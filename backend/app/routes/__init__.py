from fastapi import APIRouter

from . import auth, goals, transactions

api_router = APIRouter()
api_router.include_router(auth.router, prefix="/auth", tags=["auth"])
api_router.include_router(transactions.router, prefix="/transactions", tags=["transactions"])
api_router.include_router(goals.router, prefix="/goals", tags=["goals"])

__all__ = ["api_router"]
