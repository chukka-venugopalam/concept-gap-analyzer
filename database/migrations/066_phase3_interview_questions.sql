-- Migration 066: Interview-question backfill for the 4 Phase 3
-- pro-tier topics/extensions — Math & Number Theory, Advanced Trees,
-- Advanced Graphs II, Advanced Strings
-- All had zero interview_questions rows (they were only just created
-- in 056-063). Follows the 046-style single-INSERT convention, same as
-- 055/064/065. display_order continues from 55 -> 56-63.
-- All 8 LeetCode problems below are ALREADY LIVE in this schema as
-- verified concept_practice_problems entries (057/059/061/063) —
-- reused here rather than re-verified.

INSERT INTO interview_questions
  (concept_id, question_type, company, prompt, difficulty, company_note, reference_notes,
   opening_prompt, hint_ladder, expected_follow_ups, optimal_complexity, rubric_dimensions, display_order)
VALUES

('math_fast_exponentiation', 'coding', 'Google',
 'Pow(x, n) (https://leetcode.com/problems/powx-n/) — implement pow(x, n), computing x raised to the integer power n.',
 'Medium',
 'A deceptively simple-looking question Google uses to check whether a candidate defaults to O(n) repeated multiplication or reaches for the O(log n) fast-exponentiation recurrence.',
 'x^n = (x^(n/2))^2 when n is even, or x * x^(n-1) when n is odd — halving the exponent at each step gives O(log n) multiplications instead of n.',
 'What is the straightforward O(n) way to compute this first?',
 '["If you already know x^(n/2), how could you get x^n from it with just one more multiplication?", "What changes about that approach when n is odd instead of even?", "What do you need to handle specially about negative exponents?"]',
 '[{"trigger":"if_only_on_given","question":"That works but is O(n) — can you get this down to O(log n) using repeated squaring?"}]',
 'O(log n) time, O(log n) space recursively or O(1) iteratively',
 '[{"dimension":"recurrence_correct","description":"Did they correctly derive both the even-exponent and odd-exponent cases of the halving recurrence?"},{"dimension":"negative_exponent_handled","description":"Did they correctly handle a negative n, typically by computing 1 / x^(-n)?"},{"dimension":"complexity_stated","description":"Did they state O(log n) unprompted and explain why halving the exponent gives that bound?"}]',
 56),

('math_sieve', 'coding', 'Amazon',
 'Count Primes (https://leetcode.com/problems/count-primes/) — count the number of primes strictly less than a given integer n.',
 'Medium',
 'The canonical LeetCode problem for forcing a Sieve of Eratosthenes approach — testing each number individually for primality is correct but too slow to pass for large n, which is the whole point of the question.',
 'Mark a boolean array of size n as all prime initially, then for each number starting from 2, if it is still marked prime, mark all of its multiples (starting from its square) as composite.',
 'If you tested each number from 2 to n individually for primality, what would that cost, and would it be fast enough here?',
 '["Instead of testing each number alone, could you eliminate many numbers at once by their known factors?", "Once you know 2 is prime, what does that immediately tell you about every multiple of 2?", "Why is it safe to start marking a prime p''s multiples at p*p instead of 2*p?"]',
 '[{"trigger":"if_per_number_trial_division_given","question":"That is correct but too slow for large n — can you eliminate multiple composite numbers at once instead of checking each individually?"}]',
 'O(n log log n) time, O(n) space',
 '[{"dimension":"sieve_recognized","description":"Did they recognize this needs the Sieve of Eratosthenes rather than per-number trial division, given the problem''s scale?"},{"dimension":"starts_at_square","description":"Did they start marking a prime''s multiples at its square rather than 2x, avoiding redundant work?"},{"dimension":"off_by_one_correct","description":"Did they correctly count primes STRICTLY LESS than n, not including n itself?"}]',
 57),

('adv_segment_tree', 'coding', 'Bloomberg',
 'Range Sum Query - Mutable (https://leetcode.com/problems/range-sum-query-mutable/) — support both updating an element and querying the sum of a range, repeatedly, efficiently.',
 'Medium',
 'The presence of BOTH frequent updates and frequent range queries in the same problem is the signal Bloomberg interviewers look for — a prefix-sum array alone (O(1) query) becomes O(n) per update, which is the trap this question is designed to expose.',
 'Build a segment tree where each node stores the sum of a range; both a point update and a range-sum query touch only O(log n) nodes on the path from a leaf (or a small set of paths) up toward the root.',
 'Why might a simple prefix-sum array, which gives O(1) range queries, actually perform poorly here?',
 '["If you update one element in a prefix-sum array, how much of the array needs to change?", "What is different about a segment tree that lets both operations stay fast even with frequent updates?", "How many nodes does a single point update actually need to touch in a segment tree, and why?"]',
 '[{"trigger":"if_prefix_sum_given","question":"That gives fast queries but what happens to update cost with a prefix-sum array? Can you find a structure that keeps both fast?"}]',
 'O(log n) per update and per query, O(n) space',
 '[{"dimension":"recognizes_prefix_sum_tradeoff","description":"Did they recognize that a prefix-sum array trades away update speed for query speed, and that this problem needs both?"},{"dimension":"segment_tree_correct","description":"Did they correctly implement both update and query as O(log n) tree traversals?"},{"dimension":"complexity_stated","description":"Did they state O(log n) for both operations unprompted?"}]',
 58),

