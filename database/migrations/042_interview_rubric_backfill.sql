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
