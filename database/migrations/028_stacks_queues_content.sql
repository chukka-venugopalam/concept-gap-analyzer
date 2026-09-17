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
