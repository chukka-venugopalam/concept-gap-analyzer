PROMPT_VERSION = "v1.0"


def build_interview_turn_prompt(
    question_prompt: str,
    conversation_log: list[dict],
    latest_message: str,
    hint_ladder: list[str],
    hints_used: int,
    expected_follow_ups: list[dict],
    follow_ups_fired: list[str]
) -> str:
    history_text = "\n".join([
        f"{turn['role'].upper()}: {turn['message']}"
        for turn in conversation_log
    ]) if conversation_log else "(this is the first message)"

    remaining_hints = hint_ladder[hints_used:]
    hint_text = "\n".join([
        f"[{i}] {h}" for i, h in enumerate(remaining_hints)
    ]) if remaining_hints else "(no hints remaining)"

    available_follow_ups = [
        f for f in expected_follow_ups
        if f.get('trigger') not in follow_ups_fired
    ]
    follow_up_text = "\n".join([
        f"[{f['trigger']}] {f['question']}"
        for f in available_follow_ups
    ]) if available_follow_ups else "(no follow-ups remaining)"

    return f"""You are conducting a live mock technical interview.

You are NOT free to write your own interview questions or hints.
You may ONLY select from the pre-written options listed below, or
choose to just acknowledge and let the candidate continue. This is a
hard constraint: never invent a new technical question, hint, or
follow-up of your own — only select from what is given.

PROBLEM GIVEN TO CANDIDATE:
{question_prompt}

CONVERSATION SO FAR:
{history_text}

CANDIDATE'S LATEST MESSAGE:
{latest_message}

AVAILABLE HINTS (use one if the candidate seems stuck or confused —
pick the least revealing one that still helps):
{hint_text}

AVAILABLE FOLLOW-UP QUESTIONS (use one if the candidate has reached a
plausible working solution or approach matching that trigger's intent):
{follow_up_text}

TASK — decide exactly ONE action:
- "hint": the candidate seems stuck. Return the hint's exact index
  number from the bracketed list above. It must be a real index shown.
- "follow_up": the candidate reached a point matching one of the
  triggers above. Return that follow-up's exact trigger string,
  copied exactly as shown in brackets above.
- "acknowledge": neither applies yet — they're still working through
  it productively. Write one brief, encouraging sentence prompting
  them to continue. Do not ask a new technical question in this case.

Respond with ONLY this JSON, no other text, no markdown fences:
{{"action": "hint" | "follow_up" | "acknowledge",
  "hint_index": <int, only if action is hint>,
  "follow_up_trigger": "<string, only if action is follow_up>",
  "acknowledgment_text": "<string, only if action is acknowledge>"}}
"""
