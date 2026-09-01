-- Migration 024: Practice problems + real-world examples for Dynamic Programming
-- All URLs individually verified via live search on 2026-09-01 (LeetCode only)

INSERT INTO concept_practice_problems (concept_id, platform, title, url, difficulty, display_order) VALUES
('dp_memo_tab', 'LeetCode', 'Climbing Stairs',                                            'https://leetcode.com/problems/climbing-stairs/',                                            'Easy',   1),
('dp_memo_tab', 'LeetCode', 'House Robber',                                                'https://leetcode.com/problems/house-robber/',                                                'Medium', 2),

('dp_knapsack', 'LeetCode', 'Partition Equal Subset Sum',                                  'https://leetcode.com/problems/partition-equal-subset-sum/',                                  'Medium', 1),
('dp_knapsack', 'LeetCode', 'Target Sum',                                                  'https://leetcode.com/problems/target-sum/',                                                  'Medium', 2),

('dp_lcs',      'LeetCode', 'Longest Common Subsequence',                                  'https://leetcode.com/problems/longest-common-subsequence/',                                  'Medium', 1),

('dp_mcm',      'LeetCode', 'Burst Balloons',                                              'https://leetcode.com/problems/burst-balloons/',                                              'Hard',   1),

('dp_lis',      'LeetCode', 'Longest Increasing Subsequence',                              'https://leetcode.com/problems/longest-increasing-subsequence/',                              'Medium', 1),

('dp_apsp',     'LeetCode', 'Find the City With the Smallest Number of Neighbors at a Threshold Distance', 'https://leetcode.com/problems/find-the-city-with-the-smallest-number-of-neighbors-at-a-threshold-distance/', 'Medium', 1);

UPDATE concepts SET real_world_example = 'A spreadsheet caching a formula''s result so reopening the same cell reference doesn''t recalculate everything from scratch.' WHERE id = 'dp_memo_tab';
UPDATE concepts SET real_world_example = 'Packing a carry-on bag under a strict weight limit — picking the combination of items worth the most without going over.' WHERE id = 'dp_knapsack';
UPDATE concepts SET real_world_example = 'A "diff" tool like git diff finding the longest matching sequence of lines between two versions of a file to show what actually changed.' WHERE id = 'dp_lcs';
UPDATE concepts SET real_world_example = 'A database query planner picking the cheapest order to join several tables — the result is the same either way, but the cost isn''t.' WHERE id = 'dp_mcm';
UPDATE concepts SET real_world_example = 'A stock-tracking app finding the longest stretch of days where the price kept trending upward, even with other days mixed in between.' WHERE id = 'dp_lis';
UPDATE concepts SET real_world_example = 'A logistics company precomputing the shortest route between every pair of warehouses once, so any route can be looked up instantly instead of recalculated per shipment.' WHERE id = 'dp_apsp';

-- VERIFICATION QUERY — expect 6 rows, problem_count 1 or 2, has_example = true on all
SELECT c.id, c.name,
       (SELECT count(*) FROM concept_practice_problems p WHERE p.concept_id = c.id) AS problem_count,
       (c.real_world_example IS NOT NULL) AS has_example
FROM concepts c
WHERE c.topic_id = 'dynamic_programming'
ORDER BY c.display_order;
