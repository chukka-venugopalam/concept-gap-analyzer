PROMPT_VERSION = "v1.0"

def build_extraction_prompt(
    topic_name: str,
    concepts: list[dict],
    stage1_response: str,
    stage2_responses: list[dict],
    stage3_response: str
) -> str:
    concept_list = "\n".join([
        f"- ID: {c['id']} | "
        f"Name: {c['name']} | "
        f"Definition: {c['definition']} | "
        f"Keywords: {', '.join(c['canonical_keywords'])}"
        for c in concepts
    ])

    stage2_text = "\n".join([
        f"Q: {r.get('probe_text','')}\n"
        f"A: {r.get('response','')}"
        for r in stage2_responses
    ])

    return f"""You are an expert CS educator evaluating a
student's understanding of {topic_name} for software
engineering interview preparation.

TASK:
Analyze the student's responses and determine which
concepts from the reference list they demonstrated
understanding of, and at what level.

CONCEPT REFERENCE LIST:
{concept_list}

STUDENT RESPONSES:

STAGE 1 (Open Explanation):
{stage1_response}

STAGE 2 (Follow-up Responses):
{stage2_text or 'Not yet completed'}

STAGE 3 (Challenge Task Response):
{stage3_response or 'Not yet completed'}

EVALUATION RULES:
1. KNOWN: concept explained correctly with elaboration
2. WEAK: concept mentioned but vague or incomplete
3. Do NOT include concepts scoring below 0.5 confidence
4. Do NOT infer knowledge not explicitly expressed
5. Extract short evidence quote under 20 words
6. Only use concept IDs from the reference list above

Return ONLY valid JSON. No markdown. No explanation.

{{
  "extracted_concepts": [
    {{
      "concept_id": "string from reference list",
      "status": "known or weak",
      "confidence": 0.5 to 1.0,
      "evidence_quote": "short quote from student",
      "stage_source": 1 or 2 or 3
    }}
  ]
}}"""
