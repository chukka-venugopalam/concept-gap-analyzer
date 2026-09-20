-- Migration 052: Arrays & Hashing extension — Binary Search
-- Fills a fundamentals gap: pat_modified_binary_search (Patterns) already
-- exists but binary-searches over an ANSWER space, and nothing anywhere
-- teaches the base algorithm it builds on (searching a sorted array
-- directly). Checked before writing this — no concept named or scoped
-- as plain Binary Search exists anywhere in the current schema.
-- Same single-file extension pattern as 044 (Greedy). All URLs
-- individually verified via live fetch/search on 2026-09-18.

INSERT INTO concepts
  (id, topic_id, name, definition, proficiency_level, importance_weight, canonical_keywords, display_order)
VALUES
('arr_binary_search', 'arrays_hashing',
 'Binary Search',
 'Repeatedly halving a sorted search space by comparing the target to the middle element and discarding the half that cannot contain it, until the target is found or the space is empty. Turns an O(n) linear scan into O(log n).',
 'beginner', 3,
 ARRAY['binary search','divide and conquer','O(log n)','sorted array','left right pointers','mid'], 11);

INSERT INTO concept_prerequisites (concept_id, prerequisite_id) VALUES
('arr_binary_search', 'arr_indexing');

INSERT INTO concept_misconceptions
  (concept_id, misconception, correction, trigger_phrases)
VALUES
('arr_binary_search',
 'Binary search can only tell you whether a target exists, not where it would go if it is missing',
 'The same halving logic, with a small adjustment to which half is kept on a near-miss, also finds the correct insertion point for a missing value or the first/last position of a duplicate — this is the exact idea that later extends to binary-searching over a range of possible answers, not a separate algorithm.',
 ARRAY['just checks existence','only yes or no answer','cant find where to insert']);

INSERT INTO concept_resources (concept_id, title, url) VALUES
('arr_binary_search', 'Binary Search', 'https://www.geeksforgeeks.org/dsa/binary-search/');

INSERT INTO concept_practice_problems (concept_id, platform, title, url, difficulty, display_order) VALUES
('arr_binary_search', 'LeetCode', 'Binary Search',          'https://leetcode.com/problems/binary-search/',          'Easy', 1),
('arr_binary_search', 'LeetCode', 'Search Insert Position',  'https://leetcode.com/problems/search-insert-position/', 'Easy', 2);

UPDATE concepts SET real_world_example = 'Looking up a word in a printed dictionary — you open to the middle, decide whether your word comes before or after, and repeat on the correct half instead of reading page by page.' WHERE id = 'arr_binary_search';

-- VERIFICATION QUERY — expect 1 row, 1 prereq, 1 misconception,
-- 1 resource, 2 problems, real-world example present
SELECT c.id, c.name,
       (SELECT count(*) FROM concept_prerequisites WHERE concept_id = c.id) AS prereqs,
       (SELECT count(*) FROM concept_misconceptions WHERE concept_id = c.id) AS misconceptions,
       (SELECT count(*) FROM concept_resources WHERE concept_id = c.id) AS resources,
       (SELECT count(*) FROM concept_practice_problems WHERE concept_id = c.id) AS problems,
       (c.real_world_example IS NOT NULL) AS has_example
FROM concepts c
WHERE c.id = 'arr_binary_search';
