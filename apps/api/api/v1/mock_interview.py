import json
import time
from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from core.auth import get_current_user, CurrentUser
from core.database import get_db
from repositories.mock_interview_repository import mock_interview_repo
from ai.interview_turn import run_interview_turn
from ai.prompts.interview_turn_prompt import build_interview_turn_prompt
from ai.interview_eval import run_interview_eval
from ai.prompts.interview_eval_prompt import build_interview_eval_prompt

router = APIRouter()

# Explicit "I'm stuck" signals shortcut straight to the next hint
# without an AI call — cheaper and more reliable than asking the model
# to detect the clearest possible case.
STUCK_PHRASES = [
    "i don't know", "i dont know", "i'm stuck", "im stuck",
    "not sure", "no idea", "i give up", "can you help",
    "i need a hint", "give me a hint", "hint please",
]


class StartMockInterviewRequest(BaseModel):
    interview_question_id: int


class TurnRequest(BaseModel):
    message: str


class FinishRequest(BaseModel):
    final_code: str | None = None


def _parse_jsonb(value, default):
    """asyncpg returns JSONB columns as raw strings unless a JSON
    codec is registered on the pool — this project has been bitten by
    that exact bug before (see session_repository stage2_responses
    handling). Defend the same way here on every JSONB field we read.
    """
    if value is None:
        return default
    if isinstance(value, str):
        try:
            return json.loads(value)
        except (json.JSONDecodeError, TypeError):
            return default
    return value


async def _load_question(db, interview_question_id: int) -> dict:
    row = await mock_interview_repo.get_interview_question(
        db, interview_question_id
    )
    if not row:
        raise HTTPException(404, "Interview question not found")
    row = dict(row)
    row["hint_ladder"] = _parse_jsonb(row.get("hint_ladder"), [])
    row["expected_follow_ups"] = _parse_jsonb(
        row.get("expected_follow_ups"), []
    )
    row["rubric_dimensions"] = _parse_jsonb(
        row.get("rubric_dimensions"), []
    )
    return row


@router.post("/start", status_code=201)
async def start_mock_interview(
    body: StartMockInterviewRequest,
    user: CurrentUser = Depends(get_current_user),
    db=Depends(get_db)
):
    question = await _load_question(db, body.interview_question_id)
    session = await mock_interview_repo.create(
        db, user.id, body.interview_question_id
    )
    session = dict(session)
    session["conversation_log"] = _parse_jsonb(
        session.get("conversation_log"), []
    )
    return {
        "data": {
            **session,
            "opening_prompt": question["opening_prompt"],
            "problem_prompt": question["prompt"],
        }
    }


