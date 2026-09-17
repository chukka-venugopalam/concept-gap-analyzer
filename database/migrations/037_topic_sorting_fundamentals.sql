-- Migration 037: Sorting Fundamentals — core topic definition
-- The algorithms/techniques worth diagnosing: bubble (baseline), insertion
-- (adaptive), merge (stable divide-conquer), quick (average-case divide-conquer),
-- heap (in-place n log n). Selection sort folded into quick/heap understanding.

INSERT INTO topics (id, name, description, display_order) VALUES
('sorting_fundamentals', 'Sorting Fundamentals', 'Classical sorting algorithms: complexity analysis, stability, in-place vs. extra-space, and when each suits the real-world constraint', 11);

INSERT INTO concepts
  (id, topic_id, name, definition, proficiency_level, importance_weight, canonical_keywords, display_order)
VALUES
('sort_bubble', 'sorting_fundamentals',
 'Bubble Sort',
 'The simplest sorting algorithm — repeatedly swap adjacent elements if they''re in the wrong order, bubbling larger elements to the end with each pass. O(n²) in average and worst case, but O(n) when already sorted. Stable.',
 'beginner', 2,
 ARRAY['bubble sort','adjacent swap','simple sort','O(n^2)','stable'], 1),

('sort_insertion', 'sorting_fundamentals',
 'Insertion Sort',
 'Build the sorted portion one element at a time, inserting each new element into its correct position within the already-sorted prefix. O(n²) in worst case, O(n) when nearly sorted. Stable and in-place.',
 'beginner', 2,
 ARRAY['insertion sort','insert into sorted','adaptive','O(n^2)','in-place'], 2),

('sort_merge', 'sorting_fundamentals',
 'Merge Sort',
 'Divide and conquer: split the array in half, recursively sort each half, then merge them back together. Always O(n log n) regardless of input order. Stable but requires O(n) extra space.',
 'interview', 3,
 ARRAY['merge sort','divide and conquer','stable sort','O(n log n)','extra space'], 3),

('sort_quicksort', 'sorting_fundamentals',
 'Quicksort',
 'Divide and conquer: pick a pivot, partition around it (smaller left, larger right), recursively sort both parts. O(n log n) average, O(n²) worst case (when pivot is always min/max). In-place, but unstable.',
 'interview', 3,
 ARRAY['quicksort','pivot partition','divide and conquer','O(n log n) average','in-place'], 4),

('sort_heapsort', 'sorting_fundamentals',
 'Heapsort',
 'Build a max-heap from the array, then repeatedly extract the maximum and place it at the end. Guaranteed O(n log n) in all cases. In-place but unstable. Less cache-friendly than quicksort in practice.',
 'interview', 2,
 ARRAY['heapsort','heap','O(n log n) worst','in-place','unstable'], 5),

('sort_complexity_analysis', 'sorting_fundamentals',
 'Complexity Analysis & Stability',
 'Reasoning about time complexity (best/average/worst case), space complexity, and stability (whether equal elements retain their original order) — critical for choosing the right algorithm for a constraint.',
 'interview', 3,
 ARRAY['time complexity','space complexity','stable','worst case','best case'], 6);

INSERT INTO concept_prerequisites (concept_id, prerequisite_id) VALUES
('sort_insertion', 'sort_bubble'),
('sort_merge', 'sort_bubble'),
('sort_quicksort', 'sort_bubble'),
('sort_heapsort', 'sort_bubble'),
('sort_complexity_analysis', 'sort_bubble');

INSERT INTO concept_misconceptions
  (concept_id, misconception, correction, trigger_phrases)
VALUES
('sort_bubble',
 'Bubble sort is never useful in practice because it''s O(n²)',
 'Bubble sort is genuinely O(n) on nearly-sorted data and has minimal overhead, making it practical for small datasets or as a teaching baseline. The O(n²) claim refers to random or reverse-sorted input, not all input.',
 ARRAY['never useful','always bad','never use it']),

('sort_insertion',
 'Insertion sort is just a slower variant of bubble sort',
 'Insertion sort''s adaptive nature makes it O(n) on nearly-sorted data, where bubble sort remains O(n²). For real-world nearly-sorted input (like logging events from sensors), insertion sort can outperform far more complex algorithms.',
 ARRAY['just a variant','slower version','same as bubble']),

('sort_merge',
 'Merge sort is O(n log n) space as well as time, so it''s always worse than quicksort',
 'Merge sort uses O(n) extra space but guarantees O(n log n) time in all cases, including worst case. Quicksort uses O(log n) space but can degrade to O(n²). The choice depends on whether time-guarantee or space-efficiency matters more for the constraint.',
 ARRAY['always worse','more space','slower overall']),

('sort_quicksort',
 'Quicksort is always faster than merge sort because it''s in-place',
 'Quicksort''s average-case O(n log n) and in-place nature make it faster in practice on random data, but merge sort''s guaranteed O(n log n) and stability matter for other constraints. Worst-case O(n²) on quicksort is a real risk if pivot selection is bad.',
 ARRAY['always faster','better in all ways','never use merge']),

('sort_heapsort',
 'Heapsort is the best sorting algorithm because it guarantees O(n log n) and is in-place',
 'Heapsort guarantees O(n log n) and is in-place, but has poor cache locality (heap accesses jump around memory) and is unstable, making it slower in practice than quicksort on real hardware despite the same asymptotic complexity.',
 ARRAY['best algorithm','always fastest','better than quicksort']),

('sort_complexity_analysis',
 'An algorithm''s time complexity is all that matters when choosing a sort',
 'Stability, space usage, cache behavior, input characteristics (nearly sorted? small dataset? large duplicates?), and worst-case guarantees all matter as much as average-case time complexity when choosing the right sort for a real constraint.',
 ARRAY['only time matters','complexity is everything','space doesn''t matter']);

INSERT INTO fallback_probes (topic_id, question, probe_order) VALUES
('sorting_fundamentals',
 'You mentioned a sorting algorithm — what''s the difference between its best-case, average-case, and worst-case complexity, and when does each one actually happen?',
 1),
('sorting_fundamentals',
 'Walk me through why merge sort is stable and quicksort is not, and when does that distinction actually matter?',
 2),
('sorting_fundamentals',
 'If you had to sort a nearly-sorted array, which of bubble, insertion, merge, and quicksort would you pick first, and why?',
 3);
