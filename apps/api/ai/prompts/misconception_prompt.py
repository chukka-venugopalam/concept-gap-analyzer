PROMPT_VERSION = "v1.0"

def build_misconception_prompt(
    concept_name: str,
    concept_definition: str,
    known_misconception: str,
    correction: str,
    user_statement: str,
    full_context: str
) -> str:
    return f"""You are validating whether a student has
a specific misconception about a CS concept.

CONCEPT: {concept_name}
DEFINITION: {concept_definition}

KNOWN MISCONCEPTION TO CHECK:
"{known_misconception}"

CORRECT UNDERSTANDING:
"{correction}"

STUDENT STATEMENT FLAGGED:
"{user_statement}"

FULL RESPONSE CONTEXT:
"{full_context[:500]}"

Does the student's statement reflect the known
misconception? Only confirm if clearly incorrect.
If ambiguous, return confirmed: false.
Do not penalize imprecise language if understanding
is fundamentally correct.

Return ONLY valid JSON. No markdown.

{{
  "confirmed": true or false,
  "confidence": 0.0 to 1.0,
  "reasoning": "one sentence",
  "student_statement": "exact quote"
}}"""
