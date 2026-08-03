CREATE TABLE IF NOT EXISTS fallback_probes (
  id          UUID PRIMARY KEY
              DEFAULT gen_random_uuid(),
  topic_id    TEXT NOT NULL
              REFERENCES topics(id),
  question    TEXT NOT NULL,
  probe_order INT DEFAULT 1
);

INSERT INTO fallback_probes
  (topic_id, question, probe_order)
VALUES
('arrays_hashing',
 'You mentioned arrays — can you explain how a hash map achieves O(1) lookup and what happens when two keys collide?',
 1),
('arrays_hashing',
 'Can you walk me through how you would use the two pointer technique to solve a problem on a sorted array?',
 2),
('arrays_hashing',
 'What is the difference between a sliding window of fixed size and variable size? When would you use each?',
 3),

('linked_lists',
 'You mentioned linked lists — can you explain how fast and slow pointers detect a cycle?',
 1),
('linked_lists',
 'Walk me through reversing a linked list. What pointers do you need and in what order do you update them?',
 2),
('linked_lists',
 'What is the key tradeoff between a linked list and an array in terms of time complexity for common operations?',
 3),

('binary_trees',
 'You mentioned binary trees — can you explain the difference between a binary tree and a binary search tree?',
 1),
('binary_trees',
 'Walk me through what happens during in-order traversal of a BST and why it produces sorted output.',
 2),
('binary_trees',
 'What does it mean for a binary tree to be balanced and why does balance matter for performance?',
 3),

('graphs',
 'You mentioned graphs — can you explain when you would choose BFS over DFS and why?',
 1),
('graphs',
 'How do you prevent visiting the same node twice in a graph traversal and why is this necessary?',
 2),
('graphs',
 'What is a topological sort and under what conditions is it possible to compute one?',
 3);
