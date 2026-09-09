-- ============================================================
-- WARNING — DO NOT RUN THIS FILE AGAINST SUPABASE.
-- Every statement below has ALREADY been executed in production
-- (verified via screenshots throughout this project). This file
-- exists ONLY to give git a single, accurate historical record of
-- what was already applied — running it again will fail on
-- duplicate primary keys (topics.id, concepts.id) or silently
-- duplicate rows wherever no unique constraint catches it.
-- If the database ever needs to be rebuilt from scratch, this file
-- is safe to run then — but never against the current live database.
-- ============================================================
--
-- Migration 045: Consolidated catch-up — everything run in Supabase
-- but not yet committed to git, plus the two new topic extensions.
-- This is a straight concatenation of the exact files already verified
-- against Supabase — nothing in the individual sections below has
-- been rewritten or regenerated. Order preserved exactly for
-- dependency correctness. Excludes 041 (already committed separately).

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
-- Migration 028: Stacks & Queues — practice problems + real-world examples
-- All URLs individually verified via live search on 2026-09-05 (LeetCode only)

INSERT INTO concept_practice_problems (concept_id, platform, title, url, difficulty, display_order) VALUES
('sq_stack_basics',           'LeetCode', 'Valid Parentheses',                        'https://leetcode.com/problems/valid-parentheses/',                        'Easy',   1),

('sq_queue_basics',           'LeetCode', 'Design Circular Queue',                    'https://leetcode.com/problems/design-circular-queue/',                    'Medium', 1),
('sq_queue_basics',           'LeetCode', 'Number of Recent Calls',                   'https://leetcode.com/problems/number-of-recent-calls/',                   'Easy',   2),

('sq_queue_via_stacks',       'LeetCode', 'Implement Queue using Stacks',             'https://leetcode.com/problems/implement-queue-using-stacks/',             'Easy',   1),

('sq_monotonic_stack',        'LeetCode', 'Daily Temperatures',                       'https://leetcode.com/problems/daily-temperatures/',                       'Medium', 1),
('sq_monotonic_stack',        'LeetCode', 'Next Greater Element I',                   'https://leetcode.com/problems/next-greater-element-i/',                   'Easy',   2),

('sq_monotonic_deque',        'LeetCode', 'Sliding Window Maximum',                   'https://leetcode.com/problems/sliding-window-maximum/',                   'Hard',   1),

('sq_expression_parsing',     'LeetCode', 'Basic Calculator II',                      'https://leetcode.com/problems/basic-calculator-ii/',                      'Medium', 1),

('sq_string_stack_processing','LeetCode', 'Decode String',                            'https://leetcode.com/problems/decode-string/',                            'Medium', 1),
('sq_string_stack_processing','LeetCode', 'Remove All Adjacent Duplicates In String', 'https://leetcode.com/problems/remove-all-adjacent-duplicates-in-string/', 'Easy',   2);

UPDATE concepts SET real_world_example = 'A stack of plates in a cafeteria — you can only take the top one, and new plates get added to the top too.' WHERE id = 'sq_stack_basics';
UPDATE concepts SET real_world_example = 'A checkout line at a store — the first person in line gets served first, and new customers join at the back.' WHERE id = 'sq_queue_basics';
UPDATE concepts SET real_world_example = 'A dish station with only two bins — dirty dishes pile into one, and only get flipped into a second bin when someone needs a clean one, which reverses their order back to first-washed-first-served.' WHERE id = 'sq_queue_via_stacks';
UPDATE concepts SET real_world_example = 'A stock-tracking app finding, for each day, the next day the price was higher — checked against a running list of days still "waiting" for a higher price.' WHERE id = 'sq_monotonic_stack';
UPDATE concepts SET real_world_example = 'A delivery app showing the highest-rated restaurant within your current radius as you drive, updating live without re-scanning every restaurant on every move.' WHERE id = 'sq_monotonic_deque';
UPDATE concepts SET real_world_example = 'A spreadsheet correctly evaluating "3 + 4 * 2" as 11, not 14, by respecting operator precedence the way a calculator does.' WHERE id = 'sq_expression_parsing';
UPDATE concepts SET real_world_example = 'A video game''s compressed level-encoding format expanding "3[AB]" into "ABABAB" on load.' WHERE id = 'sq_string_stack_processing';

-- VERIFICATION QUERY — expect 7 rows, problem_count 1 or 2, has_example = true on all
SELECT c.id, c.name,
       (SELECT count(*) FROM concept_practice_problems p WHERE p.concept_id = c.id) AS problem_count,
       (c.real_world_example IS NOT NULL) AS has_example
FROM concepts c
WHERE c.topic_id = 'stacks_queues'
ORDER BY c.display_order;
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
-- Migration 030: Patterns — core topic definition
-- The 6 patterns from the canonical 16-pattern list with no home anywhere
-- else in CIP (Two Pointers, Sliding Window, Fast&Slow, In-place Reversal,
-- Tree BFS/DFS, Top K, 0/1 Knapsack, Topological Sort are already covered
-- elsewhere — checked before scoping this file, not assumed).
-- Same two-phase pattern as 027/029: resources/practice problems/examples
-- are a separate verified follow-up pass.

INSERT INTO topics (id, name, description, display_order) VALUES
('patterns', 'Patterns', 'Algorithmic strategy patterns not tied to one specific data structure: intervals, cyclic sort, two heaps, backtracking, and search/merge variants', 10);

INSERT INTO concepts
  (id, topic_id, name, definition, proficiency_level, importance_weight, canonical_keywords, display_order)
VALUES
('pat_merge_intervals', 'patterns',
 'Merge Intervals',
 'Sorting a set of intervals by start time, then merging any that overlap into a single combined interval. Fundamental for scheduling-style problems.',
 'beginner', 2,
 ARRAY['merge intervals','overlapping intervals','sort by start time','interval scheduling'], 1),

('pat_cyclic_sort', 'patterns',
 'Cyclic Sort',
 'Placing each number directly at its correct index in-place, when the numbers are known to fall within a fixed range like 1 to n. Finds missing or duplicate numbers without extra space.',
 'interview', 2,
 ARRAY['cyclic sort','correct index','missing number','duplicate number','1 to n range'], 2),

('pat_two_heaps', 'patterns',
 'Two Heaps',
 'Maintaining a max-heap for the smaller half of a data stream and a min-heap for the larger half, keeping both balanced so the median is always available at the top of one heap.',
 'interview', 2,
 ARRAY['two heaps','running median','max heap min heap','balance heaps'], 3),

('pat_subsets_backtracking', 'patterns',
 'Subsets & Backtracking',
 'Exploring all possible combinations or subsets by making a choice, recursing, then undoing that choice before trying the next option — building up and tearing down partial solutions, pruning branches that can''t lead anywhere useful.',
 'interview', 3,
 ARRAY['backtracking','subsets','combinations','choose and unchoose','recursion tree'], 4),

('pat_modified_binary_search', 'patterns',
 'Modified Binary Search',
 'Binary searching over a monotonic answer space rather than a sorted array directly — the input itself may be unsorted, but a feasibility check at each candidate answer determines which half to search next.',
 'interview', 3,
 ARRAY['binary search on answer','modified binary search','monotonic answer','feasibility check'], 5),

('pat_kway_merge', 'patterns',
 'K-way Merge',
 'Merging K sorted lists or arrays into one by keeping a heap of the current front element from each list, always extracting the smallest and advancing that list.',
 'interview', 2,
 ARRAY['k-way merge','merge k sorted lists','heap of fronts','merge multiple lists'], 6);

-- No internal prerequisites: these 6 are largely independent strategies
-- rather than a dependency chain — not forcing relationships that aren't
-- really there.

INSERT INTO concept_misconceptions
  (concept_id, misconception, correction, trigger_phrases)
VALUES
('pat_merge_intervals',
 'Every interval needs to be checked against every other interval to find overlaps',
 'Sorting by start time first means only adjacent intervals need comparing — check each interval against just the last-merged one, avoiding an O(n^2) all-pairs check entirely.',
 ARRAY['check every pair','compare all intervals','all pairs']),

('pat_cyclic_sort',
 'Cyclic sort is just a variant of regular comparison-based sorting',
 'Cyclic sort never compares elements to each other — it uses each number''s value directly as the index it belongs at, which only works because the numbers are known to fall in a specific range like 1 to n, not because of comparison logic.',
 ARRAY['comparison sort variant','compares elements','like regular sorting']),

('pat_two_heaps',
 'A single heap is enough to track a running median',
 'One heap gives efficient access to a min or a max, but the median needs the top of the lower half AND the top of the upper half simultaneously — that requires two balanced heaps, not one.',
 ARRAY['one heap enough','single heap median','just need a heap']),

