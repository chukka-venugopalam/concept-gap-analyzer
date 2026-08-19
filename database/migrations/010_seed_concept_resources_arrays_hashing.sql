-- Seed concept_resources for the Arrays & Hashing topic (10 concepts, 2 links each).
-- Every URL below was verified via live web search on 2026-08-19 — none invented.
-- Sources favored: GeeksforGeeks (primary, consistent), Interview Cake, VisuAlgo,
-- USACO Guide, takeUforward, W3Schools, Built In — chosen for accuracy and relevance,
-- not just domain authority.

INSERT INTO concept_resources (concept_id, title, url, display_order) VALUES

-- arr_indexing
('arr_indexing', 'Why does Array Indexing take O(1) Time? - GeeksforGeeks', 'https://www.geeksforgeeks.org/dsa/why-does-accessing-an-array-element-take-o1-time/', 1),
('arr_indexing', 'Why Array Indexing is Instantly Fast (O(1) Explained) - FullStackPrep', 'https://www.fullstackprep.dev/articles/dsa/array/array-access-complexity', 2),

-- arr_dynamic
('arr_dynamic', 'Introduction to Amortized Analysis - GeeksforGeeks', 'https://www.geeksforgeeks.org/dsa/introduction-to-amortized-analysis/', 1),
('arr_dynamic', 'Dynamic Array Amortized Analysis - Interview Cake', 'https://www.interviewcake.com/concept/java/dynamic-array-amortized-analysis', 2),

-- arr_two_pointer
('arr_two_pointer', 'Two Pointers Technique - GeeksforGeeks', 'https://www.geeksforgeeks.org/dsa/two-pointers-technique/', 1),
('arr_two_pointer', 'Short Notes on Two Pointer and Sliding Window - GeeksforGeeks', 'https://www.geeksforgeeks.org/dsa/short-notes-on-two-pointer-and-sliding-window-1/', 2),

-- arr_sliding_window
('arr_sliding_window', 'Sliding Window Technique - GeeksforGeeks', 'https://www.geeksforgeeks.org/dsa/window-sliding-technique/', 1),
('arr_sliding_window', 'Sliding Window Algorithm Explained - Built In', 'https://builtin.com/data-science/sliding-window-algorithm', 2),

-- arr_prefix_sum
('arr_prefix_sum', 'Prefix Sum Technique - GeeksforGeeks', 'https://www.geeksforgeeks.org/dsa/understanding-prefix-sums/', 1),
('arr_prefix_sum', 'Introduction to Prefix Sums - USACO Guide', 'https://usaco.guide/silver/prefix-sums', 2),

-- hash_map_basics
('hash_map_basics', 'Introduction to Hashing - GeeksforGeeks', 'https://www.geeksforgeeks.org/dsa/introduction-to-hashing-2/', 1),
('hash_map_basics', 'Hash Table (Hash Map) Data Structure Explained - Interview Cake', 'https://www.interviewcake.com/concept/java/hash-map', 2),

-- hash_collision
('hash_collision', 'Collision Resolution Techniques - GeeksforGeeks', 'https://www.geeksforgeeks.org/dsa/collision-resolution-techniques/', 1),
('hash_collision', 'Hash Table Visualization (Chaining, Linear/Quadratic Probing) - VisuAlgo', 'https://visualgo.net/en/hashtable', 2),

-- hash_set
('hash_set', 'Introduction to Set Data Structure - GeeksforGeeks', 'https://www.geeksforgeeks.org/dsa/introduction-to-set-data-structure/', 1),
('hash_set', 'DSA Hash Sets - W3Schools', 'https://www.w3schools.com/dsa/dsa_data_hashsets.php', 2),

-- arr_sorting
('arr_sorting', 'Sorting Algorithms - GeeksforGeeks', 'https://www.geeksforgeeks.org/dsa/sorting-algorithms/', 1),
('arr_sorting', 'Sorting Algorithms: Slowest to Fastest - Built In', 'https://builtin.com/machine-learning/fastest-sorting-algorithm', 2),

-- arr_kadane
('arr_kadane', 'Maximum Subarray Sum - Kadane''s Algorithm - GeeksforGeeks', 'https://www.geeksforgeeks.org/dsa/largest-sum-contiguous-subarray/', 1),
('arr_kadane', 'Kadane''s Algorithm - takeUforward', 'https://takeuforward.org/data-structure/kadanes-algorithm-maximum-subarray-sum-in-an-array', 2);
