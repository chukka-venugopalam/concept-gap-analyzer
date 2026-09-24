-- Migration 067: Theory-question fill for the 6 concepts that still had
-- zero interview_questions after 055/064/065/066 — confirmed via the
-- same query pattern used to find those originally. All 6
-- (math_gcd_lcm, math_modular_arithmetic, math_primality,
-- adv_sparse_table, graph_scc, graph_bipartite_matching) were
-- deliberately left without a coding practice problem earlier because
-- no clean standalone LeetCode problem exists for any of them — that's
-- still true, but it only blocks CODING questions. THEORY questions
-- don't need a LeetCode link, so this closes the gap the honest way
-- rather than forcing a mismatched coding problem in.
-- Follows the 046-style single-INSERT convention. display_order
-- continues from 63 -> 64-69.

INSERT INTO interview_questions
  (concept_id, question_type, company, prompt, difficulty, company_note, reference_notes,
   opening_prompt, hint_ladder, expected_follow_ups, optimal_complexity, rubric_dimensions, display_order)
VALUES

('math_gcd_lcm', 'theory', 'Stripe',
 'Why does the Euclidean algorithm work, and why is it so much faster than checking every possible divisor?',
 'Medium',
 'A payments-adjacent company like Stripe deals with currency conversion and rate simplification internally, and this kind of "why does this work, not just how" question is reported as a common way to check real understanding versus memorized code.',
 'The key fact: gcd(a, b) = gcd(b, a mod b). Any common divisor of a and b must also divide a mod b, and vice versa, so the pair (a, b) and (b, a mod b) always share the same gcd — the algorithm just keeps shrinking the pair until one side hits zero.',
 'Before explaining the speed, can you first explain WHY replacing (a, b) with (b, a mod b) doesn''t change the answer?',
 '["What has to be true about any number that divides both a and b, in relation to a mod b?", "Roughly how many steps does this take compared to checking every number up to min(a,b)?", "What happens when one of the two numbers reaches zero?"]',
 '[{"trigger":"if_only_how_given","question":"You described the steps correctly — can you now explain WHY they''re guaranteed to produce the right answer?"}]',
 NULL,
 '[{"dimension":"invariant_explained","description":"Did they correctly explain why gcd(a,b) = gcd(b, a mod b), not just recite the recurrence?"},{"dimension":"complexity_contrasted","description":"Did they contrast the O(log(min(a,b))) runtime against the O(min(a,b)) brute-force alternative?"},{"dimension":"termination_understood","description":"Did they correctly identify that the algorithm terminates when a number reaches zero?"}]',
 64),

('math_modular_arithmetic', 'theory', 'Google',
 'Why doesn''t division distribute over a modulus the way addition and multiplication do?',
 'Medium',
 'Google is reported to probe number-theory edge cases like this specifically to separate candidates who''ve memorized "just take mod at each step" from those who understand why that rule has an exception.',
 'Addition and multiplication under a modulus are well-defined because the modulus operation itself is compatible with those operations. Division requires finding a MULTIPLICATIVE INVERSE, which only exists if the divisor and modulus are coprime — division isn''t simply "undoing" multiplication under a modulus the way it is normally.',
 'Let''s start concrete — can you show me why (a + b) mod m equals ((a mod m) + (b mod m)) mod m?',
 '["Once you''ve shown addition works cleanly, what specifically breaks down when you try the same reasoning for division?", "What condition does a number need to satisfy to even HAVE a modular inverse?", "How would you actually compute a modular inverse, if you needed one?"]',
 '[{"trigger":"if_answer_stays_vague","question":"Can you give a concrete example where naive modular division gives the wrong answer?"}]',
 NULL,
 '[{"dimension":"addition_multiplication_shown","description":"Did they correctly demonstrate why addition/multiplication distribute over a modulus?"},{"dimension":"division_failure_identified","description":"Did they correctly identify that division needs a modular inverse rather than direct division of reduced values?"},{"dimension":"inverse_condition_named","description":"Did they mention that a modular inverse only exists when the divisor and modulus are coprime?"}]',
 65),

('math_primality', 'theory', 'Amazon',
 'Why is it sufficient to check divisibility only up to the square root of n when testing whether n is prime?',
 'Easy',
 'A common Amazon screening-round question specifically because it''s short enough to ask verbally without a whiteboard, while still testing real number-theory reasoning rather than memorized code.',
 'If n has a factor larger than sqrt(n), that factor must pair with a co-factor smaller than sqrt(n) (since their product is n) — so any factor above sqrt(n) would already have been caught via its smaller pair below sqrt(n).',
 'Suppose n has a factor d that''s larger than sqrt(n) — what can you say about n divided by d?',
 '["If d > sqrt(n) and d divides n, what do you know about the size of n/d?", "So if a factor above sqrt(n) exists, does that guarantee a factor below sqrt(n) also exists?", "What''s the one exception to watch for when d equals sqrt(n) exactly?"]',
 '[{"trigger":"if_answer_is_rote","question":"Can you prove this rather than just state it — why must a factor pair straddle the square root?"}]',
 NULL,
 '[{"dimension":"pairing_argument_given","description":"Did they correctly explain that factors pair up around sqrt(n), so checking past it is redundant?"},{"dimension":"complexity_stated","description":"Did they state the resulting O(sqrt(n)) complexity, contrasted with a naive O(n) check?"},{"dimension":"perfect_square_edge_case","description":"Did they consider the edge case where n is a perfect square and d equals sqrt(n) exactly?"}]',
 66),

