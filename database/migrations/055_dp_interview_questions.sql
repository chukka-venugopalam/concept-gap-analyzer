-- Migration 055: Dynamic Programming interview questions
-- DP had zero interview_questions rows across all of 036/040/046 —
-- confirmed by grep before writing this (the only DP concept ever
-- referenced there was via dp_apsp's practice problem, not an
-- interview_questions row). Closes out Phase 2 alongside 054.
-- Follows the newest single-INSERT convention (046's format, all rubric
-- fields inline) rather than the older 036+042 insert-then-backfill split.
-- display_order continues the existing global sequence: 036 used 1-12,
-- 040 used 13-24, 046 used 25-36 — confirmed by parsing all three files'
-- actual VALUES tuples before writing this, not assumed. This batch is
-- 37-44.
-- All 8 LeetCode problems below are ALREADY LIVE in this schema as
-- verified concept_practice_problems entries (017/024/054) — reused
-- here rather than re-verified, since they're already-trusted rows in
-- this same database, not new claims.
-- Same honesty framing as 036: company_note is documented interview
-- style/pattern from research, not a claim that a specific company
-- asked this exact question on a specific date.

INSERT INTO interview_questions
  (concept_id, question_type, company, prompt, difficulty, company_note, reference_notes,
   opening_prompt, hint_ladder, expected_follow_ups, optimal_complexity, rubric_dimensions, display_order)
VALUES

('dp_knapsack', 'coding', 'Amazon',
 'Partition Equal Subset Sum (https://leetcode.com/problems/partition-equal-subset-sum/) — determine if an array can be split into two subsets with equal sum.',
 'Medium',
 'Amazon interviews commonly pair a knapsack-shaped coding problem with a Leadership Principles discussion right after — the framing is usually practical ("split inventory into two equal-value shipments") rather than named as 0/1 Knapsack outright.',
 'Reduces to: can a subset sum to total/2? That is 0/1 Knapsack with target = sum/2 and each number used at most once.',
 'Before coding, tell me what has to be true about the total sum for a split to even be possible.',
 '["What has to be true about the total sum before any split is possible?", "If a subset summing to exactly total/2 exists, does the rest automatically also sum to total/2?", "This is now: can any subset of the array sum to a specific target — a shape you may recognize."]',
 '[{"trigger":"after_first_working_solution","question":"Can you reduce the space from O(n * target) to O(target) with a 1D array? What order must you iterate the target dimension in, and why?"}]',
 'O(n * sum) time, O(sum) space with a 1D rolling array',
 '[{"dimension":"reduction_recognized","description":"Did they recognize this as 0/1 Knapsack with target = sum/2, rather than trying to enumerate splits directly?"},{"dimension":"odd_sum_handled","description":"Did they check that an odd total sum makes an equal split immediately impossible?"},{"dimension":"space_optimization","description":"Did they know to iterate the target dimension backward when compressing to 1D, to avoid reusing an item twice?"}]',
 37),

('dp_lcs', 'coding', 'Google',
 'Longest Common Subsequence (https://leetcode.com/problems/longest-common-subsequence/) — find the length of the longest subsequence common to two strings.',
 'Medium',
 'Dynamic programming is described in interview-prep research as one of Google''s most consistently tested topics, and LCS specifically as a common entry point into 2D string DP before harder variants (edit distance, interleaving strings) are explored as follow-ups.',
 'dp[i][j] = dp[i-1][j-1] + 1 if the characters match, else max(dp[i-1][j], dp[i][j-1]).',
 'Walk me through the two cases for dp[i][j] before writing any code — what happens when the characters match, and when they do not?',
 '["What information do you need about shorter prefixes of both strings to solve this for the full strings?", "If the last characters of both prefixes match, how does that extend a smaller answer?", "If they do not match, which two smaller subproblems could still contain the answer?"]',
 '[{"trigger":"after_first_working_solution","question":"Can you reduce the space to O(min(m,n)) instead of O(m*n)? What has to change about how you index into the smaller dimension?"},{"trigger":"if_finished_quickly","question":"How would you modify this to also reconstruct the actual subsequence, not just its length?"}]',
 'O(m*n) time, O(m*n) space (O(min(m,n)) with a rolling array)',
 '[{"dimension":"recurrence_correct","description":"Did they correctly state both cases of the recurrence before coding?"},{"dimension":"base_case_clear","description":"Did they correctly handle the empty-prefix base case (row/column of zeros)?"},{"dimension":"complexity_stated","description":"Did they state O(m*n) time/space unprompted?"}]',
 38),

