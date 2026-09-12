PROMPT_VERSION = "v1.0"


def build_interview_eval_prompt(
    question_prompt: str,
    conversation_log: list[dict],
    final_code: str | None,
    rubric_dimensions: list[dict]
) -> str:
    history_text = "\n".join([
        f"{turn['role'].upper()}: {turn['message']}"
        for turn in conversation_log
    ]) if conversation_log else "(no conversation recorded)"

    dimensions_text = "\n".join([
        f"- {d['dimension']}: {d['description']}"
        for d in rubric_dimensions
    ]) if rubric_dimensions else "(no rubric dimensions defined)"

    code_text = final_code if final_code else "(no final code submitted)"

    return f"""You are evaluating a completed mock technical interview.

PROBLEM GIVEN:
{question_prompt}

FULL CONVERSATION:
{history_text}

CANDIDATE'S FINAL CODE:
{code_text}

RUBRIC DIMENSIONS TO SCORE (0-100 each). Base every score only on
actual evidence in the conversation and code above — never invent
evidence that is not there. If the conversation gives no signal for a
dimension, score it conservatively (around 50) rather than guessing:
{dimensions_text}

Respond with ONLY this JSON, no other text, no markdown fences:
{{"rubric_scores": {{"<dimension_name>": <0-100 int>, ...}},
  "score_overall": <0-100 int, a holistic weighted judgment of overall
  interview performance across all dimensions>}}
"""
