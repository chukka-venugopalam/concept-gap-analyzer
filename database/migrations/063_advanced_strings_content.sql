-- Migration 063: Advanced Strings extension — resources, practice problems, real-world examples
-- Rabin-Karp and Manacher's GfG URLs individually fetched for their
-- canonical /dsa/ form on 2026-09-18. Z-function's resource is this
-- migration's honesty exception — see 062's header comment. Its URL
-- (cp-algorithms.com/string/z-function.html) was confirmed via direct
-- search match, not guessed by analogy with the Manacher's URL on the
-- same site.

INSERT INTO concept_resources (concept_id, title, url) VALUES
('str_rabin_karp', 'Rabin-Karp Algorithm for Pattern Searching', 'https://www.geeksforgeeks.org/dsa/rabin-karp-algorithm-for-pattern-searching/'),
('str_z_function', 'Z-function and its calculation', 'https://cp-algorithms.com/string/z-function.html'),
('str_manacher',   'Manacher''s Algorithm', 'https://www.geeksforgeeks.org/dsa/manachers-algorithm-linear-time-longest-palindromic-substring-part-1/');

INSERT INTO concept_practice_problems (concept_id, platform, title, url, difficulty, display_order) VALUES
('str_rabin_karp', 'LeetCode', 'Longest Duplicate Substring',    'https://leetcode.com/problems/longest-duplicate-substring/',    'Hard', 1),
('str_manacher',   'LeetCode', 'Longest Palindromic Substring',  'https://leetcode.com/problems/longest-palindromic-substring/',  'Medium', 1);

UPDATE concepts SET real_world_example = 'A plagiarism checker scanning a submitted essay against thousands of source documents — hashing each sentence lets it flag likely-copied passages fast, only doing a full word-by-word comparison when a hash collision needs confirming.' WHERE id = 'str_rabin_karp';
UPDATE concepts SET real_world_example = 'A DNA sequence analyzer checking whether a short marker sequence recurs at the start of a much longer strand, by measuring how far each position''s sequence keeps matching the very beginning before it diverges.' WHERE id = 'str_z_function';
UPDATE concepts SET real_world_example = 'A text editor''s "select the longest palindrome around my cursor" feature that stays instant even on a huge document, because it never re-checks characters it has already confirmed match from a nearby palindrome.' WHERE id = 'str_manacher';

-- VERIFICATION QUERY — expect 3 resources, 2 practice problems (str_z_function
-- intentionally has none — see 062's header comment), and all 3
-- concepts with a real-world example. Check resource_title against
-- what's in this file to confirm nothing got mismatched.
SELECT c.id,
       (SELECT title FROM concept_resources WHERE concept_id = c.id LIMIT 1) AS resource_title,
       (SELECT count(*) FROM concept_resources WHERE concept_id = c.id) AS resources,
       (SELECT count(*) FROM concept_practice_problems WHERE concept_id = c.id) AS problems,
       (c.real_world_example IS NOT NULL) AS has_example
FROM concepts c
WHERE c.id IN ('str_rabin_karp','str_z_function','str_manacher')
ORDER BY c.display_order;
