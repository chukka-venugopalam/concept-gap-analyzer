-- Migration 054: Dynamic Programming depth expansion
-- DP was the thinnest topic (6 concepts) and had zero interview questions
-- (confirmed by grep across all interview-question migrations before writing
-- this). Adds 4 concepts genuinely missing from the existing 6 — checked
-- each against the current schema first, not assumed:
--   - Unbounded Knapsack: the reuse variant dp_knapsack's own misconception
--     text already references but never teaches as its own concept
--   - Grid/Path DP, State-Machine DP (stock), Bitmask DP: confirmed absent
--     via grep, all common interview/pro-tier DP categories
-- Interval DP was deliberately NOT added here: dp_mcm's existing Burst
-- Balloons practice problem already generalizes the same split-point
-- range-DP idea, so a separate concept would duplicate diagnostic state
-- (same reasoning migration 030 used to avoid duplicating Two Pointers/
-- Sliding Window in Patterns). Tree DP and Digit DP are also left for a
-- later pass — kept this migration to 4 well-verified concepts rather
-- than stretching into more.
-- All prerequisites point to dp_memo_tab only, matching the existing
-- design note in 014 (avoid fake teaching-order links) — EXCEPT
-- dp_unbounded_knapsack -> dp_knapsack, which is a real, direct variant
-- relationship already documented in dp_knapsack's own misconception text,
-- not a loose thematic pairing.
-- Resources: 3 of 4 use GeeksforGeeks, matching this project's established
-- convention. dp_state_machine is the one exception — no single GfG
-- article specifically covering the stock-DP state-machine technique was
-- found during verification, so it links to labuladong.online instead,
-- a real, independently-corroborated algorithms resource that is
-- specifically about this technique. Its practice problems are still
-- LeetCode, verified individually as usual.
-- All URLs (GfG articles and LeetCode problems) individually fetched or
-- cross-checked against multiple independent sources on 2026-09-18 —
-- none taken from memory.

INSERT INTO concepts (id, topic_id, name, definition, proficiency_level, importance_weight, canonical_keywords, display_order) VALUES

('dp_unbounded_knapsack', 'dynamic_programming',
 'Unbounded Knapsack',
 'Choosing items to maximize value within a weight capacity where each item may be reused any number of times, unlike 0/1 Knapsack where each item is used at most once. The recurrence changes to reference the CURRENT row (dp[i][w-weight[i]]) instead of the previous row specifically because reuse is now allowed. Coin Change (fewest coins, or number of ways to make an amount) applies this same recurrence to currency denominations.',
 'interview', 3,
 ARRAY['unbounded knapsack','coin change','item reuse','current row','minimum coins','ways to make amount'], 7),

('dp_grid_paths', 'dynamic_programming',
 'Grid / Path DP',
 'Counting or optimizing paths through a 2D grid where movement is restricted, typically to only right and down, so dp[i][j] depends only on dp[i-1][j] and dp[i][j-1] — their sum for counting distinct paths, or the better of the two plus the current cell''s cost for optimization. The first row and first column are the base case, since each has exactly one way to be reached.',
 'interview', 3,
 ARRAY['grid dp','unique paths','path counting','min path sum','2d dp','right and down','first row first column'], 8),

('dp_state_machine', 'dynamic_programming',
 'State-Machine DP (Buy/Sell Stock)',
 'DP where the state includes not just a position like day index but also a discrete mode, such as whether a stock is currently held, because the best decision today depends on which mode prior decisions left you in. dp[day][mode] tracks the best result for every (day, mode) pair, transitioning between modes such as buy, sell, hold, and cooldown, rather than accumulating a single running value.',
 'advanced', 2,
 ARRAY['state machine dp','buy sell stock','holding state','transaction limit','cooldown','discrete state'], 9),

('dp_bitmask', 'dynamic_programming',
 'Bitmask DP',
 'Representing which elements of a small set (typically under ~20) have already been used as a single integer, where bit i is 1 if element i has been included. This lets the DP state track exactly WHICH elements were chosen, not just how many, at the cost of an exponential 2^n possible states — practical only when n is small enough for 2^n to stay tractable.',
 'advanced', 2,
 ARRAY['bitmask dp','bitmask','subset state','2^n states','traveling salesman','set membership'], 10);

INSERT INTO concept_prerequisites (concept_id, prerequisite_id) VALUES
('dp_unbounded_knapsack', 'dp_memo_tab'),
('dp_unbounded_knapsack', 'dp_knapsack'),
('dp_grid_paths',         'dp_memo_tab'),
('dp_state_machine',      'dp_memo_tab'),
('dp_bitmask',            'dp_memo_tab');

INSERT INTO concept_misconceptions (concept_id, misconception, correction, trigger_phrases) VALUES

('dp_unbounded_knapsack',
 'Unbounded Knapsack needs an entirely different recurrence from 0/1 Knapsack because items can repeat.',
 'The recurrence is almost identical to 0/1 Knapsack — the only change is referencing dp[i][w-weight[i]] (the current row) instead of dp[i-1][w-weight[i]] (the previous row) when including an item, which is exactly the change 0/1 Knapsack''s own misconception warns against making by accident.',
 ARRAY['completely different recurrence','need a new approach','nothing like 0/1 knapsack']),

