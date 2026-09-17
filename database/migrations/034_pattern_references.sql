-- Migration 034: Pattern reference index
-- New table: represents patterns from the canonical 16-pattern list that
-- are already fully covered as real concepts in OTHER topics. This lets
-- the Patterns topic display all 16 by name for completeness, while only
-- the 6 genuinely-new ones (in 030) are real diagnosable concepts here.
-- No duplicate diagnostic state for the same skill.

CREATE TABLE IF NOT EXISTS topic_pattern_references (
  id                 SERIAL PRIMARY KEY,
  topic_id           TEXT NOT NULL REFERENCES topics(id),
  pattern_name       TEXT NOT NULL,
  covered_concept_id TEXT NOT NULL REFERENCES concepts(id),
  display_order      INT DEFAULT 0
);

INSERT INTO topic_pattern_references (topic_id, pattern_name, covered_concept_id, display_order) VALUES
('patterns', 'Sliding Window',                  'arr_sliding_window', 1),
('patterns', 'Two Pointers',                    'arr_two_pointer',    2),
('patterns', 'Fast & Slow Pointers',             'll_fast_slow',       3),
('patterns', 'In-place Reversal of a LinkedList','ll_reversal',        4),
('patterns', 'Tree BFS',                         'bt_bfs',             5),
('patterns', 'Tree DFS',                         'bt_inorder',         6),
('patterns', 'Tree DFS',                         'bt_preorder',        6),
('patterns', 'Tree DFS',                         'bt_postorder',       6),
('patterns', 'Bitwise XOR',                      'bit_xor_properties', 7),
('patterns', 'Top ''K'' Elements',               'heap_priority_queue',8),
('patterns', '0/1 Knapsack',                     'dp_knapsack',        9),
('patterns', 'Topological Sort',                 'graph_topo',         10);

-- VERIFICATION QUERY — expect 12 rows (Tree DFS spans 3 concepts, the
-- other 8 pattern names map to 1 concept each: 8 + 3 + 1 = 12)
SELECT pattern_name, covered_concept_id
FROM topic_pattern_references
WHERE topic_id = 'patterns'
ORDER BY display_order;
