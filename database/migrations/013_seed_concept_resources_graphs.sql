-- Seed concept_resources for the Graphs topic (10 concepts, 2 links each).
-- Every URL below was verified via live web search on 2026-08-28 — none invented.
-- Sources favored: GeeksforGeeks (primary, consistent), VisuAlgo (interactive) —
-- chosen for accuracy and relevance to each specific concept.

INSERT INTO concept_resources (concept_id, title, url, display_order) VALUES

-- graph_basics
('graph_basics', 'Graph and its Representations - GeeksforGeeks', 'https://www.geeksforgeeks.org/dsa/graph-and-its-representations/', 1),
('graph_basics', 'Comparison between Adjacency List and Adjacency Matrix representation of Graph - GeeksforGeeks', 'https://www.geeksforgeeks.org/dsa/comparison-between-adjacency-list-and-adjacency-matrix-representation-of-graph/', 2),

-- graph_adj_list
('graph_adj_list', 'Adjacency List Representation - GeeksforGeeks', 'https://www.geeksforgeeks.org/dsa/adjacency-list-meaning-definition-in-dsa/', 1),
('graph_adj_list', 'Comparison between Adjacency List and Adjacency Matrix representation of Graph - GeeksforGeeks', 'https://www.geeksforgeeks.org/dsa/comparison-between-adjacency-list-and-adjacency-matrix-representation-of-graph/', 2),

-- graph_adj_matrix
('graph_adj_matrix', 'Adjacency Matrix Representation - GeeksforGeeks', 'https://www.geeksforgeeks.org/dsa/adjacency-matrix/', 1),
('graph_adj_matrix', 'Comparison between Adjacency List and Adjacency Matrix representation of Graph - GeeksforGeeks', 'https://www.geeksforgeeks.org/dsa/comparison-between-adjacency-list-and-adjacency-matrix-representation-of-graph/', 2),

-- graph_bfs
('graph_bfs', 'Breadth First Search or BFS for a Graph - GeeksforGeeks', 'https://www.geeksforgeeks.org/dsa/breadth-first-search-or-bfs-for-a-graph/', 1),
('graph_bfs', 'Graph Traversal (Depth/Breadth First Search) - VisuAlgo', 'https://visualgo.net/en/dfsbfs', 2),

-- graph_dfs
('graph_dfs', 'Depth First Search or DFS for a Graph - GeeksforGeeks', 'https://www.geeksforgeeks.org/dsa/depth-first-search-or-dfs-for-a-graph/', 1),
('graph_dfs', 'Graph Traversal (Depth/Breadth First Search) - VisuAlgo', 'https://visualgo.net/en/dfsbfs', 2),

-- graph_visited
('graph_visited', 'Time and Space Complexity of Depth First Search (DFS) - GeeksforGeeks', 'https://www.geeksforgeeks.org/dsa/time-and-space-complexity-of-depth-first-search-dfs/', 1),
('graph_visited', 'Depth First Search or DFS for a Graph - GeeksforGeeks', 'https://www.geeksforgeeks.org/dsa/depth-first-search-or-dfs-for-a-graph/', 2),

-- graph_connected
('graph_connected', 'Connected Component Definition & Meaning in DSA - GeeksforGeeks', 'https://www.geeksforgeeks.org/dsa/connected-component-definition-meaning-in-dsa/', 1),
('graph_connected', 'Connected Components in an Undirected Graph - GeeksforGeeks', 'https://www.geeksforgeeks.org/dsa/connected-components-in-an-undirected-graph/', 2),

-- graph_cycle
('graph_cycle', 'Detect Cycle in an Undirected Graph - GeeksforGeeks', 'https://www.geeksforgeeks.org/dsa/detect-cycle-undirected-graph/', 1),
('graph_cycle', 'Detect Cycle in a Directed Graph - GeeksforGeeks', 'https://www.geeksforgeeks.org/dsa/detect-cycle-in-a-graph/', 2),

-- graph_topo
('graph_topo', 'Topological Sorting - GeeksforGeeks', 'https://www.geeksforgeeks.org/dsa/topological-sorting/', 1),
('graph_topo', 'Topological Sorting using BFS - Kahn''s Algorithm - GeeksforGeeks', 'https://www.geeksforgeeks.org/dsa/topological-sorting-indegree-based-solution/', 2),

-- graph_bipartite
('graph_bipartite', 'What is Bipartite Graph? - GeeksforGeeks', 'https://www.geeksforgeeks.org/dsa/what-is-bipartite-graph/', 1),
('graph_bipartite', 'Check whether a given graph is Bipartite or not - GeeksforGeeks', 'https://www.geeksforgeeks.org/dsa/bipartite-graph/', 2);
