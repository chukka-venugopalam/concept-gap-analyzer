from dataclasses import dataclass, field

@dataclass
class GraphDiffResult:
    known: list[str] = field(default_factory=list)
    weak: list[str] = field(default_factory=list)
    missing: list[str] = field(default_factory=list)
    total_expected: int = 0

def compute_graph_diff(
    extracted_concepts: list,
    all_topic_concepts: list[dict]
) -> GraphDiffResult:
    known_ids = {
        c.concept_id for c in extracted_concepts
        if c.status == 'known' and c.confidence >= 0.7
    }
    weak_ids = {
        c.concept_id for c in extracted_concepts
        if c.status == 'weak' or
        (c.status == 'known' and c.confidence < 0.7)
    }
    all_ids = {c['id'] for c in all_topic_concepts}
    missing_ids = all_ids - known_ids - weak_ids

    important_missing = {
        c['id'] for c in all_topic_concepts
        if c['id'] in missing_ids
        and c.get('importance_weight', 2) >= 2
    }

    return GraphDiffResult(
        known=list(known_ids),
        weak=list(weak_ids),
        missing=list(important_missing),
        total_expected=len(all_ids)
    )