('pat_subsets_backtracking',
 'Backtracking always explores every possible combination with no way to skip bad paths early',
 'The actual power of backtracking is pruning — abandoning a partial choice the moment it''s known to be invalid or worse than an already-found solution, rather than exhaustively completing every branch.',
 ARRAY['explores everything','no pruning','always full exploration']),

('pat_modified_binary_search',
 'Binary search only works when the input array itself is sorted',
 'This pattern binary-searches over the space of possible answers, not the input. The input doesn''t need to be sorted at all, as long as the answer''s feasibility is monotonic across the search space.',
 ARRAY['array must be sorted','input needs sorting','only sorted arrays']),

('pat_kway_merge',
 'Merging K sorted lists means comparing all K front elements against each other on every single step',
 'A heap of size K makes each step only O(log K) to extract the minimum and insert the next element — not a fresh O(K) comparison across every list''s front element each time.',
 ARRAY['compare all k','check every list','linear comparison each step']);

INSERT INTO fallback_probes (topic_id, question, probe_order) VALUES
('patterns',
 'You mentioned interval or scheduling problems — why does sorting by start time first make merging overlaps so much simpler?',
 1),
('patterns',
 'Walk me through why cyclic sort places numbers at specific indices instead of comparing them to each other.',
 2),
('patterns',
 'How would you track a running median as numbers stream in, and why does that need two heaps instead of one?',
 3);
-- Migration 031: Resource links for Stacks & Queues
-- All URLs individually verified via live search on 2026-09-05

INSERT INTO concept_resources (concept_id, title, url) VALUES
('sq_stack_basics', 'Introduction to Stack Data Structure', 'https://www.geeksforgeeks.org/dsa/introduction-to-stack-data-structure-and-algorithm-tutorials/'),
('sq_stack_basics', 'Stack Data Structure', 'https://www.geeksforgeeks.org/dsa/stack-data-structure/'),

('sq_queue_basics', 'Queue Data Structure', 'https://www.geeksforgeeks.org/dsa/queue-data-structure/'),

('sq_queue_via_stacks', 'Implement Queue using Stacks', 'https://www.geeksforgeeks.org/dsa/queue-using-stacks/'),

('sq_monotonic_stack', 'Introduction to Monotonic Stack', 'https://www.geeksforgeeks.org/dsa/introduction-to-monotonic-stack-2/'),
('sq_monotonic_stack', 'How to Identify and Solve Monotonic Stack Problems', 'https://www.geeksforgeeks.org/dsa/how-to-identify-and-solve-monotonic-stack-problems/'),

('sq_monotonic_deque', 'Deque: Introduction and Applications', 'https://www.geeksforgeeks.org/deque-set-1-introduction-applications/'),

('sq_expression_parsing', 'Infix Expression Evaluation', 'https://www.geeksforgeeks.org/dsa/expression-evaluation/'),
('sq_expression_parsing', 'Infix, Postfix and Prefix Notations', 'https://www.geeksforgeeks.org/dsa/infix-postfix-prefix-notation/'),

('sq_string_stack_processing', 'Stack Data Structure', 'https://www.geeksforgeeks.org/dsa/stack-data-structure/');

-- VERIFICATION QUERY — expect 7 rows, resource_count 1 or 2
SELECT c.id, c.name,
       (SELECT count(*) FROM concept_resources r WHERE r.concept_id = c.id) AS resource_count
FROM concepts c
WHERE c.topic_id = 'stacks_queues'
ORDER BY c.display_order;
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
-- Migration 034: Pattern reference index
-- New table: represents patterns from the canonical 16-pattern list that
-- are already fully covered as real concepts in OTHER topics. This lets
-- the Patterns topic display all 16 by name for completeness, while only
-- the 6 genuinely-new ones (in 030) are real diagnosable concepts here.
-- No duplicate diagnostic state for the same skill.

CREATE TABLE IF NOT EXISTS topic_pattern_references (
  id                 SERIAL PRIMARY KEY,
  topic_id           TEXT NOT NULL REFERENCES topics(id),
  pattern_name       TEXT NOT NULL,
  covered_concept_id TEXT NOT NULL REFERENCES concepts(id),
  display_order      INT DEFAULT 0
);

INSERT INTO topic_pattern_references (topic_id, pattern_name, covered_concept_id, display_order) VALUES
('patterns', 'Sliding Window',                  'arr_sliding_window', 1),
('patterns', 'Two Pointers',                    'arr_two_pointer',    2),
('patterns', 'Fast & Slow Pointers',             'll_fast_slow',       3),
('patterns', 'In-place Reversal of a LinkedList','ll_reversal',        4),
('patterns', 'Tree BFS',                         'bt_bfs',             5),
('patterns', 'Tree DFS',                         'bt_inorder',         6),
('patterns', 'Tree DFS',                         'bt_preorder',        6),
('patterns', 'Tree DFS',                         'bt_postorder',       6),
('patterns', 'Bitwise XOR',                      'bit_xor_properties', 7),
('patterns', 'Top ''K'' Elements',               'heap_priority_queue',8),
('patterns', '0/1 Knapsack',                     'dp_knapsack',        9),
('patterns', 'Topological Sort',                 'graph_topo',         10);

-- VERIFICATION QUERY — expect 12 rows (Tree DFS spans 3 concepts, the
-- other 8 pattern names map to 1 concept each: 8 + 3 + 1 = 12)
SELECT pattern_name, covered_concept_id
FROM topic_pattern_references
WHERE topic_id = 'patterns'
ORDER BY display_order;
-- Migration 035: Patterns — resources + practice problems + real-world examples
-- All URLs individually verified via live search on 2026-09-05

INSERT INTO concept_resources (concept_id, title, url) VALUES
('pat_merge_intervals',        'Merging Intervals',                    'https://www.geeksforgeeks.org/dsa/merging-intervals/'),
('pat_cyclic_sort',            'Missing Number in a Sorted Array',     'https://www.geeksforgeeks.org/dsa/find-the-missing-number-in-a-sorted-array/'),
('pat_two_heaps',              'Two Heaps: Min Heap & Max Heap — Median', 'https://medium.com/@stephen.joel/two-heaps-median-f28ebc1569d7'),
('pat_subsets_backtracking',   'Heap & Priority Queue and Backtracking Deep Dive', 'https://theskilledcoder.com/posts/dsa/heap-priority-queue'),
('pat_modified_binary_search', 'Koko Eating Bananas (Binary Search on Answer)', 'https://www.geeksforgeeks.org/dsa/koko-eating-bananas/'),
('pat_kway_merge',             'Heap Data Structure (includes K-way Merge)', 'https://www.geeksforgeeks.org/dsa/heap-data-structure/');

INSERT INTO concept_practice_problems (concept_id, platform, title, url, difficulty, display_order) VALUES
('pat_merge_intervals',        'LeetCode', 'Merge Intervals',                'https://leetcode.com/problems/merge-intervals/',                'Medium', 1),

('pat_cyclic_sort',            'LeetCode', 'Find All Duplicates in an Array','https://leetcode.com/problems/find-all-duplicates-in-an-array/','Medium', 1),
('pat_cyclic_sort',            'LeetCode', 'Find All Numbers Disappeared in an Array', 'https://leetcode.com/problems/find-all-numbers-disappeared-in-an-array/', 'Easy', 2),

('pat_two_heaps',              'LeetCode', 'Find Median from Data Stream',   'https://leetcode.com/problems/find-median-from-data-stream/',   'Hard',   1),

('pat_subsets_backtracking',   'LeetCode', 'Subsets',                        'https://leetcode.com/problems/subsets/',                        'Medium', 1),
('pat_subsets_backtracking',   'LeetCode', 'Permutations',                   'https://leetcode.com/problems/permutations/',                   'Medium', 2),

('pat_modified_binary_search', 'LeetCode', 'Koko Eating Bananas',            'https://leetcode.com/problems/koko-eating-bananas/',            'Medium', 1),

('pat_kway_merge',             'LeetCode', 'Merge k Sorted Lists',           'https://leetcode.com/problems/merge-k-sorted-lists/',           'Hard',   1);

UPDATE concepts SET real_world_example = 'A calendar app combining your 9-10am and 9:30-11am meetings into a single 9-11am busy block.' WHERE id = 'pat_merge_intervals';
UPDATE concepts SET real_world_example = 'A raffle with tickets numbered 1 to n, checking which numbers were never claimed by placing each sold ticket at its own numbered slot.' WHERE id = 'pat_cyclic_sort';
UPDATE concepts SET real_world_example = 'A live traffic app tracking the median commute time across thousands of drivers as new reports stream in every second.' WHERE id = 'pat_two_heaps';
UPDATE concepts SET real_world_example = 'A puzzle app generating every way to arrange pieces on a board, abandoning a partial arrangement the moment two pieces conflict instead of finishing it out.' WHERE id = 'pat_subsets_backtracking';
UPDATE concepts SET real_world_example = 'A shipping company finding the smallest truck capacity that still lets all packages ship within a deadline, by testing candidate capacities instead of every possible arrangement.' WHERE id = 'pat_modified_binary_search';
UPDATE concepts SET real_world_example = 'A search engine merging already-sorted-by-relevance result lists from multiple servers into one final ranked list.' WHERE id = 'pat_kway_merge';

