import time
import logging
from ai.extraction import run_extraction
from ai.probe_generator import generate_probes
from ai.misconception import (
    validate_misconception, should_surface
)
from ai.prompts.extraction_prompt import (
    build_extraction_prompt
)
from ai.prompts.misconception_prompt import (
    build_misconception_prompt
)
from services.extraction_service import (
    rule_based_extraction, merge_extraction_results
)
from services.graph_diff_service import compute_graph_diff
from services.scoring_service import (
    compute_understanding_score
)
from services.learning_path_service import (
    generate_next_concepts
)
from services.misconception_service import (
    check_trigger_phrases
)

logger = logging.getLogger(__name__)

async def evaluate_session(
    session: dict,
    topic: dict,
    concepts: list[dict],
    prerequisites: list[dict],
    misconception_defs: list[dict]
) -> dict:
    start = time.time()

    stage1 = session.get('stage1_response', '')
    stage2 = session.get('stage2_responses', [])
    stage3 = session.get('stage3_response', '')
    full_text = f"{stage1} {stage3} " + " ".join([
        r.get('response', '') for r in stage2
    ])

    rule_candidates = rule_based_extraction(
        full_text, concepts
    )

    extraction_prompt = build_extraction_prompt(
        topic['name'], concepts,
        stage1, stage2, stage3
    )
    ai_result = await run_extraction(extraction_prompt)
    merged = merge_extraction_results(
        rule_candidates, ai_result.extracted_concepts
    )

    diff = compute_graph_diff(merged, concepts)

    confirmed_misconceptions = []
    for mc in misconception_defs:
        if check_trigger_phrases(
            full_text, mc.get('trigger_phrases', [])
        ):
            prompt = build_misconception_prompt(
                mc['concept_name'],
                mc['concept_definition'],
                mc['misconception'],
                mc['correction'],
                full_text[:300],
                full_text
            )
            validation = await validate_misconception(prompt)
            if should_surface(validation):
                confirmed_misconceptions.append({
                    'concept_id': mc['concept_id'],
                    'concept_name': mc['concept_name'],
                    'what_user_said':
                        validation.student_statement,
                    'correction': mc['correction'],
                    'confidence': validation.confidence,
                    'evidence_quote':
                        validation.student_statement
                })

    score = compute_understanding_score(
        diff, merged, confirmed_misconceptions,
        concepts, prerequisites
    )

    next_concept_ids = generate_next_concepts(
        diff.missing, diff.weak,
        concepts, prerequisites
    )

    concept_map = {c['id']: c for c in concepts}
    next_concepts = [
        {
            'concept_id': cid,
            'concept_name': concept_map[cid]['name'],
            'reason': _get_reason(
                cid, diff, concept_map
            )
        }
        for cid in next_concept_ids
        if cid in concept_map
    ]

    duration = int(time.time() - start)

    return {
        'score': {
            'overall':      score.overall,
            'coverage':     score.coverage,
            'depth':        score.depth,
            'accuracy':     score.accuracy,
            'connectivity': score.connectivity,
        },
        'concepts_known':   diff.known,
        'concepts_weak':    diff.weak,
        'concepts_missing': diff.missing,
        'misconceptions':   confirmed_misconceptions,
        'next_concepts':    next_concept_ids,
        'next_concepts_detail': next_concepts,
        'concept_evidence': [
            {
                'concept_id':    c.concept_id,
                'status':        c.status,
                'confidence':    c.confidence,
                'evidence_quote':c.evidence_quote,
                'stage_source':  c.stage_source
            }
            for c in merged
        ],
        'duration_seconds': duration
    }

def _get_reason(
    concept_id: str,
    diff,
    concept_map: dict
) -> str:
    concept = concept_map.get(concept_id, {})
    if concept_id in diff.weak:
        return (f"You mentioned "
                f"{concept.get('name','')} "
                f"but didn't explain it fully")
    return (f"Core concept — "
            f"required for interview readiness")
