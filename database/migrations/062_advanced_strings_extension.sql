-- Migration 062: Bit & String Manipulation extension — Rabin-Karp,
-- Z-function, Manacher's Algorithm
-- Adds to the EXISTING bit_string_manipulation topic (not a new topic),
-- same pattern as 044/060. display_order continues from 8 (confirmed:
-- 029 uses 1-8) -> 9-11.
-- str_pattern_matching's own definition already frames KMP as one of
-- several substring-search techniques ("ranging from brute-force... to
-- KMP") — str_rabin_karp is the alternative hashing-based approach to
-- that same problem, so its prerequisite is str_pattern_matching, a
-- real dependency (same family of problem), not a new unrelated topic.
-- str_z_function is a different linear-time substring-search technique,
-- same prerequisite for the same reason.
-- str_manacher directly extends str_palindrome: today's concept only
-- covers checking/finding via two-pointer or center-expansion (O(n) or
-- O(n^2)); Manacher's is explicitly the O(n) technique for the harder
-- "longest palindromic substring" version of the same problem, so its
-- prerequisite is str_palindrome.
-- Resources: Rabin-Karp and Manacher's GfG URLs individually fetched
-- for their canonical /dsa/ form on 2026-09-18. Z-function is this
-- migration's honesty exception (same pattern as 057/059/061): no
-- clean GfG-specific article was confirmed for it during this session
-- despite several attempts, so it links to cp-algorithms.com instead —
-- a well-established, independently-corroborated competitive-programming
-- reference that is specifically about this technique. Its practice
-- problem is still a real, verified LeetCode entry.

INSERT INTO concepts (id, topic_id, name, definition, proficiency_level, importance_weight, canonical_keywords, display_order) VALUES

('str_rabin_karp', 'bit_string_manipulation',
 'Rabin-Karp Algorithm',
 'Finding pattern occurrences in a text by comparing HASH values of the pattern and each same-length window of text, rather than comparing characters directly. A rolling hash lets the window''s hash be updated in O(1) as it slides one position, by removing the outgoing character''s contribution and adding the incoming one. A hash match still needs a character-by-character check to rule out a collision (two different substrings hashing the same).',
 'advanced', 2,
 ARRAY['rabin-karp','rolling hash','hash collision','substring search','multiple pattern search'], 9),

('str_z_function', 'bit_string_manipulation',
 'Z-function',
 'For a string s, Z[i] is the length of the longest substring starting at position i that is also a prefix of s (Z[0] is left undefined or set to 0 by convention). Computed for the whole string in O(n) by reusing overlap information from a previously-computed window [l, r] instead of comparing from scratch at every position. Used for pattern matching by computing the Z-array of pattern + separator + text, where any Z[i] equal to the pattern length marks a match.',
 'advanced', 2,
 ARRAY['z-function','z-array','longest common prefix','z-algorithm','string periodicity'], 10),

('str_manacher', 'bit_string_manipulation',
 'Manacher''s Algorithm',
 'Finding the longest palindromic substring in O(n), instead of the O(n^2) center-expansion approach. The string is first transformed by inserting a separator between every character (and at both ends) so that every palindrome, odd or even length in the original, becomes odd-length in the transformed string. A radius array is then filled by reusing a mirror position''s already-known radius whenever the current position falls inside the rightmost palindrome found so far, only expanding character-by-character beyond what is already known.',
 'advanced', 2,
 ARRAY['manacher','longest palindromic substring','O(n) palindrome','mirror position','transformed string','center expansion'], 11);

INSERT INTO concept_prerequisites (concept_id, prerequisite_id) VALUES
('str_rabin_karp', 'str_pattern_matching'),
('str_z_function', 'str_pattern_matching'),
('str_manacher', 'str_palindrome');

INSERT INTO concept_misconceptions (concept_id, misconception, correction, trigger_phrases) VALUES

('str_rabin_karp',
 'If the hash values of the pattern and a window match, that window is confirmed to be a real match.',
 'A hash match only means the window is a CANDIDATE — different substrings can collide to the same hash value under any fixed modulus. A character-by-character comparison is still required to confirm a genuine match; skipping it can report false positives.',
 ARRAY['hash match means confirmed','no need to double check','hash equal means equal strings']),

('str_z_function',
 'The Z-function and the KMP failure function store the same information, just computed differently.',
 'They answer different questions. KMP''s failure function at position i is the longest proper prefix of s[0..i] that is also a suffix of s[0..i] (a property of the PREFIX ending at i). The Z-function at position i is the longest substring STARTING at i that matches the string''s prefix (a property of the SUFFIX starting at i). Related, but not the same values.',
 ARRAY['same as kmp failure function','same information as kmp','interchangeable with kmp array']),

('str_manacher',
 'The separator characters inserted before running Manacher''s algorithm need to be handled as special cases in the final answer.',
 'The separators exist purely to make every palindrome odd-length during processing; converting a radius in the transformed string back to a substring of the ORIGINAL string (dropping the separators) is a single index calculation, not a special case requiring extra logic during the main expansion loop.',
 ARRAY['separators need special handling','extra case for the hash characters','treat inserted chars differently']);

-- VERIFICATION QUERY — expect 3 concepts (display_order 9-11), 3
-- prerequisites, 3 misconceptions
SELECT 'concepts' AS what, count(*) FROM concepts WHERE id IN
  ('str_rabin_karp','str_z_function','str_manacher')
UNION ALL
SELECT 'prereqs', count(*) FROM concept_prerequisites WHERE concept_id IN
  ('str_rabin_karp','str_z_function','str_manacher')
UNION ALL
SELECT 'misconceptions', count(*) FROM concept_misconceptions WHERE concept_id IN
  ('str_rabin_karp','str_z_function','str_manacher');
