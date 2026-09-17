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
