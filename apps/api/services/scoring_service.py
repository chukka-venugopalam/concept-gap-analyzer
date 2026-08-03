from dataclasses import dataclass

@dataclass
class UnderstandingScore:
    overall: int
    coverage: int
    depth: int
    accuracy: int
    connectivity: int

    @classmethod
    def zero(cls):
        return cls(0, 0, 0, 0, 0)

def compute_understanding_score(
    diff,
    extracted_concepts: list,
    misconceptions: list,
    all_concepts: list[dict],
    prerequisites: list[dict]
) -> UnderstandingScore:
    total = len(all_concepts)
    if total == 0:
        return UnderstandingScore.zero()

    weight_map = {
        c['id']: c.get('importance_weight', 2)
        for c in all_concepts
    }
    total_weight = sum(weight_map.values())
    if total_weight == 0:
        return UnderstandingScore.zero()

    covered = diff.known + diff.weak
    covered_weight = sum(
        weight_map.get(cid, 2) for cid in covered
        if cid in weight_map
    )
    coverage = int((covered_weight / total_weight) * 100)

    known_concepts = [
        c for c in extracted_concepts
        if c.status == 'known'
    ]
    if known_concepts:
        avg_conf = sum(c.confidence for c in known_concepts) / len(known_concepts)
        depth = int(avg_conf * 100)
    else:
        depth = 0

    if not misconceptions:
        accuracy = 100
    else:
        penalty = sum(
            weight_map.get(m.get('concept_id',''), 2) * 15
            for m in misconceptions
        )
        accuracy = max(0, 100 - penalty)

    expressed = set(diff.known + diff.weak)
    possible = [
        p for p in prerequisites
        if p.get('concept_id') in expressed
        and p.get('prerequisite_id') in expressed
    ]
    if not possible:
        connectivity = 50
    else:
        all_evidence = " ".join([
            c.evidence_quote for c in extracted_concepts
        ]).lower()
        relational = [
            'because','therefore','which means',
            'allows','requires','depends',
            'enables','using','so that','builds on'
        ]
        hits = sum(
            1 for kw in relational
            if kw in all_evidence
        )
        connectivity = min(int((hits / 5) * 100), 100)

    overall = int(
        coverage     * 0.35 +
        depth        * 0.25 +
        accuracy     * 0.25 +
        connectivity * 0.15
    )

    return UnderstandingScore(
        overall=overall,
        coverage=coverage,
        depth=depth,
        accuracy=accuracy,
        connectivity=connectivity
    )
