-- Migration 064: Interview-question backfill — Linked Lists, Tries,
-- Sorting Fundamentals, Patterns
-- All 4 of these had ZERO interview_questions rows before this
-- migration (confirmed by grep across 036/040/046/055 before writing
-- this). Closes out the second half of Phase 2.
-- Follows the newest single-INSERT convention (046's format, all rubric
-- fields inline), same as 055. display_order continues the global
-- sequence: 036 used 1-12, 040 used 13-24, 046 used 25-36, 055 used
-- 37-44 (confirmed by parsing all four files' actual VALUES tuples
-- before writing this) -> this batch is 45-52.
-- All 8 LeetCode problems below are ALREADY LIVE in this schema as
-- verified concept_practice_problems entries (021/026/035/039/044) —
-- reused here rather than re-verified, since they're already-trusted
-- rows in this same database, not new claims.
-- Same honesty framing as 036: company_note is documented interview
-- style/pattern from research, not a claim that a specific company
-- asked this exact question on a specific date.

INSERT INTO interview_questions
  (concept_id, question_type, company, prompt, difficulty, company_note, reference_notes,
   opening_prompt, hint_ladder, expected_follow_ups, optimal_complexity, rubric_dimensions, display_order)
VALUES

('ll_reversal', 'coding', 'Amazon',
 'Reverse Linked List (https://leetcode.com/problems/reverse-linked-list/) — reverse a singly linked list and return the new head.',
 'Easy',
 'A very common warm-up question in Amazon''s early phone screens — the interviewer is often more interested in clean pointer handling and the iterative-vs-recursive tradeoff than in raw difficulty.',
 'Track three pointers (previous, current, next) and re-point current.next to previous on each step, advancing all three forward.',
 'Before coding, tell me: how many pointers do you think you will need to track at once, and why?',
 '["What happens to the rest of the list if you just flip one node''s next pointer without saving a reference to what came after it first?", "Can you do this without any extra data structure, using only a constant number of pointer variables?", "How would a recursive version differ in space complexity from the iterative one?"]',
 '[{"trigger":"after_first_working_solution","question":"Can you also write the recursive version, and tell me its space complexity compared to the iterative one?"}]',
 'O(n) time, O(1) space iteratively (O(n) space recursively, due to the call stack)',
 '[{"dimension":"pointer_order_correct","description":"Did they save the next node before overwriting current.next, avoiding losing the rest of the list?"},{"dimension":"handles_empty_and_single","description":"Did their solution correctly handle an empty list and a single-node list without special-casing?"},{"dimension":"space_complexity_contrast","description":"Could they correctly state why the recursive version uses O(n) space via the call stack, while the iterative one is O(1)?"}]',
 45),

('ll_fast_slow', 'coding', 'Meta',
 'Linked List Cycle (https://leetcode.com/problems/linked-list-cycle/) — determine if a linked list has a cycle, using O(1) extra space.',
 'Easy',
 'Frequently used at Meta to check whether a candidate reaches for Floyd''s cycle detection (fast/slow pointers) instead of the more obvious but memory-heavy hash-set-of-visited-nodes approach.',
 'Move one pointer one step at a time and another two steps at a time; if there is a cycle, the fast pointer will eventually lap the slow one and they will meet.',
 'What is the O(n)-space way to solve this first, before we optimize?',
 '["If there IS a cycle, will a pointer moving twice as fast eventually catch up to a slower pointer stuck looping the same cycle?", "Could two pointers moving at different speeds ever meet if the list has no cycle at all?", "What is the loop termination condition for the fast pointer if there is no cycle?"]',
 '[{"trigger":"after_first_working_solution","question":"Can you also find the NODE where the cycle begins, not just whether one exists? (Linked List Cycle II)"}]',
 'O(n) time, O(1) space',
 '[{"dimension":"space_optimized","description":"Did they move from a hash-set approach to the O(1)-space fast/slow pointer technique, ideally without being told to optimize?"},{"dimension":"termination_correct","description":"Did they correctly terminate the loop when the fast pointer (or fast.next) hits null, for the no-cycle case?"},{"dimension":"explains_why_it_works","description":"Could they explain WHY the fast pointer is guaranteed to catch the slow one if a cycle exists, not just that it does?"}]',
 46),

