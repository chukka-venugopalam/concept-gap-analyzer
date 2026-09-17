-- Migration 043: Graphs extension — Union-Find, MST, Dijkstra
-- Extends the existing 10-concept Graphs topic to 13. All URLs
-- individually verified via live search on 2026-09-08.

INSERT INTO concepts
  (id, topic_id, name, definition, proficiency_level, importance_weight, canonical_keywords, display_order)
VALUES
('graph_union_find', 'graphs',
 'Union-Find (Disjoint Set)',
 'A data structure that tracks a partition of elements into disjoint sets, supporting efficient union (merge two sets) and find (which set does an element belong to) operations. With path compression and union by rank, both run in near-constant amortized time.',
 'interview', 3,
 ARRAY['union find','disjoint set','path compression','union by rank','find set'], 11),

('graph_mst', 'graphs',
 'Minimum Spanning Tree',
 'The subset of edges connecting all vertices in a weighted graph at the minimum possible total edge weight, with no cycles. Kruskal''s algorithm sorts edges and adds them via Union-Find if they do not form a cycle; Prim''s algorithm grows a tree greedily from a starting vertex, using the same overall pattern as Dijkstra''s algorithm.',
 'interview', 3,
 ARRAY['minimum spanning tree','kruskal','prim','MST'], 12),

('graph_dijkstra', 'graphs',
 'Dijkstra''s Algorithm',
 'Finding the shortest path from a source vertex to every other vertex in a weighted graph with non-negative edge weights, using a priority queue to always expand the currently-closest unvisited vertex next. A greedy algorithm — it is also the weighted generalization of BFS.',
 'interview', 3,
 ARRAY['dijkstra','shortest path','weighted graph','priority queue shortest path'], 13);

INSERT INTO concept_prerequisites (concept_id, prerequisite_id) VALUES
('graph_mst', 'graph_union_find'),
('graph_dijkstra', 'graph_bfs');

INSERT INTO concept_misconceptions
  (concept_id, misconception, correction, trigger_phrases)
VALUES
('graph_union_find',
 'Union-Find requires re-scanning every element to answer a find query',
 'Path compression flattens the path to the root on every find call, so repeated finds on the same or nearby elements become nearly O(1) after the first — it is not a fresh full scan each time.',
 ARRAY['scans every element','full scan each time','linear every call']),

('graph_mst',
 'A minimum spanning tree is the same as the shortest path tree from a single source',
 'MST minimizes the total weight of all edges connecting every vertex; a shortest-path tree (like Dijkstra produces) minimizes distance FROM ONE specific source to every vertex. These can genuinely be different trees on the same graph.',
 ARRAY['same as shortest path','same as dijkstra tree','identical trees']),

('graph_dijkstra',
 'Dijkstra''s algorithm works correctly with negative edge weights, just more slowly',
 'Dijkstra''s greedy assumption — once a vertex is finalized its shortest distance can never improve — breaks entirely with negative edges. It can produce a WRONG answer, not just a slower one. Bellman-Ford is needed for graphs with negative weights.',
 ARRAY['works with negative','just slower','still correct with negative weights']);

INSERT INTO concept_resources (concept_id, title, url) VALUES
('graph_union_find', 'Introduction to Disjoint Set (Union-Find)', 'https://www.geeksforgeeks.org/dsa/introduction-to-disjoint-set-data-structure-or-union-find-algorithm/'),
('graph_mst', 'Kruskal''s Minimum Spanning Tree Algorithm', 'https://www.geeksforgeeks.org/dsa/kruskals-minimum-spanning-tree-algorithm-greedy-algo-2/'),
('graph_dijkstra', 'Dijkstra''s Shortest Path Algorithm', 'https://www.geeksforgeeks.org/dsa/dijkstras-shortest-path-algorithm-greedy-algo-7/');

INSERT INTO concept_practice_problems (concept_id, platform, title, url, difficulty, display_order) VALUES
('graph_union_find', 'LeetCode', 'Number of Provinces', 'https://leetcode.com/problems/number-of-provinces/', 'Medium', 1),
('graph_union_find', 'LeetCode', 'Redundant Connection', 'https://leetcode.com/problems/redundant-connection/', 'Medium', 2),
('graph_mst', 'LeetCode', 'Min Cost to Connect All Points', 'https://leetcode.com/problems/min-cost-to-connect-all-points/', 'Medium', 1),
('graph_dijkstra', 'LeetCode', 'Network Delay Time', 'https://leetcode.com/problems/network-delay-time/', 'Medium', 1);

UPDATE concepts SET real_world_example = 'A social network merging two friend groups into one the moment a mutual connection is discovered, and instantly answering "are these two people in the same network?" without re-scanning everyone.' WHERE id = 'graph_union_find';
UPDATE concepts SET real_world_example = 'An internet provider deciding which cables to lay between cities to connect every city to the network at the lowest total cost.' WHERE id = 'graph_mst';
UPDATE concepts SET real_world_example = 'A GPS app finding the fastest route to a destination, accounting for road-specific travel times rather than just the fewest turns.' WHERE id = 'graph_dijkstra';

-- VERIFICATION QUERY — expect 3 new concepts, each with a prereq
-- listed (except union_find, which is correctly a new root), 1
-- misconception, 1 resource, 1-2 problems, and a real-world example
SELECT c.id, c.name,
       (SELECT count(*) FROM concept_prerequisites WHERE concept_id = c.id) AS prereqs,
       (SELECT count(*) FROM concept_misconceptions WHERE concept_id = c.id) AS misconceptions,
       (SELECT count(*) FROM concept_resources WHERE concept_id = c.id) AS resources,
       (SELECT count(*) FROM concept_practice_problems WHERE concept_id = c.id) AS problems,
       (c.real_world_example IS NOT NULL) AS has_example
FROM concepts c
WHERE c.id IN ('graph_union_find', 'graph_mst', 'graph_dijkstra');
