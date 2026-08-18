import logging
import json
from ai.client import get_gemini_client
from pydantic import BaseModel, Field
from typing import Literal

logger = logging.getLogger(__name__)

class ExtractedConcept(BaseModel):
    concept_id: str
    status: Literal['known', 'weak']
    confidence: float = Field(ge=0.0, le=1.0)
    evidence_quote: str
    stage_source: int

class ExtractionResult(BaseModel):
    extracted_concepts: list[ExtractedConcept]

async def run_extraction(
    prompt: str
) -> ExtractionResult:
    MAX_RETRIES = 2
    for attempt in range(MAX_RETRIES):
        try:
            client = get_gemini_client()
            response = client.models.generate_content(
                model='gemini-3.6-flash',
                contents=prompt
            )
            content = response.text.strip()
            print(f"[EXTRACTION] Response "
                  f"({len(content)} chars)")
            print(f"[EXTRACTION] Raw text: {repr(content)}")

            if content.startswith("```"):
                lines = content.split("\n")
                content = "\n".join(lines[1:-1])

            parsed = json.loads(content)
            concepts = []
            for item in parsed.get(
                'extracted_concepts', []
            ):
                try:
                    concepts.append(
                        ExtractedConcept(**item)
                    )
                except Exception as parse_err:
                    logger.error(
                        f"[EXTRACTION] Item parse failed: {parse_err} for item: {item}"
                    )
                    print(
                        f"[EXTRACTION] Item parse failed: {parse_err} for item: {item}"
                    )

            print(f"[EXTRACTION] Got "
                  f"{len(concepts)} concepts")
            return ExtractionResult(
                extracted_concepts=concepts
            )

        except Exception as e:
            logger.error(
                f"Extraction attempt "
                f"{attempt+1} failed: {e}"
            )
            print(f"[EXTRACTION] FAILED attempt {attempt+1}: {e}")
            if attempt == MAX_RETRIES - 1:
                return ExtractionResult(
                    extracted_concepts=[]
                )

    return ExtractionResult(extracted_concepts=[])
