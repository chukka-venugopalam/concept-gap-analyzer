-- Migration 033: Bit & String Manipulation — practice problems + real-world examples
-- All URLs individually verified via live search on 2026-09-05 (LeetCode only)

INSERT INTO concept_practice_problems (concept_id, platform, title, url, difficulty, display_order) VALUES
('bit_operators',        'LeetCode', 'Number of 1 Bits',                                'https://leetcode.com/problems/number-of-1-bits/',                                'Easy',   1),

('bit_xor_properties',   'LeetCode', 'Missing Number',                                  'https://leetcode.com/problems/missing-number/',                                  'Easy',   1),
('bit_xor_properties',   'LeetCode', 'Single Number III',                               'https://leetcode.com/problems/single-number-iii/',                              'Medium', 2),

('bit_counting',         'LeetCode', 'Number of 1 Bits',                                'https://leetcode.com/problems/number-of-1-bits/',                                'Easy',   1),
('bit_counting',         'LeetCode', 'Power of Two',                                    'https://leetcode.com/problems/power-of-two/',                                    'Easy',   2),

('bit_masking_subsets',  'LeetCode', 'Subsets',                                         'https://leetcode.com/problems/subsets/',                                         'Medium', 1),

('str_palindrome',       'LeetCode', 'Longest Palindromic Substring',                   'https://leetcode.com/problems/longest-palindromic-substring/',                   'Medium', 1),

('str_anagram',          'LeetCode', 'Valid Anagram',                                   'https://leetcode.com/problems/valid-anagram/',                                   'Easy',   1),

('str_pattern_matching', 'LeetCode', 'Find the Index of the First Occurrence in a String', 'https://leetcode.com/problems/find-the-index-of-the-first-occurrence-in-a-string/', 'Easy', 1),

('str_common_prefix',    'LeetCode', 'Longest Common Prefix',                           'https://leetcode.com/problems/longest-common-prefix/',                           'Easy',   1);

UPDATE concepts SET real_world_example = 'A game engine packing multiple on/off settings — sound, fullscreen, vsync — into a single integer using bit flags, instead of separate boolean variables.' WHERE id = 'bit_operators';
UPDATE concepts SET real_world_example = 'A factory scanner finding the one mislabeled item in a batch where every correct item appears in a matched pair, by XOR-ing every scanned ID together.' WHERE id = 'bit_xor_properties';
UPDATE concepts SET real_world_example = 'A permissions system counting how many access flags a user has enabled, or checking whether a cache size is a valid power-of-two allocation.' WHERE id = 'bit_counting';
UPDATE concepts SET real_world_example = 'A restaurant app generating every possible combination of optional toppings a customer could add to an order.' WHERE id = 'bit_masking_subsets';
UPDATE concepts SET real_world_example = 'A DNA sequence tool checking whether a genetic segment reads the same in both directions.' WHERE id = 'str_palindrome';
UPDATE concepts SET real_world_example = 'A word game like Scrabble checking whether the tiles a player has could spell a valid target word, regardless of order.' WHERE id = 'str_anagram';
UPDATE concepts SET real_world_example = 'A code editor''s "find" feature locating every occurrence of a search term across a large file efficiently.' WHERE id = 'str_pattern_matching';
UPDATE concepts SET real_world_example = 'An autocomplete feature narrowing suggestions to only entries sharing the same typed-so-far prefix.' WHERE id = 'str_common_prefix';

-- VERIFICATION QUERY — expect 8 rows, problem_count 1 or 2, has_example = true on all
SELECT c.id, c.name,
       (SELECT count(*) FROM concept_practice_problems p WHERE p.concept_id = c.id) AS problem_count,
       (c.real_world_example IS NOT NULL) AS has_example
FROM concepts c
WHERE c.topic_id = 'bit_string_manipulation'
ORDER BY c.display_order;
