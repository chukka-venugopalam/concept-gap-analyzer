import logging
import json
import asyncio
from ai.client import get_gemini_client
from pydantic import BaseModel

logger = logging.getLogger(__name__)


class InterviewEvalResult(BaseModel):
    rubric_scores: dict[str, int] = {}
    score_overall: int = 0


async def run_interview_eval(prompt: str) -> InterviewEvalResult:
    MAX_RETRIES = 3
    for attempt in range(MAX_RETRIES):
        try:
            client = get_gemini_client()
            response = client.models.generate_content(
                model='gemini-3.6-flash',
                contents=prompt
            )
            content = response.text.strip()
            print(f"[INTERVIEW_EVAL] Response "
                  f"({len(content)} chars)")
            print(f"[INTERVIEW_EVAL] Raw text: {repr(content)}")

            if content.startswith("```"):
                lines = content.split("\n")
                content = "\n".join(lines[1:-1])

            parsed = json.loads(content)
            return InterviewEvalResult(**parsed)

        except Exception as e:
            logger.error(
                f"Interview eval attempt "
                f"{attempt+1} failed: {e}"
            )
            print(f"[INTERVIEW_EVAL] FAILED attempt {attempt+1}: {e}")
            if attempt < MAX_RETRIES - 1:
                await asyncio.sleep(2 ** attempt)
            else:
                return InterviewEvalResult()

    return InterviewEvalResult()
