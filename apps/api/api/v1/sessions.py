from fastapi import APIRouter, Depends, HTTPException, Query
from core.auth import get_current_user, CurrentUser
from core.database import get_db
from models.api.requests import (
    StartSessionRequest, Stage1Request,
    Stage2Request, Stage3Request, EvaluateRequest
)
from repositories.user_repository import user_repo
from repositories.session_repository import session_repo
from repositories.topic_repository import topic_repo
from repositories.concept_repository import concept_repo
from repositories.learner_state_repository import (
    learner_repo
)
from services.evaluation_service import evaluate_session
from services.probe_service import determine_probe_count
from ai.probe_generator import generate_probes
from ai.prompts.probe_prompt import build_probe_prompt
import json

router = APIRouter()

@router.get("/active")
async def get_active_session(
    topic_id: str = Query(...),
    user: CurrentUser = Depends(get_current_user),
    db=Depends(get_db)
):
    session = await session_repo.get_active(
        db, user.id, topic_id
    )
    return {"data": session}

@router.post("/start", status_code=201)
async def start_session(
    body: StartSessionRequest,
    user: CurrentUser = Depends(get_current_user),
    db=Depends(get_db)
):
    try:
        # Validate topic exists
        topic = await topic_repo.get_by_id(
            db, body.topic_id
        )
        if not topic:
            raise HTTPException(
                status_code=400,
                detail={
                    "code": "invalid_topic",
                    "message": f"Topic not found"
                }
            )

        # Ensure user row exists in users table to satisfy foreign key
        await db.execute("""
    INSERT INTO users (id, email, display_name)
    VALUES ($1::uuid, $2, $3)
    ON CONFLICT (email) DO UPDATE
    SET last_active_at = NOW(),
        id = EXCLUDED.id
""", user.id, user.email or 'demo@example.com', 'User')
        # Abandon existing drafts
        await db.execute("""
            UPDATE sessions
            SET status = 'abandoned'
            WHERE user_id = $1::uuid
              AND topic_id = $2
              AND status = 'draft'
        """, user.id, body.topic_id)

        # Count existing sessions
        count_row = await db.fetchrow("""
            SELECT COUNT(*) as cnt
            FROM sessions
            WHERE user_id = $1::uuid
              AND topic_id = $2
              AND status != 'abandoned'
        """, user.id, body.topic_id)
        session_number = (count_row['cnt'] or 0) + 1

        # Create new session
        session_row = await db.fetchrow("""
            INSERT INTO sessions
              (user_id, topic_id, session_number)
            VALUES ($1::uuid, $2, $3)
            RETURNING
              id::text AS session_id,
              topic_id,
              session_number,
              status,
              started_at
        """, user.id, body.topic_id, session_number)

        if not session_row:
            raise HTTPException(
                status_code=500,
                detail={"code": "session_create_failed",
                        "message": "Failed to create session"}
            )

        return {"data": dict(session_row)}

    except HTTPException:
        raise
    except Exception as e:
        print(f"[SESSION START ERROR] {type(e).__name__}: {e}")
        raise HTTPException(
            status_code=500,
            detail={
                "code": "session_start_failed",
                "message": str(e)
            }
        )

