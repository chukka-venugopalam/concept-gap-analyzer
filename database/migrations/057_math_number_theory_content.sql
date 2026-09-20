-- Migration 057: Math & Number Theory — resources, practice problems, real-world examples
-- All 5 GfG resource URLs individually fetched (not just search-snippet-
-- guessed) on 2026-09-18 to confirm their canonical /dsa/ URL before use.
-- Honesty note (same convention as 036): math_modular_arithmetic and
-- math_primality do NOT get a dedicated LeetCode practice problem here.
-- Both are usually a supporting technique embedded inside other problems
-- (an answer "mod 10^9+7", a helper inside a larger solution) rather than
-- something LeetCode asks about in isolation, and no single problem
-- verified during this session tested either cleanly on its own — a
-- forced, mismatched problem would be worse than none. The other three
-- concepts have genuinely dedicated, verified problems.

INSERT INTO concept_resources (concept_id, title, url) VALUES
('math_gcd_lcm',              'Euclidean Algorithms (Basic and Extended)', 'https://www.geeksforgeeks.org/dsa/euclidean-algorithms-basic-and-extended/'),
('math_modular_arithmetic',   'Modulo 10^9+7 (1000000007)', 'https://www.geeksforgeeks.org/dsa/modulo-1097-1000000007/'),
('math_primality',            'Check for Prime Number', 'https://www.geeksforgeeks.org/dsa/check-for-prime-number/'),
('math_sieve',                'Sieve of Eratosthenes', 'https://www.geeksforgeeks.org/dsa/sieve-of-eratosthenes/'),
('math_fast_exponentiation',  'Exponential Squaring (Fast Modulo Multiplication)', 'https://www.geeksforgeeks.org/dsa/exponential-squaring-fast-modulo-multiplication/');

INSERT INTO concept_practice_problems (concept_id, platform, title, url, difficulty, display_order) VALUES
('math_gcd_lcm',             'LeetCode', 'Find Greatest Common Divisor of Array', 'https://leetcode.com/problems/find-greatest-common-divisor-of-array/', 'Easy', 1),
('math_sieve',               'LeetCode', 'Count Primes',                         'https://leetcode.com/problems/count-primes/',                         'Medium', 1),
('math_fast_exponentiation', 'LeetCode', 'Pow(x, n)',                            'https://leetcode.com/problems/powx-n/',                               'Medium', 1);

UPDATE concepts SET real_world_example = 'Cutting the longest possible equal-length pieces from two ropes of different lengths with none left over — the piece length is their GCD.' WHERE id = 'math_gcd_lcm';
UPDATE concepts SET real_world_example = 'A 12-hour clock — adding 5 hours to 10 o''clock does not give 15 o''clock, it wraps around to 3, because clock arithmetic is arithmetic modulo 12.' WHERE id = 'math_modular_arithmetic';
UPDATE concepts SET real_world_example = 'Arranging students into equal-sized rows for a class photo — if the class size has no divisor between 2 and its square root, it can only be arranged as one long row (the class size is prime).' WHERE id = 'math_primality';
UPDATE concepts SET real_world_example = 'Crossing out every multiple of 2, then 3, then 5 on a printed number chart, leaving only the primes uncrossed — the same elimination process run by hand.' WHERE id = 'math_sieve';
UPDATE concepts SET real_world_example = 'Doubling a bacteria population: instead of multiplying by the growth rate one generation at a time, repeated squaring jumps from generation 1 to 2 to 4 to 8 in just a few multiplications instead of many.' WHERE id = 'math_fast_exponentiation';

-- VERIFICATION QUERY — expect 5 resources, 3 practice problems, and all
-- 5 concepts with a real-world example
SELECT c.id,
       (SELECT count(*) FROM concept_resources WHERE concept_id = c.id) AS resources,
       (SELECT count(*) FROM concept_practice_problems WHERE concept_id = c.id) AS problems,
       (c.real_world_example IS NOT NULL) AS has_example
FROM concepts c
WHERE c.topic_id = 'math_number_theory'
ORDER BY c.display_order;
