from fastapi import APIRouter

from . import goals, transactions

api_router = APIRouter()
api_router.include_router(transactions.router, prefix="/transactions", tags=["transactions"])
api_router.include_router(goals.router, prefix="/goals", tags=["goals"])

__all__ = ["api_router"]