-- VERIFICATION QUERY — expect 6 rows, resources 1, problems 1 or 2, has_example true
SELECT c.id, c.name,
       (SELECT count(*) FROM concept_resources r WHERE r.concept_id = c.id) AS resources,
       (SELECT count(*) FROM concept_practice_problems p WHERE p.concept_id = c.id) AS problems,
       (c.real_world_example IS NOT NULL) AS has_example
FROM concepts c
WHERE c.topic_id = 'patterns'
ORDER BY c.display_order;
-- Migration 036: Interview Questions — initial content batch
-- Honesty note (carried from the research phase, not just a comment):
-- no official public question bank exists for any of these companies.
-- Coding prompts below are real, individually-verified LeetCode problems
-- framed by documented company interview style/pattern (sourced from
-- aggregated candidate reports), not claims that "Company X asked this
-- exact question on date Y." Theory/behavioral prompts are original
-- content shaped by the same research, not quoted from any single source.

INSERT INTO interview_questions
  (concept_id, question_type, company, prompt, difficulty, company_note, reference_notes, display_order)
VALUES

-- Amazon: LP-paired coding, monotonic-stack-style problems commonly reported
('sq_monotonic_stack', 'coding', 'Amazon',
 'Daily Temperatures (https://leetcode.com/problems/daily-temperatures/) — for each day, find how many days until a warmer temperature.',
 'Medium',
 'Amazon pairs coding rounds with Leadership Principles as a genuinely equal weight, not a formality after the code — be ready to pivot into a behavioral story right after finishing this.',
 'Monotonic stack, O(n). Watch for the misconception that the stack holds a full sorted history rather than just elements still waiting for a warmer day.',
 1),

(NULL, 'behavioral', 'Amazon',
 'Tell me about a time you disagreed with a decision your team or manager made, and how you handled it.',
 NULL,
 'Maps directly to Amazon''s "Have Backbone; Disagree and Commit" Leadership Principle — bring one specific, quantified example, not a hypothetical.',
 'Strong answers name the disagreement, the action taken, and the measurable outcome — vague "I raised my concerns" answers score poorly.',
 2),

('sq_monotonic_stack', 'theory', 'Amazon',
 'Walk through the time complexity of your Daily Temperatures solution and explain why it beats the brute-force approach.',
 NULL,
 'Amazon interviewers commonly probe complexity reasoning as closely as correctness itself.',
 'Look for: brute force is O(n^2) re-scanning forward from each day; monotonic stack is O(n) because each index is pushed and popped at most once.',
 3),

-- Google: harder problems, verbal reasoning about complexity emphasized
('graph_topo', 'coding', 'Google',
 'Course Schedule (https://leetcode.com/problems/course-schedule/) — determine if all courses can be finished given prerequisite pairs.',
 'Medium',
 'Google interviews are described as grading how clearly a candidate narrates their own reasoning and complexity tradeoffs, not just whether the code runs.',
 'Cycle detection in a directed graph — reduces to topological sort; a cycle means no valid ordering exists.',
 4),

(NULL, 'theory', 'Google',
 'Explain why your approach to a graph reachability problem is optimal — what''s the theoretical lower bound, and can you justify it?',
 NULL,
 'Multiple sources describe Google as pushing candidates to defend optimality out loud, not just present a working solution.',
 'A strong answer states the lower bound (e.g. must touch every edge at least once) and explicitly compares it to the achieved complexity.',
 5),

(NULL, 'real_world', 'Google',
 'How would your graph traversal approach change if the graph were too large to fit in memory on a single machine?',
 NULL,
 'Google interviewers sometimes extend a clean in-memory solution into a systems-constrained follow-up mid-interview.',
 'Points toward external/distributed BFS concepts (partitioning, batched processing) — depth of the answer matters less than recognizing the constraint changed.',
 6),

-- Meta: sliding window heavy, narrower recurring set, speed emphasized
('arr_sliding_window', 'coding', 'Meta',
 'Minimum Window Substring (https://leetcode.com/problems/minimum-window-substring/) — find the smallest substring containing all characters of a target string.',
 'Hard',
 'Sliding window is disproportionately represented in Meta''s reported loop, and interviews there are described as faster-paced than Google''s.',
 'Variable-size window with a character frequency map; the shrink condition is the part candidates most often get wrong under time pressure.',
 7),

('arr_sliding_window', 'coding', 'Meta',
 'Longest Substring Without Repeating Characters (https://leetcode.com/problems/longest-substring-without-repeating-characters/) — find the length of the longest substring with no repeated characters.',
 'Medium',
 'A classic Meta-style warm-up — recognizable and fast to execute if the sliding window pattern is fluent, which is exactly what''s being timed.',
 'Expand right, shrink left on duplicate — O(n) with a hash set or last-seen-index map.',
 8),

(NULL, 'theory', 'Meta',
 'Why does a sliding window avoid the redundant work a brute-force substring search does? Be specific about what work is actually being reused.',
 NULL,
 'Speed matters here — this is the kind of question meant to be answered in under a minute, not worked out from scratch.',
 'The window reuses the previous window''s character counts instead of rescanning the whole substring from a new start each time.',
 9),

-- Netflix: practical/production framing over abstract puzzles, ownership in behavioral rounds
(NULL, 'real_world', 'Netflix',
 'Given an existing rate-limiter class that allows N requests per fixed time window, extend it to support a burst allowance without a full rewrite.',
 NULL,
 'Netflix consistently favors extending or debugging existing code over blank-slate algorithm puzzles — the existing class is deliberately part of the prompt.',
 'A reasonable answer discusses token-bucket-style burst handling layered onto the existing fixed-window logic, and explicitly weighs what changes vs. what stays.',
 10),

(NULL, 'behavioral', 'Netflix',
 'Tell me about a time you made an independent decision that turned out to be wrong. What did you do next?',
 NULL,
 'Netflix''s behavioral rounds are described as emphasizing ownership and candid self-reflection over rehearsed STAR-format answers — the "what did you do next" half matters as much as admitting the mistake.',
 'Weak answers stop at describing the mistake; strong ones show what changed in how the candidate works afterward.',
 11),

(NULL, 'theory', 'Netflix',
 'A senior-level Netflix round might ask: how would you reason about concurrent access to the rate-limiter above? What could go wrong?',
 NULL,
 'Senior coding rounds at Netflix are described as blurring into system-design and production-concerns territory rather than staying purely algorithmic.',
 'Look for recognition of race conditions on the shared counter and at least one concrete mitigation (locking, atomic operations, or a redesign avoiding shared mutable state).',
 12);

-- VERIFICATION QUERY — expect 12 rows, 4 per company across Amazon/Google/Meta/Netflix
SELECT company, question_type, count(*) 
FROM interview_questions 
GROUP BY company, question_type 
ORDER BY company, question_type;
-- Migration 037: Sorting Fundamentals — core topic definition
-- The algorithms/techniques worth diagnosing: bubble (baseline), insertion
-- (adaptive), merge (stable divide-conquer), quick (average-case divide-conquer),
-- heap (in-place n log n). Selection sort folded into quick/heap understanding.

INSERT INTO topics (id, name, description, display_order) VALUES
('sorting_fundamentals', 'Sorting Fundamentals', 'Classical sorting algorithms: complexity analysis, stability, in-place vs. extra-space, and when each suits the real-world constraint', 11);

INSERT INTO concepts
  (id, topic_id, name, definition, proficiency_level, importance_weight, canonical_keywords, display_order)
VALUES
('sort_bubble', 'sorting_fundamentals',
 'Bubble Sort',
 'The simplest sorting algorithm — repeatedly swap adjacent elements if they''re in the wrong order, bubbling larger elements to the end with each pass. O(n²) in average and worst case, but O(n) when already sorted. Stable.',
 'beginner', 2,
 ARRAY['bubble sort','adjacent swap','simple sort','O(n^2)','stable'], 1),

('sort_insertion', 'sorting_fundamentals',
 'Insertion Sort',
 'Build the sorted portion one element at a time, inserting each new element into its correct position within the already-sorted prefix. O(n²) in worst case, O(n) when nearly sorted. Stable and in-place.',
 'beginner', 2,
 ARRAY['insertion sort','insert into sorted','adaptive','O(n^2)','in-place'], 2),

('sort_merge', 'sorting_fundamentals',
 'Merge Sort',
 'Divide and conquer: split the array in half, recursively sort each half, then merge them back together. Always O(n log n) regardless of input order. Stable but requires O(n) extra space.',
 'interview', 3,
 ARRAY['merge sort','divide and conquer','stable sort','O(n log n)','extra space'], 3),

