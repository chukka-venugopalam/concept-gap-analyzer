-- Migration 053: Patterns extension — Recursion Fundamentals
-- Fills a fundamentals gap: pat_subsets_backtracking and bt_recursion
-- (Binary Trees) both assume recursion as a prerequisite skill, but no
-- concept anywhere teaches base case / recursive case / call stack
-- generally — checked before writing this, confirmed absent. Lives in
-- Patterns (not Binary Trees) because it is not tree-specific: it is the
-- same "algorithmic strategy not tied to one specific data structure"
-- framing this topic already uses for its other 7 concepts.
-- Deliberately NOT added as a cross-topic prerequisite of bt_recursion —
-- no cross-topic prerequisite edge exists anywhere in the current schema,
-- and introducing the first one is a bigger architectural change than
-- this fundamentals patch is scoped for. Only the in-topic edge to
-- pat_subsets_backtracking is added, which mirrors exactly what 041 did
-- when it added prerequisite edges within a single topic.
-- Same single-file extension pattern as 044 (Greedy). All URLs
-- individually verified via live fetch/search on 2026-09-18.

INSERT INTO concepts
  (id, topic_id, name, definition, proficiency_level, importance_weight, canonical_keywords, display_order)
VALUES
('pat_recursion_fundamentals', 'patterns',
 'Recursion Fundamentals',
 'Solving a problem by having a function call itself on a smaller version of the same problem, until a base case is reached that can be answered directly with no further call. Each call adds a frame to the call stack; results combine as calls return in reverse order. A missing or unreachable base case causes infinite recursion and a stack overflow, not a slightly wrong answer.',
 'beginner', 3,
 ARRAY['recursion','base case','recursive case','call stack','stack frame','recursive function','stack overflow'], 8);

-- pat_subsets_backtracking genuinely depends on this (backtracking IS
-- recursion plus explicit undo) — a real dependency, not one of the
-- loose thematic pairings 041 used to connect the other 6 patterns.
INSERT INTO concept_prerequisites (concept_id, prerequisite_id) VALUES
('pat_subsets_backtracking', 'pat_recursion_fundamentals');

INSERT INTO concept_misconceptions
  (concept_id, misconception, correction, trigger_phrases)
VALUES
('pat_recursion_fundamentals',
 'A missing or incorrectly-placed base case just causes a slightly wrong answer',
 'A base case that is missing, unreachable, or checked after the recursive call causes infinite recursion and a stack overflow crash. The base case must be checked before any recursive call, and the recursive case must be guaranteed to shrink the input toward it on every call.',
 ARRAY['slightly wrong answer','minor bug','mostly still works','off by one result']);

INSERT INTO concept_resources (concept_id, title, url) VALUES
('pat_recursion_fundamentals', 'Introduction to Recursion', 'https://www.geeksforgeeks.org/dsa/introduction-to-recursion-2/');

INSERT INTO concept_practice_problems (concept_id, platform, title, url, difficulty, display_order) VALUES
('pat_recursion_fundamentals', 'LeetCode', 'Fibonacci Number', 'https://leetcode.com/problems/fibonacci-number/', 'Easy',   1),
('pat_recursion_fundamentals', 'LeetCode', 'Pow(x, n)',        'https://leetcode.com/problems/powx-n/',           'Medium', 2);

UPDATE concepts SET real_world_example = 'Russian nesting dolls — you keep opening each doll to find a smaller one inside, until you reach the smallest doll that does not open. That smallest doll is the base case; opening each doll is the recursive case.' WHERE id = 'pat_recursion_fundamentals';

-- VERIFICATION QUERY — expect 1 row, 2 outgoing prereqs (subsets_backtracking
-- depending on this doesn't count here, this concept has 0 of its own),
-- 1 misconception, 1 resource, 2 problems, real-world example present,
-- plus a second query confirming the backtracking edge landed
SELECT c.id, c.name,
       (SELECT count(*) FROM concept_prerequisites WHERE concept_id = c.id) AS own_prereqs,
       (SELECT count(*) FROM concept_misconceptions WHERE concept_id = c.id) AS misconceptions,
       (SELECT count(*) FROM concept_resources WHERE concept_id = c.id) AS resources,
       (SELECT count(*) FROM concept_practice_problems WHERE concept_id = c.id) AS problems,
       (c.real_world_example IS NOT NULL) AS has_example
FROM concepts c
WHERE c.id = 'pat_recursion_fundamentals';

SELECT concept_id, prerequisite_id FROM concept_prerequisites
WHERE concept_id = 'pat_subsets_backtracking' AND prerequisite_id = 'pat_recursion_fundamentals';
