-- Migration 056: New topic — Math & Number Theory
-- Confirmed entirely absent before writing this: grep across every existing
-- migration for gcd/lcm, sieve, modular arithmetic, and primality returned
-- zero matches. This was the most complete gap identified in the DSA
-- coverage review, and reasonably foundational despite being "pro" tier —
-- many other problems (DP, graphs, combinatorics) quietly assume it.
-- Follows the same core-file structure as 027 (Stacks & Queues): topic +
-- concepts + prerequisites + misconceptions + fallback_probes together,
-- with resources/practice/real-world in a separate 057, matching the
-- two-file pattern 030 (Patterns) used for a brand-new topic.
-- display_order = 12 (topics currently run 1-11, confirmed by checking
-- every topics INSERT before writing this, not assumed).
-- Prerequisite direction for the sieve/primality pair follows the
-- pedagogical order used in the actual GfG source verified below (single-
-- number primality testing is taught first, sieve generalizes it to a
-- range) — not a loose thematic pairing like some of Patterns' prereqs.
-- CORRECTED after first run failed: fallback_probes' actual live columns
-- are (id, topic_id, question, probe_order) — confirmed via
-- information_schema against the real database — not (topic_id,
-- probe_text, display_order) as migration 027's file content in this
-- repo suggested. That file doesn't match what's actually live; this is
-- schema drift in the repo, not a mistake in this migration's original
-- design. Fixed below to match the verified live schema.

INSERT INTO topics (id, name, description, display_order) VALUES
('math_number_theory', 'Math & Number Theory',
 'GCD/LCM, modular arithmetic, primality testing, sieve-based prime generation, and fast exponentiation',
 12);

INSERT INTO concepts (id, topic_id, name, definition, proficiency_level, importance_weight, canonical_keywords, display_order) VALUES

('math_gcd_lcm', 'math_number_theory',
 'GCD & LCM (Euclidean Algorithm)',
 'Computing the greatest common divisor of two numbers by repeatedly replacing the larger with its remainder when divided by the smaller, until one reaches zero: gcd(a, b) = gcd(b, a mod b). The least common multiple follows directly, lcm(a, b) = (a * b) / gcd(a, b). Runs in O(log(min(a,b))) time, far faster than checking every possible common divisor.',
 'beginner', 3,
 ARRAY['gcd','greatest common divisor','lcm','least common multiple','euclidean algorithm','modulo'], 1),

('math_modular_arithmetic', 'math_number_theory',
 'Modular Arithmetic',
 'Arithmetic performed on remainders after division by a fixed modulus, used to keep numbers bounded when a true answer would overflow standard integer types. Addition, subtraction, and multiplication all distribute over the modulus: (a + b) mod m = ((a mod m) + (b mod m)) mod m, and likewise for multiplication. Division does NOT distribute the same way and requires a modular inverse instead.',
 'interview', 3,
 ARRAY['modular arithmetic','mod','10^9+7','overflow','modular inverse','distributive property'], 2),

('math_primality', 'math_number_theory',
 'Primality Testing',
 'Checking whether a single number n is prime by trial division up to sqrt(n) only: if n has no divisor at or below its square root, it has none above it either, since any larger factor would have to pair with a factor smaller than the square root. Runs in O(sqrt(n)) time, far faster than checking all the way up to n.',
 'beginner', 2,
 ARRAY['primality test','prime number','trial division','square root bound','is prime'], 3),

('math_sieve', 'math_number_theory',
 'Sieve of Eratosthenes',
 'Generating every prime up to n at once by starting with all numbers marked prime, then repeatedly taking the next unmarked number and marking all of its multiples as composite. Runs in O(n log log n) total, dramatically faster than testing each number individually for primality — the right choice whenever primes are needed for a RANGE of numbers rather than a single one.',
 'interview', 2,
 ARRAY['sieve of eratosthenes','prime generation','composite marking','O(n log log n)','range of primes'], 4),

('math_fast_exponentiation', 'math_number_theory',
 'Fast (Modular) Exponentiation',
 'Computing a^b, typically modulo some m, in O(log b) time instead of O(b), by repeatedly squaring the base and halving the exponent: a^b = (a^(b/2))^2 when b is even, or a * a^(b-1) when b is odd. Taking the modulus after every multiplication keeps intermediate values from overflowing, which is why this technique is almost always paired with modular arithmetic.',
 'interview', 2,
 ARRAY['fast exponentiation','binary exponentiation','modular exponentiation','power function','O(log n)','repeated squaring'], 5);

