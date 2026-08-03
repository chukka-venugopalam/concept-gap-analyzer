from fastapi import APIRouter, Depends, Query
from core.auth import get_current_user, CurrentUser
from core.database import get_db
from models.api.requests import UpdateProfileRequest
from repositories.user_repository import user_repo
from repositories.topic_repository import topic_repo
from repositories.session_repository import session_repo
from repositories.learner_state_repository import (
    learner_repo
)

router = APIRouter()

@router.get("/profile")
async def get_profile(
    user: CurrentUser = Depends(get_current_user),
    db=Depends(get_db)
):
    profile = await user_repo.get_by_id(db, user.id)
    return {"data": profile}

@router.patch("/profile")
async def update_profile(
    body: UpdateProfileRequest,
    user: CurrentUser = Depends(get_current_user),
    db=Depends(get_db)
):
    updated = await user_repo.update_profile(
        db, user.id,
        goal=body.goal,
        onboarding_done=body.onboarding_done,
        display_name=body.display_name
    )
    return {"data": updated}

@router.get("/topic-status")
async def get_topic_status(
    user: CurrentUser = Depends(get_current_user),
    db=Depends(get_db)
):
    rows = await topic_repo.get_user_topic_status(
        db, user.id
    )
    statuses = []
    for r in rows:
        score = r.get('last_score')
        if score is None:
            status = "not_started"
        elif score >= 75:
            status = "strong"
        else:
            status = "in_progress"
        statuses.append({**r, "status": status})
    return {"data": {"topics": statuses}}

@router.get("/sessions")
async def get_sessions(
    user: CurrentUser = Depends(get_current_user),
    db=Depends(get_db),
    limit: int = Query(default=5, le=20),
    topic_id: str | None = Query(default=None)
):
    sessions = await session_repo.get_user_sessions(
        db, user.id, limit, topic_id
    )
    return {"data": {"sessions": sessions}}

@router.get("/top-weaknesses")
async def get_top_weaknesses(
    user: CurrentUser = Depends(get_current_user),
    db=Depends(get_db),
    limit: int = Query(default=5, le=10)
):
    weaknesses = await learner_repo.get_top_weaknesses(
        db, user.id, limit
    )
    return {"data": {"weaknesses": weaknesses}}
