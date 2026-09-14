-- Migration 050: Heaps + Tries misconception depth pass (final)
-- Heaps had 4 (heap_property, heap_array_rep, heap_build, heap_extract)
-- for 6 concepts — missing heap_insert and heap_priority_queue.
-- Tries had 4 (trie_structure, trie_lookup_complexity, trie_end_marker,
-- trie_memory_tradeoff) for 5 — missing trie_applications.
-- This closes the last remaining gaps — every topic in the platform
-- reaches at least 1 misconception per concept after this.

INSERT INTO concept_misconceptions
  (concept_id, misconception, correction, trigger_phrases)
VALUES

('heap_insert',
 'Inserting a new element into a heap means placing it wherever there is an empty slot',
 'A new element is always added at the END of the underlying array first, maintaining the heap''s complete-tree shape, then "sifted up" by swapping with its parent until the heap property is restored — placement always starts at the same predictable spot, never arbitrary.',
 ARRAY['any empty slot','wherever there is room','placed anywhere']),

('heap_priority_queue',
 'A priority queue and a heap are exactly the same thing',
 'A priority queue is an abstract data type — the concept of "give me the highest-priority item" — while a heap is one common concrete implementation of it. Priority queues can also be built with sorted arrays or balanced trees, with different performance tradeoffs.',
 ARRAY['same thing as heap','priority queue is a heap','identical concepts']),

('trie_applications',
 'A trie is only useful for spell-checking and dictionary word lookups',
 'Tries power a much broader set of applications relying on shared-prefix structure — autocomplete and search suggestions, IP routing tables (longest prefix match), and certain string-matching algorithms — not just spell-checking.',
 ARRAY['only for spell check','just dictionary lookup','only word validation']);

-- VERIFICATION QUERY — expect 11 rows total (6 heaps + 5 tries), all at count 1
SELECT c.topic_id, c.id, c.name,
       (SELECT count(*) FROM concept_misconceptions WHERE concept_id = c.id) AS misconception_count
FROM concepts c
WHERE c.topic_id IN ('heaps', 'tries')
ORDER BY c.topic_id, c.display_order;