('trie_structure', 'coding', 'Google',
 'Implement Trie (Prefix Tree) (https://leetcode.com/problems/implement-trie-prefix-tree/) — design a trie with insert, search, and startsWith operations.',
 'Medium',
 'A design-style question Google uses to check whether a candidate can build a data structure from its stated properties, rather than just apply an existing one to a problem.',
 'Each trie node needs a way to reference its children (commonly a fixed-size array of 26 for lowercase letters, or a hash map for a larger alphabet) and a marker for whether a complete word ends at that node.',
 'What does each node in your trie need to store to support all three operations?',
 '["What is the difference between search (exact word match) and startsWith (any word has this prefix) in terms of what you check at the end of traversal?", "Why does each node need an explicit end-of-word marker, rather than just checking if a node has no children?", "What happens to your time complexity if you use a hash map instead of a fixed-size array for children — does it change?"]',
 '[{"trigger":"after_first_working_solution","question":"How would you extend this to support deleting a word, including cleaning up now-unnecessary nodes?"}]',
 'O(L) time per operation, where L is the word/prefix length; O(N*L) space for N total characters inserted',
 '[{"dimension":"end_of_word_marker","description":"Did they include an explicit boolean marker for word endings, correctly distinguishing search from startsWith?"},{"dimension":"correct_traversal","description":"Did insert/search/startsWith all correctly walk one character at a time, creating nodes only in insert?"},{"dimension":"complexity_stated","description":"Did they state that each operation is O(L) in the word/prefix length, not O(N) in the number of stored words?"}]',
 47),

('trie_applications', 'coding', 'Amazon',
 'Word Search II (https://leetcode.com/problems/word-search-ii/) — given a grid of letters and a list of words, find all words that can be formed by sequentially adjacent cells.',
 'Hard',
 'A common signal Amazon looks for is whether a candidate recognizes that running a separate DFS per word is far too slow, and reaches for a shared trie of all words to prune the grid search instead.',
 'Build one trie from all the words, then do a single DFS over the grid, walking the trie alongside grid movement — a grid path that runs out of matching trie children can be abandoned immediately, and a trie node marked as a completed word signals a find.',
 'If you searched for each word individually with backtracking, what would go wrong as the word list gets large?',
 '["Instead of searching the grid once per word, could all the words share ONE structure that lets you prune paths that cannot possibly complete any word?", "How does walking the trie alongside your DFS let you stop exploring a grid path early?", "Once a word is found, should its trie node still be searchable again — does anything need to be marked or removed?"]',
 '[{"trigger":"if_only_bruteforce_given","question":"That works but is slow for many words — can you restructure this using a shared trie of all target words instead of searching per word?"}]',
 'O(M*4*3^(L-1)) roughly, where M is grid cells and L is max word length, bounded by trie-based pruning',
 '[{"dimension":"trie_recognized","description":"Did they recognize a shared trie as the right structure to search all words simultaneously, rather than looping DFS per word?"},{"dimension":"pruning_correct","description":"Did their DFS correctly abandon a grid path as soon as no trie child matches the next letter?"},{"dimension":"avoids_duplicate_finds","description":"Did they avoid reporting the same found word twice, such as by marking or removing it from the trie once found?"}]',
 48),

('sort_quicksort', 'coding', 'Microsoft',
 'Sort an Array (https://leetcode.com/problems/sort-an-array/) — implement a sorting algorithm from scratch to sort an array in ascending order.',
 'Medium',
 'Microsoft is reported to occasionally ask candidates to implement a sort by hand specifically to confirm real understanding of partitioning or merging, rather than relying on a language''s built-in sort.',
 'Quicksort: pick a pivot, partition the array so smaller elements are left of the pivot and larger are right, then recursively sort each side. Average O(n log n), but worst case O(n^2) on already-sorted or adversarial input without randomization.',
 'Which sorting algorithm are you most comfortable implementing from memory, and what is its worst-case time complexity?',
 '["What happens to quicksort''s performance if the pivot is always the smallest or largest remaining element?", "How does randomizing or median-of-three pivot selection help avoid that worst case in practice?", "If you chose merge sort instead, what is the tradeoff versus quicksort in terms of extra space?"]',
 '[{"trigger":"after_first_working_solution","question":"Can you explain why your chosen algorithm''s worst case happens, and what practical technique avoids triggering it?"}]',
 'O(n log n) average for quicksort/mergesort; quicksort O(n^2) worst case without randomization, mergesort always O(n log n) but O(n) extra space',
 '[{"dimension":"correct_implementation","description":"Did they correctly implement partitioning (quicksort) or merging (mergesort) without off-by-one errors?"},{"dimension":"worst_case_understood","description":"Could they identify their chosen algorithm''s worst-case input and complexity, not just its average case?"},{"dimension":"space_time_tradeoff","description":"Did they articulate the space-time tradeoff between an in-place approach (quicksort) and a stable one needing extra space (mergesort)?"}]',
 49),

