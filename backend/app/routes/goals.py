from typing import List

from fastapi import Depends, HTTPException, status
from fastapi.routing import APIRouter
from sqlmodel import Session

from .. import crud
from ..auth import get_current_user
from ..database import get_session
from ..models import GoalCreate, GoalRead, GoalUpdate, User

router = APIRouter()


@router.get("/", response_model=List[GoalRead])
def list_goals(
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user),
) -> List[GoalRead]:
    goals = crud.list_goals(session, current_user.id)
    return list(goals)


@router.post("/", response_model=GoalRead, status_code=status.HTTP_201_CREATED)
def create_goal(
    payload: GoalCreate,
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user),
) -> GoalRead:
    goal = crud.create_goal(session, payload, current_user.id)
    return goal


@router.put("/{goal_id}", response_model=GoalRead)
def update_goal(
    goal_id: int,
    payload: GoalUpdate,
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user),
) -> GoalRead:
    goal = crud.get_goal(session, goal_id, current_user.id)
    if not goal:
        raise HTTPException(status_code=404, detail="Goal not found")
    updated = crud.update_goal(session, goal, payload)
    return updated


@router.delete("/{goal_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_goal(
    goal_id: int,
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user),
) -> None:
    goal = crud.get_goal(session, goal_id, current_user.id)
    if not goal:
        raise HTTPException(status_code=404, detail="Goal not found")
    crud.delete_goal(session, goal)