@router.post("/{session_id}/turn")
async def submit_turn(
    session_id: str,
    body: TurnRequest,
    user: CurrentUser = Depends(get_current_user),
    db=Depends(get_db)
):
    session = await mock_interview_repo.get(db, session_id, user.id)
    if not session:
        raise HTTPException(404, "Session not found")
    session = dict(session)
    if session["status"] != "draft":
        raise HTTPException(400, "This session has already finished")

    question = await _load_question(
        db, session["interview_question_id"]
    )

    conversation_log = _parse_jsonb(
        session.get("conversation_log"), []
    )
    conversation_log.append({
        "role": "candidate",
        "message": body.message,
        "timestamp": time.time(),
    })

    hints_used = session.get("hints_used") or 0
    hint_ladder = question["hint_ladder"]
    expected_follow_ups = question["expected_follow_ups"]
    follow_ups_fired = [
        turn.get("follow_up_trigger") for turn in conversation_log
        if turn.get("role") == "ai" and turn.get("follow_up_trigger")
    ]

    lower_msg = body.message.lower()
    explicit_stuck = any(p in lower_msg for p in STUCK_PHRASES)

    # Clearest case: explicit stuck signal + a hint still available.
    # Skip the AI call entirely — rule-based logic handles this,
    # matching this project's "AI for language, code for logic" split.
    if explicit_stuck and hints_used < len(hint_ladder):
        ai_message = hint_ladder[hints_used]
        new_hints_used = hints_used + 1
        turn_record = {
            "role": "ai", "message": ai_message,
            "action": "hint", "timestamp": time.time(),
        }
    else:
        prompt = build_interview_turn_prompt(
            question_prompt=question["prompt"],
            conversation_log=conversation_log[:-1],
            latest_message=body.message,
            hint_ladder=hint_ladder,
            hints_used=hints_used,
            expected_follow_ups=expected_follow_ups,
            follow_ups_fired=follow_ups_fired,
        )
        decision = await run_interview_turn(prompt)
        new_hints_used = hints_used

        if decision.action == "hint" and decision.hint_index is not None:
            remaining = hint_ladder[hints_used:]
            idx = decision.hint_index
            if remaining and 0 <= idx < len(remaining):
                ai_message = remaining[idx]
                new_hints_used = hints_used + 1
                turn_record = {
                    "role": "ai", "message": ai_message,
                    "action": "hint", "timestamp": time.time(),
                }
            else:
                # Model picked an index that doesn't exist — never
                # trust it blindly, fall back to a safe acknowledgment
                # rather than showing a broken/undefined hint.
                ai_message = (
                    "Take a moment and think through the structure "
                    "you'd need here."
                )
                turn_record = {
                    "role": "ai", "message": ai_message,
                    "action": "acknowledge", "timestamp": time.time(),
                }
        elif decision.action == "follow_up" and decision.follow_up_trigger:
            matched = next(
                (f for f in expected_follow_ups
                 if f.get("trigger") == decision.follow_up_trigger
                 and f.get("trigger") not in follow_ups_fired),
                None
            )
            if matched:
                ai_message = matched["question"]
                turn_record = {
                    "role": "ai", "message": ai_message,
                    "action": "follow_up",
                    "follow_up_trigger": matched["trigger"],
                    "timestamp": time.time(),
                }
            else:
                # Model named a trigger that doesn't exist or was
                # already used — same principle, never fabricate a
                # follow-up question that wasn't actually written.
                ai_message = "Good — keep going, tell me more about your approach."
                turn_record = {
                    "role": "ai", "message": ai_message,
                    "action": "acknowledge", "timestamp": time.time(),
                }
        else:
            ai_message = (
                decision.acknowledgment_text
                or "Keep going whenever you're ready."
            )
            turn_record = {
                "role": "ai", "message": ai_message,
                "action": "acknowledge", "timestamp": time.time(),
            }

    conversation_log.append(turn_record)
    await mock_interview_repo.append_turn(
        db, session_id, conversation_log, new_hints_used
    )

    return {"data": {
        "action": turn_record["action"],
        "message": ai_message,
        "hints_used": new_hints_used,
    }}


@router.post("/{session_id}/finish")
async def finish_mock_interview(
    session_id: str,
    body: FinishRequest,
    user: CurrentUser = Depends(get_current_user),
    db=Depends(get_db)
):
    session = await mock_interview_repo.get(db, session_id, user.id)
    if not session:
        raise HTTPException(404, "Session not found")
    session = dict(session)

    question = await _load_question(
        db, session["interview_question_id"]
    )
    conversation_log = _parse_jsonb(
        session.get("conversation_log"), []
    )
    rubric_dimensions = question["rubric_dimensions"]

    prompt = build_interview_eval_prompt(
        question_prompt=question["prompt"],
        conversation_log=conversation_log,
        final_code=body.final_code,
        rubric_dimensions=rubric_dimensions,
    )
    eval_result = await run_interview_eval(prompt)

    duration_seconds = None
    if len(conversation_log) >= 2:
        first_ts = conversation_log[0].get("timestamp")
        last_ts = conversation_log[-1].get("timestamp")
        if first_ts and last_ts:
            duration_seconds = int(last_ts - first_ts)

    result = await mock_interview_repo.finish(
        db, session_id, body.final_code, duration_seconds,
        eval_result.rubric_scores, eval_result.score_overall,
    )
    return {"data": dict(result)}
