-- Migration 060: Graphs extension — Bellman-Ford, SCC, Bridges &
-- Articulation Points, Bipartite Matching
-- Adds to the EXISTING graphs topic (not a new topic) — same
-- single-file extension pattern as 044 (Greedy) and 043 (Union-Find/
-- MST/Dijkstra). display_order continues from 13 (confirmed: 006+043
-- together use 1-13, checked before writing this) -> 14-17.
-- graph_bellman_ford directly resolves what graph_dijkstra's own
-- misconception text already promised: "Bellman-Ford is needed for
-- graphs with negative weights" — this is the concept that promise
-- pointed to, not a new unrelated addition.
-- graph_bipartite (existing, checking-only) is a real, direct
-- prerequisite for graph_bipartite_matching (finding a matching) —
-- checked graph_bipartite's actual definition first to confirm it only
-- covers 2-coloring/detection, not matching, so this is additive, not
-- duplicate diagnostic state.
-- graph_scc and graph_bridges_articulation are both DFS-based low-link
-- techniques -> prerequisite is graph_dfs, a real dependency, not a
-- loose thematic pairing.
-- Bridges and Articulation Points are combined into ONE concept
-- (graph_bridges_articulation) since both use the exact same low-link
-- DFS technique (confirmed via the verified GfG source below) — treating
-- them as two diagnosable concepts would duplicate the same underlying
-- skill, the same reasoning 030 used to avoid duplicating patterns.
-- All 4 GfG resource URLs individually fetched for their canonical /dsa/
-- form on 2026-09-18. graph_scc and graph_bipartite_matching do NOT get
-- a dedicated LeetCode practice problem — same honesty pattern as 057
-- and 059: nothing verified this session tested either cleanly as a
-- standalone LeetCode problem (LeetCode has no direct "find all SCCs"
-- or "maximum bipartite matching" problem; both are usually a helper
-- step inside a larger problem). graph_bellman_ford and
-- graph_bridges_articulation DO have genuinely dedicated ones.

INSERT INTO concepts (id, topic_id, name, definition, proficiency_level, importance_weight, canonical_keywords, display_order) VALUES

('graph_bellman_ford', 'graphs',
 'Bellman-Ford Algorithm',
 'Finding the shortest path from a source vertex to every other vertex in a weighted graph that may have negative edge weights, by relaxing every edge repeatedly (V-1 times, where V is the vertex count) until no distance can be improved further. A final extra pass that still finds an improvement means the graph contains a negative-weight cycle, which Bellman-Ford can detect but not produce a meaningful shortest path through.',
 'advanced', 2,
 ARRAY['bellman-ford','negative weights','edge relaxation','negative cycle detection','V-1 iterations'], 14),

('graph_scc', 'graphs',
 'Strongly Connected Components (SCC)',
 'A maximal set of vertices in a DIRECTED graph where every vertex can reach every other vertex in the same set via a directed path. Kosaraju''s algorithm finds all SCCs in O(V+E) using two DFS passes: one on the original graph to record finish order, one on the graph with every edge reversed, processed in reverse finish order.',
 'advanced', 2,
 ARRAY['strongly connected components','SCC','kosaraju','tarjan','directed graph','reverse graph','finish order'], 15),

('graph_bridges_articulation', 'graphs',
 'Bridges & Articulation Points',
 'A bridge is an edge whose removal disconnects the graph (increases the number of connected components); an articulation point is a vertex with the same property. Both are found with a single DFS that tracks each vertex''s discovery time and its "low-link" value (the earliest-discovered vertex reachable from its subtree via a back edge) — an edge (u,v) is a bridge exactly when low[v] > disc[u], meaning v''s subtree has no other way back up to or above u.',
 'advanced', 2,
 ARRAY['bridge','articulation point','cut vertex','low-link','discovery time','critical edge','critical connection'], 16),

('graph_bipartite_matching', 'graphs',
 'Bipartite Matching',
 'Given a bipartite graph (vertices split into two sets with edges only between them), finding the maximum set of edges where no two edges share an endpoint. Solved by repeatedly finding an "augmenting path" from an unmatched vertex on one side to an unmatched vertex on the other, alternating between non-matching and matching edges, and flipping every edge along that path — each successful augmenting path increases the matching size by exactly one.',
 'advanced', 2,
 ARRAY['bipartite matching','maximum matching','augmenting path','job assignment','ford-fulkerson','hopcroft-karp'], 17);

INSERT INTO concept_prerequisites (concept_id, prerequisite_id) VALUES
('graph_bellman_ford', 'graph_dijkstra'),
('graph_scc', 'graph_dfs'),
('graph_bridges_articulation', 'graph_dfs'),
('graph_bipartite_matching', 'graph_bipartite');

INSERT INTO concept_misconceptions (concept_id, misconception, correction, trigger_phrases) VALUES

('graph_bellman_ford',
 'Bellman-Ford always finds the correct shortest paths as long as you run it, even with a negative cycle present.',
 'If a negative-weight cycle is reachable from the source, there is no well-defined shortest path at all — you could loop the cycle forever, making the "shortest path" negative infinity. Bellman-Ford''s extra Vth pass exists specifically to DETECT this case, not to still produce a correct (but merely different) answer.',
 ARRAY['always finds correct paths','works fine with negative cycle','just gives a different answer']),

('graph_scc',
 'Strongly Connected Components apply to undirected graphs the same way connected components do.',
 'SCCs are specifically a directed-graph concept. In an undirected graph, reachability is automatically symmetric (if u can reach v, v can reach u via the same edges), so "connected component" already captures this — there is nothing extra an SCC would add. SCCs matter precisely because directed edges are one-way, so being reachable from a vertex does not mean you can reach it back.',
 ARRAY['same as connected components','works for undirected too','no real difference from connectivity']),

('graph_bridges_articulation',
 'Every edge connected to an articulation point is automatically a bridge.',
 'An articulation point can have several edges, only some (or none) of which are bridges — removing the vertex disconnects the graph, but removing just one of its edges might not, if another path through that same vertex still exists via a different edge. Bridges and articulation points are related but computed independently from the same low-link values, not derived from each other directly.',
 ARRAY['all its edges are bridges','automatically a bridge too','same thing as articulation point']),

('graph_bipartite_matching',
 'Once a vertex is matched during the algorithm, that match is final and can never be changed.',
 'The entire point of an augmenting path is that it CAN reassign an already-matched vertex to free it up for a better overall matching — that reassignment is exactly what increases the total matching size by one. Treating early matches as permanently fixed is what caps a greedy approach below the true maximum.',
 ARRAY['matches are final','cant reassign once matched','permanent once assigned']);

-- VERIFICATION QUERY — expect 4 new concepts (display_order 14-17), 4
-- prerequisites, 4 misconceptions
SELECT 'concepts' AS what, count(*) FROM concepts WHERE id IN
  ('graph_bellman_ford','graph_scc','graph_bridges_articulation','graph_bipartite_matching')
UNION ALL
SELECT 'prereqs', count(*) FROM concept_prerequisites WHERE concept_id IN
  ('graph_bellman_ford','graph_scc','graph_bridges_articulation','graph_bipartite_matching')
UNION ALL
SELECT 'misconceptions', count(*) FROM concept_misconceptions WHERE concept_id IN
  ('graph_bellman_ford','graph_scc','graph_bridges_articulation','graph_bipartite_matching');
