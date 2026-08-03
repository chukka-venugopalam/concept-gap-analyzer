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
        probes = [
            ProbeItem(
                id=f"fp_{i}",
                context_reference="",
                question=fp['question'],
                target_concept_id=""
            )
            for i, fp in enumerate(fallback)
        ]

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

    concept_map = {c['id']: c for c in concepts}

    return {
        "data": {
            "session_id": body.session_id,
            "topic_id": session['topic_id'],
            "topic_name": topic['name'],
            "session_number": session.get(
                'session_number', 1
            ),
            "score": {**score, "delta": delta,
                      "previous_score": prev_score},
            "concepts": {
                "known": [
                    {
                        "concept_id": cid,
                        "concept_name":
                            concept_map.get(
                                cid, {}
                            ).get('name', cid),
                        "evidence_quote":
                            next((
                                e['evidence_quote']
                                for e in
                                evaluation[
                                    'concept_evidence'
                                ]
                                if e['concept_id'] == cid
                            ), ""),
                        "stage_source": next((
                            e['stage_source']
                            for e in
                            evaluation['concept_evidence']
                            if e['concept_id'] == cid
                        ), 1)
                    }
                    for cid in evaluation['concepts_known']
                ],
                "weak": [
                    {
                        "concept_id": cid,
                        "concept_name":
                            concept_map.get(
                                cid, {}
                            ).get('name', cid),
                        "gap_explanation":
                            f"You mentioned "
                            f"{concept_map.get(cid,{}).get('name',cid)}"
                            f" but didn't explain it fully",
                        "evidence_quote": next((
                            e['evidence_quote']
                            for e in
                            evaluation['concept_evidence']
                            if e['concept_id'] == cid
                        ), ""),
                        "stage_source": 1
                    }
                    for cid in evaluation['concepts_weak']
                ],
                "missing": [
                    {
                        "concept_id": cid,
                        "concept_name":
                            concept_map.get(
                                cid, {}
                            ).get('name', cid),
                        "importance": "high" if
                            concept_map.get(
                                cid, {}
                            ).get(
                                'importance_weight', 2
                            ) >= 3 else "medium",
                        "prerequisite_for": []
                    }
                    for cid in
                    evaluation['concepts_missing']
                ]
            },
            "misconceptions": evaluation['misconceptions'],
            "next_concepts":
                evaluation['next_concepts_detail'],
            "completed_at": None,
            "duration_seconds":
                evaluation['duration_seconds']
        }
    }

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
    return {"data": session}
