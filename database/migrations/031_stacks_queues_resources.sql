-- Migration 031: Resource links for Stacks & Queues
-- All URLs individually verified via live search on 2026-09-05

INSERT INTO concept_resources (concept_id, title, url) VALUES
('sq_stack_basics', 'Introduction to Stack Data Structure', 'https://www.geeksforgeeks.org/dsa/introduction-to-stack-data-structure-and-algorithm-tutorials/'),
('sq_stack_basics', 'Stack Data Structure', 'https://www.geeksforgeeks.org/dsa/stack-data-structure/'),

('sq_queue_basics', 'Queue Data Structure', 'https://www.geeksforgeeks.org/dsa/queue-data-structure/'),

('sq_queue_via_stacks', 'Implement Queue using Stacks', 'https://www.geeksforgeeks.org/dsa/queue-using-stacks/'),

('sq_monotonic_stack', 'Introduction to Monotonic Stack', 'https://www.geeksforgeeks.org/dsa/introduction-to-monotonic-stack-2/'),
('sq_monotonic_stack', 'How to Identify and Solve Monotonic Stack Problems', 'https://www.geeksforgeeks.org/dsa/how-to-identify-and-solve-monotonic-stack-problems/'),

('sq_monotonic_deque', 'Deque: Introduction and Applications', 'https://www.geeksforgeeks.org/deque-set-1-introduction-applications/'),

('sq_expression_parsing', 'Infix Expression Evaluation', 'https://www.geeksforgeeks.org/dsa/expression-evaluation/'),
('sq_expression_parsing', 'Infix, Postfix and Prefix Notations', 'https://www.geeksforgeeks.org/dsa/infix-postfix-prefix-notation/'),

('sq_string_stack_processing', 'Stack Data Structure', 'https://www.geeksforgeeks.org/dsa/stack-data-structure/');

-- VERIFICATION QUERY — expect 7 rows, resource_count 1 or 2
SELECT c.id, c.name,
       (SELECT count(*) FROM concept_resources r WHERE r.concept_id = c.id) AS resource_count
FROM concepts c
WHERE c.topic_id = 'stacks_queues'
ORDER BY c.display_order;
