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
