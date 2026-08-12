import logging
import json
from ai.client import get_gemini_client
from pydantic import BaseModel

logger = logging.getLogger(__name__)

CONFIDENCE_THRESHOLD = 0.85

class MisconceptionValidation(BaseModel):
    confirmed: bool
    confidence: float
    reasoning: str
    student_statement: str

async def validate_misconception(
    prompt: str
) -> MisconceptionValidation:
    try:
        client = get_gemini_client()
        response = client.models.generate_content(
            model='gemini-2.0-flash',
            contents=prompt
        )
        content = response.text.strip()

        if content.startswith("```"):
            lines = content.split("\n")
            content = "\n".join(lines[1:-1])

        parsed = json.loads(content)
        return MisconceptionValidation(
            confirmed=parsed.get('confirmed', False),
            confidence=parsed.get('confidence', 0.0),
            reasoning=parsed.get('reasoning', ''),
            student_statement=parsed.get(
                'student_statement', ''
            )
        )

    except Exception as e:
        logger.error(
            f"Misconception failed: {e}"
        )
        return MisconceptionValidation(
            confirmed=False,
            confidence=0.0,
            reasoning="Validation failed",
            student_statement=""
        )

def should_surface(
    validation: MisconceptionValidation
) -> bool:
    return (
        validation.confirmed and
        validation.confidence >= CONFIDENCE_THRESHOLD
    )
