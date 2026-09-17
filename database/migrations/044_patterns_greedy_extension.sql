-- Migration 044: Patterns extension — Greedy Algorithms
-- Extends the existing 6-concept Patterns topic to 7. All URLs
-- individually verified via live search on 2026-09-08.

INSERT INTO concepts
  (id, topic_id, name, definition, proficiency_level, importance_weight, canonical_keywords, display_order)
VALUES
('pat_greedy', 'patterns',
 'Greedy Algorithms',
 'Making the locally optimal choice at each step without reconsidering previous choices, betting that a sequence of local optima leads to a global optimum. Only works when a problem has the greedy-choice property and optimal substructure — Dijkstra''s and Kruskal''s algorithms are both greedy, while 0/1 Knapsack is a classic case where greedy fails and DP is needed instead.',
 'interview', 3,
 ARRAY['greedy algorithm','greedy choice','locally optimal','local optimum'], 7);

INSERT INTO concept_prerequisites (concept_id, prerequisite_id) VALUES
('pat_greedy', 'pat_merge_intervals');

INSERT INTO concept_misconceptions
  (concept_id, misconception, correction, trigger_phrases)
VALUES
('pat_greedy',
 'A greedy algorithm always gives the correct optimal answer',
 'Greedy only works when the problem actually has the greedy-choice property. For problems like 0/1 Knapsack, where item choices interact, a greedy approach gives a WRONG answer — dynamic programming is needed instead.',
 ARRAY['always optimal','always works','always gives best answer']);

INSERT INTO concept_resources (concept_id, title, url) VALUES
('pat_greedy', 'Introduction to Greedy Algorithms', 'https://www.geeksforgeeks.org/dsa/introduction-to-greedy-algorithm-data-structures-and-algorithm-tutorials/');

INSERT INTO concept_practice_problems (concept_id, platform, title, url, difficulty, display_order) VALUES
('pat_greedy', 'LeetCode', 'Jump Game', 'https://leetcode.com/problems/jump-game/', 'Medium', 1),
('pat_greedy', 'LeetCode', 'Gas Station', 'https://leetcode.com/problems/gas-station/', 'Medium', 2);

UPDATE concepts SET real_world_example = 'A cashier making change with the fewest coins by always giving the largest coin that does not overshoot — works for standard currency, but would not work for an unusual coin system.' WHERE id = 'pat_greedy';

-- VERIFICATION QUERY — expect 1 row, 1 prereq, 1 misconception,
-- 1 resource, 2 problems, real-world example present
SELECT c.id, c.name,
       (SELECT count(*) FROM concept_prerequisites WHERE concept_id = c.id) AS prereqs,
       (SELECT count(*) FROM concept_misconceptions WHERE concept_id = c.id) AS misconceptions,
       (SELECT count(*) FROM concept_resources WHERE concept_id = c.id) AS resources,
       (SELECT count(*) FROM concept_practice_problems WHERE concept_id = c.id) AS problems,
       (c.real_world_example IS NOT NULL) AS has_example
FROM concepts c
WHERE c.id = 'pat_greedy';
