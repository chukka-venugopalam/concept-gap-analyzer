PROMPT_VERSION = "v1.0"

def build_probe_prompt(
    topic_name: str,
    stage1_response: str,
    concepts_covered: list[str],
    concepts_not_covered: list[dict]
) -> str:
    not_covered = "\n".join([
        f"- {c['name']}: {c['definition']}"
        for c in concepts_not_covered[:6]
    ])
    covered = ", ".join(concepts_covered) if concepts_covered else "none identified"

    return f"""You are a technical interviewer conducting
a conceptual assessment of {topic_name}.

WHAT CANDIDATE COVERED: {covered}

WHAT CANDIDATE DID NOT COVER:
{not_covered}

CANDIDATE STAGE 1 RESPONSE:
"{stage1_response}"

Generate 2-3 follow-up probe questions that:
1. Acknowledge something they said well
2. Ask about a specific gap from the list above
3. Feel like natural interview follow-ups
4. Are ONE question each, not compound
5. Are conversational, not academic
6. Do NOT repeat what they already covered

Return ONLY valid JSON. No markdown. No explanation.

{{
  "probes": [
    {{
      "id": "p1",
      "context_reference": "brief ref to what they said",
      "question": "the actual question",
      "target_concept_id": "concept id from gap list"
    }}
  ],
  "probe_count": 2
}}"""
