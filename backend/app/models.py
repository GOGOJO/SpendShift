from datetime import date, datetime
from enum import Enum
from typing import Optional

from sqlmodel import Field, Relationship, SQLModel


class TransactionType(str, Enum):
    INCOME = "income"
    EXPENSE = "expense"


# User models
class UserBase(SQLModel):
    email: str = Field(unique=True, index=True)
    full_name: Optional[str] = None


class User(UserBase, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    hashed_password: str
    created_at: datetime = Field(default_factory=datetime.utcnow, nullable=False)
    
    # Relationships
    transactions: list["Transaction"] = Relationship(back_populates="user")
    goals: list["Goal"] = Relationship(back_populates="user")


class UserCreate(SQLModel):
    email: str = Field(..., description="User email address")
    password: str = Field(..., min_length=6, description="User password (minimum 6 characters, no maximum)")
    full_name: Optional[str] = Field(None, description="User's full name")


class UserRead(UserBase):
    id: int
    created_at: datetime


class UserLogin(SQLModel):
    email: str
    password: str


class Token(SQLModel):
    access_token: str
    token_type: str = "bearer"


class TokenData(SQLModel):
    user_id: Optional[int] = None


# Transaction models
class TransactionBase(SQLModel):
    description: str
    amount: float = Field(gt=0)
    category: str
    type: TransactionType = Field(description="income or expense")
    date: date
    user_id: int = Field(foreign_key="user.id")


class Transaction(TransactionBase, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    created_at: datetime = Field(default_factory=datetime.utcnow, nullable=False)
    updated_at: datetime = Field(default_factory=datetime.utcnow, nullable=False)
    
    # Relationship
    user: User = Relationship(back_populates="transactions")


class TransactionCreate(SQLModel):
    description: str
    amount: float = Field(gt=0)
    category: str
    type: TransactionType
    date: date


class TransactionRead(SQLModel):
    id: int
    description: str
    amount: float
    category: str
    type: TransactionType
    date: date
    user_id: int
    created_at: datetime
    updated_at: datetime


class TransactionUpdate(SQLModel):
    description: Optional[str] = None
    amount: Optional[float] = Field(default=None, gt=0)
    category: Optional[str] = None
    type: Optional[TransactionType] = None
    date: Optional[date] = None


# Goal models
class GoalBase(SQLModel):
    name: str
    target_amount: float = Field(gt=0)
    current_amount: float = Field(default=0, ge=0)
    deadline: date
    category: Optional[str] = None
    user_id: int = Field(foreign_key="user.id")


class Goal(GoalBase, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    created_at: datetime = Field(default_factory=datetime.utcnow, nullable=False)
    updated_at: datetime = Field(default_factory=datetime.utcnow, nullable=False)
    
    # Relationship
    user: User = Relationship(back_populates="goals")


class GoalCreate(SQLModel):
    name: str
    target_amount: float = Field(gt=0)
    current_amount: float = Field(default=0, ge=0)
    deadline: date
    category: Optional[str] = None


class GoalRead(SQLModel):
    id: int
    name: str
    target_amount: float
    current_amount: float
    deadline: date
    category: Optional[str] = None
    user_id: int
    created_at: datetime
    updated_at: datetime


class GoalUpdate(SQLModel):
    name: Optional[str] = None
    target_amount: Optional[float] = Field(default=None, gt=0)
    current_amount: Optional[float] = Field(default=None, ge=0)
    deadline: Optional[date] = None
    category: Optional[str] = None
