-- Migration 032: Resource links for Bit & String Manipulation
-- All URLs individually verified via live search on 2026-09-05

INSERT INTO concept_resources (concept_id, title, url) VALUES
('bit_operators', 'Introduction to Bitwise Algorithms', 'https://www.geeksforgeeks.org/dsa/introduction-to-bitwise-algorithms-data-structures-and-algorithms-tutorial/'),

('bit_xor_properties', 'Bitwise XOR Operator in Programming', 'https://www.geeksforgeeks.org/software-engineering/bitwise-xor-operator-in-programming/'),

('bit_counting', 'Count Set Bits', 'https://www.geeksforgeeks.org/dsa/count-set-bits-in-an-integer/'),

('bit_masking_subsets', 'Find All Distinct Subsets Using Bitmasking', 'https://www.geeksforgeeks.org/dsa/find-distinct-subsets-given-set/'),

('str_palindrome', 'Longest Palindromic Substring', 'https://www.geeksforgeeks.org/dsa/longest-palindromic-substring/'),

('str_anagram', 'Check if Two Strings are Anagrams of Each Other', 'https://www.geeksforgeeks.org/dsa/check-whether-two-strings-are-anagram-of-each-other/'),

('str_pattern_matching', 'KMP Algorithm for Pattern Searching', 'https://www.geeksforgeeks.org/dsa/kmp-algorithm-for-pattern-searching/'),

('str_common_prefix', 'Longest Common Prefix', 'https://www.geeksforgeeks.org/dsa/longest-common-prefix/');

-- VERIFICATION QUERY — expect 8 rows, resource_count 1
SELECT c.id, c.name,
       (SELECT count(*) FROM concept_resources r WHERE r.concept_id = c.id) AS resource_count
FROM concepts c
WHERE c.topic_id = 'bit_string_manipulation'
ORDER BY c.display_order;