('adv_fenwick_tree', 'coding', 'Uber',
 'Count of Smaller Numbers After Self (https://leetcode.com/problems/count-of-smaller-numbers-after-self/) — for each element, count how many elements to its right are smaller than it.',
 'Hard',
 'A well-known Fenwick Tree application at Uber specifically because the brute-force O(n^2) approach is easy to write but clearly too slow, pushing candidates toward a Fenwick-Tree-over-ranks solution.',
 'Process the array from right to left, using a Fenwick Tree indexed by (compressed) value rank to maintain a running count of how many numbers smaller than the current one have been seen so far, querying before inserting each element.',
 'What is the O(n^2) brute-force approach here, and why would it likely be too slow?',
 '["If you process elements from right to left, what running information would let you answer each element''s count in less than O(n) time?", "How can a Fenwick Tree, normally used for prefix sums, be adapted to count how many values SEEN SO FAR are smaller than a given value?", "Since raw values might be large or sparse, what technique lets you use them as compact Fenwick Tree indices?"]',
 '[{"trigger":"if_bruteforce_given","question":"That is O(n^2) — can you process the array in one direction while maintaining counts in a Fenwick Tree indexed by value rank?"}]',
 'O(n log n) time (coordinate compression plus n Fenwick Tree operations), O(n) space',
 '[{"dimension":"direction_correct","description":"Did they process the array right-to-left so that each Fenwick Tree query reflects only elements already seen (to the right)?"},{"dimension":"coordinate_compression","description":"Did they apply coordinate compression to map values to compact Fenwick Tree indices?"},{"dimension":"query_before_insert","description":"Did they correctly query the count BEFORE inserting the current element, to avoid counting an element against itself?"}]',
 59),

('graph_bellman_ford', 'coding', 'Netflix',
 'Cheapest Flights Within K Stops (https://leetcode.com/problems/cheapest-flights-within-k-stops/) — find the cheapest price from a source to a destination city using at most k stops.',
 'Medium',
 'A well-known Bellman-Ford application specifically because Dijkstra''s greedy finalize-once assumption does not respect the "at most k stops" constraint the way Bellman-Ford''s iteration-by-iteration relaxation naturally does.',
 'Run k+1 rounds of edge relaxation (one per allowed flight/edge in the path), using a SNAPSHOT of the previous round''s distances at the start of each round, so that each round only allows paths using one more edge than the last.',
 'Why might Dijkstra''s algorithm, normally used for cheapest-path problems, not directly respect the "at most k stops" limit here?',
 '["What does each round of Bellman-Ford-style edge relaxation add to the maximum path length considered so far?", "Why is it important to use a snapshot (copy) of the previous round''s distances, rather than updating distances in place during a round?", "How many rounds of relaxation correspond to allowing at most k stops?"]',
 '[{"trigger":"if_dijkstra_given","question":"Standard Dijkstra doesn''t respect a stop limit well — can you adapt Bellman-Ford''s round-by-round relaxation to enforce it instead?"}]',
 'O(k * E) time, where E is the number of flights, O(n) space',
 '[{"dimension":"stop_limit_respected","description":"Did their solution correctly cap the number of edges/stops used, rather than finding the unconstrained cheapest path?"},{"dimension":"snapshot_used","description":"Did they use a snapshot of distances from the start of each round, avoiding using a same-round update within a single relaxation pass?"},{"dimension":"complexity_stated","description":"Did they correctly relate the number of relaxation rounds to k+1?"}]',
 60),

