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

@router.get("/{topic_id}/library")
async def get_topic_library(
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
    practice = await concept_repo.get_practice_problems(db, topic_id)
    resources = await concept_repo.get_resources(db, topic_id)

    nodes = [
        {
            "id": c['id'],
            "name": c['name'],
            "definition": c.get('definition', ''),
            "real_world_example": c.get('real_world_example'),
            "importance_weight": c.get('importance_weight', 2),
            "resources": [
                {
                    "title": r.get('title', ''),
                    "url": r.get('url', '')
                }
                for r in resources
                if r['concept_id'] == c['id']
            ],
            "practice_problems": [
                {
                    "platform": p.get('platform', ''),
                    "title": p.get('title', ''),
                    "url": p.get('url', ''),
                    "difficulty": p.get('difficulty', '')
                }
                for p in practice
                if p['concept_id'] == c['id']
            ]
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
            "topic_id": topic_id,
            "topic_name": topic['name'],
            "nodes": nodes,
            "edges": edge_list
        }
    }

@router.get("/{topic_id}/pattern-references")
async def get_pattern_references(
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
    rows = await db.fetch("""
        SELECT
            pr.pattern_name,
            pr.covered_concept_id AS concept_id,
            c.name              AS concept_name,
            c.topic_id,
            t.name              AS topic_name,
            pr.display_order
        FROM topic_pattern_references pr
        JOIN concepts c ON c.id = pr.covered_concept_id
        JOIN topics   t ON t.id = c.topic_id
        WHERE pr.topic_id = $1
        ORDER BY pr.display_order, c.name
    """, topic_id)
    return {
        "data": [
            {
                "pattern_name": r["pattern_name"],
                "concept_id": r["concept_id"],
                "concept_name": r["concept_name"],
                "topic_id": r["topic_id"],
                "topic_name": r["topic_name"],
                "display_order": r.get("display_order", 0)
            }
            for r in rows
        ]
    }
