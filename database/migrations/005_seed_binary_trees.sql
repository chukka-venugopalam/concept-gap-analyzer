INSERT INTO concepts
  (id, topic_id, name, definition,
   importance_weight, canonical_keywords,
   display_order)
VALUES
('bt_node','binary_trees',
 'Tree Node',
 'Node containing value with left and right child pointers, both null if leaf node',
 3,
 ARRAY['node','left','right','child','value','pointer'],1),

('bt_structure','binary_trees',
 'Binary Tree Structure',
 'Hierarchical structure where each node has at most two children: left and right',
 3,
 ARRAY['binary tree','at most two','hierarchy','parent','children','root'],2),

('bt_leaf','binary_trees',
 'Leaf Node',
 'Node with no children — both left and right pointers are null',
 2,
 ARRAY['leaf','no children','null children','end node','terminal'],3),

('bt_height','binary_trees',
 'Tree Height and Depth',
 'Height is longest path from root to leaf. Depth of node is distance from root.',
 2,
 ARRAY['height','depth','level','distance','root to leaf','longest path'],4),

('bst_property','binary_trees',
 'BST Property',
 'In BST all nodes in left subtree are smaller and all nodes in right subtree are larger than current node — applies to ALL descendants not just direct children',
 3,
 ARRAY['BST','binary search tree','left smaller','right larger','ordered','search property','sorted','all descendants'],5),

('bt_inorder','binary_trees',
 'In-order Traversal',
 'Visit left subtree then root then right subtree — produces sorted output for BST',
 3,
 ARRAY['inorder','in-order','left root right','LNR','sorted output','ascending'],6),

('bt_preorder','binary_trees',
 'Pre-order Traversal',
 'Visit root first then left subtree then right subtree — used for tree copying',
 2,
 ARRAY['preorder','pre-order','root first','NLR','copy tree'],7),

('bt_postorder','binary_trees',
 'Post-order Traversal',
 'Visit left then right subtree then root — used for deletion and size calculation',
 2,
 ARRAY['postorder','post-order','root last','LRN','deletion'],8),

('bt_bfs','binary_trees',
 'Level Order Traversal BFS',
 'Visit nodes level by level using a queue — explores all nodes at depth d before d+1',
 3,
 ARRAY['level order','BFS','breadth first','queue','level by level','width'],9),

('bt_balanced','binary_trees',
 'Balanced vs Unbalanced Trees',
 'Balanced tree has height O(log n) ensuring efficient operations. Unbalanced degrades to O(n) in worst case like a linked list.',
 2,
 ARRAY['balanced','unbalanced','height','logn','degenerate','skewed'],10),

('bt_recursion','binary_trees',
 'Tree Recursion Pattern',
 'Most tree problems solved by: handle base case null node, recurse left, recurse right, combine results',
 3,
 ARRAY['recursion','recursive','base case','null check','divide conquer','subproblem'],11);

INSERT INTO concept_prerequisites VALUES
('bt_structure',  'bt_node'),
('bt_leaf',       'bt_node'),
('bt_height',     'bt_structure'),
('bst_property',  'bt_structure'),
('bt_inorder',    'bt_structure'),
('bt_preorder',   'bt_structure'),
('bt_postorder',  'bt_structure'),
('bt_bfs',        'bt_structure'),
('bt_balanced',   'bt_height'),
('bt_balanced',   'bst_property'),
('bt_recursion',  'bt_structure');

INSERT INTO concept_misconceptions
  (concept_id, misconception, correction,
   trigger_phrases)
VALUES
('bst_property',
 'BST property only applies to direct children of a node not all descendants',
 'BST property applies to ALL descendants. Every node in left subtree must be smaller, every node in right subtree must be larger, not just the immediate children.',
 ARRAY['direct children','immediate children','just children','only children']),

('bt_structure',
 'Binary tree and binary search tree are the same thing',
 'Binary tree just means at most two children. BST is a binary tree with the additional ordering property. Not all binary trees are BSTs.',
 ARRAY['same thing','same as BST','binary tree is BST','both same']),

('bt_inorder',
 'In-order traversal always gives sorted output for any binary tree',
 'In-order traversal gives sorted output ONLY for a BST. For a general binary tree it just visits left-root-right with no sorting guarantee.',
 ARRAY['always sorted','any tree','all trees','always gives sorted']);
