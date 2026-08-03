from fastapi import APIRouter, Depends, HTTPException
from core.auth import get_current_user, CurrentUser
from core.database import get_db
from repositories.topic_repository import topic_repo
from repositories.session_repository import session_repo

router = APIRouter()

@router.get("")
async def get_topics(
    user: CurrentUser = Depends(get_current_user),
    db=Depends(get_db)
):
    topics = await topic_repo.get_all_active(db)
    return {"data": {"topics": topics}}

@router.get("/{topic_id}/sessions")
async def get_topic_sessions(
    topic_id: str,
    user: CurrentUser = Depends(get_current_user),
    db=Depends(get_db)
):
    topic = await topic_repo.get_by_id(db, topic_id)
    if not topic:
        raise HTTPException(
            status_code=404,
            detail={
                "code": "topic_not_found",
                "message": f"Topic '{topic_id}' not found"
            }
        )
    sessions = await session_repo.get_user_sessions(
        db, user.id, limit=20, topic_id=topic_id
    )
    return {
        "data": {
            "topic_id": topic_id,
            "topic_name": topic['name'],
            "sessions": sessions,
            "total_sessions": len(sessions)
        }
    }