('sort_quicksort', 'sorting_fundamentals',
 'Quicksort',
 'Divide and conquer: pick a pivot, partition around it (smaller left, larger right), recursively sort both parts. O(n log n) average, O(n²) worst case (when pivot is always min/max). In-place, but unstable.',
 'interview', 3,
 ARRAY['quicksort','pivot partition','divide and conquer','O(n log n) average','in-place'], 4),

('sort_heapsort', 'sorting_fundamentals',
 'Heapsort',
 'Build a max-heap from the array, then repeatedly extract the maximum and place it at the end. Guaranteed O(n log n) in all cases. In-place but unstable. Less cache-friendly than quicksort in practice.',
 'interview', 2,
 ARRAY['heapsort','heap','O(n log n) worst','in-place','unstable'], 5),

('sort_complexity_analysis', 'sorting_fundamentals',
 'Complexity Analysis & Stability',
 'Reasoning about time complexity (best/average/worst case), space complexity, and stability (whether equal elements retain their original order) — critical for choosing the right algorithm for a constraint.',
 'interview', 3,
 ARRAY['time complexity','space complexity','stable','worst case','best case'], 6);

INSERT INTO concept_prerequisites (concept_id, prerequisite_id) VALUES
('sort_insertion', 'sort_bubble'),
('sort_merge', 'sort_bubble'),
('sort_quicksort', 'sort_bubble'),
('sort_heapsort', 'sort_bubble'),
('sort_complexity_analysis', 'sort_bubble');

INSERT INTO concept_misconceptions
  (concept_id, misconception, correction, trigger_phrases)
VALUES
('sort_bubble',
 'Bubble sort is never useful in practice because it''s O(n²)',
 'Bubble sort is genuinely O(n) on nearly-sorted data and has minimal overhead, making it practical for small datasets or as a teaching baseline. The O(n²) claim refers to random or reverse-sorted input, not all input.',
 ARRAY['never useful','always bad','never use it']),

('sort_insertion',
 'Insertion sort is just a slower variant of bubble sort',
 'Insertion sort''s adaptive nature makes it O(n) on nearly-sorted data, where bubble sort remains O(n²). For real-world nearly-sorted input (like logging events from sensors), insertion sort can outperform far more complex algorithms.',
 ARRAY['just a variant','slower version','same as bubble']),

('sort_merge',
 'Merge sort is O(n log n) space as well as time, so it''s always worse than quicksort',
 'Merge sort uses O(n) extra space but guarantees O(n log n) time in all cases, including worst case. Quicksort uses O(log n) space but can degrade to O(n²). The choice depends on whether time-guarantee or space-efficiency matters more for the constraint.',
 ARRAY['always worse','more space','slower overall']),

('sort_quicksort',
 'Quicksort is always faster than merge sort because it''s in-place',
 'Quicksort''s average-case O(n log n) and in-place nature make it faster in practice on random data, but merge sort''s guaranteed O(n log n) and stability matter for other constraints. Worst-case O(n²) on quicksort is a real risk if pivot selection is bad.',
 ARRAY['always faster','better in all ways','never use merge']),

('sort_heapsort',
 'Heapsort is the best sorting algorithm because it guarantees O(n log n) and is in-place',
 'Heapsort guarantees O(n log n) and is in-place, but has poor cache locality (heap accesses jump around memory) and is unstable, making it slower in practice than quicksort on real hardware despite the same asymptotic complexity.',
 ARRAY['best algorithm','always fastest','better than quicksort']),

('sort_complexity_analysis',
 'An algorithm''s time complexity is all that matters when choosing a sort',
 'Stability, space usage, cache behavior, input characteristics (nearly sorted? small dataset? large duplicates?), and worst-case guarantees all matter as much as average-case time complexity when choosing the right sort for a real constraint.',
 ARRAY['only time matters','complexity is everything','space doesn''t matter']);

INSERT INTO fallback_probes (topic_id, question, probe_order) VALUES
('sorting_fundamentals',
 'You mentioned a sorting algorithm — what''s the difference between its best-case, average-case, and worst-case complexity, and when does each one actually happen?',
 1),
('sorting_fundamentals',
 'Walk me through why merge sort is stable and quicksort is not, and when does that distinction actually matter?',
 2),
('sorting_fundamentals',
 'If you had to sort a nearly-sorted array, which of bubble, insertion, merge, and quicksort would you pick first, and why?',
 3);
-- Migration 038: Sorting Fundamentals — resource links
-- All URLs individually verified via live search on 2026-09-05

INSERT INTO concept_resources (concept_id, title, url) VALUES
('sort_bubble', 'Bubble Sort',
 'https://www.geeksforgeeks.org/dsa/bubble-sort/'),

('sort_insertion', 'Insertion Sort',
 'https://www.geeksforgeeks.org/dsa/insertion-sort/'),

('sort_merge', 'Merge Sort',
 'https://www.geeksforgeeks.org/dsa/merge-sort/'),

('sort_quicksort', 'QuickSort',
 'https://www.geeksforgeeks.org/dsa/quick-sort/'),

('sort_heapsort', 'Heap Sort',
 'https://www.geeksforgeeks.org/dsa/heap-sort/'),

('sort_complexity_analysis', 'Analysis of Different Sorting Techniques',
 'https://www.geeksforgeeks.org/dsa/analysis-of-different-sorting-techniques/'),

('sort_complexity_analysis', 'Introduction to Sorting Algorithms',
 'https://www.geeksforgeeks.org/dsa/introduction-to-sorting-algorithm/');

-- VERIFICATION QUERY — expect 6 concepts, 7 total resources (1 on complexity, 2 on analysis)
SELECT c.id, c.name,
       (SELECT count(*) FROM concept_resources r WHERE r.concept_id = c.id) AS resource_count
FROM concepts c
WHERE c.topic_id = 'sorting_fundamentals'
ORDER BY c.display_order;
-- Migration 039: Sorting Fundamentals — practice problems + real-world examples
-- All URLs individually verified via live search on 2026-09-05 (LeetCode only)

INSERT INTO concept_practice_problems (concept_id, platform, title, url, difficulty, display_order) VALUES
('sort_bubble', 'LeetCode', 'Sort an Array', 'https://leetcode.com/problems/sort-an-array/', 'Medium', 1),

('sort_insertion', 'LeetCode', 'Sort an Array', 'https://leetcode.com/problems/sort-an-array/', 'Medium', 1),

('sort_merge', 'LeetCode', 'Sort an Array', 'https://leetcode.com/problems/sort-an-array/', 'Medium', 1),

('sort_quicksort', 'LeetCode', 'Sort an Array', 'https://leetcode.com/problems/sort-an-array/', 'Medium', 1),

('sort_heapsort', 'LeetCode', 'K Closest Points to Origin', 'https://leetcode.com/problems/k-closest-points-to-origin/', 'Medium', 1),

('sort_complexity_analysis', 'LeetCode', 'Sort an Array', 'https://leetcode.com/problems/sort-an-array/', 'Medium', 1),
('sort_complexity_analysis', 'LeetCode', 'Sort the Matrix Diagonally', 'https://leetcode.com/problems/sort-the-matrix-diagonally/', 'Medium', 2);

UPDATE concepts SET real_world_example = 'A classroom seating chart reordering students by height in a single pass, swapping neighbors until everyone''s in place.' WHERE id = 'sort_bubble';
UPDATE concepts SET real_world_example = 'A cashier sorting coins by denomination one coin at a time, inserting each new coin into the already-sorted pile.' WHERE id = 'sort_insertion';
UPDATE concepts SET real_world_example = 'A library splitting its entire book inventory in half, sorting each half separately, then merging them back into perfect alphabetical order.' WHERE id = 'sort_merge';
UPDATE concepts SET real_world_example = 'A search engine picking a "pivot" result and partitioning all other results into more/less relevant, then recursively refining each partition.' WHERE id = 'sort_quicksort';
UPDATE concepts SET real_world_example = 'A priority queue efficiently extracting the highest-priority task by repeatedly popping the heap root, making it O(n log n) for sorting priority tasks.' WHERE id = 'sort_heapsort';
UPDATE concepts SET real_world_example = 'A database choosing between QuickSort (fast average case) and MergeSort (predictable worst case) based on whether the table''s data distribution is known or random.' WHERE id = 'sort_complexity_analysis';

-- VERIFICATION QUERY — expect 6 rows, problem_count 1 or 2, has_example = true on all
SELECT c.id, c.name,
       (SELECT count(*) FROM concept_practice_problems p WHERE p.concept_id = c.id) AS problem_count,
       (c.real_world_example IS NOT NULL) AS has_example
