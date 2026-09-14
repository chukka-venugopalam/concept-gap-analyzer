-- Migration 049: Arrays & Hashing + Graphs misconception depth pass
-- Arrays & Hashing had 3 (hash_map_basics, arr_two_pointer,
-- arr_sliding_window) for 10 concepts. Graphs had 3 (graph_bfs,
-- graph_dfs, graph_topo) for its original 10. Adding the missing 7 each.

-- Arrays & Hashing
INSERT INTO concept_misconceptions
  (concept_id, misconception, correction, trigger_phrases)
VALUES

('arr_indexing',
 'The first element of an array is faster to access than elements further in',
 'Array indexing is O(1) for ANY position, not just the first. Arrays store elements in contiguous memory, so any index''s address is calculated directly (base address + index x element size) — no speed difference between index 0 and index 999.',
 ARRAY['first element faster','beginning is quicker','index 0 is fastest']),

('arr_dynamic',
 'A dynamic array resizes by exactly one slot every time it runs out of space',
 'Dynamic arrays typically double their capacity when full, not add just one slot. This amortized growth strategy is what keeps average insertion O(1) rather than O(n) per append.',
 ARRAY['resizes by one','grows by one slot','adds one at a time']),

('arr_prefix_sum',
 'Prefix sums only help when you need the sum of the entire array',
 'The real power of prefix sums is answering ANY range-sum query in O(1) after O(n) preprocessing, by subtracting two precomputed prefix sums — not just the total sum.',
 ARRAY['only for total sum','entire array only','whole array sum']),

('hash_collision',
 'Hash collisions are rare enough to ignore in practice',
 'Collisions are a normal, expected part of hashing — a real hash table implementation must handle them, since even a well-designed hash function will produce collisions once enough elements are inserted.',
 ARRAY['rare enough to ignore','wont happen often','not a real concern']),

('hash_set',
 'A hash set can store duplicate values, it just does not return them twice',
 'A hash set physically cannot contain duplicate values — adding a value already present simply has no effect. A set enforces uniqueness at insertion, it does not filter duplicates at read time.',
 ARRAY['stores duplicates internally','has duplicates but hides them','keeps both copies']),

('arr_sorting',
 'Once you decide to sort, you should always default to the built-in sort without considering the data',
 'Knowing when sorting helps and which sort fits matters — nearly-sorted data favors insertion sort, a small known value range favors counting sort, and sorting a whole array to find one element is often worse than a linear scan.',
 ARRAY['always use built in sort','sorting always helps','sort first regardless']),

('arr_kadane',
 'Kadane''s algorithm requires tracking the maximum subarray''s actual start and end indices to work',
 'The core algorithm only needs the running sum and the max sum seen so far — it works without tracking indices at all, unless the problem specifically asks which subarray achieved the max, which needs extra bookkeeping on top.',
 ARRAY['needs start and end index','must track indices','requires tracking positions']);

-- Graphs (original 10 concepts)
INSERT INTO concept_misconceptions
  (concept_id, misconception, correction, trigger_phrases)
VALUES

('graph_basics',
 'A graph must always have a starting node, like a tree has a root',
 'Unlike a tree, a graph has no inherent starting node — any vertex is a valid entry point for traversal, and the choice of where to start is up to the algorithm, not a structural requirement of the graph.',
 ARRAY['must have a root','needs a starting node','like a tree root']),

('graph_adj_list',
 'An adjacency list and an adjacency matrix always use the same amount of memory',
 'An adjacency list uses O(V + E) space, scaling with actual edges present, while a matrix always uses O(V^2) regardless of edge count — for a sparse graph, the list is dramatically more memory-efficient.',
 ARRAY['same memory','equal space','no memory difference']),

('graph_adj_matrix',
 'Checking if two nodes are connected is equally fast with an adjacency list and an adjacency matrix',
 'A matrix gives O(1) edge-existence checks via direct lookup, while a list requires scanning a node''s neighbor list, O(degree of the node) — the matrix is faster for this specific check, at the cost of more memory overall.',
 ARRAY['equally fast','same speed','no difference in lookup']),

('graph_visited',
 'Marking a node as visited is only necessary to avoid infinite loops in graphs with cycles',
 'Visited tracking is needed even in acyclic graphs whenever multiple paths can reach the same node (a diamond-shaped structure, for example) — without it you process the same node repeatedly, wasting work even with zero cycle risk.',
 ARRAY['only needed for cycles','only matters with cycles','unnecessary without cycles']),

('graph_connected',
 'The number of connected components equals the number of edges in the graph',
 'Connected components count separate, unreachable-from-each-other groups of nodes — this depends on structure, not directly on edge count. A graph with many edges can still have multiple components if some nodes are isolated from others.',
 ARRAY['equals number of edges','same as edge count','depends on edges']),

('graph_cycle',
 'Cycle detection works the same way for directed and undirected graphs',
 'The algorithms genuinely differ — undirected cycle detection must ignore the edge just arrived from, or every edge falsely looks like a 2-node cycle, while directed detection uses 3-state marking to catch back-edges to an ancestor still being processed.',
 ARRAY['same for both','works identically','no difference between directed and undirected']),

('graph_bipartite',
 'A graph is bipartite if it simply has two groups of similarly-sized nodes',
 'Bipartiteness is about edge constraints, not group size — every edge must connect a node in one group to a node in the OTHER group, with none allowed within the same group. Group sizes can be very unequal and still be valid.',
 ARRAY['two similar sized groups','about group size','equal sized partitions']);

-- VERIFICATION QUERY — expect 20 rows total (10+10), all at count 1
SELECT c.topic_id, c.id, c.name,
       (SELECT count(*) FROM concept_misconceptions WHERE concept_id = c.id) AS misconception_count
FROM concepts c
WHERE (c.topic_id = 'arrays_hashing')
   OR (c.topic_id = 'graphs' AND c.id IN (
       'graph_basics','graph_adj_list','graph_adj_matrix','graph_bfs','graph_dfs',
       'graph_visited','graph_connected','graph_cycle','graph_topo','graph_bipartite'))
ORDER BY c.topic_id, c.display_order;
