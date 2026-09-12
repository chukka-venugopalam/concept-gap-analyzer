import logging
import json
import asyncio
from ai.client import get_gemini_client
from pydantic import BaseModel
from typing import Literal, Optional

logger = logging.getLogger(__name__)


class InterviewTurnDecision(BaseModel):
    action: Literal['hint', 'follow_up', 'acknowledge']
    hint_index: Optional[int] = None
    follow_up_trigger: Optional[str] = None
    acknowledgment_text: Optional[str] = None


FALLBACK_MESSAGE = (
    "Take your time — keep going whenever you're ready."
)


async def run_interview_turn(
    prompt: str
) -> InterviewTurnDecision:
    MAX_RETRIES = 3
    for attempt in range(MAX_RETRIES):
        try:
            client = get_gemini_client()
            response = client.models.generate_content(
                model='gemini-3.6-flash',
                contents=prompt
            )
            content = response.text.strip()
            print(f"[INTERVIEW_TURN] Response "
                  f"({len(content)} chars)")
            print(f"[INTERVIEW_TURN] Raw text: {repr(content)}")

            if content.startswith("```"):
                lines = content.split("\n")
                content = "\n".join(lines[1:-1])

            parsed = json.loads(content)
            return InterviewTurnDecision(**parsed)

        except Exception as e:
            logger.error(
                f"Interview turn attempt "
                f"{attempt+1} failed: {e}"
            )
            print(f"[INTERVIEW_TURN] FAILED attempt {attempt+1}: {e}")
            if attempt < MAX_RETRIES - 1:
                await asyncio.sleep(2 ** attempt)
            else:
                return InterviewTurnDecision(
                    action='acknowledge',
                    acknowledgment_text=FALLBACK_MESSAGE
                )

    return InterviewTurnDecision(
        action='acknowledge',
        acknowledgment_text=FALLBACK_MESSAGE
    )
