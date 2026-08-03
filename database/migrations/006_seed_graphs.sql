INSERT INTO concepts
  (id, topic_id, name, definition,
   importance_weight, canonical_keywords,
   display_order)
VALUES
('graph_basics','graphs',
 'Graph Definition',
 'Collection of vertices connected by edges. Can be directed or undirected, weighted or unweighted',
 3,
 ARRAY['graph','vertices','edges','nodes','directed','undirected','weighted'],1),

('graph_adj_list','graphs',
 'Adjacency List',
 'Graph representation using array of lists where index i stores all neighbors of vertex i — space efficient for sparse graphs',
 3,
 ARRAY['adjacency list','neighbor list','sparse','representation','array of lists'],2),

('graph_adj_matrix','graphs',
 'Adjacency Matrix',
 'N×N matrix where cell [i][j] is 1 if edge exists between i and j — good for dense graphs, O(1) edge lookup',
 2,
 ARRAY['adjacency matrix','matrix','dense','N by N','edge lookup'],3),

('graph_bfs','graphs',
 'Breadth First Search',
 'Explores graph level by level using queue. Guarantees shortest path in unweighted graph. Time O(V+E)',
 3,
 ARRAY['BFS','breadth first','queue','level order','shortest path','V plus E','unweighted'],4),

('graph_dfs','graphs',
 'Depth First Search',
 'Explores as far as possible before backtracking using stack or recursion. Time O(V+E)',
 3,
 ARRAY['DFS','depth first','stack','recursion','backtrack','explore','V plus E'],5),

('graph_visited','graphs',
 'Visited Tracking',
 'Boolean array or set marking visited nodes to prevent infinite loops in cyclic graphs',
 3,
 ARRAY['visited','seen','mark','boolean array','prevent revisit','infinite loop'],6),

('graph_connected','graphs',
 'Connected Components',
 'Maximal subgraphs where every vertex is reachable from every other vertex in that component',
 2,
 ARRAY['connected','component','reachable','island','group','cluster'],7),

('graph_cycle','graphs',
 'Cycle Detection',
 'Detecting cycles in graph using DFS with recursion stack for directed graphs or parent tracking for undirected',
 2,
 ARRAY['cycle','loop','back edge','recursion stack','parent','undirected','directed'],8),

('graph_topo','graphs',
 'Topological Sort',
 'Linear ordering of vertices where for every directed edge u→v, u appears before v. Only valid for DAGs.',
 2,
 ARRAY['topological','topo sort','DAG','ordering','dependency','directed acyclic'],9),

('graph_bipartite','graphs',
 'Bipartite Graphs',
 'Graph whose vertices can be split into two sets with edges only between sets, not within. Detectable via 2-coloring BFS/DFS.',
 2,
 ARRAY['bipartite','two color','coloring','two sets','partition','even odd'],10);

INSERT INTO concept_prerequisites VALUES
('graph_adj_list',    'graph_basics'),
('graph_adj_matrix',  'graph_basics'),
('graph_bfs',         'graph_adj_list'),
('graph_dfs',         'graph_adj_list'),
('graph_visited',     'graph_bfs'),
('graph_visited',     'graph_dfs'),
('graph_connected',   'graph_bfs'),
('graph_cycle',       'graph_dfs'),
('graph_topo',        'graph_dfs'),
('graph_bipartite',   'graph_bfs');

INSERT INTO concept_misconceptions
  (concept_id, misconception, correction,
   trigger_phrases)
VALUES
('graph_bfs',
 'BFS finds shortest path in all graphs including weighted ones',
 'BFS only guarantees shortest path in unweighted graphs. For weighted graphs you need Dijkstra or Bellman-Ford.',
 ARRAY['always shortest','weighted graph','any graph','all graphs']),

('graph_dfs',
 'DFS and BFS always produce the same result',
 'DFS and BFS explore in completely different orders. DFS goes deep first, BFS goes wide. They solve different problems optimally.',
 ARRAY['same result','same output','equivalent','same order']),

('graph_topo',
 'Topological sort works on any graph',
 'Topological sort only works on Directed Acyclic Graphs. A cycle makes topological ordering impossible.',
 ARRAY['any graph','all graphs','undirected','with cycles']);
