-- Migration 038: Sorting Fundamentals — resource links
-- All URLs individually verified via live search on 2026-09-05

INSERT INTO concept_resources (concept_id, title, url) VALUES
('sort_bubble', 'Bubble Sort',
 'https://www.geeksforgeeks.org/dsa/bubble-sort/'),

('sort_insertion', 'Insertion Sort',
 'https://www.geeksforgeeks.org/dsa/insertion-sort/'),

('sort_merge', 'Merge Sort',
 'https://www.geeksforgeeks.org/dsa/merge-sort/'),

('sort_quicksort', 'QuickSort',
 'https://www.geeksforgeeks.org/dsa/quick-sort/'),

('sort_heapsort', 'Heap Sort',
 'https://www.geeksforgeeks.org/dsa/heap-sort/'),

('sort_complexity_analysis', 'Analysis of Different Sorting Techniques',
 'https://www.geeksforgeeks.org/dsa/analysis-of-different-sorting-techniques/'),

('sort_complexity_analysis', 'Introduction to Sorting Algorithms',
 'https://www.geeksforgeeks.org/dsa/introduction-to-sorting-algorithm/');

-- VERIFICATION QUERY — expect 6 concepts, 7 total resources (1 on complexity, 2 on analysis)
SELECT c.id, c.name,
       (SELECT count(*) FROM concept_resources r WHERE r.concept_id = c.id) AS resource_count
FROM concepts c
WHERE c.topic_id = 'sorting_fundamentals'
ORDER BY c.display_order;