('dp_lis', 'coding', 'Meta',
 'Longest Increasing Subsequence (https://leetcode.com/problems/longest-increasing-subsequence/) — find the length of the longest strictly increasing subsequence.',
 'Medium',
 'A recurring "can you beat your own solution" question — the naive O(n^2) DP is a reasonable starting point, but interviewers commonly push for the O(n log n) patience-sorting approach as a follow-up.',
 'O(n^2): dp[i] = 1 + max(dp[j]) for all j < i where nums[j] < nums[i]. O(n log n): maintain the smallest possible tail of an increasing subsequence for each length, using binary search to place each new number.',
 'Start with the most straightforward correct approach you can think of — we will optimize after.',
 '["For a subsequence ending at index i, what do you need to know about earlier elements?", "Once you have a working O(n^2) solution, is there information you are recomputing that could be maintained incrementally instead?", "What is the smallest possible tail value for an increasing subsequence of a given length, and how would binary search help you update that?"]',
 '[{"trigger":"if_only_on2_given","question":"That works — can you get this to O(n log n)? What would you binary search over?"}]',
 'O(n^2) naive DP; O(n log n) optimal with binary search over subsequence tails',
 '[{"dimension":"naive_correct","description":"Did they arrive at a correct O(n^2) solution first?"},{"dimension":"optimization_direction","description":"When pushed, did they reason toward binary search rather than guessing unrelated optimizations?"},{"dimension":"distinguishes_length_vs_reconstruction","description":"Did they notice that the patience-sorting array does not directly hold a valid subsequence, only its length?"}]',
 39),

('dp_unbounded_knapsack', 'coding', 'Microsoft',
 'Coin Change (https://leetcode.com/problems/coin-change/) — find the fewest coins needed to make a given amount, or -1 if impossible.',
 'Medium',
 'Reported as a common Microsoft coding-round staple — the emphasis is on clean handling of the impossible case (-1) as much as the DP itself.',
 'dp[amount] = 1 + min(dp[amount - coin]) over all coins where amount - coin >= 0, with dp[0] = 0 and unreachable amounts left at infinity/-1.',
 'What should dp[0] represent, and why is that a sensible base case here?',
 '["Since each coin can be reused, what does that tell you about which row of a 2D table you would reference?", "How do you represent an amount that cannot be reached with any combination of coins?", "What is the correct way to initialize the dp array so unreached amounts are distinguishable from amount 0?"]',
 '[{"trigger":"after_first_working_solution","question":"How would this change if you needed the NUMBER OF WAYS to make the amount instead of the fewest coins? (Coin Change II)"}]',
 'O(amount * number of coins) time, O(amount) space',
 '[{"dimension":"unbounded_recognized","description":"Did they correctly reuse the current row/array (not the previous one), since coins can repeat?"},{"dimension":"impossible_case_handled","description":"Did they correctly return -1 (not 0 or a garbage large value) when the amount is unreachable?"},{"dimension":"initialization_correct","description":"Did they initialize the dp array to a sentinel larger than any possible answer, not zero?"}]',
 40),

('dp_grid_paths', 'coding', 'Bloomberg',
 'Unique Paths (https://leetcode.com/problems/unique-paths/) — count the distinct paths from top-left to bottom-right of an m x n grid, moving only right or down.',
 'Medium',
 'A common warm-up-tier DP question reported in Bloomberg''s technical rounds — straightforward once the grid recurrence is recognized, often followed by a request to handle obstacles.',
 'dp[i][j] = dp[i-1][j] + dp[i][j-1], with the entire first row and first column initialized to 1 (exactly one way to reach any cell along an edge).',
 'How many ways are there to reach any cell in the first row, or the first column? Start there.',
 '["From how many directions can you arrive at any interior cell?", "What does that make dp[i][j] in terms of the cells above and to the left of it?", "Do you actually need a full 2D array, or can you get away with one row at a time?"]',
 '[{"trigger":"after_first_working_solution","question":"This has a closed-form combinatorial answer, C(m+n-2, m-1) — can you see why?"},{"trigger":"if_finished_quickly","question":"How would you handle the same problem if some grid cells were blocked obstacles?"}]',
 'O(m*n) time; O(n) space with a single rolling row, or O(1) extra with the combinatorial formula',
 '[{"dimension":"recurrence_correct","description":"Did they correctly derive dp[i][j] = dp[i-1][j] + dp[i][j-1]?"},{"dimension":"base_case_clear","description":"Did they correctly initialize the first row and column to 1 rather than 0?"},{"dimension":"space_awareness","description":"Did they recognize the space can be reduced to O(n), or better, without being told?"}]',
 41),

