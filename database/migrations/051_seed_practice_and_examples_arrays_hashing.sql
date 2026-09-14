-- Seed concept_practice_problems and real_world_example for the
-- Arrays & Hashing topic (10 concepts). Every problem URL below was
-- verified via live web search on 2026-08-29 — none invented.
-- Platform mix: LeetCode fits every concept here (matches CIP's stated
-- interview-prep purpose); HackerRank included once, for hash_set,
-- where it genuinely fit well. CodeChef is contest/competitive-
-- programming oriented and did not have a genuinely well-fitting,
-- appropriately-leveled problem for any of these 10 fundamentals-level
-- concepts — not used here rather than forced onto a bad fit.
-- arr_dynamic and hash_collision each have only ONE verified problem;
-- a second wasn't forced just to hit a count.

INSERT INTO concept_practice_problems (concept_id, platform, title, url, difficulty, display_order) VALUES

('arr_indexing', 'LeetCode', 'Build Array from Permutation', 'https://leetcode.com/problems/build-array-from-permutation/', 'Easy', 1),
('arr_indexing', 'LeetCode', 'Running Sum of 1d Array', 'https://leetcode.com/problems/running-sum-of-1d-array/', 'Easy', 2),

('arr_dynamic', 'LeetCode', 'Insert Delete GetRandom O(1)', 'https://leetcode.com/problems/insert-delete-getrandom-o1/', 'Medium', 1),

('arr_two_pointer', 'LeetCode', 'Two Sum II - Input Array Is Sorted', 'https://leetcode.com/problems/two-sum-ii-input-array-is-sorted/', 'Medium', 1),
('arr_two_pointer', 'LeetCode', 'Container With Most Water', 'https://leetcode.com/problems/container-with-most-water/', 'Medium', 2),

('arr_sliding_window', 'LeetCode', 'Longest Substring Without Repeating Characters', 'https://leetcode.com/problems/longest-substring-without-repeating-characters/', 'Medium', 1),
('arr_sliding_window', 'LeetCode', 'Minimum Size Subarray Sum', 'https://leetcode.com/problems/minimum-size-subarray-sum/', 'Medium', 2),

('arr_prefix_sum', 'LeetCode', 'Subarray Sum Equals K', 'https://leetcode.com/problems/subarray-sum-equals-k/', 'Medium', 1),
('arr_prefix_sum', 'LeetCode', 'Find the Highest Altitude', 'https://leetcode.com/problems/find-the-highest-altitude/', 'Easy', 2),

('hash_map_basics', 'LeetCode', 'Two Sum', 'https://leetcode.com/problems/two-sum/', 'Easy', 1),
('hash_map_basics', 'LeetCode', 'Contains Duplicate', 'https://leetcode.com/problems/contains-duplicate/', 'Easy', 2),

('hash_collision', 'LeetCode', 'Design HashMap', 'https://leetcode.com/problems/design-hashmap/', 'Medium', 1),

('hash_set', 'LeetCode', 'Longest Consecutive Sequence', 'https://leetcode.com/problems/longest-consecutive-sequence/', 'Medium', 1),
('hash_set', 'HackerRank', 'Hash Tables: Ransom Note', 'https://www.hackerrank.com/challenges/ctci-ransom-note/problem', 'Medium', 2),

('arr_sorting', 'LeetCode', 'Sort Colors', 'https://leetcode.com/problems/sort-colors/', 'Medium', 1),
('arr_sorting', 'LeetCode', 'Merge Intervals', 'https://leetcode.com/problems/merge-intervals/', 'Medium', 2),

('arr_kadane', 'LeetCode', 'Maximum Subarray', 'https://leetcode.com/problems/maximum-subarray/', 'Medium', 1),
('arr_kadane', 'LeetCode', 'Best Time to Buy and Sell Stock', 'https://leetcode.com/problems/best-time-to-buy-and-sell-stock/', 'Easy', 2);

-- Real-world examples: one illustrative paragraph per concept, written
-- from general accurate technical knowledge, not sourced from a
-- single citation (these describe well-known, standard applications).

UPDATE concepts SET real_world_example = 'Video streaming players use direct array indexing to jump to any frame instantly — since frames sit in a contiguous buffer, seeking to frame 1000 takes exactly as long as seeking to frame 1, no matter how long the video is.' WHERE id = 'arr_indexing';

UPDATE concepts SET real_world_example = 'Python lists, Java''s ArrayList, and C++''s std::vector are all dynamic arrays under the hood. Appending past capacity silently triggers a bigger allocation and a full copy, which is why appending is usually fast but occasionally has a slower "hiccup".' WHERE id = 'arr_dynamic';

UPDATE concepts SET real_world_example = 'Merging two sorted contact-list exports uses two pointers, one per list, always advancing whichever pointer currently points at the smaller name — the same core idea used inside merge sort''s merge step.' WHERE id = 'arr_two_pointer';

UPDATE concepts SET real_world_example = 'Network routers track how many packets arrived in the last N milliseconds for rate-limiting using a sliding window, so they never have to re-scan the entire packet history on every new packet.' WHERE id = 'arr_sliding_window';

UPDATE concepts SET real_world_example = 'A spreadsheet''s running-total column or a bank statement''s balance column is a prefix sum in practice — each row is the previous balance plus that row''s transaction, computed once and then instantly readable for any range of rows.' WHERE id = 'arr_prefix_sum';

UPDATE concepts SET real_world_example = 'A phone''s contacts app finds a name in roughly the same instant whether you have 50 contacts or 50,000, because names are stored in a hash map keyed by name, not scanned one at a time.' WHERE id = 'hash_map_basics';

UPDATE concepts SET real_world_example = 'A URL shortener has to explicitly decide what happens when two different long URLs hash to the same short code — that collision is not a bug to avoid, it is a case the data structure must handle correctly by design.' WHERE id = 'hash_collision';

UPDATE concepts SET real_world_example = 'A spell-checker keeps every valid dictionary word in a hash set, so checking whether a typed word is real is an instant lookup rather than a search through an entire word list.' WHERE id = 'hash_set';

UPDATE concepts SET real_world_example = 'An e-commerce site sorting products by price or rating before displaying them is the most common real use of a general-purpose sort — the interesting engineering question is usually not whether it is sorted, but which sort is stable and fast enough at that scale.' WHERE id = 'arr_sorting';

UPDATE concepts SET real_world_example = 'A stock-tracking app showing "best possible single-day-range gain this month" is running a Kadane''s-algorithm-shaped scan over daily price changes to find the best contiguous run without checking every possible date range.' WHERE id = 'arr_kadane';
