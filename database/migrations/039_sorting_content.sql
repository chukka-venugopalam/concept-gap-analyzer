-- Migration 039: Sorting Fundamentals — practice problems + real-world examples
-- All URLs individually verified via live search on 2026-09-05 (LeetCode only)

INSERT INTO concept_practice_problems (concept_id, platform, title, url, difficulty, display_order) VALUES
('sort_bubble', 'LeetCode', 'Sort an Array', 'https://leetcode.com/problems/sort-an-array/', 'Medium', 1),

('sort_insertion', 'LeetCode', 'Sort an Array', 'https://leetcode.com/problems/sort-an-array/', 'Medium', 1),

('sort_merge', 'LeetCode', 'Sort an Array', 'https://leetcode.com/problems/sort-an-array/', 'Medium', 1),

('sort_quicksort', 'LeetCode', 'Sort an Array', 'https://leetcode.com/problems/sort-an-array/', 'Medium', 1),

('sort_heapsort', 'LeetCode', 'K Closest Points to Origin', 'https://leetcode.com/problems/k-closest-points-to-origin/', 'Medium', 1),

('sort_complexity_analysis', 'LeetCode', 'Sort an Array', 'https://leetcode.com/problems/sort-an-array/', 'Medium', 1),
('sort_complexity_analysis', 'LeetCode', 'Sort the Matrix Diagonally', 'https://leetcode.com/problems/sort-the-matrix-diagonally/', 'Medium', 2);

UPDATE concepts SET real_world_example = 'A classroom seating chart reordering students by height in a single pass, swapping neighbors until everyone''s in place.' WHERE id = 'sort_bubble';
UPDATE concepts SET real_world_example = 'A cashier sorting coins by denomination one coin at a time, inserting each new coin into the already-sorted pile.' WHERE id = 'sort_insertion';
UPDATE concepts SET real_world_example = 'A library splitting its entire book inventory in half, sorting each half separately, then merging them back into perfect alphabetical order.' WHERE id = 'sort_merge';
UPDATE concepts SET real_world_example = 'A search engine picking a "pivot" result and partitioning all other results into more/less relevant, then recursively refining each partition.' WHERE id = 'sort_quicksort';
UPDATE concepts SET real_world_example = 'A priority queue efficiently extracting the highest-priority task by repeatedly popping the heap root, making it O(n log n) for sorting priority tasks.' WHERE id = 'sort_heapsort';
UPDATE concepts SET real_world_example = 'A database choosing between QuickSort (fast average case) and MergeSort (predictable worst case) based on whether the table''s data distribution is known or random.' WHERE id = 'sort_complexity_analysis';

-- VERIFICATION QUERY — expect 6 rows, problem_count 1 or 2, has_example = true on all
SELECT c.id, c.name,
       (SELECT count(*) FROM concept_practice_problems p WHERE p.concept_id = c.id) AS problem_count,
       (c.real_world_example IS NOT NULL) AS has_example
FROM concepts c
WHERE c.topic_id = 'sorting_fundamentals'
ORDER BY c.display_order;
