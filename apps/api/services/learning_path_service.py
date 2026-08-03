from collections import defaultdict, deque

def generate_next_concepts(
    missing_ids: list[str],
    weak_ids: list[str],
    all_concepts: list[dict],
    prerequisites: list[dict],
    limit: int = 5
) -> list[str]:
    target = set(missing_ids + weak_ids)
    dependents = defaultdict(set)
    in_degree = defaultdict(int)

    for prereq in prerequisites:
        cid = prereq.get('concept_id')
        pid = prereq.get('prerequisite_id')
        if cid in target:
            dependents[pid].add(cid)
            in_degree[cid] += 1

    queue = deque([
        cid for cid in target
        if in_degree[cid] == 0
    ])
    sorted_ids = []

    while queue:
        cid = queue.popleft()
        sorted_ids.append(cid)
        for dep in dependents[cid]:
            in_degree[dep] -= 1
            if in_degree[dep] == 0:
                queue.append(dep)

    weight_map = {
        c['id']: c.get('importance_weight', 2)
        for c in all_concepts
    }
    sorted_ids.sort(
        key=lambda x: weight_map.get(x, 1),
        reverse=True
    )
    return sorted_ids[:limit]
