-- Migration 026: Practice problems + real-world examples for Tries
-- All URLs individually verified via live search on 2026-09-01 (LeetCode only)

INSERT INTO concept_practice_problems (concept_id, platform, title, url, difficulty, display_order) VALUES
('trie_structure',          'LeetCode', 'Implement Trie (Prefix Tree)',                    'https://leetcode.com/problems/implement-trie-prefix-tree/',                    'Medium', 1),

('trie_lookup_complexity',  'LeetCode', 'Implement Trie (Prefix Tree)',                    'https://leetcode.com/problems/implement-trie-prefix-tree/',                    'Medium', 1),

('trie_end_marker',         'LeetCode', 'Implement Trie (Prefix Tree)',                    'https://leetcode.com/problems/implement-trie-prefix-tree/',                    'Medium', 1),

('trie_memory_tradeoff',    'LeetCode', 'Design Add and Search Words Data Structure',      'https://leetcode.com/problems/design-add-and-search-words-data-structure/',    'Medium', 1),

('trie_applications',       'LeetCode', 'Design Add and Search Words Data Structure',      'https://leetcode.com/problems/design-add-and-search-words-data-structure/',    'Medium', 1),
('trie_applications',       'LeetCode', 'Word Search II',                                  'https://leetcode.com/problems/word-search-ii/',                                'Hard',   2);

UPDATE concepts SET real_world_example = 'A phone''s predictive text, where "CA" and "CAT" share the same starting path since they share the same first two letters.' WHERE id = 'trie_structure';
UPDATE concepts SET real_world_example = 'Checking whether a username is taken takes about the same time whether the system has a thousand usernames or a million, since it only depends on the length of the name typed.' WHERE id = 'trie_lookup_complexity';
UPDATE concepts SET real_world_example = 'A dictionary app needing to tell "car" (a real word) apart from "ca" (just the start of "car" and "cat", not a word on its own).' WHERE id = 'trie_end_marker';
UPDATE concepts SET real_world_example = 'Why a spell-checker with only a handful of short words might take up more memory as a trie than as a plain list, since every branch reserves room for letters that never get used.' WHERE id = 'trie_memory_tradeoff';
UPDATE concepts SET real_world_example = 'A search bar''s autocomplete, suggesting every stored query that starts with what you''ve typed so far.' WHERE id = 'trie_applications';

-- VERIFICATION QUERY — expect 5 rows, problem_count 1 or 2, has_example = true on all
SELECT c.id, c.name,
       (SELECT count(*) FROM concept_practice_problems p WHERE p.concept_id = c.id) AS problem_count,
       (c.real_world_example IS NOT NULL) AS has_example
FROM concepts c
WHERE c.topic_id = 'tries'
ORDER BY c.display_order;
