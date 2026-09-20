-- Migration 065: Phase 4 — design-question interview backfill
-- LRU Cache, LFU Cache, and Min Stack are consistently among the most
-- frequently reported "design a data structure" interview questions,
-- and had zero interview_questions rows anywhere in this schema before
-- this migration (checked via grep). These are algorithms/DS questions,
-- not System Design (HLD) — explicitly kept in scope per the original
-- gap analysis. Tied to existing concepts rather than new ones:
-- hash_map_basics for the two caches (the O(1) lookup is the hash
-- map's job; eviction order is a doubly linked list detail covered
-- inside the question itself), sq_stack_basics for Min Stack.
-- Follows the 046-style single-INSERT convention, same as 055/064.
-- display_order continues from 52 (confirmed via the same parsing
-- check as prior migrations) -> 53-55.
-- LeetCode #146/#460/#155 confirmed via search corroboration (official
-- LeetCode problem statement text for #146 appeared directly in
-- results) on 2026-09-18, not from memory alone.

INSERT INTO interview_questions
  (concept_id, question_type, company, prompt, difficulty, company_note, reference_notes,
   opening_prompt, hint_ladder, expected_follow_ups, optimal_complexity, rubric_dimensions, display_order)
VALUES

('hash_map_basics', 'coding', 'Amazon',
 'LRU Cache (https://leetcode.com/problems/lru-cache/) — design a cache with get and put in O(1), evicting the least recently used entry when full.',
 'Medium',
 'One of the most consistently reported "design a data structure" questions across almost every major company — the key signal is recognizing which two structures need to be combined, not just implementing either alone.',
 'A hash map gives O(1) key lookup, but by itself has no sense of usage order. A doubly linked list gives O(1) removal/insertion at any position given a node reference, which a singly linked list cannot do — combine them: the hash map stores key -> node, and the list orders nodes from least to most recently used.',
 'A hash map alone gives you O(1) lookup. What is it missing that this problem also needs?',
 '["If you tried to track usage order with just a hash map, what operation would become slow?", "Why does the linked list specifically need to be DOUBLY linked, rather than singly linked, for O(1) removal?", "On a get() call, what needs to happen to the accessed node''s position in the list, and why?"]',
 '[{"trigger":"after_first_working_solution","question":"Can you do the same for LFU Cache, which evicts by frequency of use instead of recency?"}]',
 'O(1) time for both get and put, O(capacity) space',
 '[{"dimension":"two_structures_combined","description":"Did they identify that a hash map alone cannot track usage order, and reach for a doubly linked list to fix that specifically?"},{"dimension":"doubly_linked_justified","description":"Could they explain why a DOUBLY linked list is required for O(1) removal of an arbitrary node, not just a singly linked one?"},{"dimension":"updates_order_on_both_ops","description":"Did their solution correctly move a node to the most-recently-used position on BOTH get and put, not just put?"}]',
 53),

('hash_map_basics', 'coding', 'Google',
 'LFU Cache (https://leetcode.com/problems/lfu-cache/) — design a cache with get and put in O(1), evicting the least frequently used entry when full, breaking ties by least recently used.',
 'Hard',
 'Often used as a harder follow-up once a candidate has solved LRU Cache, specifically to see whether they can generalize the hash-map-plus-linked-list idea to a second dimension (frequency) rather than starting from scratch.',
 'Track three things: key -> (value, frequency), frequency -> a doubly linked list of keys at that frequency (ordered by recency within the tie), and the current minimum frequency present in the cache, updated whenever it could change.',
 'This is like LRU Cache but with an extra dimension — what is that extra thing you now need to track per key?',
 '["Beyond key -> value, what additional piece of information does every entry now need?", "If two keys have the same frequency, how do you decide which one to evict first?", "Why is it worth maintaining a running ''minimum frequency'' variable instead of scanning for it each time an eviction is needed?"]',
 '[{"trigger":"if_scans_for_min_freq","question":"Scanning for the minimum frequency each eviction works, but what does that cost you compared to tracking it as you go?"}]',
 'O(1) time for both get and put, O(capacity) space',
 '[{"dimension":"frequency_tracked","description":"Did they correctly track frequency per key, distinct from recency, and increment it on both get and put?"},{"dimension":"tie_break_correct","description":"Did they correctly break frequency ties using recency (a doubly linked list per frequency bucket), rather than an arbitrary choice?"},{"dimension":"min_frequency_maintained","description":"Did they maintain the minimum frequency incrementally rather than recomputing it by scanning on every eviction?"}]',
 54),

('sq_stack_basics', 'coding', 'Apple',
 'Min Stack (https://leetcode.com/problems/min-stack/) — design a stack that supports push, pop, top, and retrieving the minimum element, all in O(1).',
 'Easy',
 'A common design warm-up used to check whether a candidate defaults to re-scanning the stack for the minimum (O(n)) before being prompted to find the O(1) approach.',
 'Maintain a second stack alongside the main one that tracks the minimum seen so far at each point — push the new minimum (current value if it is smaller, otherwise the previous minimum again) onto this second stack every time you push onto the main one, and pop both together.',
 'What is the O(n) way to find the minimum first, before we optimize it?',
 '["If you push a second stack that mirrors the main one but tracks ''the minimum so far'', what should you push onto it every time you push onto the main stack?", "Why does popping BOTH stacks together, not just the main one, keep the minimum stack correct?", "Could you solve this with only one stack, by storing pairs of (value, current minimum) instead of two separate stacks?"]',
 '[{"trigger":"if_only_onscan_given","question":"That works but is O(n) per getMin call — can you make getMin O(1) as well, using extra space if needed?"}]',
 'O(1) time for push, pop, top, and getMin; O(n) space for the auxiliary minimum-tracking stack',
 '[{"dimension":"min_tracked_per_push","description":"Did they correctly push a running minimum value onto the auxiliary stack on every push to the main stack, not just when a new minimum occurs?"},{"dimension":"pops_together","description":"Did they pop from both stacks together on every pop, keeping the two stacks in sync?"},{"dimension":"achieves_O1","description":"Did they arrive at true O(1) for getMin, rather than settling for an O(n) scan?"}]',
 55);

-- VERIFICATION QUERY — expect 3 rows, display_order 53-55
SELECT concept_id, question_type, company, difficulty, display_order,
       (opening_prompt IS NOT NULL) AS has_opening_prompt,
       (hint_ladder IS NOT NULL) AS has_hints,
       (rubric_dimensions IS NOT NULL) AS has_rubric
FROM interview_questions
WHERE display_order BETWEEN 53 AND 55
ORDER BY display_order;
