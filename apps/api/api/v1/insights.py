from fastapi import APIRouter
from repositories.insights_repository import insights_repo
from core.database import get_db
from fastapi import Depends

router = APIRouter()


@router.get("/misconceptions")
async def get_misconception_leaderboard(
    limit: int = 20,
    db=Depends(get_db)
):
    """
    Public, no auth required — this endpoint only ever returns aggregate
    counts (concept_id, concept_name, topic_name, evaluation counts,
    rate). It never selects evidence_quote, session_id, or any
    user-identifying column. See insights_repository.py's own docstring
    for why this is the one intentional cross-user query in the codebase.
    """
    leaderboard = await insights_repo.get_misconception_leaderboard(
        db, limit=limit
    )
    return {"data": {"leaderboard": leaderboard}}


@router.get("/misconceptions/{concept_id}")
async def get_concept_misconception_stats(
    concept_id: str,
    db=Depends(get_db)
):
    """
    Single-concept stat, e.g. for showing '73% of people get this wrong'
    inline wherever a concept is displayed. Returns null data if the
    concept doesn't have enough sessions yet (min_evaluations threshold)
    rather than a misleading small-sample percentage.
    """
    stats = await insights_repo.get_concept_misconception_stats(
        db, concept_id
    )
    return {"data": stats}
