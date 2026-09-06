from fastapi import APIRouter, Depends
from typing import Optional
from core.auth import get_current_user, CurrentUser
from core.database import get_db

router = APIRouter()


@router.get("")
async def list_interview_questions(
    company: Optional[str] = None,
    question_type: Optional[str] = None,
    concept_id: Optional[str] = None,
    user: CurrentUser = Depends(get_current_user),
    db=Depends(get_db)
):
    conditions = []
    params = []

    if company:
        params.append(company)
        conditions.append(f"iq.company = ${len(params)}")

    if question_type:
        params.append(question_type)
        conditions.append(f"iq.question_type = ${len(params)}")

    if concept_id:
        params.append(concept_id)
        conditions.append(f"iq.concept_id = ${len(params)}")

    where_clause = ("WHERE " + " AND ".join(conditions)) if conditions else ""

    rows = await db.fetch(f"""
        SELECT
            iq.id,
            iq.concept_id,
            c.name         AS concept_name,
            c.topic_id,
            t.name         AS topic_name,
            iq.question_type,
            iq.company,
            iq.prompt,
            iq.difficulty,
            iq.company_note,
            iq.reference_notes,
            iq.display_order
        FROM interview_questions iq
        LEFT JOIN concepts c ON c.id = iq.concept_id
        LEFT JOIN topics   t ON t.id = c.topic_id
        {where_clause}
        ORDER BY iq.display_order
    """, *params)

    return {
        "data": {
            "questions": [dict(r) for r in rows],
            "total": len(rows)
        }
    }


@router.get("/companies")
async def list_companies(
    user: CurrentUser = Depends(get_current_user),
    db=Depends(get_db)
):
    rows = await db.fetch("""
        SELECT DISTINCT company
        FROM interview_questions
        WHERE company IS NOT NULL
        ORDER BY company
    """)
    return {
        "data": {
            "companies": [r["company"] for r in rows]
        }
    }
