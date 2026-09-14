-- Migration 047: Linked Lists misconception depth pass
-- Only ll_singly and ll_cycle had misconceptions before this (2 for 10
-- concepts). Adding the missing 8 to bring every concept to at least
-- one, matching the 1-per-concept baseline every topic built this
-- session already has.

INSERT INTO concept_misconceptions
  (concept_id, misconception, correction, trigger_phrases)
VALUES

('ll_node',
 'A linked list node must contain a "previous" reference to work correctly',
 'A basic node only needs data plus a reference to the NEXT node. A "previous" reference is what makes a list doubly linked, not a requirement of a node in general — singly linked lists work perfectly well with just a next pointer.',
 ARRAY['needs previous','must have previous','requires backward reference']),

('ll_doubly',
 'A doubly linked list is just a singly linked list with extra memory overhead and no real benefit',
 'The previous pointer enables O(1) backward traversal and O(1) removal of a known node without first finding its predecessor — real benefits for structures like an LRU cache or browser history that a singly linked list cannot provide efficiently.',
 ARRAY['no real benefit','just extra memory','waste of memory']),

('ll_traversal',
 'Traversing a linked list to find its length is O(1), like an array''s length property',
 'Unlike an array, a linked list has no stored length by default. Finding the length requires walking the entire list — O(n) — unless a separate length counter is maintained alongside insertions and deletions.',
 ARRAY['O(1) length','constant time length','like .length']),

('ll_insertion',
 'Inserting into a linked list is always O(1) regardless of position',
 'Inserting at a node you already have a reference to (like the head) is O(1), but inserting at an arbitrary position (like "the 5th element") requires first traversing to that position, which is O(n).',
 ARRAY['always O(1)','insertion is constant','O(1) anywhere']),

('ll_deletion',
 'Deleting a node just means removing it from memory directly',
 'Deleting a node means updating the PREVIOUS node''s next pointer to skip over it — you need a reference to the node BEFORE the one being deleted, not just the node itself, or the list cannot be reconnected.',
 ARRAY['just remove it','delete the node directly','remove from memory']),

('ll_fast_slow',
 'The fast pointer must move exactly twice as fast as the slow pointer for this technique to work',
 'Moving the fast pointer 2 steps for every 1 step of the slow pointer is the standard choice for cycle detection and finding the middle, but the core idea only requires the fast pointer to move faster — other ratios can work for different problems.',
 ARRAY['must be exactly twice','only works with 2x','has to be double speed']),

('ll_reversal',
 'Reversing a linked list requires extra space to store the reversed order',
 'A linked list can be reversed in-place in O(1) extra space by iterating through and flipping each node''s next pointer to point backward, using only a few temporary pointer variables — no new list or array is needed.',
 ARRAY['needs extra space','requires a new list','needs additional memory']),

('ll_dummy_node',
 'A dummy node changes the final answer or result of the algorithm',
 'A dummy node is purely a coding convenience that simplifies edge-case handling (like deleting the head) by giving every real node a consistent predecessor — it is discarded before returning the result and never affects the actual answer.',
 ARRAY['changes the answer','part of the result','affects the output']);

-- VERIFICATION QUERY — expect 10 rows, each concept with count 1 or 2
-- (ll_singly and ll_cycle should show 2, since they already had one)
SELECT c.id, c.name,
       (SELECT count(*) FROM concept_misconceptions WHERE concept_id = c.id) AS misconception_count
FROM concepts c
WHERE c.topic_id = 'linked_lists'
ORDER BY c.display_order;
