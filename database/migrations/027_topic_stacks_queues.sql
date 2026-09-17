-- Migration 027: Stacks & Queues — core topic definition
-- Matches existing schema exactly (checked against 001_initial_schema.sql
-- and the real Linked Lists seed for format/style before writing this).
-- Resources, practice problems, and real-world examples are a SEPARATE
-- follow-up pass (same two-phase pattern this repo already uses: seed_X
-- migrations are followed by separate seed_concept_resources_X ones) —
-- those need individual live-search verification the same way 021-026 did,
-- not something to guess into this file.

INSERT INTO topics (id, name, description, display_order) VALUES
('stacks_queues', 'Stacks & Queues', 'LIFO/FIFO structures, monotonic stacks and deques, and stack-based parsing', 8);

INSERT INTO concepts
  (id, topic_id, name, definition, proficiency_level, importance_weight, canonical_keywords, display_order)
VALUES
('sq_stack_basics', 'stacks_queues',
 'Stack (LIFO)',
 'A linear structure where the most recently added element is the first removed. Push and pop both operate on the same end (the top) in O(1), whether backed by an array or a linked list.',
 'beginner', 3,
 ARRAY['stack','LIFO','push','pop','peek','last in first out'], 1),

('sq_queue_basics', 'stacks_queues',
 'Queue (FIFO)',
 'A linear structure where the first element added is the first removed. Enqueue adds at the back, dequeue removes from the front. A plain array needs a circular buffer or head/tail index pair to keep both operations O(1).',
 'beginner', 3,
 ARRAY['queue','FIFO','enqueue','dequeue','first in first out','circular buffer'], 2),

('sq_queue_via_stacks', 'stacks_queues',
 'Queue via Two Stacks',
 'Implementing FIFO behavior using two LIFO stacks: an input stack absorbs new elements, and elements only transfer to the output stack (reversing their order) when the output stack is empty and a dequeue is needed.',
 'interview', 2,
 ARRAY['two stacks','queue using stacks','amortized','input stack','output stack'], 3),

('sq_monotonic_stack', 'stacks_queues',
 'Monotonic Stack',
 'A stack kept in strictly increasing or decreasing order by popping elements that violate the order before pushing a new one. Used to find, for each element, the next greater or smaller element in O(n) total instead of O(n^2).',
 'interview', 3,
 ARRAY['monotonic stack','next greater element','next smaller element','increasing stack','decreasing stack'], 4),

('sq_monotonic_deque', 'stacks_queues',
 'Monotonic Deque',
 'A double-ended queue that maintains monotonic order like a monotonic stack, but also evicts from the front when the oldest index falls outside a sliding window. The front always holds the current window''s max (or min).',
 'advanced', 2,
 ARRAY['monotonic deque','sliding window maximum','deque','double ended queue'], 5),

('sq_expression_parsing', 'stacks_queues',
 'Expression Parsing with Stacks',
 'Using one or more stacks to evaluate expressions with nested parentheses and operator precedence — tracking pending operators and operands so multiplication/division resolve before addition/subtraction.',
 'interview', 2,
 ARRAY['expression evaluation','operator precedence','calculator','nested parentheses','postfix'], 6),

('sq_string_stack_processing', 'stacks_queues',
 'Stack-Based String Processing',
 'Processing a string character by character, pushing or popping based only on the current character and whatever is currently on top of the stack — no lookahead or full-string knowledge required. Used for duplicate removal and nested-encoding problems.',
 'interview', 2,
 ARRAY['string stack','duplicate removal','decode string','character by character'], 7);

INSERT INTO concept_prerequisites (concept_id, prerequisite_id) VALUES
('sq_queue_via_stacks', 'sq_stack_basics'),
('sq_queue_via_stacks', 'sq_queue_basics'),
('sq_monotonic_stack', 'sq_stack_basics'),
('sq_monotonic_deque', 'sq_monotonic_stack'),
('sq_monotonic_deque', 'sq_queue_basics'),
('sq_expression_parsing', 'sq_stack_basics'),
('sq_string_stack_processing', 'sq_stack_basics');

INSERT INTO concept_misconceptions
  (concept_id, misconception, correction, trigger_phrases)
VALUES
('sq_stack_basics',
 'Stack push/pop are O(n) because elements need to shift',
 'Push and pop both happen at the top only — an array-backed stack appends/removes at the end, a linked-list-backed stack adds/removes at the head. Neither needs to shift anything, so both are O(1).',
 ARRAY['O(n)','shift elements','shifting','have to move']),

('sq_queue_basics',
 'A plain array gives O(1) dequeue from the front',
 'Removing from the front of a plain array means every remaining element shifts left, making it O(n). True O(1) dequeue needs a circular buffer or a separate head index instead of physically removing index 0.',
 ARRAY['O(1) dequeue','array queue','front of array','remove from front']),

('sq_queue_via_stacks',
 'Every enqueue/dequeue call moves elements between both stacks',
 'Elements only transfer from the input stack to the output stack when the output stack is empty and a dequeue happens. Across many operations this amortizes to O(1) per call, not O(n) every time.',
 ARRAY['every operation','both stacks every time','transfer every time','always moves']),

('sq_monotonic_stack',
 'A monotonic stack holds the full history of elements seen so far, in order',
 'Elements get popped and discarded the moment they violate the monotonic property against the incoming element. The stack only ever holds elements still "waiting" for their next greater/smaller value — not a complete sorted record.',
 ARRAY['keeps everything','full history','permanent record','sorted order']),

('sq_monotonic_deque',
 'The front of the deque always holds the oldest index in the window',
 'The front holds whichever index currently has the maximum (or minimum) value for the pattern being solved — not simply the oldest one. Indices are evicted from the front only once they fall outside the window, separately from the monotonic-order eviction at the back.',
 ARRAY['oldest index','oldest element','front is oldest']),

('sq_expression_parsing',
 'Operators can be evaluated strictly left to right',
 'Left-to-right evaluation breaks operator precedence — multiplication and division must resolve before addition and subtraction. A correct approach uses a stack to hold pending values until precedence allows evaluation, or converts to postfix first.',
 ARRAY['left to right','ignore precedence','process in order','evaluate as you go']),

('sq_string_stack_processing',
 'You need the full string length up front to decide what to push or pop',
 'These problems process one character at a time — the decision to push or pop depends only on the current character and the current top of the stack, never on lookahead or the string''s total length.',
 ARRAY['need full string','know the length','look ahead','see the whole string']);

INSERT INTO fallback_probes (topic_id, probe_text, display_order) VALUES
('stacks_queues',
 'You mentioned stacks or queues — can you explain when you''d reach for a monotonic stack instead of a regular one?',
 1),
('stacks_queues',
 'Walk me through implementing a queue using two stacks. Which stack do elements move to, and exactly when?',
 2),
('stacks_queues',
 'What''s the time complexity difference between an array-backed and a linked-list-backed stack or queue, and why does it differ?',
 3);