FROM concepts c
WHERE c.topic_id = 'sorting_fundamentals'
ORDER BY c.display_order;
-- Migration 040: Interview Questions — expanded batch (corrected)
-- Unlike the first draft of this file, every company_note below is now
-- grounded in an actual verified search on that company's reported 2026
-- interview style, not general plausibility. Where a specific illustrative
-- framing (e.g. "imagine this represents trading volume") isn't itself
-- a verified claim about the company, it's marked as illustrative only.

INSERT INTO interview_questions
  (concept_id, question_type, company, prompt, difficulty, company_note, reference_notes, display_order)
VALUES

-- Microsoft: verified emphasis on explaining reasoning/tradeoffs/edge cases,
-- plus heavy low-level design (LLD/OOD, SOLID principles) alongside DSA rounds
('bt_inorder', 'coding', 'Microsoft',
 'Binary Tree Inorder Traversal (https://leetcode.com/problems/binary-tree-inorder-traversal/) — visit nodes in sorted order: left subtree, root, right subtree.',
 'Easy',
 'Reported Microsoft loops emphasize explaining your approach, complexity, edge cases, and how the solution changes under follow-up twists — not just arriving at working code silently.',
 'Recursive is straightforward; being asked to also produce the iterative version is a common follow-up twist.',
 13),

(NULL, 'theory', 'Microsoft',
 'Design a simplified Excel-style formula parser class — what are the core classes and how do they interact? (No code needed, just the design.)',
 NULL,
 'Microsoft interview guides specifically report low-level/object-oriented design rounds — designing classes and interactions rather than writing algorithms — as a distinct round from standard DSA coding.',
 'Look for separation of concerns (parsing vs. evaluation vs. cell storage) and whether SOLID principles come up unprompted.',
 14),

(NULL, 'behavioral', 'Microsoft',
 'Tell me about a time you had to defend a technical decision to a skeptical teammate or manager.',
 NULL,
 'Reported Microsoft rounds specifically ask candidates to defend technical decisions and discuss how they handled disagreement or incomplete information.',
 'Strong answers show the reasoning behind the original decision, not just that the candidate "won" the disagreement.',
 15),

-- Apple: verified emphasis on reasoning over memorized patterns, probing
-- edge cases / scale / testing, production-quality code
('str_palindrome', 'coding', 'Apple',
 'Valid Palindrome (https://leetcode.com/problems/valid-palindrome/) — check if a string is a palindrome, considering only alphanumeric characters and ignoring case.',
 'Easy',
 'Reported Apple interviews specifically probe "what happens with huge input" and "how would you test it" as follow-ups, valuing reasoning over recognizing a memorized pattern.',
 'Two pointers skipping non-alphanumeric characters; be ready to discuss what changes for a streamed/huge input that can''t fit in memory.',
 16),

(NULL, 'theory', 'Apple',
 'Why did you choose that data structure for your solution? What would change if the input were 1000x larger?',
 NULL,
 'This is close to verbatim what reported Apple interviewers are described as asking — "why did you choose that data structure," "what happens with huge input."',
 'A strong answer names the specific tradeoff (e.g. hash set for O(1) lookup vs. sorted array for less memory) rather than defaulting to the first structure that worked.',
 17),

-- Uber: verified emphasis on production-focused coding + scalability/latency
-- tradeoffs in system design for mid-to-senior loops
('graph_cycle', 'coding', 'Uber',
 'Course Schedule (https://leetcode.com/problems/course-schedule/) — detect a cycle in a directed graph.',
 'Medium',
 'Reported Uber loops are described as practical and production-focused, with system-design follow-ups emphasizing tradeoffs, scalability, and latency for mid-to-senior candidates.',
 'Topological sort or DFS with color-marking; a real Uber-style follow-up would ask how this holds up under real-time dispatch latency constraints.',
 18),

(NULL, 'behavioral', 'Uber',
 'Tell me about a time you had to make a tradeoff between shipping quickly and building something more scalable. What did you decide, and what were the numbers behind it?',
 NULL,
 'Uber''s process is reported to reward candidates who "back up their behavioral answers with real numbers," not just a general story.',
 'Weak answers stay qualitative; strong ones cite an actual metric that informed the decision.',
 19),

-- Bloomberg: verified emphasis on reasoning-while-coding, LLD, real-time
-- financial systems for system design rounds
('heap_priority_queue', 'coding', 'Bloomberg',
 'Top K Frequent Elements (https://leetcode.com/problems/top-k-frequent-elements/) — find K most common elements in an array.',
 'Medium',
 'Reported Bloomberg loops specifically emphasize talking through your reasoning during live coding, not just arriving at a correct answer. (Illustrative only, not verified: a Bloomberg-flavored framing might recast the input as trading-volume data — but that specific framing wasn''t itself confirmed in research, it''s a plausible domain flavor.)',
 'Heap of size K after building a frequency map; the reasoning-out-loud expectation matters more here than in a typical loop.',
 20),

(NULL, 'theory', 'Bloomberg',
 'Bloomberg system design rounds are reported to focus on real-time financial systems for mid-level and senior candidates — what would you need to clarify before designing one?',
 NULL,
 'Directly reflects verified reporting on Bloomberg''s system design round focus.',
 'Look for questions about latency tolerance, consistency requirements, and whether "real-time" means milliseconds or seconds in context.',
 21),

-- Stripe: verified emphasis on practical, real-engineering-style problems —
-- rate limiters, structured-data parsing — over abstract puzzles
(NULL, 'coding', 'Stripe',
 'Implement a rate limiter supporting a fixed request quota per time window (e.g. token bucket or sliding window), then extend it to support a burst allowance.',
 'Medium',
 'This is close to Stripe''s actual reported interview style — rate limiters and token-bucket-style problems are specifically named as representative Stripe coding questions, not abstract algorithm puzzles.',
 'Base implementation first, then the burst-allowance extension — Stripe interviews are reported to specifically test how a candidate handles a follow-up twist mid-problem.',
 22),

(NULL, 'coding', 'Stripe',
 'Given a CSV file of transaction records with inconsistent formatting, parse it into clean structured records, handling malformed rows gracefully.',
 'Medium',
 'CSV transaction parsing and log parsing are specifically named in Stripe interview reports as representative of their financial-data-processing coding style.',
 'The real test is edge-case handling on messy input, not algorithmic complexity — matches Stripe''s reported grading criteria of test coverage and requirement-clarification.',
 23),

(NULL, 'behavioral', 'Stripe',
 'Describe a time you had to move with urgency on a production issue while still being careful about correctness.',
 NULL,
 'Directly references Stripe''s publicly stated operating principle "move with urgency and focus," which reports say interviewers reference throughout the loop.',
 'Strong answers show both halves — genuine urgency AND a concrete safeguard against a rushed mistake, not just speed alone.',
 24);

-- VERIFICATION QUERY — expect 12 new rows across Microsoft/Apple/Uber/Bloomberg/Stripe
SELECT company, question_type, count(*)
FROM interview_questions
WHERE display_order >= 13
GROUP BY company, question_type
ORDER BY company, question_type;
-- Migration 042: Rubric backfill for all 24 existing interview_questions rows
-- Matched to display_order from migrations 036 and 040. Coding-type rows
-- get full treatment (hint_ladder, optimal_complexity); theory/behavioral/
-- real_world rows get opening_prompt + rubric_dimensions + a lighter
-- expected_follow_ups where a natural probe exists, no optimal_complexity
-- (not applicable to non-coding rows).

-- 1: Amazon / Daily Temperatures
UPDATE interview_questions SET
  opening_prompt = 'Before you start, walk me through your understanding of the problem — what are we optimizing for?',
  hint_ladder = '["What if you kept track of days you haven''t found a warmer temperature for yet?", "Consider processing days left to right, maintaining a structure of pending days.", "A stack kept in decreasing temperature order lets you resolve multiple pending days at once when a warmer day appears."]',
  expected_follow_ups = '[{"trigger":"after_first_working_solution","question":"What is the time complexity of your solution, and why?"},{"trigger":"if_brute_force_only","question":"Your solution is O(n^2) - can you avoid re-scanning forward from each day?"}]',
  optimal_complexity = 'O(n) time, O(n) space',
  rubric_dimensions = '[{"dimension":"clarifying_questions","description":"Did they ask about input size, empty arrays, or duplicate temperatures before coding?"},{"dimension":"approach_before_code","description":"Did they explain the monotonic stack idea before writing code?"},{"dimension":"complexity_analysis","description":"Did they state complexity unprompted?"},{"dimension":"edge_cases","description":"Did they consider an empty array or a strictly decreasing sequence?"}]'
WHERE display_order = 1;

