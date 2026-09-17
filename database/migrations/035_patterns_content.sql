-- Migration 035: Patterns — resources + practice problems + real-world examples
-- All URLs individually verified via live search on 2026-09-05

INSERT INTO concept_resources (concept_id, title, url) VALUES
('pat_merge_intervals',        'Merging Intervals',                    'https://www.geeksforgeeks.org/dsa/merging-intervals/'),
('pat_cyclic_sort',            'Missing Number in a Sorted Array',     'https://www.geeksforgeeks.org/dsa/find-the-missing-number-in-a-sorted-array/'),
('pat_two_heaps',              'Two Heaps: Min Heap & Max Heap — Median', 'https://medium.com/@stephen.joel/two-heaps-median-f28ebc1569d7'),
('pat_subsets_backtracking',   'Heap & Priority Queue and Backtracking Deep Dive', 'https://theskilledcoder.com/posts/dsa/heap-priority-queue'),
('pat_modified_binary_search', 'Koko Eating Bananas (Binary Search on Answer)', 'https://www.geeksforgeeks.org/dsa/koko-eating-bananas/'),
('pat_kway_merge',             'Heap Data Structure (includes K-way Merge)', 'https://www.geeksforgeeks.org/dsa/heap-data-structure/');

INSERT INTO concept_practice_problems (concept_id, platform, title, url, difficulty, display_order) VALUES
('pat_merge_intervals',        'LeetCode', 'Merge Intervals',                'https://leetcode.com/problems/merge-intervals/',                'Medium', 1),

('pat_cyclic_sort',            'LeetCode', 'Find All Duplicates in an Array','https://leetcode.com/problems/find-all-duplicates-in-an-array/','Medium', 1),
('pat_cyclic_sort',            'LeetCode', 'Find All Numbers Disappeared in an Array', 'https://leetcode.com/problems/find-all-numbers-disappeared-in-an-array/', 'Easy', 2),

('pat_two_heaps',              'LeetCode', 'Find Median from Data Stream',   'https://leetcode.com/problems/find-median-from-data-stream/',   'Hard',   1),

('pat_subsets_backtracking',   'LeetCode', 'Subsets',                        'https://leetcode.com/problems/subsets/',                        'Medium', 1),
('pat_subsets_backtracking',   'LeetCode', 'Permutations',                   'https://leetcode.com/problems/permutations/',                   'Medium', 2),

('pat_modified_binary_search', 'LeetCode', 'Koko Eating Bananas',            'https://leetcode.com/problems/koko-eating-bananas/',            'Medium', 1),

('pat_kway_merge',             'LeetCode', 'Merge k Sorted Lists',           'https://leetcode.com/problems/merge-k-sorted-lists/',           'Hard',   1);

UPDATE concepts SET real_world_example = 'A calendar app combining your 9-10am and 9:30-11am meetings into a single 9-11am busy block.' WHERE id = 'pat_merge_intervals';
UPDATE concepts SET real_world_example = 'A raffle with tickets numbered 1 to n, checking which numbers were never claimed by placing each sold ticket at its own numbered slot.' WHERE id = 'pat_cyclic_sort';
UPDATE concepts SET real_world_example = 'A live traffic app tracking the median commute time across thousands of drivers as new reports stream in every second.' WHERE id = 'pat_two_heaps';
UPDATE concepts SET real_world_example = 'A puzzle app generating every way to arrange pieces on a board, abandoning a partial arrangement the moment two pieces conflict instead of finishing it out.' WHERE id = 'pat_subsets_backtracking';
UPDATE concepts SET real_world_example = 'A shipping company finding the smallest truck capacity that still lets all packages ship within a deadline, by testing candidate capacities instead of every possible arrangement.' WHERE id = 'pat_modified_binary_search';
UPDATE concepts SET real_world_example = 'A search engine merging already-sorted-by-relevance result lists from multiple servers into one final ranked list.' WHERE id = 'pat_kway_merge';

-- VERIFICATION QUERY — expect 6 rows, resources 1, problems 1 or 2, has_example true
SELECT c.id, c.name,
       (SELECT count(*) FROM concept_resources r WHERE r.concept_id = c.id) AS resources,
       (SELECT count(*) FROM concept_practice_problems p WHERE p.concept_id = c.id) AS problems,
       (c.real_world_example IS NOT NULL) AS has_example
FROM concepts c
WHERE c.topic_id = 'patterns'
ORDER BY c.display_order;
