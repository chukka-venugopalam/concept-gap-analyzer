INSERT INTO concepts
  (id, topic_id, name, definition,
   importance_weight, canonical_keywords,
   display_order)
VALUES
('arr_indexing','arrays_hashing',
 'Array Indexing',
 'Accessing elements by position in O(1) using zero-based index',
 3,
 ARRAY['index','position','zero-based','O(1)','random access'],1),

('arr_dynamic','arrays_hashing',
 'Dynamic Arrays',
 'Arrays that resize automatically when capacity exceeded, typically doubling in size',
 2,
 ARRAY['resize','dynamic','ArrayList','amortized','capacity','doubling'],2),

('arr_two_pointer','arrays_hashing',
 'Two Pointer Technique',
 'Two indices moving toward each other or same direction to solve array problems in O(n)',
 3,
 ARRAY['two pointer','left right','converging','sliding','O(n)'],3),

('arr_sliding_window','arrays_hashing',
 'Sliding Window',
 'Maintaining a subarray window that slides across array to track running computation',
 3,
 ARRAY['sliding window','window','subarray','fixed size','variable size'],4),

('arr_prefix_sum','arrays_hashing',
 'Prefix Sum',
 'Precomputed cumulative sums enabling O(1) range sum queries after O(n) preprocessing',
 2,
 ARRAY['prefix sum','cumulative','range query','preprocessing','running sum'],5),

('hash_map_basics','arrays_hashing',
 'Hash Map Basics',
 'Key-value store with O(1) average insert, lookup, delete using hash function',
 3,
 ARRAY['hash map','dictionary','key value','O(1)','lookup','hash table'],6),

('hash_collision','arrays_hashing',
 'Hash Collision Handling',
 'Resolving two keys mapping to same bucket via chaining or open addressing',
 2,
 ARRAY['collision','chaining','open addressing','linear probing','bucket'],7),

('hash_set','arrays_hashing',
 'Hash Set',
 'Collection of unique elements with O(1) membership testing using hashing',
 3,
 ARRAY['hash set','set','unique','membership','contains','O(1)'],8),

('arr_sorting','arrays_hashing',
 'Sorting Fundamentals',
 'Arranging elements in order; knowing when to use sort as first step in array problems',
 2,
 ARRAY['sort','sorted','order','ascending','descending','nlogn'],9),

('arr_kadane','arrays_hashing',
 'Kadane Algorithm',
 'Finding maximum subarray sum in O(n) by tracking current and global maximum',
 2,
 ARRAY['kadane','maximum subarray','max sum','current max','global max'],10);

INSERT INTO concept_prerequisites VALUES
('arr_sliding_window', 'arr_two_pointer'),
('arr_prefix_sum',     'arr_indexing'),
('hash_collision',     'hash_map_basics'),
('hash_set',           'hash_map_basics'),
('arr_kadane',         'arr_sliding_window');

INSERT INTO concept_misconceptions
  (concept_id, misconception, correction,
   trigger_phrases)
VALUES
('hash_map_basics',
 'Hash maps are always O(1) in all cases',
 'O(1) is average case. Worst case is O(n) due to hash collisions causing all keys to land in same bucket',
 ARRAY['always O(1)','guaranteed O(1)','always constant']),

('arr_two_pointer',
 'Two pointer only works on sorted arrays',
 'Two pointer works on unsorted arrays too, especially for sliding window problems. Sorting requirement depends on the problem.',
 ARRAY['only sorted','must be sorted','requires sorted']),

('arr_sliding_window',
 'Sliding window always has fixed size',
 'Sliding window can be variable size. Variable windows expand and shrink based on conditions.',
 ARRAY['always fixed','fixed size only','constant size']);
