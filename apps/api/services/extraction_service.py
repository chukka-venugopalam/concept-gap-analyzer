def rule_based_extraction(
    user_text: str,
    concepts: list[dict]
) -> list[dict]:
    user_lower = user_text.lower()
    candidates = []

    for concept in concepts:
        keywords = concept.get('canonical_keywords', [])
        hits = [kw for kw in keywords if kw.lower() in user_lower]
        if hits:
            candidates.append({
                'concept_id': concept['id'],
                'keyword_matches': hits,
                'rule_confidence': min(
                    len(hits) / max(len(keywords), 1),
                    1.0
                )
            })
    print(f"[DIAG] rule_based checked {len(concepts)} concepts, "
          f"found {len(candidates)} candidates: {candidates}")
    return candidates

def merge_extraction_results(
    rule_candidates: list[dict],
    ai_concepts: list
) -> list:
    ai_ids = {c.concept_id for c in ai_concepts}
    merged = list(ai_concepts)

    for candidate in rule_candidates:
        if candidate['concept_id'] not in ai_ids:
            if candidate['rule_confidence'] >= 0.6:
                from ai.extraction import ExtractedConcept
                merged.append(ExtractedConcept(
                    concept_id=candidate['concept_id'],
                    status='weak',
                    confidence=candidate['rule_confidence'] * 0.7,
                    evidence_quote='detected via keywords',
                    stage_source=1
                ))
    return merged
