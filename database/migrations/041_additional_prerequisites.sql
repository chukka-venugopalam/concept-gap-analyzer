-- Migration 041: Additional prerequisite edges
-- Checked all 11 topics first: Linked Lists, Binary Trees, Graphs, DP,
-- Heaps, Tries, Stacks & Queues, and Sorting Fundamentals are already
-- fully connected (every concept has at least one edge) — NOT touched
-- here, adding edges to them would be unnecessary.
-- Only 3 topics actually have isolated/disconnected concepts:
-- Arrays & Hashing (pre-existing gap), Bit & String Manipulation and
-- Patterns (gaps I introduced this session, being fixed now).

-- Arrays & Hashing: arr_dynamic and arr_sorting were fully isolated;
-- arr_two_pointer's cluster was disconnected from arr_indexing's.
-- Result: two clean rooted trees (arr_indexing-rooted: 7 concepts,
-- hash_map_basics-rooted: 3 concepts) instead of 3 fragments + 2 orphans.
INSERT INTO concept_prerequisites (concept_id, prerequisite_id) VALUES
('arr_two_pointer', 'arr_indexing'),
('arr_dynamic',     'arr_indexing'),
('arr_sorting',     'arr_indexing');

-- Bit & String Manipulation: str_palindrome and str_anagram were fully
-- isolated, and the whole "string" side was disconnected from "bit".
-- Result: str_palindrome and str_anagram both feed into str_common_prefix
-- (comparing characters across strings extends single-string comparison),
-- which already fed into str_pattern_matching — one connected chain.
INSERT INTO concept_prerequisites (concept_id, prerequisite_id) VALUES
('str_common_prefix', 'str_palindrome'),
('str_common_prefix', 'str_anagram');

-- Patterns: all 6 concepts were fully isolated (0 edges). These are
-- genuinely more independent strategies than a strict data-structure
-- hierarchy, so this creates 3 defensible pairs rather than forcing
-- one artificial tree — still infinitely better than 6 floating dots.
INSERT INTO concept_prerequisites (concept_id, prerequisite_id) VALUES
('pat_kway_merge',             'pat_two_heaps'),           -- both: heap picks the next-best item across multiple sources; k-way merge generalizes two-heaps' 2-source idea to K
('pat_modified_binary_search', 'pat_subsets_backtracking'),-- both: systematic search over a space of possibilities (recursion tree vs. answer range)
('pat_merge_intervals',        'pat_cyclic_sort');         -- both: rearrange/preprocess elements into a useful order before the core logic applies

-- VERIFICATION QUERY — expect zero rows returned (no concept anywhere
-- with neither an outgoing nor incoming prerequisite edge)
SELECT c.id, c.name, c.topic_id
FROM concepts c
WHERE c.topic_id IN ('arrays_hashing', 'bit_string_manipulation', 'patterns')
  AND c.id NOT IN (SELECT concept_id FROM concept_prerequisites)
  AND c.id NOT IN (SELECT prerequisite_id FROM concept_prerequisites);
