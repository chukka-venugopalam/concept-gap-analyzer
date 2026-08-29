-- Seed the Heaps topic: topic row, 6 concepts, prerequisites, misconceptions,
-- fallback probes.
--
-- SV-OS provides ONE node (d3-05-heaps) for this topic, but its summary and
-- common_mistakes genuinely cover 5 distinct sub-ideas (heap property, array
-- representation, insertion, extraction, build-heap) — each is split into
-- its own concept below, all still directly grounded in that verified
-- source. The 6th concept, Priority Queue, is standard, uncontroversial DSA
-- curriculum content (the universal application of a heap) authored from
-- general knowledge, same basis as e.g. "Sorting Fundamentals" or "Hash
-- Collision Handling" in the existing arrays_hashing seed — not sourced
-- from an external citation, but not a contested or invented claim either.
--
-- All 4 of SV-OS's common_mistakes for this node are used, one per the
-- concept they actually describe.

INSERT INTO topics (id, name, description, display_order, concept_count) VALUES
('heaps',
 'Heaps',
 'Binary heap property, array representation, and heap operations',
 6, 6);

INSERT INTO concepts (id, topic_id, name, definition, importance_weight, canonical_keywords, display_order) VALUES

('heap_property','heaps',
 'Heap Property',
 'A binary heap is a complete binary tree where every parent satisfies an ordering relationship with its children: in a min-heap every parent is <= both children, in a max-heap every parent is >= both children.',
 3,
 ARRAY['heap property','min-heap','max-heap','complete binary tree','parent child order'],1),

('heap_array_rep','heaps',
 'Array Representation',
 'Because a heap is always a complete binary tree, it can be stored compactly in a plain array: for a 0-indexed position i, children sit at 2i+1 and 2i+2, and the parent sits at (i-1)/2.',
 3,
 ARRAY['array representation','2i+1','2i+2','parent index','0-indexed','complete tree'],2),

('heap_insert','heaps',
 'Insertion (Sift-Up)',
 'Inserting into a heap appends the new element at the end of the array, then repeatedly swaps it with its parent while it violates the heap property, moving up the tree in O(log n) time.',
 3,
 ARRAY['sift up','bubble up','insertion','swap with parent','O(log n)'],3),

('heap_extract','heaps',
 'Extraction (Sift-Down)',
 'Extracting the root moves the last array element into the root position, then repeatedly swaps it with the smaller (min-heap) or larger (max-heap) child while it violates the heap property, moving down the tree in O(log n) time.',
 3,
 ARRAY['sift down','bubble down','extraction','heapify down','swap with child','O(log n)'],4),

('heap_build','heaps',
 'Build-Heap (Heapify)',
 'Building a heap from an existing array bottom-up, by sifting down every non-leaf node starting from the last one, runs in O(n) total, which is tighter than the O(n log n) naive estimate of n individual insertions.',
 2,
 ARRAY['build heap','heapify','bottom-up','O(n)','buildHeap'],5),

('heap_priority_queue','heaps',
 'Priority Queue',
 'A priority queue is the abstract data type most commonly implemented with a heap: it supports efficient insertion and efficient removal of the highest (or lowest) priority element, each in O(log n) time.',
 3,
 ARRAY['priority queue','PQ','highest priority','insert and extract','heap-based queue'],6);

INSERT INTO concept_prerequisites VALUES
('heap_array_rep',      'heap_property'),
('heap_insert',         'heap_array_rep'),
('heap_extract',        'heap_array_rep'),
('heap_build',          'heap_insert'),
('heap_priority_queue', 'heap_extract');

INSERT INTO concept_misconceptions (concept_id, misconception, correction, trigger_phrases) VALUES

('heap_property',
 'Assuming a heap is fully sorted because the root is always the minimum (or maximum).',
 'Only root-to-child ordering is guaranteed — siblings have no guaranteed order relative to each other, so a heap''s underlying array is not a sorted array.',
 ARRAY['heap is sorted','fully sorted array','siblings are ordered']),

('heap_array_rep',
 'Confusing 0-indexed and 1-indexed child/parent formulas.',
 'For 0-indexed arrays, children sit at 2i+1 and 2i+2, not 2i and 2i+1 — using the 1-indexed formula on a 0-indexed array silently corrupts the heap structure.',
 ARRAY['children at 2i','use 2i and 2i+1','1-indexed formula']),

('heap_build',
 'Assuming n individual insertions is just as fast as bottom-up heapify.',
 'Both produce a valid heap, but repeated insertion is O(n log n) total, while bottom-up build-heap is O(n) — a real, not just theoretical, difference for large inputs.',
 ARRAY['insertions are just as fast','n log n is fine','same complexity as heapify']),

('heap_extract',
 'Sifting down only once instead of repeatedly during extraction.',
 'A single swap with the smaller (or larger) child is not enough — if the moved element still violates the heap property further down, sifting must continue until it settles into a valid position.',
 ARRAY['one swap is enough','sift down once','single comparison']);

INSERT INTO fallback_probes (topic_id, question, probe_order) VALUES
('heaps',
 'You mentioned heaps — how would you represent one using a plain array, and how do you find a node''s children and parent from its index?',
 1),
('heaps',
 'Walk me through what happens when you insert a new element into a min-heap. Why does "sifting up" restore the heap property?',
 2),
('heaps',
 'Why does building a heap from an array bottom-up run in O(n) instead of the O(n log n) you''d get from n individual insertions?',
 3);
