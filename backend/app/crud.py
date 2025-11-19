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

def list_transactions(session: Session) -> Iterable[Transaction]:
    statement = select(Transaction).order_by(Transaction.date.desc(), Transaction.id.desc())
    return session.exec(statement)


def create_transaction(session: Session, payload: TransactionCreate) -> Transaction:
    transaction = Transaction.from_orm(payload)
    session.add(transaction)
    session.commit()
    session.refresh(transaction)
    return transaction


def get_transaction(session: Session, transaction_id: int) -> Optional[Transaction]:
    return session.get(Transaction, transaction_id)


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

def list_goals(session: Session) -> Iterable[Goal]:
    statement = select(Goal).order_by(Goal.deadline.asc(), Goal.id.asc())
    return session.exec(statement)


def create_goal(session: Session, payload: GoalCreate) -> Goal:
    goal = Goal.from_orm(payload)
    session.add(goal)
    session.commit()
    session.refresh(goal)
    return goal


def get_goal(session: Session, goal_id: int) -> Optional[Goal]:
    return session.get(Goal, goal_id)


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
