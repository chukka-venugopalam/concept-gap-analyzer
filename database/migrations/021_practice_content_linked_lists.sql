-- Migration 021: Practice problems + real-world examples for Linked Lists
-- All URLs individually verified via live search on 2026-09-01 (LeetCode only, zero fabricated links)
-- Run manually in Supabase SQL editor, then run the verification query at the bottom.

INSERT INTO concept_practice_problems (concept_id, platform, title, url, difficulty, display_order) VALUES
('ll_node',       'LeetCode', 'Design Linked List',               'https://leetcode.com/problems/design-linked-list/',               'Medium', 1),

('ll_singly',     'LeetCode', 'Reverse Linked List',               'https://leetcode.com/problems/reverse-linked-list/',               'Easy',   1),
('ll_singly',     'LeetCode', 'Merge Two Sorted Lists',            'https://leetcode.com/problems/merge-two-sorted-lists/',            'Easy',   2),

('ll_doubly',     'LeetCode', 'Design Browser History',            'https://leetcode.com/problems/design-browser-history/',            'Medium', 1),

('ll_traversal',  'LeetCode', 'Middle of the Linked List',         'https://leetcode.com/problems/middle-of-the-linked-list/',         'Easy',   1),
('ll_traversal',  'LeetCode', 'Palindrome Linked List',            'https://leetcode.com/problems/palindrome-linked-list/',            'Easy',   2),

('ll_insertion',  'LeetCode', 'Merge Two Sorted Lists',            'https://leetcode.com/problems/merge-two-sorted-lists/',            'Easy',   1),
('ll_insertion',  'LeetCode', 'Add Two Numbers',                   'https://leetcode.com/problems/add-two-numbers/',                   'Medium', 2),

('ll_deletion',   'LeetCode', 'Remove Linked List Elements',       'https://leetcode.com/problems/remove-linked-list-elements/',       'Easy',   1),
('ll_deletion',   'LeetCode', 'Delete Node in a Linked List',      'https://leetcode.com/problems/delete-node-in-a-linked-list/',      'Medium', 2),

('ll_fast_slow',  'LeetCode', 'Linked List Cycle',                 'https://leetcode.com/problems/linked-list-cycle/',                 'Easy',   1),
('ll_fast_slow',  'LeetCode', 'Middle of the Linked List',         'https://leetcode.com/problems/middle-of-the-linked-list/',         'Easy',   2),

('ll_cycle',      'LeetCode', 'Linked List Cycle',                 'https://leetcode.com/problems/linked-list-cycle/',                 'Easy',   1),
('ll_cycle',      'LeetCode', 'Linked List Cycle II',              'https://leetcode.com/problems/linked-list-cycle-ii/',              'Medium', 2),

('ll_reversal',   'LeetCode', 'Reverse Linked List',               'https://leetcode.com/problems/reverse-linked-list/',               'Easy',   1),
('ll_reversal',   'LeetCode', 'Reverse Linked List II',            'https://leetcode.com/problems/reverse-linked-list-ii/',            'Medium', 2),

('ll_dummy_node', 'LeetCode', 'Remove Nth Node From End of List',  'https://leetcode.com/problems/remove-nth-node-from-end-of-list/',  'Medium', 1),
('ll_dummy_node', 'LeetCode', 'Remove Linked List Elements',       'https://leetcode.com/problems/remove-linked-list-elements/',       'Easy',   2);

UPDATE concepts SET real_world_example = 'A spreadsheet app''s undo history: each entry holds one saved state plus a pointer to the state that comes after it.' WHERE id = 'll_node';
UPDATE concepts SET real_world_example = 'A music app''s "up next" queue — each track only needs to know what plays after it, not the whole queue at once.' WHERE id = 'll_singly';
UPDATE concepts SET real_world_example = 'A browser''s back/forward history — you can step to the previous OR next page from wherever you are, which needs a pointer in both directions.' WHERE id = 'll_doubly';
UPDATE concepts SET real_world_example = 'A text editor scanning a large file character by character without loading the whole file into one contiguous block of memory.' WHERE id = 'll_traversal';
UPDATE concepts SET real_world_example = 'Dragging a song into the middle of a playlist queue — once you''re at the right spot, inserting is just rewiring two pointers, not shifting every song after it.' WHERE id = 'll_insertion';
UPDATE concepts SET real_world_example = 'Marking a to-do app task complete and removing it from the active list without shifting every other task in memory.' WHERE id = 'll_deletion';
UPDATE concepts SET real_world_example = 'A video player jumping to the midpoint of a stream, or a build tool walking a dependency chain two links at a time to check it terminates.' WHERE id = 'll_fast_slow';
UPDATE concepts SET real_world_example = 'A build system detecting that module A depends on B, which depends back on A, before it loops forever trying to resolve them.' WHERE id = 'll_cycle';
UPDATE concepts SET real_world_example = 'Replaying a chain of navigation breadcrumbs backward, or reversing the order of an undo/redo stack.' WHERE id = 'll_reversal';
UPDATE concepts SET real_world_example = 'A payroll system using a placeholder "period zero" before the real first pay period, so the very first real insertion doesn''t need special-cased logic.' WHERE id = 'll_dummy_node';

-- VERIFICATION QUERY — run after the above, expect 10 rows, problem_count 1 or 2, has_example = true on all
SELECT c.id, c.name,
       (SELECT count(*) FROM concept_practice_problems p WHERE p.concept_id = c.id) AS problem_count,
       (c.real_world_example IS NOT NULL) AS has_example
FROM concepts c
WHERE c.topic_id = 'linked_lists'
ORDER BY c.display_order;
