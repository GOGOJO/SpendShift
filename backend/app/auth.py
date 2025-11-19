import base64
import binascii
import hashlib
import secrets
from datetime import datetime, timedelta
from typing import Optional

from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError, jwt
from sqlmodel import Session, select

from .config import get_settings
from .database import get_session
from .models import TokenData, User

settings = get_settings()
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/auth/login")

# PBKDF2 configuration
PBKDF2_ITERATIONS = 100000  # Number of iterations (higher = more secure but slower)
PBKDF2_HASH_NAME = "sha256"  # Hash algorithm
PBKDF2_SALT_LENGTH = 32  # Salt length in bytes
PBKDF2_KEY_LENGTH = 32  # Derived key length in bytes


def get_password_hash(password: str) -> str:
    """
    Hash a password using PBKDF2.
    
    PBKDF2 has no password length limit and is secure.
    Returns a string in format: iterations$salt$hash (all base64 encoded)
    """
    # Generate a random salt
    salt = secrets.token_bytes(PBKDF2_SALT_LENGTH)
    
    # Hash the password
    password_bytes = password.encode('utf-8')
    key = hashlib.pbkdf2_hmac(
        PBKDF2_HASH_NAME,
        password_bytes,
        salt,
        PBKDF2_ITERATIONS,
        PBKDF2_KEY_LENGTH
    )
    
    # Encode salt and key to base64 for storage
    salt_b64 = base64.b64encode(salt).decode('ascii')
    key_b64 = base64.b64encode(key).decode('ascii')
    
    # Return format: iterations$salt$hash
    return f"{PBKDF2_ITERATIONS}${salt_b64}${key_b64}"


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verify a password against its hash."""
    try:
        # Parse the stored hash: iterations$salt$hash
        parts = hashed_password.split('$')
        if len(parts) != 3:
            return False
        
        iterations = int(parts[0])
        salt_b64 = parts[1]
        stored_key_b64 = parts[2]
        
        # Decode salt and stored key
        salt = base64.b64decode(salt_b64)
        stored_key = base64.b64decode(stored_key_b64)
        
        # Hash the provided password with the same salt and iterations
        password_bytes = plain_password.encode('utf-8')
        computed_key = hashlib.pbkdf2_hmac(
            PBKDF2_HASH_NAME,
            password_bytes,
            salt,
            iterations,
            len(stored_key)
        )
        
        # Compare using constant-time comparison to prevent timing attacks
        return secrets.compare_digest(stored_key, computed_key)
    except (ValueError, TypeError, binascii.Error):
        return False


def create_access_token(data: dict, expires_delta: Optional[timedelta] = None) -> str:
    """Create a JWT access token."""
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=settings.access_token_expire_minutes)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, settings.secret_key, algorithm=settings.algorithm)
    return encoded_jwt


def get_user_by_email(session: Session, email: str) -> Optional[User]:
    """Get a user by email."""
    statement = select(User).where(User.email == email)
    return session.exec(statement).first()


def authenticate_user(session: Session, email: str, password: str) -> Optional[User]:
    """Authenticate a user by email and password."""
    user = get_user_by_email(session, email)
    if not user:
        return None
    if not verify_password(password, user.hashed_password):
        return None
    return user


def get_current_user(
    token: str = Depends(oauth2_scheme),
    session: Session = Depends(get_session),
) -> User:
    """Get the current authenticated user from JWT token."""
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, settings.secret_key, algorithms=[settings.algorithm])
        user_id_raw = payload.get("sub")
        if user_id_raw is None:
            print(f"DEBUG: Token payload missing 'sub': {payload}")
            raise credentials_exception
        
        # Convert to int if it's a string
        try:
            user_id = int(user_id_raw) if isinstance(user_id_raw, str) else user_id_raw
        except (ValueError, TypeError) as e:
            print(f"DEBUG: Failed to convert user_id to int: {user_id_raw}, error: {e}")
            raise credentials_exception
        
        user = session.get(User, user_id)
        if user is None:
            print(f"DEBUG: User not found with id: {user_id}")
            raise credentials_exception
        return user
    except JWTError as e:
        print(f"DEBUG: JWT decode error: {e}")
        raise credentials_exception
    except Exception as e:
        print(f"DEBUG: Unexpected error in get_current_user: {e}")
        raise credentials_exception

