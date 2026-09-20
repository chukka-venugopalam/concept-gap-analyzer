-- Migration 059: Advanced Trees — resources, practice problems, real-world examples
-- All 3 GfG resource URLs individually fetched (not just search-snippet-
-- guessed) on 2026-09-18 to confirm their canonical /dsa/ URL before use.
-- Honesty note (same convention as 036 and 057): adv_sparse_table does
-- NOT get a dedicated LeetCode practice problem. Sparse Table is
-- overwhelmingly a competitive-programming structure for static-array
-- RMQ; nothing verified during this session tested it cleanly as its
-- own standalone LeetCode problem (LeetCode's static range-sum problem,
-- #303, is conventionally solved with a simple prefix-sum array, not a
-- Sparse Table, so using it here would misrepresent which technique it
-- actually teaches). The other two concepts have genuinely dedicated,
-- verified problems.

INSERT INTO concept_resources (concept_id, title, url) VALUES
('adv_segment_tree', 'Segment Tree Data Structure', 'https://www.geeksforgeeks.org/dsa/segment-tree-data-structure/'),
('adv_fenwick_tree', 'Binary Indexed Tree or Fenwick Tree', 'https://www.geeksforgeeks.org/dsa/binary-indexed-tree-or-fenwick-tree-2/'),
('adv_sparse_table', 'Range Minimum Query (Square Root Decomposition and Sparse Table)', 'https://www.geeksforgeeks.org/dsa/range-minimum-query-for-static-array/');

INSERT INTO concept_practice_problems (concept_id, platform, title, url, difficulty, display_order) VALUES
('adv_segment_tree', 'LeetCode', 'Range Sum Query - Mutable',            'https://leetcode.com/problems/range-sum-query-mutable/',            'Medium', 1),
('adv_fenwick_tree', 'LeetCode', 'Count of Smaller Numbers After Self',  'https://leetcode.com/problems/count-of-smaller-numbers-after-self/', 'Hard',   1);

UPDATE concepts SET real_world_example = 'A building-wide thermostat system where you need both "what is the average temperature on floors 3 to 7 right now" (range query) and "floor 5''s sensor just reported a new reading" (point update) answered quickly, without re-averaging every floor each time.' WHERE id = 'adv_segment_tree';
UPDATE concepts SET real_world_example = 'A running leaderboard total where you need the cumulative score up to any player''s rank, updated instantly every time a single player''s score changes, without re-summing the whole leaderboard.' WHERE id = 'adv_fenwick_tree';
UPDATE concepts SET real_world_example = 'A published, unchanging dataset of historical daily temperatures, where a research tool needs to instantly answer "what was the coldest day between March 3rd and June 8th" for any date range, as many times as asked, with no new data ever being added.' WHERE id = 'adv_sparse_table';

-- VERIFICATION QUERY — expect 3 resources, 2 practice problems, and all
-- 3 concepts with a real-world example
SELECT c.id,
       (SELECT count(*) FROM concept_resources WHERE concept_id = c.id) AS resources,
       (SELECT count(*) FROM concept_practice_problems WHERE concept_id = c.id) AS problems,
       (c.real_world_example IS NOT NULL) AS has_example
FROM concepts c
WHERE c.topic_id = 'advanced_trees'
ORDER BY c.display_order;
