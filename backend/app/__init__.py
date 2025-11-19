"""SpendShift FastAPI application package."""

__all__ = [
    "get_app",
]

from .main import app as get_app  # re-export for convenience