('dp_grid_paths',
 'Since any cell could theoretically be reached through many routes, dp[i][j] should consider every previously-computed cell, not just the immediate neighbors.',
 'Movement is restricted, typically to only right and down, so dp[i][j] only ever depends on its immediate predecessors, dp[i-1][j] and dp[i][j-1] — considering every earlier cell is unnecessary work and usually a sign the movement constraint was misread.',
 ARRAY['consider all previous cells','check every earlier cell','any direction is possible']),

('dp_state_machine',
 'Tracking only the best profit so far is enough state, the same way a simple running-max greedy would work.',
 'Without also tracking which mode you are in, such as holding a share or not and how many transactions remain, the DP cannot correctly decide whether selling today is even legal or optimal. The state needs at minimum a (day, mode) pair, not a single running number — this is exactly why simple greedy only works for the unlimited-transaction version and fails once a transaction limit or cooldown is added.',
 ARRAY['just track the max profit','single running value','dont need to track holding']),

('dp_bitmask',
 'Bitmask DP is just regular DP with the array index written in binary instead of decimal.',
 'The bitmask itself is part of the state, not just an index format — each of the 2^n possible bitmasks represents a genuinely different subset of elements already used, and the DP explores transitions between these subset-states. That is a fundamentally different state space from a normal 1D or 2D DP table, not a cosmetic renumbering of one.',
 ARRAY['just binary indexing','same as regular dp','just a different number format']);

INSERT INTO concept_resources (concept_id, title, url) VALUES
('dp_unbounded_knapsack', 'Unbounded Knapsack (Repetition of Items Allowed)', 'https://www.geeksforgeeks.org/dsa/unbounded-knapsack-repetition-items-allowed/'),
('dp_grid_paths',         'Dynamic Programming', 'https://www.geeksforgeeks.org/dsa/dynamic-programming/'),
('dp_state_machine',      'One Method to Solve All Stock Problems on LeetCode', 'https://labuladong.online/en/algo/dynamic-programming/stock-problem-summary/'),
('dp_bitmask',            'Bitmasking and Dynamic Programming (Count Ways to Assign Unique Cap to Every Person)', 'https://www.geeksforgeeks.org/dsa/bitmasking-and-dynamic-programming-set-1-count-ways-to-assign-unique-cap-to-every-person/');

INSERT INTO concept_practice_problems (concept_id, platform, title, url, difficulty, display_order) VALUES
('dp_unbounded_knapsack', 'LeetCode', 'Coin Change',                                    'https://leetcode.com/problems/coin-change/',                                    'Medium', 1),
('dp_unbounded_knapsack', 'LeetCode', 'Coin Change II',                                 'https://leetcode.com/problems/coin-change-ii/',                                 'Medium', 2),
('dp_grid_paths',         'LeetCode', 'Unique Paths',                                   'https://leetcode.com/problems/unique-paths/',                                   'Medium', 1),
('dp_grid_paths',         'LeetCode', 'Minimum Path Sum',                               'https://leetcode.com/problems/minimum-path-sum/',                               'Medium', 2),
('dp_state_machine',      'LeetCode', 'Best Time to Buy and Sell Stock with Cooldown',  'https://leetcode.com/problems/best-time-to-buy-and-sell-stock-with-cooldown/',  'Medium', 1),
('dp_state_machine',      'LeetCode', 'Best Time to Buy and Sell Stock III',            'https://leetcode.com/problems/best-time-to-buy-and-sell-stock-iii/',            'Hard',   2),
('dp_bitmask',            'LeetCode', 'Partition to K Equal Sum Subsets',               'https://leetcode.com/problems/partition-to-k-equal-sum-subsets/',               'Medium', 1);

UPDATE concepts SET real_world_example = 'An unlimited vending machine of coin denominations making exact change with the fewest coins possible — unlike a knapsack of one-of-a-kind souvenirs where each item can only be packed once.' WHERE id = 'dp_unbounded_knapsack';
UPDATE concepts SET real_world_example = 'A delivery robot that can only move right or down through a warehouse grid, counting how many distinct routes reach the loading dock.' WHERE id = 'dp_grid_paths';
UPDATE concepts SET real_world_example = 'A trading bot that can only be in one of a few modes at a time — holding a share, just sold and cooling down, or free to buy — and must decide each day whether switching modes now beats waiting, given how many switches it has left.' WHERE id = 'dp_state_machine';
UPDATE concepts SET real_world_example = 'A delivery driver deciding the cheapest route visiting every one of 12 stops exactly once — small enough that tracking exactly which stops are already visited, as one of 4096 possible subsets, is computationally practical.' WHERE id = 'dp_bitmask';

-- VERIFICATION QUERY — expect 4 rows, each with the prereq/misconception/
-- resource/problem counts noted, and a real-world example present
SELECT c.id, c.name, c.display_order,
       (SELECT count(*) FROM concept_prerequisites WHERE concept_id = c.id) AS prereqs,
       (SELECT count(*) FROM concept_misconceptions WHERE concept_id = c.id) AS misconceptions,
       (SELECT count(*) FROM concept_resources WHERE concept_id = c.id) AS resources,
       (SELECT count(*) FROM concept_practice_problems WHERE concept_id = c.id) AS problems,
       (c.real_world_example IS NOT NULL) AS has_example
FROM concepts c
WHERE c.id IN ('dp_unbounded_knapsack','dp_grid_paths','dp_state_machine','dp_bitmask')
ORDER BY c.display_order;

-- Expect: dp_unbounded_knapsack prereqs=2, the other three prereqs=1 each.
