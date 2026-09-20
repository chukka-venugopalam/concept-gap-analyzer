-- Migration 058: New topic — Advanced Trees
-- Confirmed absent before writing this: grep across every existing
-- migration for segment tree, Fenwick/BIT, and sparse table returned
-- zero matches. display_order = 13 (topics run 1-12 after 056 added
-- Math & Number Theory at 12 — confirmed by checking every topics
-- INSERT before writing this).
-- No prerequisite edges between the 3 concepts here, unlike Math &
-- Number Theory's sieve->primality edge: the verified GfG source for
-- Fenwick Tree explicitly frames it and Segment Tree as ALTERNATIVE
-- solutions to the same range-query problem, not a dependency chain —
-- you don't need one to learn the other. Forcing an edge here would be
-- exactly the kind of loose, unjustified pairing 030's own comments
-- warn against. All three are root concepts.
-- CORRECTED before this file was ever run: 056 (Math & Number Theory)
-- hit fallback_probes column names that don't match this repo's file
-- content — the real live columns are (id, topic_id, question,
-- probe_order), not (topic_id, probe_text, display_order). Fixed here
-- proactively so this file doesn't fail the same way 056 did.

INSERT INTO topics (id, name, description, display_order) VALUES
('advanced_trees', 'Advanced Trees',
 'Segment trees, Fenwick (Binary Indexed) trees, and sparse tables for range queries and updates',
 13);

INSERT INTO concepts (id, topic_id, name, definition, proficiency_level, importance_weight, canonical_keywords, display_order) VALUES

('adv_segment_tree', 'advanced_trees',
 'Segment Tree',
 'A binary tree built over an array where each node stores an aggregate (sum, min, max, etc.) of a range of elements, the root covering the whole array and leaves covering single elements. Supports both range queries and point (or range) updates in O(log n) time by recursing into only the O(log n) nodes whose ranges are relevant, rather than touching every element.',
 'advanced', 2,
 ARRAY['segment tree','range query','range update','O(log n)','recursive tree','aggregate'], 1),

('adv_fenwick_tree', 'advanced_trees',
 'Fenwick Tree (Binary Indexed Tree)',
 'An implicit tree stored in a single array, where index i is responsible for a range of elements determined by the position of its lowest set bit. Supports prefix-sum queries and point updates in O(log n) time by moving between an index and its parent/next-ancestor via i - (i & -i) and i + (i & -i). Simpler to implement and more space-efficient than a Segment Tree, but limited to reversible operations like sum, XOR, or product — not min/max.',
 'advanced', 2,
 ARRAY['fenwick tree','binary indexed tree','BIT','lowest set bit','prefix sum','point update'], 2),

('adv_sparse_table', 'advanced_trees',
 'Sparse Table',
 'A lookup table built once over a STATIC array (no updates allowed), where table[i][j] stores the aggregate of the range starting at i with length 2^j. Answers idempotent range queries (min, max, GCD — operations where overlapping the same element twice does not change the result) in O(1) time after O(n log n) preprocessing, by combining two overlapping power-of-2 ranges that together cover the query range.',
 'advanced', 2,
 ARRAY['sparse table','range minimum query','RMQ','idempotent','static array','O(1) query','power of two ranges'], 3);

INSERT INTO concept_misconceptions (concept_id, misconception, correction, trigger_phrases) VALUES

('adv_segment_tree',
 'A Segment Tree needs to be rebuilt from scratch every time a single element in the array changes.',
 'A point update only needs to touch the O(log n) nodes on the path from that leaf up to the root, recomputing each ancestor''s aggregate from its two children — not a full rebuild. This O(log n) update is exactly what makes Segment Trees useful when both queries and updates happen frequently.',
 ARRAY['rebuild the whole tree','recompute everything','start over after update']),

('adv_fenwick_tree',
 'A Fenwick Tree can answer any type of range query a Segment Tree can, just with less code.',
 'A Fenwick Tree only works for operations that are reversible/invertible, like sum or XOR, because queries are computed as a difference of two prefix results (prefix(R) minus prefix(L-1)). Range minimum or maximum cannot be un-done this way, so those queries need a Segment Tree (or Sparse Table for a static array) instead.',
 ARRAY['works for any operation','same as segment tree but simpler','can do min max too']),

('adv_sparse_table',
 'A Sparse Table can be updated in O(log n) the same way a Segment Tree can, once it is built.',
 'A Sparse Table has no update operation at all — it is built once for a STATIC array and answers queries in O(1), but changing even one element invalidates the whole precomputed table, requiring a full O(n log n) rebuild. If the array changes, a Segment Tree or Fenwick Tree is the right structure, not a Sparse Table.',
 ARRAY['can update it like segment tree','supports updates too','just rebuild one entry']);

INSERT INTO fallback_probes (topic_id, question, probe_order) VALUES
('advanced_trees',
 'If you needed both fast range queries AND fast point updates on an array, which of these three structures would you reach for, and why not the others?',
 1),
('advanced_trees',
 'Why can a Fenwick Tree answer a range-sum query but not a range-minimum query, when a Segment Tree can do both?',
 2),
('advanced_trees',
 'The array is never going to change after it is built. Does that change which of these three structures you would pick, and why?',
 3);

-- VERIFICATION QUERY — expect the topic + 3 concepts + 3 misconceptions +
-- 3 fallback probes, 0 prerequisites (intentional, see comment above)
SELECT 'topic' AS what, count(*) FROM topics WHERE id = 'advanced_trees'
UNION ALL
SELECT 'concepts', count(*) FROM concepts WHERE topic_id = 'advanced_trees'
UNION ALL
SELECT 'misconceptions', count(*) FROM concept_misconceptions WHERE concept_id IN
  ('adv_segment_tree','adv_fenwick_tree','adv_sparse_table')
UNION ALL
SELECT 'fallback_probes', count(*) FROM fallback_probes WHERE topic_id = 'advanced_trees';
