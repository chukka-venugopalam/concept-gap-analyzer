-- Seed the Tries topic: topic row, 5 concepts, prerequisites, misconceptions,
-- fallback probes.
--
-- SV-OS provides ONE node (d3-06-tries) for this topic. Its summary and all
-- 4 common_mistakes cover 4 distinct sub-ideas (structure, O(L) complexity,
-- end-of-word marker, memory tradeoff) — split into their own concepts
-- below. A 5th concept, Prefix Matching and Autocomplete, is drawn directly
-- from a specific sentence in the SV-OS summary itself ("well suited for
-- autocomplete and prefix-matching, since all strings sharing a prefix live
-- under the same subtree"), not separately invented.
--
-- All 4 of SV-OS's common_mistakes for this node are used, one per the
-- concept they actually describe.

INSERT INTO topics (id, name, description, display_order, concept_count) VALUES
('tries',
 'Tries',
 'Prefix trees for efficient string storage, lookup, and prefix matching',
 7, 5);

INSERT INTO concepts (id, topic_id, name, definition, importance_weight, canonical_keywords, display_order) VALUES

('trie_structure','tries',
 'Trie Structure',
 'A trie (prefix tree) stores strings character by character along root-to-node paths rather than as whole-string keys, so every node represents a shared prefix and strings with common prefixes share the same nodes.',
 3,
 ARRAY['trie','prefix tree','character by character','shared prefix','node per character'],1),

('trie_lookup_complexity','tries',
 'O(L) Lookup and Insert',
 'Looking up, inserting, or checking whether a string exists in a trie takes O(L) time, where L is the length of the string itself, independent of how many other strings are already stored.',
 3,
 ARRAY['O(L)','lookup time','insert time','independent of size','string length'],2),

('trie_end_marker','tries',
 'End-of-Word Marker',
 'Each trie node needs an explicit marker distinguishing a complete stored word from a node that is merely an intermediate prefix of a longer word, since the path structure alone cannot tell them apart.',
 3,
 ARRAY['end of word','is_word flag','word marker','complete word vs prefix'],3),

('trie_memory_tradeoff','tries',
 'Memory Tradeoffs',
 'Even though trie operations are fast, each node reserves space for many possible next characters, so a trie storing few strings with little shared prefix structure can use considerably more memory than a simple hash set.',
 2,
 ARRAY['memory usage','space tradeoff','node overhead','hash set comparison'],4),

('trie_applications','tries',
 'Prefix Matching and Autocomplete',
 'Because all strings sharing a prefix live under the same subtree, tries are especially well suited to autocomplete and prefix-matching tasks, where you need every stored string starting with a given prefix.',
 2,
 ARRAY['autocomplete','prefix matching','prefix search','subtree of a prefix'],5);

INSERT INTO concept_prerequisites VALUES
('trie_lookup_complexity',  'trie_structure'),
('trie_end_marker',         'trie_structure'),
('trie_memory_tradeoff',    'trie_structure'),
('trie_applications',       'trie_lookup_complexity');

INSERT INTO concept_misconceptions (concept_id, misconception, correction, trigger_phrases) VALUES

('trie_structure',
 'Confusing a trie''s node-per-character structure with a node-per-string structure.',
 'A trie shares nodes across strings with common prefixes, so the total node count is not simply proportional to the number of strings stored — it depends on how much those strings share.',
 ARRAY['one node per string','node count equals string count','separate path per word']),

('trie_lookup_complexity',
 'Assuming trie insertion time depends on how many other strings are already stored.',
 'Insertion is O(L), determined only by the length of the string being inserted — not by how large the trie already is.',
 ARRAY['depends on trie size','slower with more strings','scales with stored words']),

('trie_end_marker',
 'Forgetting to mark the end of a complete word distinctly from an intermediate prefix node.',
 'Without an explicit end-of-word marker, a trie cannot distinguish whether "CAR" is a stored word or just a prefix of "CARD".',
 ARRAY['no need for a marker','path alone tells you','prefix is the same as a word']),

('trie_memory_tradeoff',
 'Assuming a trie''s speed advantage means it is always more memory-efficient than alternatives.',
 'Even though operations are fast (O(L)), each node can need space for many possible next characters, so a trie storing few strings with little shared prefix structure can use more memory than a hash set.',
 ARRAY['always more memory efficient','faster means less memory','better than a hash set']);

INSERT INTO fallback_probes (topic_id, question, probe_order) VALUES
('tries',
 'You mentioned tries — how does storing strings character by character let a trie share memory between words with a common prefix?',
 1),
('tries',
 'Why does trie lookup take O(L) time regardless of how many other strings are already stored, unlike a hash set lookup?',
 2),
('tries',
 'How would a trie distinguish whether "CAR" is a complete stored word or just a prefix of "CARD"?',
 3);