@router.post("/analyze/stage1")
async def analyze_stage1(
    body: Stage1Request,
    user: CurrentUser = Depends(get_current_user),
    db=Depends(get_db)
):
    existing = await session_repo.get_by_id(
        db, body.session_id, user.id
    )
    if not existing:
        raise HTTPException(status_code=404, detail={
            "code": "session_not_found",
            "message": "Session not found"
        })

    print(f"[STAGE1] Starting stage1 analysis")
    print(f"[STAGE1] Topic: {existing['topic_id']}")
    print(f"[STAGE1] Response length: {len(body.stage1_response)}")

    concepts = await concept_repo.get_by_topic(
        db, existing['topic_id']
    )

    from services.extraction_service import (
        rule_based_extraction
    )
    candidates = rule_based_extraction(
        body.stage1_response, concepts
    )
    covered_names = [
        c['concept_id'] for c in candidates
        if c['rule_confidence'] >= 0.5
    ]
    not_covered = [
        c for c in concepts
        if c['id'] not in covered_names
    ]

    probe_count = determine_probe_count(
        covered_names, concepts
    )
    not_covered_limited = not_covered[:probe_count + 2]

    probe_prompt = build_probe_prompt(
        existing['topic_id'],
        body.stage1_response,
        covered_names,
        not_covered_limited
    )
    probe_result = await generate_probes(probe_prompt)
    probes = probe_result.probes[:probe_count]

    print(f"[STAGE1] Probes generated: {len(probes)}")
    print(f"[STAGE1] Probe data: {probes}")

    if not probes:
        from repositories.base import BaseRepository
        base = BaseRepository()
        fallback = await base.fetch_all(db, """
            SELECT id::text, question
            FROM fallback_probes
            WHERE topic_id = $1
            ORDER BY probe_order
            LIMIT $2
        """, existing['topic_id'], probe_count)

        from ai.probe_generator import ProbeItem
        if fallback:
            probes = [
                ProbeItem(
                    id=f"fp_{i}",
                    context_reference="",
                    question=fp['question'],
                    target_concept_id=""
                )
                for i, fp in enumerate(fallback)
            ]
        else:
            probes = [
                ProbeItem(
                    id="fp_default_1",
                    context_reference="",
                    question=f"What key properties, operations, or edge cases are most important when working with {existing['topic_id']}?",
                    target_concept_id=""
                ),
                ProbeItem(
                    id="fp_default_2",
                    context_reference="",
                    question=f"What are the time and space complexity trade-offs for {existing['topic_id']}?",
                    target_concept_id=""
                )
            ][:probe_count]

    probes_raw = [
        {
            "id": p.id,
            "context_reference": p.context_reference,
            "question": p.question,
            "target_concept_id": p.target_concept_id
        }
        for p in probes
    ]

    await session_repo.update_stage1(
        db, body.session_id,
        body.stage1_response,
        probes_raw, probes_raw
    )

    return {
        "data": {
            "session_id": body.session_id,
            "stage": 2,
            "probes": probes_raw,
            "probe_count": len(probes_raw)
        }
    }

@router.post("/analyze/stage2")
async def analyze_stage2(
    body: Stage2Request,
    user: CurrentUser = Depends(get_current_user),
    db=Depends(get_db)
):
    existing = await session_repo.get_by_id(
        db, body.session_id, user.id
    )
    if not existing:
        raise HTTPException(status_code=404, detail={
            "code": "session_not_found",
            "message": "Session not found"
        })

    from repositories.base import BaseRepository
    base = BaseRepository()
    challenges = await base.fetch_all(db, """
        SELECT id::text, question AS content
        FROM fallback_probes
        WHERE topic_id = $1
        ORDER BY probe_order DESC
        LIMIT 1
    """, existing['topic_id'])

    challenge = {
        "id": "ct_1",
        "instruction": "Read this and tell us what's right, wrong, or incomplete.",
        "content": challenges[0]['content']
                   if challenges else
                   "Explain the time complexity of the main operations in this topic.",
        "type": "error_correction"
    }

    responses_raw = [
        {
            "probe_id": r.probe_id,
            "response": r.response
        }
        for r in body.probe_responses
    ]

    await session_repo.update_stage2(
        db, body.session_id,
        responses_raw, challenge
    )

    return {
        "data": {
            "session_id": body.session_id,
            "stage": 3,
            "challenge_task": challenge
        }
    }

