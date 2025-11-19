from typing import List

from fastapi import Depends, HTTPException, status
from fastapi.routing import APIRouter
from sqlmodel import Session

from .. import crud
from ..auth import get_current_user
from ..database import get_session
from ..models import TransactionCreate, TransactionRead, TransactionUpdate, User

router = APIRouter()


@router.get("/", response_model=List[TransactionRead])
def list_transactions(
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user),
) -> List[TransactionRead]:
    transactions = crud.list_transactions(session, current_user.id)
    return list(transactions)


@router.post("/", response_model=TransactionRead, status_code=status.HTTP_201_CREATED)
def create_transaction(
    payload: TransactionCreate,
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user),
) -> TransactionRead:
    transaction = crud.create_transaction(session, payload, current_user.id)
    return transaction


@router.put("/{transaction_id}", response_model=TransactionRead)
def update_transaction(
    transaction_id: int,
    payload: TransactionUpdate,
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user),
) -> TransactionRead:
    transaction = crud.get_transaction(session, transaction_id, current_user.id)
    if not transaction:
        raise HTTPException(status_code=404, detail="Transaction not found")
    updated = crud.update_transaction(session, transaction, payload)
    return updated


@router.delete("/{transaction_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_transaction(
    transaction_id: int,
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user),
) -> None:
    transaction = crud.get_transaction(session, transaction_id, current_user.id)
    if not transaction:
        raise HTTPException(status_code=404, detail="Transaction not found")
    crud.delete_transaction(session, transaction)
