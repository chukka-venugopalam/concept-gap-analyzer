-- Migration 048: Binary Trees misconception depth pass
-- Only bst_property, bt_structure, and bt_inorder had misconceptions
-- before this (3 for 11 concepts). Adding the missing 8.

INSERT INTO concept_misconceptions
  (concept_id, misconception, correction, trigger_phrases)
VALUES

('bt_node',
 'A tree node can only have exactly two children, never fewer',
 '"Binary" means AT MOST two children, not exactly two. A node with only a left child, only a right child, or no children at all is perfectly valid.',
 ARRAY['must have two','always two children','exactly two']),

('bt_leaf',
 'A leaf node is any node without a value',
 'A leaf node is defined by having no children, not by lacking a value — leaf nodes still hold real data, they are just at the bottom of the tree with nothing below them.',
 ARRAY['no value','empty node','without data']),

('bt_height',
 'Tree height and the number of nodes are directly proportional',
 'Height depends on the tree''s shape, not just its node count. A balanced tree with n nodes has height O(log n), while a completely skewed tree with the same n nodes has height O(n) — same node count, very different heights.',
 ARRAY['proportional to nodes','more nodes means taller','height equals node count']),

('bt_preorder',
 'Pre-order traversal is mainly useful for producing sorted output',
 'Pre-order (root, left, right) does not produce sorted output even for a BST. Its real use is for tasks needing the parent processed before its children, like copying or serializing a tree structure.',
 ARRAY['gives sorted output','produces sorted','for sorting']),

('bt_postorder',
 'Post-order and pre-order traversal are essentially interchangeable',
 'The order genuinely matters. Post-order (left, right, root) processes children before the parent, making it the right choice for safely deleting a tree or computing values that depend on subtree results first.',
 ARRAY['interchangeable','same as preorder','doesnt matter which order']),

('bt_bfs',
 'BFS and DFS traversals of a tree always visit nodes in the same order',
 'BFS (level order) visits nodes level by level, left to right within each level. DFS-based traversals (inorder/preorder/postorder) go deep down one branch before backtracking — these produce genuinely different visiting orders except in trivial cases.',
 ARRAY['same order','both visit same way','no difference from dfs']),

('bt_balanced',
 'A balanced tree means every node has exactly two children',
 'Balance refers to the height difference between left and right subtrees being small at every node — it says nothing about whether every node has exactly two children. A tree can be balanced while many nodes have only one or zero children.',
 ARRAY['every node has two children','balanced means full','complete tree']),

('bt_recursion',
 'Recursive tree functions need a separate counter variable to know when to stop',
 'The natural stopping point in tree recursion is the base case of hitting a null/empty node — no separate counter is needed, since each recursive call works on a smaller subtree until nothing is left to process.',
 ARRAY['needs a counter','track how deep','separate stop condition']);

-- VERIFICATION QUERY — expect 11 rows, all at count 1
SELECT c.id, c.name,
       (SELECT count(*) FROM concept_misconceptions WHERE concept_id = c.id) AS misconception_count
FROM concepts c
WHERE c.topic_id = 'binary_trees'
ORDER BY c.display_order;
