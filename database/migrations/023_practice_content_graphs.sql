-- Migration 023: Practice problems + real-world examples for Graphs
-- All URLs individually verified via live search on 2026-09-01 (LeetCode only)
-- NOTE: 323 is a LeetCode Premium-locked problem — flagged so it isn't a surprise behind a paywall.

INSERT INTO concept_practice_problems (concept_id, platform, title, url, difficulty, display_order) VALUES
('graph_basics',     'LeetCode', 'Find if Path Exists in Graph',                          'https://leetcode.com/problems/find-if-path-exists-in-graph/',                          'Easy',   1),

('graph_adj_list',   'LeetCode', 'Clone Graph',                                            'https://leetcode.com/problems/clone-graph/',                                            'Medium', 1),

('graph_adj_matrix', 'LeetCode', 'Number of Islands',                                      'https://leetcode.com/problems/number-of-islands/',                                      'Medium', 1),

('graph_bfs',        'LeetCode', 'Number of Islands',                                      'https://leetcode.com/problems/number-of-islands/',                                      'Medium', 1),
('graph_bfs',        'LeetCode', 'Find if Path Exists in Graph',                           'https://leetcode.com/problems/find-if-path-exists-in-graph/',                          'Easy',   2),

('graph_dfs',        'LeetCode', 'Number of Islands',                                      'https://leetcode.com/problems/number-of-islands/',                                      'Medium', 1),
('graph_dfs',        'LeetCode', 'Clone Graph',                                            'https://leetcode.com/problems/clone-graph/',                                            'Medium', 2),

('graph_visited',    'LeetCode', 'Number of Islands',                                      'https://leetcode.com/problems/number-of-islands/',                                      'Medium', 1),

('graph_connected',  'LeetCode', 'Number of Connected Components in an Undirected Graph',  'https://leetcode.com/problems/number-of-connected-components-in-an-undirected-graph/', 'Medium', 1),

('graph_cycle',      'LeetCode', 'Course Schedule',                                        'https://leetcode.com/problems/course-schedule/',                                        'Medium', 1),

('graph_topo',       'LeetCode', 'Course Schedule',                                        'https://leetcode.com/problems/course-schedule/',                                        'Medium', 1),
('graph_topo',       'LeetCode', 'Course Schedule II',                                     'https://leetcode.com/problems/course-schedule-ii/',                                     'Medium', 2),

('graph_bipartite',  'LeetCode', 'Is Graph Bipartite?',                                    'https://leetcode.com/problems/is-graph-bipartite/',                                     'Medium', 1);

UPDATE concepts SET real_world_example = 'A city road map — intersections are nodes, the roads connecting them are edges.' WHERE id = 'graph_basics';
UPDATE concepts SET real_world_example = 'A social network storing each user''s friend list directly, rather than a giant grid checking everyone against everyone.' WHERE id = 'graph_adj_list';
UPDATE concepts SET real_world_example = 'An airline''s route grid, showing for every pair of cities whether a direct flight connects them.' WHERE id = 'graph_adj_matrix';
UPDATE concepts SET real_world_example = 'A "how are we connected" search on a social network — checking direct friends before friends-of-friends, one ring at a time.' WHERE id = 'graph_bfs';
UPDATE concepts SET real_world_example = 'A maze-solving robot committing to one path as far as it goes before backing up to try another.' WHERE id = 'graph_dfs';
UPDATE concepts SET real_world_example = 'A web crawler marking pages it has already indexed so it doesn''t fetch the same page again in an infinite loop.' WHERE id = 'graph_visited';
UPDATE concepts SET real_world_example = 'Counting how many separate clusters of mutually-linked pages exist within a website''s internal link structure.' WHERE id = 'graph_connected';
UPDATE concepts SET real_world_example = 'A spreadsheet catching that cell A references cell B, which references back to cell A, before it locks up recalculating forever.' WHERE id = 'graph_cycle';
UPDATE concepts SET real_world_example = 'A course catalog ordering classes so every prerequisite comes before the class that needs it.' WHERE id = 'graph_topo';
UPDATE concepts SET real_world_example = 'Matching job applicants to open roles, where every connection only ever goes applicant-to-role, never applicant-to-applicant.' WHERE id = 'graph_bipartite';

-- VERIFICATION QUERY — expect 10 rows, problem_count 1 or 2, has_example = true on all
SELECT c.id, c.name,
       (SELECT count(*) FROM concept_practice_problems p WHERE p.concept_id = c.id) AS problem_count,
       (c.real_world_example IS NOT NULL) AS has_example
FROM concepts c
WHERE c.topic_id = 'graphs'
ORDER BY c.display_order;