('graph_bridges_articulation', 'coding', 'Microsoft',
 'Critical Connections in a Network (https://leetcode.com/problems/critical-connections-in-a-network/) — find all connections (bridges) whose removal would disconnect part of the network.',
 'Hard',
 'A well-known application of Tarjan''s bridge-finding algorithm — the naive approach of removing each edge and re-checking connectivity is correct but far too slow for the problem''s constraints, which is the signal Microsoft interviewers look for candidates to notice.',
 'Run a single DFS tracking each node''s discovery time and low-link value (the earliest-discovered node reachable from its subtree via a back edge); an edge (u,v) is a bridge exactly when low[v] > disc[u].',
 'What would the brute-force approach of removing each edge one at a time and re-checking connectivity cost, and why is that likely too slow here?',
 '["Can you find all bridges using just ONE traversal of the graph, instead of one traversal per edge?", "What does it mean for a node''s subtree to have no way back up to or above its parent through some other edge?", "How do discovery time and low-link value together let you detect that condition?"]',
 '[{"trigger":"if_bruteforce_given","question":"That is correct but too slow — can you find every bridge in a single DFS pass using discovery time and low-link values?"}]',
 'O(V + E) time and space',
 '[{"dimension":"single_dfs_recognized","description":"Did they move away from a per-edge removal-and-recheck approach toward a single DFS pass?"},{"dimension":"low_link_correct","description":"Did they correctly compute low-link values, updating from both tree edges and back edges appropriately?"},{"dimension":"bridge_condition_correct","description":"Did they correctly apply low[v] > disc[u] as the bridge condition, and correctly skip the edge back to a node''s immediate parent?"}]',
 61),

('str_manacher', 'coding', 'Meta',
 'Longest Palindromic Substring (https://leetcode.com/problems/longest-palindromic-substring/) — find the longest substring of a string that is a palindrome.',
 'Medium',
 'Almost always first solved with O(n^2) center-expansion at Meta, then used as a springboard to ask whether a candidate is aware of the O(n) Manacher''s algorithm approach as a follow-up.',
 'Center-expansion checks every possible center (2n-1 of them, accounting for even-length palindromes) and expands outward in O(n) per center, giving O(n^2) total. Manacher''s algorithm avoids re-expanding from scratch at each center by reusing information from a mirror position within the rightmost palindrome found so far.',
 'What is the straightforward center-expansion approach here, and what is its time complexity?',
 '["How many possible centers does a string of length n have, once you account for both odd- and even-length palindromes?", "At each center, how much work does naive expansion do in the worst case?", "Are you aware of any linear-time approach to this exact problem?"]',
 '[{"trigger":"if_only_on2_given","question":"That is a fully acceptable answer for most interviews — are you familiar with Manacher''s algorithm, which solves this in O(n)?"}]',
 'O(n^2) with center expansion; O(n) with Manacher''s algorithm',
 '[{"dimension":"center_expansion_correct","description":"Did they correctly handle BOTH odd-length (single center) and even-length (between two characters) palindrome cases?"},{"dimension":"complexity_stated","description":"Did they correctly state O(n^2) for center expansion unprompted?"},{"dimension":"aware_of_optimal","description":"Even if not implementing it, could they name or describe Manacher''s algorithm as the O(n) optimal approach?"}]',
 62),

('str_rabin_karp', 'coding', 'Apple',
 'Longest Duplicate Substring (https://leetcode.com/problems/longest-duplicate-substring/) — find the longest substring that occurs at least twice in a string (possibly overlapping).',
 'Hard',
 'A well-known binary-search-plus-Rabin-Karp combination question — the binary search is on the ANSWER (candidate substring length), with Rabin-Karp used to check in roughly linear time whether any duplicate of that length exists.',
 'Binary search over possible substring lengths L; for each candidate L, use a rolling hash to compute the hash of every length-L window in O(n) total, and check for a hash collision (confirmed with a direct character comparison) indicating a duplicate.',
 'If you fixed a candidate length L, how quickly could you check whether ANY duplicate substring of exactly that length exists?',
 '["Why might binary searching over the possible ANSWER LENGTH, rather than searching directly for the substring, make this problem more tractable?", "For a fixed length L, how does a rolling hash let you check all windows of that length in roughly O(n) instead of O(n * L)?", "Why is a direct character comparison still needed even after two windows'' hashes match?"]',
 '[{"trigger":"if_stuck_on_approach","question":"Have you considered binary searching on the length of the duplicate substring, and using Rabin-Karp to check each candidate length quickly?"}]',
 'O(n log n) time overall (O(log n) binary search steps, each an O(n) Rabin-Karp scan), O(n) space',
 '[{"dimension":"binary_search_on_answer","description":"Did they recognize this as binary search on the answer (candidate length), rather than trying to directly enumerate substrings?"},{"dimension":"rolling_hash_correct","description":"Did they correctly implement a rolling hash to check all windows of a fixed length in roughly linear time?"},{"dimension":"collision_check_included","description":"Did they include a character-by-character confirmation on a hash match, to rule out a collision?"}]',
 63);

-- VERIFICATION QUERY — expect 8 rows, display_order 56-63, covering all
-- 4 Phase 3 topics/extensions
SELECT concept_id, question_type, company, difficulty, display_order,
       (opening_prompt IS NOT NULL) AS has_opening_prompt,
       (hint_ladder IS NOT NULL) AS has_hints,
       (rubric_dimensions IS NOT NULL) AS has_rubric
FROM interview_questions
WHERE display_order BETWEEN 56 AND 63
ORDER BY display_order;
