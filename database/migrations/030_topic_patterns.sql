-- Migration 030: Patterns — core topic definition
-- The 6 patterns from the canonical 16-pattern list with no home anywhere
-- else in CIP (Two Pointers, Sliding Window, Fast&Slow, In-place Reversal,
-- Tree BFS/DFS, Top K, 0/1 Knapsack, Topological Sort are already covered
-- elsewhere — checked before scoping this file, not assumed).
-- Same two-phase pattern as 027/029: resources/practice problems/examples
-- are a separate verified follow-up pass.

INSERT INTO topics (id, name, description, display_order) VALUES
('patterns', 'Patterns', 'Algorithmic strategy patterns not tied to one specific data structure: intervals, cyclic sort, two heaps, backtracking, and search/merge variants', 10);

INSERT INTO concepts
  (id, topic_id, name, definition, proficiency_level, importance_weight, canonical_keywords, display_order)
VALUES
('pat_merge_intervals', 'patterns',
 'Merge Intervals',
 'Sorting a set of intervals by start time, then merging any that overlap into a single combined interval. Fundamental for scheduling-style problems.',
 'beginner', 2,
 ARRAY['merge intervals','overlapping intervals','sort by start time','interval scheduling'], 1),

('pat_cyclic_sort', 'patterns',
 'Cyclic Sort',
 'Placing each number directly at its correct index in-place, when the numbers are known to fall within a fixed range like 1 to n. Finds missing or duplicate numbers without extra space.',
 'interview', 2,
 ARRAY['cyclic sort','correct index','missing number','duplicate number','1 to n range'], 2),

('pat_two_heaps', 'patterns',
 'Two Heaps',
 'Maintaining a max-heap for the smaller half of a data stream and a min-heap for the larger half, keeping both balanced so the median is always available at the top of one heap.',
 'interview', 2,
 ARRAY['two heaps','running median','max heap min heap','balance heaps'], 3),

('pat_subsets_backtracking', 'patterns',
 'Subsets & Backtracking',
 'Exploring all possible combinations or subsets by making a choice, recursing, then undoing that choice before trying the next option — building up and tearing down partial solutions, pruning branches that can''t lead anywhere useful.',
 'interview', 3,
 ARRAY['backtracking','subsets','combinations','choose and unchoose','recursion tree'], 4),

('pat_modified_binary_search', 'patterns',
 'Modified Binary Search',
 'Binary searching over a monotonic answer space rather than a sorted array directly — the input itself may be unsorted, but a feasibility check at each candidate answer determines which half to search next.',
 'interview', 3,
 ARRAY['binary search on answer','modified binary search','monotonic answer','feasibility check'], 5),

('pat_kway_merge', 'patterns',
 'K-way Merge',
 'Merging K sorted lists or arrays into one by keeping a heap of the current front element from each list, always extracting the smallest and advancing that list.',
 'interview', 2,
 ARRAY['k-way merge','merge k sorted lists','heap of fronts','merge multiple lists'], 6);

-- No internal prerequisites: these 6 are largely independent strategies
-- rather than a dependency chain — not forcing relationships that aren't
-- really there.

INSERT INTO concept_misconceptions
  (concept_id, misconception, correction, trigger_phrases)
VALUES
('pat_merge_intervals',
 'Every interval needs to be checked against every other interval to find overlaps',
 'Sorting by start time first means only adjacent intervals need comparing — check each interval against just the last-merged one, avoiding an O(n^2) all-pairs check entirely.',
 ARRAY['check every pair','compare all intervals','all pairs']),

('pat_cyclic_sort',
 'Cyclic sort is just a variant of regular comparison-based sorting',
 'Cyclic sort never compares elements to each other — it uses each number''s value directly as the index it belongs at, which only works because the numbers are known to fall in a specific range like 1 to n, not because of comparison logic.',
 ARRAY['comparison sort variant','compares elements','like regular sorting']),

('pat_two_heaps',
 'A single heap is enough to track a running median',
 'One heap gives efficient access to a min or a max, but the median needs the top of the lower half AND the top of the upper half simultaneously — that requires two balanced heaps, not one.',
 ARRAY['one heap enough','single heap median','just need a heap']),

('pat_subsets_backtracking',
 'Backtracking always explores every possible combination with no way to skip bad paths early',
 'The actual power of backtracking is pruning — abandoning a partial choice the moment it''s known to be invalid or worse than an already-found solution, rather than exhaustively completing every branch.',
 ARRAY['explores everything','no pruning','always full exploration']),

('pat_modified_binary_search',
 'Binary search only works when the input array itself is sorted',
 'This pattern binary-searches over the space of possible answers, not the input. The input doesn''t need to be sorted at all, as long as the answer''s feasibility is monotonic across the search space.',
 ARRAY['array must be sorted','input needs sorting','only sorted arrays']),

('pat_kway_merge',
 'Merging K sorted lists means comparing all K front elements against each other on every single step',
 'A heap of size K makes each step only O(log K) to extract the minimum and insert the next element — not a fresh O(K) comparison across every list''s front element each time.',
 ARRAY['compare all k','check every list','linear comparison each step']);

INSERT INTO fallback_probes (topic_id, question, probe_order) VALUES
('patterns',
 'You mentioned interval or scheduling problems — why does sorting by start time first make merging overlaps so much simpler?',
 1),
('patterns',
 'Walk me through why cyclic sort places numbers at specific indices instead of comparing them to each other.',
 2),
('patterns',
 'How would you track a running median as numbers stream in, and why does that need two heaps instead of one?',
 3);