('adv_sparse_table', 'theory', 'Bloomberg',
 'Why can''t a Sparse Table support updates, and what''s the actual tradeoff versus a Segment Tree?',
 'Medium',
 'Bloomberg is reported to test whether candidates understand structural tradeoffs between similar-looking tools, not just how to implement any one of them in isolation.',
 'A Sparse Table precomputes answers for every power-of-two-length range in O(n log n), and a single element update could invalidate O(log n) of those precomputed ranges, cascading further — there''s no cheap way to patch just the affected entries, so the only option is a full O(n log n) rebuild, defeating the point of static preprocessing.',
 'Walk me through what table[i][j] actually stores in a Sparse Table before we get to the update question.',
 '["If you changed one element in the original array, which precomputed ranges in the table could that possibly affect?", "Roughly how many of those precomputed ranges would need to change?", "Given that, is patching them individually actually cheaper than just rebuilding the whole table?"]',
 '[{"trigger":"after_first_explanation","question":"Given that limitation, when would you actually choose a Sparse Table over a Segment Tree despite it being update-incapable?"}]',
 NULL,
 '[{"dimension":"structure_explained","description":"Did they correctly explain what table[i][j] represents (aggregate of a power-of-two-length range)?"},{"dimension":"update_problem_identified","description":"Did they correctly identify that an update invalidates too many precomputed ranges to patch cheaply?"},{"dimension":"tradeoff_articulated","description":"Did they articulate the real tradeoff: O(1) query but static-only, versus a Segment Tree''s O(log n) query AND update?"}]',
 67),

('graph_scc', 'theory', 'Netflix',
 'Walk me through why Kosaraju''s algorithm needs to run DFS on the graph AND on its reverse.',
 'Hard',
 'A well-known "explain the algorithm, don''t just name it" question — reciting the two-pass structure without explaining WHY the reversal matters is a common surface-level answer this question is designed to catch.',
 'The first DFS pass (on the original graph) produces a finish-time ordering where, if there''s a directed edge between two different SCCs, the SCC reached first finishes later. Running DFS again on the REVERSED graph, processing vertices in reverse finish order, ensures each new DFS tree can only expand within a single SCC — because edges between different SCCs now point the wrong way to escape.',
 'Before discussing the reversal, what does finishing order in a DFS actually tell you?',
 '["In the first DFS pass, what can you say about the finish times of two vertices in DIFFERENT SCCs connected by an edge?", "Why does reversing every edge, then processing vertices in reverse finish order, prevent a DFS tree from crossing into a different SCC?", "What would go wrong if you only ran DFS once, without the reversal?"]',
 '[{"trigger":"if_steps_only_no_why","question":"You described the two passes correctly — now explain WHY reversing the graph is what makes this work, not just that it does."}]',
 'O(V + E) time and space (two DFS passes plus building the reversed graph)',
 '[{"dimension":"finish_order_property","description":"Did they correctly explain what the first pass''s finish-time ordering guarantees about inter-SCC edges?"},{"dimension":"reversal_reasoning","description":"Did they explain WHY reversing the graph prevents the second DFS from crossing SCC boundaries, not just that it does?"},{"dimension":"complexity_stated","description":"Did they state O(V+E) unprompted?"}]',
 68),

('graph_bipartite_matching', 'theory', 'Uber',
 'What does an augmenting path do in bipartite matching, and why does finding one always increase the matching size by exactly one?',
 'Hard',
 'Directly relevant to Uber''s own driver-rider matching problem, and reported as a question used to check whether a candidate understands the mechanism, not just that "run the algorithm until no more augmenting paths exist" is the stopping condition.',
 'An augmenting path starts and ends at unmatched vertices, alternating between non-matching and matching edges along the way. Flipping every edge on the path (matching becomes non-matching and vice versa) converts one more non-matching edge into a matching edge than it removes, since the path starts and ends unmatched — a net gain of exactly one matched pair.',
 'Before the "why exactly one" part — can you first describe what makes a path an augmenting path?',
 '["What has to be true about the two endpoints of an augmenting path?", "As you flip every edge along the path from non-matching to matching and back, count how many net NEW matches you create versus how many you undo.", "How do you know when no more augmenting paths exist — what does that tell you about the matching?"]',
 '[{"trigger":"if_mechanism_unclear","question":"Try tracing through a small 3-vertex-per-side example on paper — does the plus-one intuition hold?"}]',
 NULL,
 '[{"dimension":"augmenting_path_defined","description":"Did they correctly define an augmenting path as starting and ending at unmatched vertices, alternating edge types?"},{"dimension":"plus_one_explained","description":"Did they correctly explain why flipping the path''s edges yields exactly one more match, not just assert it?"},{"dimension":"termination_understood","description":"Did they connect \"no augmenting path exists\" to the matching being maximum?"}]',
 69);

-- VERIFICATION QUERY — expect 6 rows, display_order 64-69, one per
-- previously-zero concept
SELECT concept_id, question_type, company, difficulty, display_order,
       (opening_prompt IS NOT NULL) AS has_opening_prompt,
       (hint_ladder IS NOT NULL) AS has_hints,
       (rubric_dimensions IS NOT NULL) AS has_rubric
FROM interview_questions
WHERE display_order BETWEEN 64 AND 69
ORDER BY display_order;
