from fastapi import APIRouter, Depends, HTTPException
from core.auth import get_current_user, CurrentUser
from core.database import get_db
from repositories.topic_repository import topic_repo
from repositories.session_repository import session_repo
from repositories.concept_repository import concept_repo
from repositories.learner_state_repository import learner_repo

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

@router.get("/{topic_id}/graph")
async def get_topic_graph(
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
    concepts = await concept_repo.get_by_topic(db, topic_id)
    edges = await concept_repo.get_prerequisites(db, topic_id)
    states = await learner_repo.get_states_by_topic(db, user.id, topic_id)

    state_map = {s['concept_id']: s['current_status'] for s in states}

    nodes = [
        {
            "id": c['id'],
            "name": c['name'],
            "importance_weight": c.get('importance_weight', 2),
            "status": state_map.get(c['id'], 'not_assessed')
        }
        for c in concepts
    ]

    edge_list = [
        {
            "source": e['concept_id'],
            "target": e['prerequisite_id']
        }
        for e in edges
    ]

    return {
        "data": {
            "nodes": nodes,
            "edges": edge_list
        }
    }
