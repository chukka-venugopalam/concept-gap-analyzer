def determine_probe_count(
    concepts_covered: list,
    total_concepts: list
) -> int:
    if not total_concepts:
        return 2
    ratio = len(concepts_covered) / len(total_concepts)
    if ratio >= 0.75:
        return 1
    elif ratio >= 0.50:
        return 2
    return 3