@router.post("/analyze/stage3")
async def analyze_stage3(
    body: Stage3Request,
    user: CurrentUser = Depends(get_current_user),
    db=Depends(get_db)
):
    existing = await session_repo.get_by_id(
        db, body.session_id, user.id
    )
    if not existing:
        raise HTTPException(status_code=404, detail={
            "code": "session_not_found",
            "message": "Session not found"
        })

    await session_repo.update_stage3(
        db, body.session_id, body.stage3_response
    )

    return {
        "data": {
            "session_id": body.session_id,
            "stage": "complete",
            "ready_to_evaluate": True
        }
    }

def build_results_payload(
    session: dict,
    topic: dict | None,
    concepts: list[dict],
    score_delta: int | None = None,
    previous_score: int | None = None,
    concept_evidence: list[dict] | None = None,
    next_concepts_detail: list[dict] | None = None
) -> dict:
    concept_map = {c['id']: c for c in concepts}

    known_ids = session.get('concepts_known') or []
    weak_ids = session.get('concepts_weak') or []
    missing_ids = session.get('concepts_missing') or []

    evidence_list = concept_evidence or []
    evidence_map = {
        e['concept_id']: e for e in evidence_list if 'concept_id' in e
    }

    known_list = [
        {
            "concept_id": cid,
            "concept_name": concept_map.get(cid, {}).get('name', cid),
            "evidence_quote": evidence_map.get(cid, {}).get('evidence_quote', ""),
            "stage_source": evidence_map.get(cid, {}).get('stage_source', 1)
        }
        for cid in known_ids
    ]

    weak_list = [
        {
            "concept_id": cid,
            "concept_name": concept_map.get(cid, {}).get('name', cid),
            "gap_explanation": f"You mentioned {concept_map.get(cid, {}).get('name', cid)} but didn't explain it fully",
            "evidence_quote": evidence_map.get(cid, {}).get('evidence_quote', ""),
            "stage_source": 1
        }
        for cid in weak_ids
    ]

    missing_list = [
        {
            "concept_id": cid,
            "concept_name": concept_map.get(cid, {}).get('name', cid),
            "importance": "high" if concept_map.get(cid, {}).get('importance_weight', 2) >= 3 else "medium",
            "prerequisite_for": []
        }
        for cid in missing_ids
    ]

    raw_misconceptions = session.get('misconceptions')
    if isinstance(raw_misconceptions, str):
        try:
            misconceptions = json.loads(raw_misconceptions)
        except Exception:
            misconceptions = []
    elif isinstance(raw_misconceptions, list):
        misconceptions = raw_misconceptions
    else:
        misconceptions = []

    if next_concepts_detail is not None:
        next_concepts = next_concepts_detail
    else:
        raw_next = session.get('next_concepts') or []
        if isinstance(raw_next, str):
            try:
                raw_next = json.loads(raw_next)
            except Exception:
                raw_next = []

        next_concepts = []
        for item in raw_next:
            if isinstance(item, str):
                cname = concept_map.get(item, {}).get('name', item)
                reason = (f"You mentioned {cname} but didn't explain it fully"
                          if item in weak_ids else
                          "Core concept — required for interview readiness")
                next_concepts.append({
                    "concept_id": item,
                    "concept_name": cname,
                    "reason": reason
                })
            elif isinstance(item, dict):
                next_concepts.append(item)

    score_overall = session.get('score_overall', 0)
    score_coverage = session.get('score_coverage', 0)
    score_depth = session.get('score_depth', 0)
    score_accuracy = session.get('score_accuracy', 0)
    score_connectivity = session.get('score_connectivity', 0)

    completed_at = session.get('completed_at')
    if hasattr(completed_at, 'isoformat'):
        completed_at = completed_at.isoformat()

    return {
        "session_id": session.get('session_id') or session.get('id'),
        "topic_id": session.get('topic_id'),
        "topic_name": topic.get('name') if topic else session.get('topic_name'),
        "session_number": session.get('session_number', 1),
        "score": {
            "overall": score_overall,
            "coverage": score_coverage,
            "depth": score_depth,
            "accuracy": score_accuracy,
            "connectivity": score_connectivity,
            "delta": score_delta,
            "previous_score": previous_score
        },
        "concepts": {
            "known": known_list,
            "weak": weak_list,
            "missing": missing_list
        },
        "misconceptions": misconceptions,
        "next_concepts": next_concepts,
        "completed_at": completed_at,
        "duration_seconds": session.get('duration_seconds', 0)
    }

