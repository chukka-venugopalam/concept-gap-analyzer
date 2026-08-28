-- Seed concept_resources for the Linked Lists topic (10 concepts, 2 links each).
-- Every URL below was verified via live web search on 2026-08-28 — none invented.
-- Sources favored: GeeksforGeeks (primary, consistent), VisuAlgo (interactive),
-- DEV Community, Medium — chosen for accuracy and relevance to each specific concept.

INSERT INTO concept_resources (concept_id, title, url, display_order) VALUES

-- ll_node
('ll_node', 'Basic Terminologies of Linked List - GeeksforGeeks', 'https://www.geeksforgeeks.org/dsa/what-is-linked-list/', 1),
('ll_node', 'Linked List (Single, Doubly), Stack, Queue, Deque - VisuAlgo', 'https://visualgo.net/en/list', 2),

-- ll_singly
('ll_singly', 'Singly Linked List Tutorial - GeeksforGeeks', 'https://www.geeksforgeeks.org/dsa/singly-linked-list-tutorial/', 1),
('ll_singly', 'Linked List (Single, Doubly), Stack, Queue, Deque - VisuAlgo', 'https://visualgo.net/en/list', 2),

-- ll_doubly
('ll_doubly', 'Doubly Linked List Tutorial - GeeksforGeeks', 'https://www.geeksforgeeks.org/dsa/doubly-linked-list/', 1),
('ll_doubly', 'Linked List (Single, Doubly), Stack, Queue, Deque - VisuAlgo', 'https://visualgo.net/en/list', 2),

-- ll_traversal
('ll_traversal', 'Traversal of Singly Linked List - GeeksforGeeks', 'https://www.geeksforgeeks.org/dsa/traversal-of-singly-linked-list/', 1),
('ll_traversal', 'Time and Space Complexity of Linked List - GeeksforGeeks', 'https://www.geeksforgeeks.org/dsa/time-and-space-complexity-of-linked-list/', 2),

-- ll_insertion
('ll_insertion', 'Insertion in Linked List - GeeksforGeeks', 'https://www.geeksforgeeks.org/dsa/insertion-in-linked-list/', 1),
('ll_insertion', 'Recursive Insertion and Traversal in Linked List - GeeksforGeeks', 'https://www.geeksforgeeks.org/dsa/recursive-insertion-and-traversal-linked-list/', 2),

-- ll_deletion
('ll_deletion', 'Deletion in Linked List - GeeksforGeeks', 'https://www.geeksforgeeks.org/dsa/deletion-in-linked-list/', 1),
('ll_deletion', 'Time and Space Complexity of Linked List - GeeksforGeeks', 'https://www.geeksforgeeks.org/dsa/time-and-space-complexity-of-linked-list/', 2),

-- ll_fast_slow
('ll_fast_slow', 'Floyd''s Cycle Finding Algorithm - GeeksforGeeks', 'https://www.geeksforgeeks.org/dsa/floyds-cycle-finding-algorithm/', 1),
('ll_fast_slow', 'How does Floyd''s Slow and Fast Pointers Approach Work? - GeeksforGeeks', 'https://www.geeksforgeeks.org/dsa/how-does-floyds-slow-and-fast-pointers-approach-work/', 2),

-- ll_cycle
('ll_cycle', 'Detect Loop in a Linked List - GeeksforGeeks', 'https://www.geeksforgeeks.org/dsa/detect-loop-in-a-linked-list/', 1),
('ll_cycle', 'Fast & Slow Pointers: Master Floyd''s Cycle Detection - Medium', 'https://medium.com/@piyushkashyap045/fast-slow-pointers-master-floyds-cycle-detection-55aff08d10fe', 2),

-- ll_reversal
('ll_reversal', 'Reverse a Linked List - GeeksforGeeks', 'https://www.geeksforgeeks.org/dsa/reverse-a-linked-list/', 1),
('ll_reversal', 'Reverse a Linked List Using Recursion - GeeksforGeeks', 'https://www.geeksforgeeks.org/dsa/recursively-reversing-a-linked-list-a-simple-implementation/', 2),

-- ll_dummy_node
('ll_dummy_node', 'A Complete Guide to Mastering Linked-List Problems (Dummy Node Pattern) - DEV Community', 'https://dev.to/devcorner/a-complete-guide-to-mastering-linked-list-problems-3o8n', 1),
('ll_dummy_node', 'Doubly Linked List using Sentinel Nodes - GeeksforGeeks', 'https://www.geeksforgeeks.org/dsa/doubly-linked-list-using-sentinel-nodes/', 2);
