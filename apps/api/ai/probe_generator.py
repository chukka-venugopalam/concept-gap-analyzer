import logging
import json
from ai.client import get_gemini_client
from pydantic import BaseModel

logger = logging.getLogger(__name__)

class ProbeItem(BaseModel):
    id: str
    context_reference: str
    question: str
    target_concept_id: str

class ProbeResult(BaseModel):
    probes: list[ProbeItem]
    probe_count: int

async def generate_probes(
    prompt: str
) -> ProbeResult:
    try:
        model = get_gemini_client()

        response = model.generate_content(prompt)
        content = response.text.strip()

        print(f"[PROBES] Raw response "
              f"({len(content)} chars): "
              f"{content[:100]}...")

        if content.startswith("```"):
            lines = content.split("\n")
            content = "\n".join(
                lines[1:-1]
                if lines[-1] == "```"
                else lines[1:]
            )

        parsed = json.loads(content)

        probes = []
        for i, item in enumerate(
            parsed.get('probes', [])
        ):
            try:
                probes.append(ProbeItem(
                    id=item.get('id', f'p{i+1}'),
                    context_reference=item.get(
                        'context_reference', ''
                    ),
                    question=item.get('question', ''),
                    target_concept_id=item.get(
                        'target_concept_id', ''
                    )
                ))
            except Exception:
                pass

        print(f"[PROBES] Generated {len(probes)} probes")
        return ProbeResult(
            probes=probes,
            probe_count=len(probes)
        )

    except Exception as e:
        logger.error(
            f"Probe generation failed: {e}"
        )
        return ProbeResult(probes=[], probe_count=0)
