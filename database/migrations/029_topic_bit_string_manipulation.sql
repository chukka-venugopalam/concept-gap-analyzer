-- Migration 029: Bit + String Manipulation — core topic definition
-- Same two-phase pattern as 027: core definition here, resources/practice
-- problems/real-world examples as a separate verified follow-up pass.

INSERT INTO topics (id, name, description, display_order) VALUES
('bit_string_manipulation', 'Bit & String Manipulation', 'Bitwise tricks, XOR properties, and string-processing techniques like pattern matching and anagram detection', 9);

INSERT INTO concepts
  (id, topic_id, name, definition, proficiency_level, importance_weight, canonical_keywords, display_order)
VALUES
('bit_operators', 'bit_string_manipulation',
 'Bitwise Operators',
 'The core bitwise operations — AND, OR, XOR, NOT, and left/right shifts — and what each does to individual bits of a number. Forms the basis for every other bit-manipulation technique.',
 'beginner', 3,
 ARRAY['AND','OR','XOR','NOT','bit shift','left shift','right shift','bitwise operator'], 1),

('bit_xor_properties', 'bit_string_manipulation',
 'XOR Properties',
 'XOR''s self-canceling property (a ^ a = 0, a ^ 0 = a), which lets it find a single element appearing an odd number of times among pairs, or swap two values without a temporary variable.',
 'interview', 3,
 ARRAY['XOR','exclusive or','self canceling','find unique','swap without temp'], 2),

('bit_counting', 'bit_string_manipulation',
 'Counting & Checking Set Bits',
 'Techniques for counting or checking set bits — n & (n-1) clears the lowest set bit, the basis for counting total set bits and checking whether a number is a power of two.',
 'interview', 2,
 ARRAY['set bits','n & (n-1)','power of two','count bits','popcount'], 3),

('bit_masking_subsets', 'bit_string_manipulation',
 'Bitmasking for Subsets',
 'Representing subset membership as the bits of an integer, so all 2^n subsets of a set can be enumerated by iterating integers from 0 to 2^n - 1.',
 'interview', 2,
 ARRAY['bitmask','subset enumeration','2^n subsets','bit representation'], 4),

('str_palindrome', 'bit_string_manipulation',
 'Palindrome Checking',
 'Checking whether a string reads the same forward and backward, typically via two pointers converging from both ends or expanding outward from a center.',
 'beginner', 2,
 ARRAY['palindrome','two pointer string','expand from center','reverse compare'], 5),

('str_anagram', 'bit_string_manipulation',
 'Anagram Detection',
 'Determining whether two strings contain the same characters with the same frequency, typically checked via a character frequency count or by sorting both strings.',
 'beginner', 2,
 ARRAY['anagram','character frequency','frequency count','sorting strings'], 6),

('str_pattern_matching', 'bit_string_manipulation',
 'Pattern Matching & KMP Basics',
 'Finding occurrences of a pattern string within a larger text, ranging from brute-force comparison to the KMP algorithm, which precomputes a failure function to avoid re-checking already-matched characters.',
 'interview', 2,
 ARRAY['pattern matching','substring search','KMP','failure function'], 7),

('str_common_prefix', 'bit_string_manipulation',
 'Longest Common Prefix / Substring',
 'Finding the longest prefix or substring shared across multiple strings, typically by comparing characters position-by-position across all strings simultaneously.',
 'interview', 1,
 ARRAY['longest common prefix','longest common substring','shared prefix'], 8);

INSERT INTO concept_prerequisites (concept_id, prerequisite_id) VALUES
('bit_xor_properties', 'bit_operators'),
('bit_counting', 'bit_operators'),
('bit_masking_subsets', 'bit_counting'),
('str_pattern_matching', 'str_common_prefix');

INSERT INTO concept_misconceptions
  (concept_id, misconception, correction, trigger_phrases)
VALUES
('bit_operators',
 'Left-shifting a number by n always safely doubles it n times',
 'Left shift multiplies by 2^n only while the result stays within the integer type''s bit width. Shifting past that overflows or wraps instead of producing a mathematically correct larger number.',
 ARRAY['always doubles','safe multiply','no overflow']),

('bit_xor_properties',
 'XOR-ing a whole list finds the most frequent element',
 'XOR cancels pairs of identical values to zero, so it finds an element appearing an odd number of times when every other element appears an even number of times — not the most frequent element in general.',
 ARRAY['most frequent','majority element','appears most']),

('bit_counting',
 'n & (n-1) checks whether a number is even',
 'n & (n-1) clears the lowest set bit of n; comparing the result to 0 checks whether n was a power of two (exactly one set bit), not whether it''s even. Checking evenness is n & 1.',
 ARRAY['checks even','is even','n & 1 confusion']),

('bit_masking_subsets',
 'Bitmask subset enumeration only works for small, fixed sets known in advance',
 'The technique works for any set up to roughly 20-25 elements, limited only by 2^n growing too large to enumerate — not by needing to know the set ahead of time. The set itself can be built dynamically at runtime.',
 ARRAY['only fixed sets','known in advance','cant be dynamic']),

('str_palindrome',
 'Checking a palindrome requires building a reversed copy of the string first',
 'Two pointers starting at both ends and moving inward compare characters directly without ever building a reversed copy, using O(1) extra space instead of O(n).',
 ARRAY['reverse the string','create a copy','need reversed version']),

('str_anagram',
 'Two strings are anagrams if they have the same length',
 'Equal length is necessary but not sufficient — the strings also need identical character counts. "abc" and "abd" are the same length but not anagrams.',
 ARRAY['same length means','just check length','length is enough']),

('str_pattern_matching',
 'Brute-force pattern matching and KMP have the same time complexity — KMP is just simpler to write',
 'Brute-force is O(n*m) in the worst case, re-scanning from near the start after every partial mismatch. KMP achieves O(n+m) using a precomputed failure function to avoid re-checking matched characters — the complexities genuinely differ, and KMP is more intricate to implement, not simpler.',
 ARRAY['same complexity','KMP just simpler','no real speed difference']),

('str_common_prefix',
 'Finding the longest common prefix requires comparing every pair of strings separately',
 'All strings can be compared simultaneously position-by-position — checking whether every string shares the same character at index i, stopping at the first mismatch or the shortest string''s end. No pairwise comparison needed.',
 ARRAY['compare every pair','pairwise comparison','check pairs']);

INSERT INTO fallback_probes (topic_id, question, probe_order) VALUES
('bit_string_manipulation',
 'You mentioned bit manipulation — can you explain why XOR-ing every element in a list cancels out duplicates, and what that leaves behind?',
 1),
('bit_string_manipulation',
 'Walk me through checking if one string is an anagram of another — what exactly are you comparing, and why isn''t matching length alone enough?',
 2),
('bit_string_manipulation',
 'What specifically makes KMP faster than brute-force pattern matching? What information does it avoid re-checking?',
 3);
