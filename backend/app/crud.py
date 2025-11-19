from typing import Iterable, Optional

from sqlmodel import Session, select

from .models import (
    Goal,
    GoalCreate,
    GoalUpdate,
    Transaction,
    TransactionCreate,
    TransactionUpdate,
)


# Transaction helpers

def list_transactions(session: Session, user_id: int) -> Iterable[Transaction]:
    statement = (
        select(Transaction)
        .where(Transaction.user_id == user_id)
        .order_by(Transaction.date.desc(), Transaction.id.desc())
    )
    return session.exec(statement)


def create_transaction(session: Session, payload: TransactionCreate, user_id: int) -> Transaction:
    transaction = Transaction(**payload.dict(), user_id=user_id)
    session.add(transaction)
    session.commit()
    session.refresh(transaction)
    return transaction


def get_transaction(session: Session, transaction_id: int, user_id: int) -> Optional[Transaction]:
    transaction = session.get(Transaction, transaction_id)
    if transaction and transaction.user_id == user_id:
        return transaction
    return None


def update_transaction(
    session: Session, transaction: Transaction, payload: TransactionUpdate
) -> Transaction:
    for field, value in payload.dict(exclude_unset=True).items():
        setattr(transaction, field, value)
    session.add(transaction)
    session.commit()
    session.refresh(transaction)
    return transaction


def delete_transaction(session: Session, transaction: Transaction) -> None:
    session.delete(transaction)
    session.commit()


# Goal helpers

def list_goals(session: Session, user_id: int) -> Iterable[Goal]:
    statement = (
        select(Goal)
        .where(Goal.user_id == user_id)
        .order_by(Goal.deadline.asc(), Goal.id.asc())
    )
    return session.exec(statement)


def create_goal(session: Session, payload: GoalCreate, user_id: int) -> Goal:
    goal = Goal(**payload.dict(), user_id=user_id)
    session.add(goal)
    session.commit()
    session.refresh(goal)
    return goal


def get_goal(session: Session, goal_id: int, user_id: int) -> Optional[Goal]:
    goal = session.get(Goal, goal_id)
    if goal and goal.user_id == user_id:
        return goal
    return None


def update_goal(session: Session, goal: Goal, payload: GoalUpdate) -> Goal:
    for field, value in payload.dict(exclude_unset=True).items():
        setattr(goal, field, value)
    session.add(goal)
    session.commit()
    session.refresh(goal)
    return goal


def delete_goal(session: Session, goal: Goal) -> None:
    session.delete(goal)
    session.commit()