-- 2: Amazon / behavioral disagreement
UPDATE interview_questions SET
  opening_prompt = 'Take a moment to think of a specific, real example before answering - I will be listening for a concrete situation, not a general philosophy.',
  expected_follow_ups = '[{"trigger":"if_answer_stays_general","question":"Can you walk me through one specific instance - what was the actual disagreement about?"},{"trigger":"if_no_outcome_mentioned","question":"What ended up happening as a result?"}]',
  rubric_dimensions = '[{"dimension":"specificity","description":"Did they name an actual situation, or stay hypothetical?"},{"dimension":"action_taken","description":"Did they describe what THEY specifically did, not just the team?"},{"dimension":"outcome_stated","description":"Did they mention a measurable or concrete result?"}]'
WHERE display_order = 2;

-- 3: Amazon / theory on Daily Temperatures complexity
UPDATE interview_questions SET
  opening_prompt = 'Walk me through this out loud, as if explaining to a teammate who has not seen your solution yet.',
  expected_follow_ups = '[{"trigger":"if_only_states_complexity","question":"Can you explain WHY it is O(n) - what guarantees each element is processed a constant number of times?"}]',
  rubric_dimensions = '[{"dimension":"brute_force_named","description":"Did they state the O(n^2) baseline before explaining the improvement?"},{"dimension":"mechanism_explained","description":"Did they explain WHY the stack achieves O(n), not just state it?"}]'
WHERE display_order = 3;

-- 4: Google / Course Schedule
UPDATE interview_questions SET
  opening_prompt = 'Before coding, tell me: what does it mean for this problem to have no valid answer?',
  hint_ladder = '["Think about what structure would let you find courses with no remaining prerequisites.", "Consider tracking each course''s indegree - how many prerequisites it still has left.", "If you process courses whose indegree just reached zero, and cannot process all courses this way, a cycle must exist."]',
  expected_follow_ups = '[{"trigger":"after_first_working_solution","question":"What is the theoretical lower bound for this problem, and does your solution achieve it?"},{"trigger":"after_correct_complexity_stated","question":"How would you also return a valid course ORDER, not just whether one exists?"}]',
  optimal_complexity = 'O(V + E) time and space',
  rubric_dimensions = '[{"dimension":"reasoning_narration","description":"Did they narrate their reasoning clearly, or code silently?"},{"dimension":"optimality_justified","description":"Did they explicitly justify optimality, not just that it works?"},{"dimension":"edge_cases","description":"Did they consider a course depending on itself, or disconnected groups?"}]'
WHERE display_order = 4;

-- 5: Google / theory lower bound
UPDATE interview_questions SET
  opening_prompt = 'This is abstract - think out loud, I want the reasoning process, not just a conclusion.',
  expected_follow_ups = '[{"trigger":"if_no_lower_bound_given","question":"What is the minimum amount of work any algorithm would have to do here, regardless of approach?"}]',
  rubric_dimensions = '[{"dimension":"lower_bound_stated","description":"Did they name a concrete lower bound, not just assert optimality?"},{"dimension":"comparison_made","description":"Did they compare their achieved complexity against that lower bound?"}]'
WHERE display_order = 5;

-- 6: Google / real_world graph too large for memory
UPDATE interview_questions SET
  opening_prompt = 'Assume your working in-memory solution from before - now the constraint has changed.',
  expected_follow_ups = '[{"trigger":"if_answer_stays_vague","question":"Concretely, how would you partition the graph across machines?"}]',
  rubric_dimensions = '[{"dimension":"constraint_recognition","description":"Did they recognize the fundamental shift before proposing a fix?"},{"dimension":"concrete_approach","description":"Did they name a specific technique, not just say distribute it?"}]'
WHERE display_order = 6;

-- 7: Meta / Minimum Window Substring
UPDATE interview_questions SET
  opening_prompt = 'This one is meant to move fast - start talking through your approach as soon as you have one, do not wait until it is fully formed.',
  hint_ladder = '["Think about expanding a window to include enough characters, then shrinking it while it stays valid.", "A frequency map of the target string tells you when your current window satisfies the requirement.", "Track how many required characters are currently satisfied - shrink from the left while that count stays full."]',
  expected_follow_ups = '[{"trigger":"after_first_working_solution","question":"What is the shrink condition, exactly - how do you know when it is safe to shrink further?"},{"trigger":"if_slow_to_start","question":"What is the brute-force approach here, just to anchor us before optimizing?"}]',
  optimal_complexity = 'O(n + m) time, O(m) space',
  rubric_dimensions = '[{"dimension":"speed","description":"Did they reach a working approach quickly?"},{"dimension":"shrink_condition_correct","description":"Did they correctly identify when the window can safely shrink?"},{"dimension":"edge_cases","description":"Did they consider a target longer than the source, or repeated target characters?"}]'
WHERE display_order = 7;

-- 8: Meta / Longest Substring Without Repeating Characters
UPDATE interview_questions SET
  opening_prompt = 'Same expectation as before - this should feel fast and familiar if the pattern is fluent.',
  hint_ladder = '["What structure tells you quickly whether a character is already in your current window?", "Consider a hash set or a map of each character''s last-seen index.", "When you hit a duplicate, you can jump the left edge directly past the duplicate''s last position instead of shrinking one step at a time."]',
  expected_follow_ups = '[{"trigger":"after_first_working_solution","question":"Is your shrink step O(1) amortized, or could it degrade in some case?"}]',
  optimal_complexity = 'O(n) time, O(min(n, charset size)) space',
  rubric_dimensions = '[{"dimension":"speed","description":"Did they recognize the pattern immediately?"},{"dimension":"optimization_depth","description":"Did they reach the O(1)-jump optimization, or stop at the simpler version?"}]'
WHERE display_order = 8;

-- 9: Meta / theory sliding window redundant work
UPDATE interview_questions SET
  opening_prompt = 'Quick one - answer this in under a minute, the way you would if asked mid-interview.',
  expected_follow_ups = '[{"trigger":"if_answer_is_vague","question":"Specifically, what information from the previous window gets reused instead of recomputed?"}]',
  rubric_dimensions = '[{"dimension":"specificity","description":"Did they name exactly what state is reused, not just say it is more efficient?"},{"dimension":"speed_of_answer","description":"Did they answer promptly, matching the expected pace?"}]'
WHERE display_order = 9;

-- 10: Netflix / real_world rate limiter burst allowance
UPDATE interview_questions SET
  opening_prompt = 'Here is an existing class - I want you to extend it, not rewrite it from scratch. Tell me your plan before touching the code.',
  hint_ladder = '["What data would you need to track beyond just the current window''s count?", "Consider allowing a short-term allowance on top of the steady rate, like a bucket that refills over time.", "A token bucket lets you accumulate unused capacity and spend it in a burst, while still capping the long-term rate."]',
  expected_follow_ups = '[{"trigger":"after_first_working_extension","question":"What existing behavior did you have to preserve, and what did you have to change?"},{"trigger":"if_full_rewrite_attempted","question":"Can you layer this on top of the existing logic instead of replacing it?"}]',
  rubric_dimensions = '[{"dimension":"extension_not_rewrite","description":"Did they build on the existing class, or discard it?"},{"dimension":"plan_before_code","description":"Did they explain their plan before editing?"}]'
WHERE display_order = 10;

-- 11: Netflix / behavioral independent decision wrong
UPDATE interview_questions SET
  opening_prompt = 'I am listening for what you did AFTER realizing you were wrong, as much as the mistake itself.',
  expected_follow_ups = '[{"trigger":"if_stops_at_mistake","question":"What did you actually do differently after that?"}]',
  rubric_dimensions = '[{"dimension":"ownership_shown","description":"Did they take clear ownership without deflecting?"},{"dimension":"concrete_change","description":"Did they describe a specific change in how they work afterward?"}]'
WHERE display_order = 11;

-- 12: Netflix / theory concurrent access to rate limiter
UPDATE interview_questions SET
  opening_prompt = 'Building on the rate limiter from before - now imagine multiple requests hitting it at the exact same instant.',
  expected_follow_ups = '[{"trigger":"if_no_race_condition_named","question":"What happens if two requests read the counter at the same instant, before either writes back?"}]',
  rubric_dimensions = '[{"dimension":"race_condition_identified","description":"Did they identify the shared-counter race condition specifically?"},{"dimension":"mitigation_named","description":"Did they name a concrete fix, not just handle concurrency?"}]'
WHERE display_order = 12;

-- 13: Microsoft / Binary Tree Inorder Traversal
UPDATE interview_questions SET
  opening_prompt = 'Start with whichever approach comes to mind first - I will ask for the alternative after.',
  hint_ladder = '["Think recursively first: left subtree, root, then right subtree.", "Now consider: could you achieve the same order without recursion, using an explicit stack?"]',
  expected_follow_ups = '[{"trigger":"after_recursive_solution","question":"Can you also write the iterative version, using an explicit stack?"},{"trigger":"after_both_versions","question":"What is the space complexity difference between your two versions?"}]',
  optimal_complexity = 'O(n) time, O(h) space where h is tree height',
  rubric_dimensions = '[{"dimension":"explains_before_coding","description":"Did they state their approach before typing?"},{"dimension":"handles_followup_twist","description":"Did they adapt cleanly to the iterative-version ask?"}]'
