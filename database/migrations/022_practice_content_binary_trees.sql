-- Migration 022: Practice problems + real-world examples for Binary Trees
-- All URLs individually verified via live search on 2026-09-01 (LeetCode only)

INSERT INTO concept_practice_problems (concept_id, platform, title, url, difficulty, display_order) VALUES
('bt_node',      'LeetCode', 'Maximum Depth of Binary Tree',        'https://leetcode.com/problems/maximum-depth-of-binary-tree/',        'Easy',   1),

('bt_structure', 'LeetCode', 'Invert Binary Tree',                  'https://leetcode.com/problems/invert-binary-tree/',                  'Easy',   1),
('bt_structure', 'LeetCode', 'Same Tree',                           'https://leetcode.com/problems/same-tree/',                           'Easy',   2),

('bt_leaf',      'LeetCode', 'Leaf-Similar Trees',                  'https://leetcode.com/problems/leaf-similar-trees/',                  'Easy',   1),

('bt_height',    'LeetCode', 'Maximum Depth of Binary Tree',        'https://leetcode.com/problems/maximum-depth-of-binary-tree/',        'Easy',   1),
('bt_height',    'LeetCode', 'Balanced Binary Tree',                'https://leetcode.com/problems/balanced-binary-tree/',                'Easy',   2),

('bst_property', 'LeetCode', 'Validate Binary Search Tree',         'https://leetcode.com/problems/validate-binary-search-tree/',         'Medium', 1),

('bt_inorder',   'LeetCode', 'Binary Tree Inorder Traversal',       'https://leetcode.com/problems/binary-tree-inorder-traversal/',       'Easy',   1),

('bt_preorder',  'LeetCode', 'Binary Tree Preorder Traversal',      'https://leetcode.com/problems/binary-tree-preorder-traversal/',      'Easy',   1),

('bt_postorder', 'LeetCode', 'Binary Tree Postorder Traversal',     'https://leetcode.com/problems/binary-tree-postorder-traversal/',     'Easy',   1),

('bt_bfs',       'LeetCode', 'Binary Tree Level Order Traversal',   'https://leetcode.com/problems/binary-tree-level-order-traversal/',   'Medium', 1),

('bt_balanced',  'LeetCode', 'Balanced Binary Tree',                'https://leetcode.com/problems/balanced-binary-tree/',                'Easy',   1),

('bt_recursion', 'LeetCode', 'Maximum Depth of Binary Tree',        'https://leetcode.com/problems/maximum-depth-of-binary-tree/',        'Easy',   1),
('bt_recursion', 'LeetCode', 'Invert Binary Tree',                  'https://leetcode.com/problems/invert-binary-tree/',                  'Easy',   2);

UPDATE concepts SET real_world_example = 'A folder in a file system — it holds its own name/data plus references to the folders nested inside it.' WHERE id = 'bt_node';
UPDATE concepts SET real_world_example = 'A company org chart, where each manager branches down to a small number of direct reports.' WHERE id = 'bt_structure';
UPDATE concepts SET real_world_example = 'The end pages of a choose-your-own-adventure book — no further choices branch out from them.' WHERE id = 'bt_leaf';
UPDATE concepts SET real_world_example = 'How many menu levels deep a phone''s settings app goes before you reach an actual toggle.' WHERE id = 'bt_height';
UPDATE concepts SET real_world_example = 'A phone book split so every name to the left of a person is alphabetically earlier and everything to the right is later — letting you find a name without reading the whole book.' WHERE id = 'bst_property';
UPDATE concepts SET real_world_example = 'Printing a BST''s contents to get a fully sorted list, the same way a database index returns rows in order.' WHERE id = 'bt_inorder';
UPDATE concepts SET real_world_example = 'Copying a folder structure — a parent folder has to be created before anything inside it can be.' WHERE id = 'bt_preorder';
UPDATE concepts SET real_world_example = 'Deleting a folder structure — everything inside a folder has to go before the folder itself can be removed.' WHERE id = 'bt_postorder';
UPDATE concepts SET real_world_example = 'A "friends of friends" feature showing your closest connections first, then next-closest, one ring outward at a time.' WHERE id = 'bt_bfs';
UPDATE concepts SET real_world_example = 'Why some contact directories stay fast to search no matter how many contacts you add, while a lopsided one slows to a crawl.' WHERE id = 'bt_balanced';
UPDATE concepts SET real_world_example = 'Calculating a folder''s total size by asking each subfolder for its own size and adding them up — the same question asked again at every level down.' WHERE id = 'bt_recursion';

-- VERIFICATION QUERY — expect 11 rows, problem_count 1 or 2, has_example = true on all
SELECT c.id, c.name,
       (SELECT count(*) FROM concept_practice_problems p WHERE p.concept_id = c.id) AS problem_count,
       (c.real_world_example IS NOT NULL) AS has_example
FROM concepts c
WHERE c.topic_id = 'binary_trees'
ORDER BY c.display_order;