('dp_state_machine', 'coding', 'Uber',
 'Best Time to Buy and Sell Stock with Cooldown (https://leetcode.com/problems/best-time-to-buy-and-sell-stock-with-cooldown/) — maximize profit from stock trades where a sell must be followed by at least one cooldown day before the next buy.',
 'Medium',
 'A recurring choice for testing whether a candidate can extend the basic buy/sell-stock recurrence to a genuinely stateful version, rather than one they may have memorized in its unconstrained form.',
 'Track three states per day: holding a share, just sold (cooldown), and free to buy. Each transitions only from the states that could legally precede it the day before.',
 'Before coding, tell me: on any given day, what are all the distinct situations you could be in?',
 '["Besides holding or not holding a share, is there a third situation the cooldown rule forces you to track?", "For each of the three states, which states from the PREVIOUS day could legally transition into it?", "Can these three running values be updated with O(1) space, without an explicit dp array?"]',
 '[{"trigger":"if_only_two_states_used","question":"With only holding/not-holding as states, how would you enforce the cooldown rule after a sell?"}]',
 'O(n) time, O(1) space (three running values)',
 '[{"dimension":"third_state_identified","description":"Did they identify the cooldown state as distinct from plain not-holding, unprompted?"},{"dimension":"transitions_correct","description":"Did they correctly derive which prior-day states feed into each of today''s three states?"},{"dimension":"space_optimized","description":"Did they collapse the DP to O(1) space rather than keeping a full array across all days?"}]',
 42),

(NULL, 'theory', 'Google',
 'How do you recognize when a problem calls for dynamic programming, as opposed to plain recursion, a greedy approach, or backtracking?',
 NULL,
 'Google interviewers are described as probing this kind of pattern-recognition reasoning directly, not just waiting for it to show up implicitly while a candidate solves a problem.',
 'A strong answer names optimal substructure and overlapping subproblems specifically, distinguishes DP from greedy via counterexamples where the greedy choice is not always optimal, and distinguishes it from backtracking by noting DP reuses overlapping subproblem results rather than exploring and discarding.',
 'Take a moment - I want your general framework, not a specific problem walkthrough.',
 '["What two properties does a problem need for DP to apply at all?", "Can you give an example where a greedy, locally-optimal choice would fail, but DP succeeds?", "How is DP different from plain backtracking, if both explore choices recursively?"]',
 '[{"trigger":"if_answer_stays_vague","question":"Can you give a concrete example of a problem where greedy fails but DP works, to make this concrete?"}]',
 NULL,
 '[{"dimension":"two_properties_named","description":"Did they explicitly name optimal substructure and overlapping subproblems?"},{"dimension":"greedy_contrast","description":"Did they give a genuine counterexample where greedy fails, not just assert DP is more general?"},{"dimension":"backtracking_contrast","description":"Did they articulate that DP''s advantage over backtracking is reusing overlapping subproblem results, not just that it is faster?"}]',
 43),

('dp_bitmask', 'coding', 'Netflix',
 'Partition to K Equal Sum Subsets (https://leetcode.com/problems/partition-to-k-equal-sum-subsets/) — determine if an array can be divided into k non-empty subsets with equal sum.',
 'Medium',
 'A well-known bitmask DP / backtracking crossover question — the small constraint on array length (at most 16 elements) is the signal that an exponential, subset-based state is intended, not a red flag to avoid.',
 'dp[mask] tracks whether the subset of already-used elements represented by mask can be perfectly partitioned so far; transitions try adding each unused element to the current bucket.',
 'Look closely at the constraints before you start — what is the maximum size of the input array here, and why might that number matter?',
 '["Given the constraint that the array has at most 16 elements, what does that suggest about the size of state space you could afford to explore?", "What would a bitmask representing which elements are already placed into a bucket look like?", "How do you know when a full valid partition into k subsets has been reached?"]',
 '[{"trigger":"if_pure_backtracking_only","question":"Your backtracking solution works, but can you memoize on the bitmask of used elements to avoid recomputing the same partial states?"}]',
 'O(k * 2^n) roughly, exponential but tractable given the array-length constraint of at most 16',
 '[{"dimension":"constraint_read_correctly","description":"Did they notice the small n bound as a deliberate signal for an exponential bitmask approach?"},{"dimension":"state_defined_clearly","description":"Did they clearly define what the bitmask state represents before coding?"},{"dimension":"early_pruning","description":"Did they mention pruning impossible branches early, such as when total sum is not divisible by k?"}]',
 44);

-- VERIFICATION QUERY — expect 8 rows, display_order 37-44, all 8 concept_ids
-- either a real DP concept id or NULL (for the one theory row)
SELECT concept_id, question_type, company, difficulty, display_order,
       (opening_prompt IS NOT NULL) AS has_opening_prompt,
       (hint_ladder IS NOT NULL) AS has_hints,
       (rubric_dimensions IS NOT NULL) AS has_rubric
FROM interview_questions
WHERE display_order BETWEEN 37 AND 44
ORDER BY display_order;