WHERE display_order = 13;

-- 14: Microsoft / theory Excel formula parser design
UPDATE interview_questions SET
  opening_prompt = 'This is a design question - talk me through your classes before any code, and tell me what each one is responsible for.',
  expected_follow_ups = '[{"trigger":"if_single_monolithic_class","question":"What happens to this design if we need to add a new formula function later - does anything need to change?"}]',
  rubric_dimensions = '[{"dimension":"separation_of_concerns","description":"Did they separate parsing, evaluation, and storage?"},{"dimension":"solid_awareness","description":"Did SOLID-adjacent reasoning come up unprompted?"}]'
WHERE display_order = 14;

-- 15: Microsoft / behavioral defend technical decision
UPDATE interview_questions SET
  opening_prompt = 'Tell me about the decision itself first, then how the pushback happened.',
  expected_follow_ups = '[{"trigger":"if_reasoning_missing","question":"What was your reasoning behind the original decision?"}]',
  rubric_dimensions = '[{"dimension":"reasoning_shown","description":"Did they explain WHY they made the original decision?"},{"dimension":"handled_disagreement_well","description":"Did they describe a constructive resolution?"}]'
WHERE display_order = 15;

-- 16: Apple / Valid Palindrome
UPDATE interview_questions SET
  opening_prompt = 'Before you code, tell me: what exactly counts as a character we care about here?',
  hint_ladder = '["Two pointers from both ends is a natural fit for palindrome checking.", "What do you do when a pointer lands on a non-alphanumeric character?", "Skip non-alphanumeric characters at each pointer independently before comparing."]',
  expected_follow_ups = '[{"trigger":"after_first_working_solution","question":"What happens with a huge input - a string too large to hold in memory at once?"},{"trigger":"after_huge_input_discussed","question":"How would you test this? What edge cases would you specifically check?"}]',
  optimal_complexity = 'O(n) time, O(1) space',
  rubric_dimensions = '[{"dimension":"clarified_constraints","description":"Did they clarify what counts as alphanumeric before coding?"},{"dimension":"scale_reasoning","description":"Did they reason well about huge/streamed input?"},{"dimension":"testing_mindset","description":"Did they proactively name specific test cases?"}]'
WHERE display_order = 16;

-- 17: Apple / theory data structure choice at scale
UPDATE interview_questions SET
  opening_prompt = 'Think about the actual tradeoff, not just it works - I want the reasoning.',
  expected_follow_ups = '[{"trigger":"if_vague_justification","question":"What specifically would break, or get slower, if you had chosen differently?"}]',
  rubric_dimensions = '[{"dimension":"tradeoff_named","description":"Did they name a specific tradeoff, not a vague justification?"},{"dimension":"scale_reasoning","description":"Did they meaningfully reconsider for the 1000x scenario?"}]'
WHERE display_order = 17;

-- 18: Uber / Course Schedule (cycle detection)
UPDATE interview_questions SET
  opening_prompt = 'Same problem type as a classic graph question - tell me how you would detect the issue before writing any code.',
  hint_ladder = '["Think about marking nodes as you visit them during a traversal.", "Consider three states per node: unvisited, currently-being-visited, and fully-visited.", "If you revisit a node that is currently-being-visited, you have found a cycle."]',
  expected_follow_ups = '[{"trigger":"after_first_working_solution","question":"How would this hold up under real-time latency constraints - say, milliseconds for live dispatch routing?"}]',
  optimal_complexity = 'O(V + E) time and space',
  rubric_dimensions = '[{"dimension":"practical_framing","description":"Did they engage with the real-time/latency follow-up concretely?"},{"dimension":"three_state_marking","description":"Did they use a 3-state visited marking, needed to correctly detect cycles?"}]'
WHERE display_order = 18;

-- 19: Uber / behavioral ship fast vs scalable with numbers
UPDATE interview_questions SET
  opening_prompt = 'I specifically want to hear the numbers behind your decision, not just the reasoning.',
  expected_follow_ups = '[{"trigger":"if_no_numbers_given","question":"What specific number or metric made you choose that path?"}]',
  rubric_dimensions = '[{"dimension":"numbers_given","description":"Did they cite an actual metric that informed the decision?"},{"dimension":"tradeoff_explicit","description":"Did they clearly state what was sacrificed and what was gained?"}]'
WHERE display_order = 19;

-- 20: Bloomberg / Top K Frequent Elements
UPDATE interview_questions SET
  opening_prompt = 'Talk me through your reasoning as you go - I want to hear your thinking live, not just see the final code.',
  hint_ladder = '["Start by counting how often each element appears.", "Think about how to efficiently find the K largest counts without fully sorting everything.", "A heap of size K lets you maintain just the top K counts as you scan."]',
  expected_follow_ups = '[{"trigger":"after_first_working_solution","question":"Could you do better than O(n log k) here? Is there a linear-time approach?"}]',
  optimal_complexity = 'O(n log k) with a heap, or O(n) average with bucket sort',
  rubric_dimensions = '[{"dimension":"narrates_while_coding","description":"Did they think out loud continuously?"},{"dimension":"explores_alternatives","description":"Did they consider more than one approach when prompted?"}]'
WHERE display_order = 20;

-- 21: Bloomberg / theory real-time financial system clarifying questions
UPDATE interview_questions SET
  opening_prompt = 'Before designing anything, what do you need me to clarify?',
  expected_follow_ups = '[{"trigger":"if_no_clarifying_questions","question":"What does real-time mean here, precisely - milliseconds, seconds?"}]',
  rubric_dimensions = '[{"dimension":"asks_before_designing","description":"Did they ask clarifying questions before proposing a design?"},{"dimension":"latency_precision","description":"Did they specifically probe what real-time means numerically?"}]'
WHERE display_order = 21;

-- 22: Stripe / rate limiter with burst allowance
UPDATE interview_questions SET
  opening_prompt = 'Start with the base implementation - I will ask for the extension once that is solid.',
  hint_ladder = '["A fixed window counter is the simplest starting point - count requests, reset every window.", "What is the problem with a fixed window right at the boundary between two windows?", "A sliding window or token bucket avoids letting someone double up right at that boundary."]',
  expected_follow_ups = '[{"trigger":"after_base_implementation","question":"Now add the burst allowance - how would you let a user exceed the steady rate briefly?"},{"trigger":"if_fixed_window_only","question":"What happens right at the boundary between two windows?"}]',
  optimal_complexity = 'O(1) per request check',
  rubric_dimensions = '[{"dimension":"handles_followup_twist","description":"Did they cleanly extend their base solution for burst allowance?"},{"dimension":"boundary_awareness","description":"Did they independently spot the fixed-window boundary issue?"}]'
WHERE display_order = 22;

-- 23: Stripe / CSV transaction parsing
UPDATE interview_questions SET
  opening_prompt = 'Assume this data is messy in ways you have not seen yet - what is your plan for handling that?',
  hint_ladder = '["What should happen when a row has the wrong number of fields?", "Should a malformed row stop the whole parse, or just get skipped and logged?", "A robust parser usually isolates failures per-row rather than failing the entire batch."]',
  expected_follow_ups = '[{"trigger":"after_first_working_solution","question":"What specific malformed inputs did you actually test against?"},{"trigger":"if_no_error_handling","question":"What happens right now if one row is missing a field?"}]',
  rubric_dimensions = '[{"dimension":"error_isolation","description":"Did they isolate row-level failures rather than letting one bad row break everything?"},{"dimension":"test_coverage_proactive","description":"Did they proactively name specific malformed-input cases?"}]'
WHERE display_order = 23;

-- 24: Stripe / behavioral urgency vs correctness
UPDATE interview_questions SET
  opening_prompt = 'I want to hear both halves clearly - the urgency, and the safeguard.',
  expected_follow_ups = '[{"trigger":"if_only_urgency_shown","question":"What specifically did you do to make sure moving fast did not introduce a new problem?"}]',
  rubric_dimensions = '[{"dimension":"urgency_shown","description":"Did they demonstrate genuine speed/priority?"},{"dimension":"safeguard_named","description":"Did they name a specific safeguard, not just I was careful?"}]'
WHERE display_order = 24;

-- VERIFICATION QUERY — expect 24 rows, all with non-null opening_prompt and
-- non-empty rubric_dimensions; hint_ladder/optimal_complexity populated
-- only on the 10 coding-type rows
SELECT display_order, question_type,
       (opening_prompt IS NOT NULL) AS has_opening,
       jsonb_array_length(hint_ladder) AS hint_count,
       jsonb_array_length(expected_follow_ups) AS followup_count,
       optimal_complexity,
       jsonb_array_length(rubric_dimensions) AS rubric_count