('sort_heapsort', 'coding', 'Bloomberg',
 'K Closest Points to Origin (https://leetcode.com/problems/k-closest-points-to-origin/) — return the k points closest to the origin from a list of points.',
 'Medium',
 'Reported as a common Bloomberg question for checking whether a candidate reaches for a heap-based partial sort instead of fully sorting the entire input when only the top k results are needed.',
 'A max-heap of size k: push points in, and whenever the heap exceeds size k, pop the farthest one — the heap always holds the k closest points seen so far, and never needs to hold more than k at once.',
 'Do you need to fully sort every point by distance, or is there a way to avoid that given you only need the top k?',
 '["If you only need the k closest points, why might sorting the entire array be more work than necessary?", "Why does using a MAX-heap of size k (not a min-heap) let you efficiently discard the farthest points as you go?", "What is the time complexity of this heap approach compared to fully sorting all n points?"]',
 '[{"trigger":"if_full_sort_given","question":"That works — can you do better than sorting all n points, using a heap that never grows past size k?"}]',
 'O(n log k) with a heap of size k, versus O(n log n) for a full sort',
 '[{"dimension":"avoids_full_sort","description":"Did they recognize a full O(n log n) sort is unnecessary overkill when only k results are needed?"},{"dimension":"correct_heap_type","description":"Did they use a max-heap (not min-heap) of size k, so the farthest of the k current candidates is always efficiently accessible to evict?"},{"dimension":"complexity_stated","description":"Did they state O(n log k) unprompted, and explain why it beats O(n log n) when k is much smaller than n?"}]',
 50),

('pat_subsets_backtracking', 'coding', 'Meta',
 'Permutations (https://leetcode.com/problems/permutations/) — return all possible permutations of a distinct-integer array.',
 'Medium',
 'A standard backtracking-template question at Meta, often used as a stepping stone to harder variants (permutations with duplicates, or with additional constraints).',
 'At each recursive step, try placing every not-yet-used number next, recurse, then undo that choice (remove it) before trying the next option — the choose/explore/un-choose backtracking template.',
 'How would you track which numbers have already been used in the current permutation being built?',
 '["At each step of building one permutation, how many choices do you have for the next number?", "After recursing into one choice, what needs to happen before you try the next available choice at that same step?", "How would this change if the input array could contain duplicate numbers, and you needed to avoid duplicate permutations in the output?"]',
 '[{"trigger":"after_first_working_solution","question":"How would you modify this for Permutations II, where the input may contain duplicates and the output must not?"}]',
 'O(n * n!) time (n! permutations, each taking O(n) to build/copy), O(n) additional space for recursion depth',
 '[{"dimension":"backtracking_template","description":"Did they correctly implement choose -> explore -> un-choose, undoing each choice before trying the next?"},{"dimension":"used_tracking_correct","description":"Did they correctly track which elements are already placed in the current permutation, whether via a used array or in-place swapping?"},{"dimension":"complexity_stated","description":"Did they correctly state the O(n * n!) time complexity, accounting for both the number of permutations and the cost to build each?"}]',
 51),

('pat_merge_intervals', 'coding', 'Google',
 'Merge Intervals (https://leetcode.com/problems/merge-intervals/) — given a list of intervals, merge all overlapping ones.',
 'Medium',
 'A frequently reported Google question specifically because the sorting step is easy to forget — without it, deciding which intervals overlap becomes far harder to reason about correctly.',
 'Sort the intervals by start time first. Then scan left to right, merging the current interval into the last one in the result if they overlap (current start <= last end), or appending it as new if they do not.',
 'Before thinking about merging logic, what order do you think it would help to process these intervals in?',
 '["Why does sorting by start time make it possible to only ever compare each interval to the most recently merged one?", "What is the exact condition for two intervals to overlap, once they are in sorted order?", "What should happen to the end of the merged interval when the current interval''s end extends further than the previous merged one''s end?"]',
 '[{"trigger":"if_sort_forgotten","question":"Without sorting first, how would you know which intervals to even compare against each other?"}]',
 'O(n log n) time (dominated by the sort), O(n) or O(log n) space depending on the sort implementation',
 '[{"dimension":"sorts_first","description":"Did they sort by interval start time before attempting to merge, rather than trying to merge in original order?"},{"dimension":"overlap_condition_correct","description":"Did they use the correct overlap condition (current start <= last merged end) and correctly extend the end when needed?"},{"dimension":"complexity_stated","description":"Did they correctly attribute the O(n log n) complexity to the sort, not the linear merge scan?"}]',
 52);

-- VERIFICATION QUERY — expect 8 rows, display_order 45-52, covering
-- linked_lists (2), tries (2), sorting_fundamentals (2), patterns (2)
SELECT concept_id, question_type, company, difficulty, display_order,
       (opening_prompt IS NOT NULL) AS has_opening_prompt,
       (hint_ladder IS NOT NULL) AS has_hints,
       (rubric_dimensions IS NOT NULL) AS has_rubric
FROM interview_questions
WHERE display_order BETWEEN 45 AND 52
ORDER BY display_order;