INSERT INTO concept_prerequisites (concept_id, prerequisite_id) VALUES
('math_sieve', 'math_primality'),
('math_fast_exponentiation', 'math_modular_arithmetic');

INSERT INTO concept_misconceptions (concept_id, misconception, correction, trigger_phrases) VALUES

('math_gcd_lcm',
 'Computing gcd requires checking every number from 1 up to the smaller of the two values.',
 'The Euclidean algorithm finds gcd(a,b) in O(log(min(a,b))) steps by repeatedly replacing (a,b) with (b, a mod b) — checking every candidate divisor is exactly the brute-force approach this algorithm avoids.',
 ARRAY['check every number','try every divisor','loop from 1 to']),

('math_modular_arithmetic',
 'Since addition and multiplication distribute over the modulus, division must too - you can just divide the reduced values.',
 'Division does NOT distribute over a modulus the way addition and multiplication do. Dividing under a modulus requires multiplying by the modular inverse of the divisor instead, computed via the extended Euclidean algorithm or Fermat''s little theorem when the modulus is prime, not plain division of the reduced values.',
 ARRAY['just divide the mod values','same as addition','divide like normal']),

('math_primality',
 'You need to check divisibility by every number from 2 up to n-1 to confirm n is prime.',
 'Only checking up to sqrt(n) is necessary. If n had a factor larger than sqrt(n), it would have to pair with a factor smaller than sqrt(n), which would already have been found — checking beyond sqrt(n) is redundant work.',
 ARRAY['check up to n','check every number up to n minus 1','loop all the way to n']),

('math_sieve',
 'The sieve needs to mark multiples of every number from 2 to n, not just the primes.',
 'Once a number is marked composite, its multiples were already (or will already be) marked when its smallest prime factor was processed. Starting the marking loop only at each still-unmarked (prime) number is what gives the sieve its O(n log log n) efficiency, and is also why marking a prime p''s multiples can start at p*p rather than 2*p.',
 ARRAY['mark multiples of every number','doesnt matter if prime or not','start marking at 2p']),

('math_fast_exponentiation',
 'Halving the exponent only works cleanly when it is even, so odd exponents need a fundamentally different approach.',
 'Odd exponents use the same recursive idea with one extra multiplication pulled out first: a^b = a * a^(b-1) when b is odd, and a^(b-1) is now even, so the halving case applies immediately after. No separate algorithm is needed — it is the same recurrence with one extra step.',
 ARRAY['odd exponents need different approach','only works for even','cant halve odd numbers']);

INSERT INTO fallback_probes (topic_id, question, probe_order) VALUES
('math_number_theory',
 'You mentioned GCD or LCM — walk me through why the Euclidean algorithm is so much faster than checking every possible divisor.',
 1),
('math_number_theory',
 'If you needed to compute a very large number raised to a very large power, modulo some value, what would your approach be and why?',
 2),
('math_number_theory',
 'How would you find every prime number up to a million efficiently, and why is testing each one individually too slow?',
 3);

-- VERIFICATION QUERY — expect the topic + 5 concepts + 2 prereqs +
-- 5 misconceptions + 3 fallback probes
SELECT 'topic' AS what, count(*) FROM topics WHERE id = 'math_number_theory'
UNION ALL
SELECT 'concepts', count(*) FROM concepts WHERE topic_id = 'math_number_theory'
UNION ALL
SELECT 'prereqs', count(*) FROM concept_prerequisites WHERE concept_id IN
  ('math_gcd_lcm','math_modular_arithmetic','math_primality','math_sieve','math_fast_exponentiation')
UNION ALL
SELECT 'misconceptions', count(*) FROM concept_misconceptions WHERE concept_id IN
  ('math_gcd_lcm','math_modular_arithmetic','math_primality','math_sieve','math_fast_exponentiation')
UNION ALL
SELECT 'fallback_probes', count(*) FROM fallback_probes WHERE topic_id = 'math_number_theory';