@router.post("/evaluate")
async def evaluate(
    body: EvaluateRequest,
    user: CurrentUser = Depends(get_current_user),
    db=Depends(get_db)
):
    session = await session_repo.get_by_id(
        db, body.session_id, user.id
    )
    if not session:
        raise HTTPException(status_code=404, detail={
            "code": "session_not_found",
            "message": "Session not found"
        })

    topic = await topic_repo.get_by_id(
        db, session['topic_id']
    )
    concepts = await concept_repo.get_by_topic(
        db, session['topic_id']
    )
    prerequisites = await concept_repo.get_prerequisites(
        db, session['topic_id']
    )
    misconception_defs = await (
        concept_repo.get_misconceptions(
            db, session['topic_id']
        )
    )

    existing_full = await session_repo.get_by_id(
        db, body.session_id, user.id
    )

    evaluation = await evaluate_session(
        existing_full or session,
        topic, concepts,
        prerequisites, misconception_defs
    )

    await session_repo.mark_complete(
        db, body.session_id, evaluation
    )

    concept_statuses = (
        [{'concept_id': cid, 'status': 'known'}
         for cid in evaluation['concepts_known']] +
        [{'concept_id': cid, 'status': 'weak'}
         for cid in evaluation['concepts_weak']] +
        [{'concept_id': cid, 'status': 'missing'}
         for cid in evaluation['concepts_missing']]
    )

    await learner_repo.upsert_states(
        db, user.id, session['topic_id'],
        body.session_id, concept_statuses
    )

    prev_score = await session_repo.get_previous_score(
        db, user.id, session['topic_id'],
        body.session_id
    )

    score = evaluation['score']
    delta = (score['overall'] - prev_score
             if prev_score is not None else None)

    eval_session_dict = {
        **session,
        "score_overall": score['overall'],
        "score_coverage": score['coverage'],
        "score_depth": score['depth'],
        "score_accuracy": score['accuracy'],
        "score_connectivity": score['connectivity'],
        "concepts_known": evaluation['concepts_known'],
        "concepts_weak": evaluation['concepts_weak'],
        "concepts_missing": evaluation['concepts_missing'],
        "misconceptions": evaluation['misconceptions'],
        "next_concepts": evaluation['next_concepts'],
        "duration_seconds": evaluation['duration_seconds']
    }

    payload = build_results_payload(
        eval_session_dict,
        topic,
        concepts,
        score_delta=delta,
        previous_score=prev_score,
        concept_evidence=evaluation['concept_evidence'],
        next_concepts_detail=evaluation['next_concepts_detail']
    )

    return {"data": payload}

@router.get("/{session_id}/results")
async def get_results(
    session_id: str,
    user: CurrentUser = Depends(get_current_user),
    db=Depends(get_db)
):
    session = await session_repo.get_by_id(
        db, session_id, user.id
    )
    if not session:
        raise HTTPException(status_code=404, detail={
            "code": "session_not_found",
            "message": "Session not found"
        })

    topic = await topic_repo.get_by_id(
        db, session['topic_id']
    )
    concepts = await concept_repo.get_by_topic(
        db, session['topic_id']
    )

    prev_score = await session_repo.get_previous_score(
        db, user.id, session['topic_id'], session_id
    )

    delta = (
        session['score_overall'] - prev_score
        if session.get('score_overall') is not None and prev_score is not None
        else None
    )

    payload = build_results_payload(
        session,
        topic,
        concepts,
        score_delta=delta,
        previous_score=prev_score
    )

    return {"data": payload}