FROM interview_questions
ORDER BY display_order;
-- Migration 043: Graphs extension — Union-Find, MST, Dijkstra
-- Extends the existing 10-concept Graphs topic to 13. All URLs
-- individually verified via live search on 2026-09-08.

INSERT INTO concepts
  (id, topic_id, name, definition, proficiency_level, importance_weight, canonical_keywords, display_order)
VALUES
('graph_union_find', 'graphs',
 'Union-Find (Disjoint Set)',
 'A data structure that tracks a partition of elements into disjoint sets, supporting efficient union (merge two sets) and find (which set does an element belong to) operations. With path compression and union by rank, both run in near-constant amortized time.',
 'interview', 3,
 ARRAY['union find','disjoint set','path compression','union by rank','find set'], 11),

('graph_mst', 'graphs',
 'Minimum Spanning Tree',
 'The subset of edges connecting all vertices in a weighted graph at the minimum possible total edge weight, with no cycles. Kruskal''s algorithm sorts edges and adds them via Union-Find if they do not form a cycle; Prim''s algorithm grows a tree greedily from a starting vertex, using the same overall pattern as Dijkstra''s algorithm.',
 'interview', 3,
 ARRAY['minimum spanning tree','kruskal','prim','MST'], 12),

('graph_dijkstra', 'graphs',
 'Dijkstra''s Algorithm',
 'Finding the shortest path from a source vertex to every other vertex in a weighted graph with non-negative edge weights, using a priority queue to always expand the currently-closest unvisited vertex next. A greedy algorithm — it is also the weighted generalization of BFS.',
 'interview', 3,
 ARRAY['dijkstra','shortest path','weighted graph','priority queue shortest path'], 13);

INSERT INTO concept_prerequisites (concept_id, prerequisite_id) VALUES
('graph_mst', 'graph_union_find'),
('graph_dijkstra', 'graph_bfs');

INSERT INTO concept_misconceptions
  (concept_id, misconception, correction, trigger_phrases)
VALUES
('graph_union_find',
 'Union-Find requires re-scanning every element to answer a find query',
 'Path compression flattens the path to the root on every find call, so repeated finds on the same or nearby elements become nearly O(1) after the first — it is not a fresh full scan each time.',
 ARRAY['scans every element','full scan each time','linear every call']),

('graph_mst',
 'A minimum spanning tree is the same as the shortest path tree from a single source',
 'MST minimizes the total weight of all edges connecting every vertex; a shortest-path tree (like Dijkstra produces) minimizes distance FROM ONE specific source to every vertex. These can genuinely be different trees on the same graph.',
 ARRAY['same as shortest path','same as dijkstra tree','identical trees']),

('graph_dijkstra',
 'Dijkstra''s algorithm works correctly with negative edge weights, just more slowly',
 'Dijkstra''s greedy assumption — once a vertex is finalized its shortest distance can never improve — breaks entirely with negative edges. It can produce a WRONG answer, not just a slower one. Bellman-Ford is needed for graphs with negative weights.',
 ARRAY['works with negative','just slower','still correct with negative weights']);

INSERT INTO concept_resources (concept_id, title, url) VALUES
('graph_union_find', 'Introduction to Disjoint Set (Union-Find)', 'https://www.geeksforgeeks.org/dsa/introduction-to-disjoint-set-data-structure-or-union-find-algorithm/'),
('graph_mst', 'Kruskal''s Minimum Spanning Tree Algorithm', 'https://www.geeksforgeeks.org/dsa/kruskals-minimum-spanning-tree-algorithm-greedy-algo-2/'),
('graph_dijkstra', 'Dijkstra''s Shortest Path Algorithm', 'https://www.geeksforgeeks.org/dsa/dijkstras-shortest-path-algorithm-greedy-algo-7/');

INSERT INTO concept_practice_problems (concept_id, platform, title, url, difficulty, display_order) VALUES
('graph_union_find', 'LeetCode', 'Number of Provinces', 'https://leetcode.com/problems/number-of-provinces/', 'Medium', 1),
('graph_union_find', 'LeetCode', 'Redundant Connection', 'https://leetcode.com/problems/redundant-connection/', 'Medium', 2),
('graph_mst', 'LeetCode', 'Min Cost to Connect All Points', 'https://leetcode.com/problems/min-cost-to-connect-all-points/', 'Medium', 1),
('graph_dijkstra', 'LeetCode', 'Network Delay Time', 'https://leetcode.com/problems/network-delay-time/', 'Medium', 1);

UPDATE concepts SET real_world_example = 'A social network merging two friend groups into one the moment a mutual connection is discovered, and instantly answering "are these two people in the same network?" without re-scanning everyone.' WHERE id = 'graph_union_find';
UPDATE concepts SET real_world_example = 'An internet provider deciding which cables to lay between cities to connect every city to the network at the lowest total cost.' WHERE id = 'graph_mst';
UPDATE concepts SET real_world_example = 'A GPS app finding the fastest route to a destination, accounting for road-specific travel times rather than just the fewest turns.' WHERE id = 'graph_dijkstra';

-- VERIFICATION QUERY — expect 3 new concepts, each with a prereq
-- listed (except union_find, which is correctly a new root), 1
-- misconception, 1 resource, 1-2 problems, and a real-world example
SELECT c.id, c.name,
       (SELECT count(*) FROM concept_prerequisites WHERE concept_id = c.id) AS prereqs,
       (SELECT count(*) FROM concept_misconceptions WHERE concept_id = c.id) AS misconceptions,
       (SELECT count(*) FROM concept_resources WHERE concept_id = c.id) AS resources,
       (SELECT count(*) FROM concept_practice_problems WHERE concept_id = c.id) AS problems,
       (c.real_world_example IS NOT NULL) AS has_example
FROM concepts c
WHERE c.id IN ('graph_union_find', 'graph_mst', 'graph_dijkstra');
-- Migration 044: Patterns extension — Greedy Algorithms
-- Extends the existing 6-concept Patterns topic to 7. All URLs
-- individually verified via live search on 2026-09-08.

INSERT INTO concepts
  (id, topic_id, name, definition, proficiency_level, importance_weight, canonical_keywords, display_order)
VALUES
('pat_greedy', 'patterns',
 'Greedy Algorithms',
 'Making the locally optimal choice at each step without reconsidering previous choices, betting that a sequence of local optima leads to a global optimum. Only works when a problem has the greedy-choice property and optimal substructure — Dijkstra''s and Kruskal''s algorithms are both greedy, while 0/1 Knapsack is a classic case where greedy fails and DP is needed instead.',
 'interview', 3,
 ARRAY['greedy algorithm','greedy choice','locally optimal','local optimum'], 7);

INSERT INTO concept_prerequisites (concept_id, prerequisite_id) VALUES
('pat_greedy', 'pat_merge_intervals');

INSERT INTO concept_misconceptions
  (concept_id, misconception, correction, trigger_phrases)
VALUES
('pat_greedy',
 'A greedy algorithm always gives the correct optimal answer',
 'Greedy only works when the problem actually has the greedy-choice property. For problems like 0/1 Knapsack, where item choices interact, a greedy approach gives a WRONG answer — dynamic programming is needed instead.',
 ARRAY['always optimal','always works','always gives best answer']);

INSERT INTO concept_resources (concept_id, title, url) VALUES
('pat_greedy', 'Introduction to Greedy Algorithms', 'https://www.geeksforgeeks.org/dsa/introduction-to-greedy-algorithm-data-structures-and-algorithm-tutorials/');

INSERT INTO concept_practice_problems (concept_id, platform, title, url, difficulty, display_order) VALUES
('pat_greedy', 'LeetCode', 'Jump Game', 'https://leetcode.com/problems/jump-game/', 'Medium', 1),
('pat_greedy', 'LeetCode', 'Gas Station', 'https://leetcode.com/problems/gas-station/', 'Medium', 2);

UPDATE concepts SET real_world_example = 'A cashier making change with the fewest coins by always giving the largest coin that does not overshoot — works for standard currency, but would not work for an unusual coin system.' WHERE id = 'pat_greedy';

-- VERIFICATION QUERY — expect 1 row, 1 prereq, 1 misconception,
-- 1 resource, 2 problems, real-world example present
SELECT c.id, c.name,
       (SELECT count(*) FROM concept_prerequisites WHERE concept_id = c.id) AS prereqs,
       (SELECT count(*) FROM concept_misconceptions WHERE concept_id = c.id) AS misconceptions,
       (SELECT count(*) FROM concept_resources WHERE concept_id = c.id) AS resources,
       (SELECT count(*) FROM concept_practice_problems WHERE concept_id = c.id) AS problems,
       (c.real_world_example IS NOT NULL) AS has_example
FROM concepts c
WHERE c.id = 'pat_greedy';
