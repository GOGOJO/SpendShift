from typing import List

from fastapi import Depends, HTTPException, status
from fastapi.routing import APIRouter
from sqlmodel import Session

from .. import crud
from ..database import get_session
from ..models import GoalCreate, GoalRead, GoalUpdate

router = APIRouter()


@router.get("/", response_model=List[GoalRead])
def list_goals(session: Session = Depends(get_session)) -> List[GoalRead]:
    goals = crud.list_goals(session)
    return list(goals)


@router.post("/", response_model=GoalRead, status_code=status.HTTP_201_CREATED)
def create_goal(payload: GoalCreate, session: Session = Depends(get_session)) -> GoalRead:
    goal = crud.create_goal(session, payload)
    return goal


@router.put("/{goal_id}", response_model=GoalRead)
def update_goal(
    goal_id: int,
    payload: GoalUpdate,
    session: Session = Depends(get_session),
) -> GoalRead:
    goal = crud.get_goal(session, goal_id)
    if not goal:
        raise HTTPException(status_code=404, detail="Goal not found")
    updated = crud.update_goal(session, goal, payload)
    return updated


@router.delete("/{goal_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_goal(goal_id: int, session: Session = Depends(get_session)) -> None:
    goal = crud.get_goal(session, goal_id)
    if not goal:
        raise HTTPException(status_code=404, detail="Goal not found")
    crud.delete_goal(session, goal)
