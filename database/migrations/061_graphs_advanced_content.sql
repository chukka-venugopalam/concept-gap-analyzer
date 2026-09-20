-- Migration 061: Graphs advanced extension — resources, practice problems, real-world examples
-- All 4 GfG resource URLs individually fetched for their canonical /dsa/
-- form on 2026-09-18. See 060's header comment for why graph_scc and
-- graph_bipartite_matching intentionally have no practice_problems row.

INSERT INTO concept_resources (concept_id, title, url) VALUES
('graph_bellman_ford',          'Bellman Ford Algorithm (Simple Implementation)',                    'https://www.geeksforgeeks.org/dsa/bellman-ford-algorithm-simple-implementation/'),
('graph_scc',                   'Strongly Connected Components',                                     'https://www.geeksforgeeks.org/dsa/strongly-connected-components/'),
('graph_bridges_articulation',  'Bridges in a Graph',                                                'https://www.geeksforgeeks.org/dsa/bridge-in-a-graph/'),
('graph_bipartite_matching',    'Maximum Bipartite Matching',                                        'https://www.geeksforgeeks.org/dsa/maximum-bipartite-matching/');

INSERT INTO concept_practice_problems (concept_id, platform, title, url, difficulty, display_order) VALUES
('graph_bellman_ford',         'LeetCode', 'Cheapest Flights Within K Stops',        'https://leetcode.com/problems/cheapest-flights-within-k-stops/',        'Medium', 1),
('graph_bridges_articulation', 'LeetCode', 'Critical Connections in a Network',      'https://leetcode.com/problems/critical-connections-in-a-network/',      'Hard',   1);

UPDATE concepts SET real_world_example = 'A currency-arbitrage detector: exchange rates can create a cycle where converting through several currencies and back leaves you with MORE money than you started with — that is a negative-weight cycle, and Bellman-Ford is exactly the algorithm that can flag one exists.' WHERE id = 'graph_bellman_ford';
UPDATE concepts SET real_world_example = 'A group of people who all follow each other back on a social network form a strongly connected component, even if the wider network has plenty of one-directional "follows" connecting to outside people who do not follow back.' WHERE id = 'graph_scc';
UPDATE concepts SET real_world_example = 'A single fiber-optic cable connecting an isolated town to the rest of a country''s network — if that one cable (the bridge) is cut, the town loses connectivity entirely, even though the rest of the network stays fine.' WHERE id = 'graph_bridges_articulation';
UPDATE concepts SET real_world_example = 'Assigning ride-share drivers to nearby passenger requests so that as many passengers as possible get a driver, when each driver can only take one passenger and each passenger can only ride with one driver.' WHERE id = 'graph_bipartite_matching';

-- VERIFICATION QUERY — expect 4 resources, 2 practice problems, and all
-- 4 concepts with a real-world example
SELECT c.id,
       (SELECT count(*) FROM concept_resources WHERE concept_id = c.id) AS resources,
       (SELECT count(*) FROM concept_practice_problems WHERE concept_id = c.id) AS problems,
       (c.real_world_example IS NOT NULL) AS has_example
FROM concepts c
WHERE c.id IN ('graph_bellman_ford','graph_scc','graph_bridges_articulation','graph_bipartite_matching')
ORDER BY c.display_order;
