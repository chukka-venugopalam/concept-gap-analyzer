-- Migration 025: Practice problems + real-world examples for Heaps
-- All URLs individually verified via live search on 2026-09-01 (LeetCode only)

INSERT INTO concept_practice_problems (concept_id, platform, title, url, difficulty, display_order) VALUES
('heap_property',       'LeetCode', 'Kth Largest Element in an Array',   'https://leetcode.com/problems/kth-largest-element-in-an-array/',   'Medium', 1),

('heap_array_rep',      'LeetCode', 'Kth Largest Element in a Stream',   'https://leetcode.com/problems/kth-largest-element-in-a-stream/',   'Easy',   1),

('heap_insert',         'LeetCode', 'Kth Largest Element in a Stream',   'https://leetcode.com/problems/kth-largest-element-in-a-stream/',   'Easy',   1),

('heap_extract',        'LeetCode', 'Last Stone Weight',                 'https://leetcode.com/problems/last-stone-weight/',                 'Easy',   1),

('heap_build',          'LeetCode', 'Kth Largest Element in an Array',   'https://leetcode.com/problems/kth-largest-element-in-an-array/',   'Medium', 1),

('heap_priority_queue', 'LeetCode', 'Top K Frequent Elements',           'https://leetcode.com/problems/top-k-frequent-elements/',           'Medium', 1),
('heap_priority_queue', 'LeetCode', 'Last Stone Weight',                 'https://leetcode.com/problems/last-stone-weight/',                 'Easy',   2);

UPDATE concepts SET real_world_example = 'An emergency room''s triage board, where the most critical patient is always at the front regardless of arrival order.' WHERE id = 'heap_property';
UPDATE concepts SET real_world_example = 'A tournament bracket stored as a flat list — you can find any match''s parent match with simple arithmetic on its position, no pointers needed.' WHERE id = 'heap_array_rep';
UPDATE concepts SET real_world_example = 'A hospital adding a new patient to triage — they start at the back and get moved up past less-urgent cases until they''re in the right spot.' WHERE id = 'heap_insert';
UPDATE concepts SET real_world_example = 'A triage nurse calling the next patient — the most urgent case is removed, and the queue quietly reorganizes to promote the new most-urgent case to the front.' WHERE id = 'heap_extract';
UPDATE concepts SET real_world_example = 'Converting an unsorted stack of resumes into a ranked shortlist all at once, rather than ranking them one at a time as they arrive.' WHERE id = 'heap_build';
UPDATE concepts SET real_world_example = 'An OS task scheduler always running the highest-priority process next, regardless of what order processes were submitted.' WHERE id = 'heap_priority_queue';

-- VERIFICATION QUERY — expect 6 rows, problem_count 1 or 2, has_example = true on all
SELECT c.id, c.name,
       (SELECT count(*) FROM concept_practice_problems p WHERE p.concept_id = c.id) AS problem_count,
       (c.real_world_example IS NOT NULL) AS has_example
FROM concepts c
WHERE c.topic_id = 'heaps'
ORDER BY c.display_order;
