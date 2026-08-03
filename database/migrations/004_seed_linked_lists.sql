INSERT INTO concepts
  (id, topic_id, name, definition,
   importance_weight, canonical_keywords,
   display_order)
VALUES
('ll_node','linked_lists',
 'Linked List Node',
 'Basic unit containing a value and pointer to the next node',
 3,
 ARRAY['node','pointer','next','value','reference'],1),

('ll_singly','linked_lists',
 'Singly Linked List',
 'Linear structure where each node points to the next node, last node points to null',
 3,
 ARRAY['singly','single','next pointer','one direction','null'],2),

('ll_doubly','linked_lists',
 'Doubly Linked List',
 'Each node has both next and previous pointers enabling bidirectional traversal',
 2,
 ARRAY['doubly','double','prev','previous','bidirectional','two pointers'],3),

('ll_traversal','linked_lists',
 'List Traversal',
 'Visiting every node from head to tail following next pointers in O(n)',
 3,
 ARRAY['traverse','traversal','iterate','visit','head','tail','O(n)'],4),

('ll_insertion','linked_lists',
 'Node Insertion',
 'Adding a node at head O(1), tail O(n) or middle O(n) by rewiring pointers',
 3,
 ARRAY['insert','add','prepend','append','O(1)','rewire','pointer'],5),

('ll_deletion','linked_lists',
 'Node Deletion',
 'Removing a node by connecting its predecessor to its successor, bypassing deleted node',
 3,
 ARRAY['delete','remove','bypass','predecessor','successor','skip'],6),

('ll_fast_slow','linked_lists',
 'Fast and Slow Pointers',
 'Two pointers moving at different speeds to detect cycles or find middle of list',
 3,
 ARRAY['fast slow','floyd','tortoise hare','cycle detection','two pointer','middle'],7),

('ll_cycle','linked_lists',
 'Cycle Detection',
 'Detecting if a list has a cycle using fast/slow pointers; they meet if cycle exists',
 3,
 ARRAY['cycle','loop','detect','fast slow','meets','infinite'],8),

('ll_reversal','linked_lists',
 'List Reversal',
 'Reversing direction of all pointers in O(n) using three pointer technique',
 3,
 ARRAY['reverse','reversal','three pointer','prev curr next','flip'],9),

('ll_dummy_node','linked_lists',
 'Dummy Head Node',
 'Sentinel node before real head simplifying edge cases in insertion and deletion',
 2,
 ARRAY['dummy','sentinel','fake head','edge case','simplify'],10);

INSERT INTO concept_prerequisites VALUES
('ll_singly',    'll_node'),
('ll_doubly',    'll_singly'),
('ll_traversal', 'll_singly'),
('ll_insertion', 'll_traversal'),
('ll_deletion',  'll_traversal'),
('ll_fast_slow', 'll_traversal'),
('ll_cycle',     'll_fast_slow'),
('ll_reversal',  'll_traversal'),
('ll_dummy_node','ll_insertion');

INSERT INTO concept_misconceptions
  (concept_id, misconception, correction,
   trigger_phrases)
VALUES
('ll_singly',
 'Linked lists support O(1) random access like arrays',
 'Linked lists are O(n) for access by index. Only head access is O(1). This is the key tradeoff versus arrays.',
 ARRAY['O(1) access','constant access','random access','like array']),

('ll_cycle',
 'Fast pointer always laps slow pointer exactly at the cycle start',
 'Fast and slow pointers meet somewhere inside the cycle, not necessarily at cycle start. Finding cycle start requires additional steps.',
 ARRAY['meets at start','cycle start','beginning of cycle']);
