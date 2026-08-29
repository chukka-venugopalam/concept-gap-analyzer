-- Seed the Dynamic Programming topic: topic row, 6 concepts, prerequisites,
-- misconceptions, and fallback probes.
--
-- Definitions and misconceptions are condensed directly from the verified
-- SV-OS GATE-prep source file (source_status: VERIFIED), entries d5-01
-- through d5-06. canonical_keywords, trigger_phrases, and fallback_probes
-- are not present in that source and are authored here based on the real,
-- verified definitions/mistakes — not independently fact-checked claims,
-- since they are word-lists and probe questions, not factual assertions.
--
-- Prerequisite design note: SV-OS's own prerequisite_slugs form a strict
-- linear chain (knapsack->memo, lcs->knapsack, mcm->lcs, lis->mcm,
-- apsp->lis) reflecting course TEACHING ORDER, not genuine concept
-- dependency. The actual dependency is that all five techniques require
-- memoization/tabulation first, but not each other — so all five point to
-- dp_memo_tab directly, matching the existing pattern in this schema
-- (e.g. hash_set and hash_collision both depend on hash_map_basics,
-- not on each other).

INSERT INTO topics (id, name, description, display_order, concept_count) VALUES
('dynamic_programming',
 'Dynamic Programming',
 'Overlapping subproblems, memoization, tabulation, and classic DP patterns',
 5, 6);

INSERT INTO concepts (id, topic_id, name, definition, importance_weight, canonical_keywords, display_order) VALUES

('dp_memo_tab','dynamic_programming',
 'Memoization vs Tabulation',
 'Solving problems with overlapping subproblems by caching each subproblem''s result the first time it is computed; memoization caches top-down inside a recursive function, tabulation builds the answer bottom-up in an iterative table.',
 3,
 ARRAY['memoization','tabulation','top-down','bottom-up','overlapping subproblems','cache','dp table','recursion'],1),

('dp_knapsack','dynamic_programming',
 '0/1 Knapsack',
 'Choosing a subset of items, each taken whole or not at all, to maximize value within a weight capacity; dp[i][w] holds the best value achievable using the first i items with capacity w.',
 3,
 ARRAY['knapsack','0/1 knapsack','weight capacity','take or leave','value weight','dp[i][w]'],2),

('dp_lcs','dynamic_programming',
 'Longest Common Subsequence',
 'Finding the longest sequence of characters that appears in the same relative order, not necessarily contiguous, in both of two strings, built via dp[i][j] comparing prefixes of each string.',
 3,
 ARRAY['LCS','longest common subsequence','subsequence','dp[i][j]','diagonal','backtracking','string matching'],3),

('dp_mcm','dynamic_programming',
 'Matrix Chain Multiplication',
 'Finding the cheapest way to parenthesize a chain of matrix multiplications, since the result is always the same by associativity but the number of scalar multiplications needed depends heavily on grouping.',
 2,
 ARRAY['matrix chain multiplication','MCM','parenthesization','scalar multiplications','split point','chain length','associativity'],4),

('dp_lis','dynamic_programming',
 'Longest Increasing Subsequence',
 'Finding the length of the longest strictly increasing subsequence of an array, where dp[i] is defined as the LIS length that must end exactly at index i, not the LIS within the first i elements.',
 3,
 ARRAY['LIS','longest increasing subsequence','strictly increasing','dp[i]','O(n^2)','subsequence'],5),

('dp_apsp','dynamic_programming',
 'All-Pairs Shortest Path',
 'Finding the shortest path between every pair of vertices in a weighted graph via Floyd-Warshall, which iteratively considers each vertex as a possible intermediate stepping stone between every other pair.',
 2,
 ARRAY['floyd-warshall','all pairs shortest path','APSP','intermediate vertex','negative weight','V^3','distance matrix'],6);

INSERT INTO concept_prerequisites VALUES
('dp_knapsack', 'dp_memo_tab'),
('dp_lcs',      'dp_memo_tab'),
('dp_mcm',      'dp_memo_tab'),
('dp_lis',      'dp_memo_tab'),
('dp_apsp',     'dp_memo_tab');

INSERT INTO concept_misconceptions (concept_id, misconception, correction, trigger_phrases) VALUES

('dp_memo_tab',
 'Applying memoization/DP to any recursive problem, even one with no overlapping subproblems.',
 'DP only helps when subproblems actually recur. If a problem has optimal substructure but no overlapping subproblems (like standard merge sort), caching adds overhead without eliminating any redundant work.',
 ARRAY['always faster','just add memoization','cache everything','dp is always better']),

('dp_memo_tab',
 'Assuming memoization and tabulation always use the same amount of space.',
 'Tabulation often allows discarding old table entries once they are no longer needed, which can reduce space well below a memoized recursive solution, since that keeps the full cache plus the call stack.',
 ARRAY['same space','no difference between memo and tabulation','space complexity is equal']),

('dp_knapsack',
 'Using the fractional-knapsack greedy strategy (best value-to-weight ratio first) on 0/1 knapsack.',
 'Once items cannot be split, picking by best ratio first does not always yield the optimal total value — 0/1 knapsack requires DP for a guaranteed-correct answer, unlike the fractional version where greedy is optimal.',
 ARRAY['greedy by ratio','just pick highest value per weight','sort by ratio and take']),

('dp_knapsack',
 'Referencing dp[i][...] instead of dp[i-1][...] when including the current item, allowing it to be reused.',
 'The recurrence must reference the PREVIOUS row (dp[i-1][...]) when including an item, not the current row — referencing the current row turns this into the unbounded knapsack variant, where items can be reused.',
 ARRAY['can use the item again','unbounded','reuse the item']),

('dp_lcs',
 'Treating "subsequence" as if it meant "substring", requiring the matched characters to be contiguous.',
 'A subsequence does not need to be contiguous — the DP must allow skipping characters in either string on a mismatch (the max(dp[i-1][j], dp[i][j-1]) branch), not just extending a contiguous run.',
 ARRAY['must be contiguous','substring','consecutive characters']),

('dp_lcs',
 'Trying to recover the actual LCS string from just the final dp[m][n] length value.',
 'The length alone does not reveal the subsequence itself — recovering the actual string requires backtracking through the completed table, following the diagonal on matches and the larger neighbor otherwise.',
 ARRAY['just read the final value','the length tells you the string','no need to backtrack']),

('dp_mcm',
 'Assuming multiplication order does not matter for matrix chains since the final result is identical.',
 'The RESULT is identical regardless of parenthesization (associativity), but the COST — the number of scalar multiplications required — varies enormously depending on grouping, which is exactly what MCM minimizes.',
 ARRAY['order does not matter','result is the same so cost is the same','associative so no need to optimize']),

('dp_mcm',
 'Filling the DP table in row-major or column-major order instead of by increasing chain length.',
 'Each entry dp[i][j] depends on shorter sub-chains, so the table must be filled by increasing chain length (diagonal by diagonal) — filling by plain row or column order reads uninitialized entries.',
 ARRAY['fill row by row','fill column by column','normal table order']),

('dp_lis',
 'Interpreting dp[i] as the LIS length using only the first i elements, rather than the LIS that must end exactly at index i.',
 'dp[i] specifically means the length of the LIS ending AT index i — this stricter definition is what makes the transition rule (extending only from valid smaller predecessors) correct.',
 ARRAY['lis within first i elements','lis up to index i','prefix lis']),

('dp_lis',
 'Reporting dp[n-1], the last computed table entry, as the final LIS answer.',
 'The longest increasing subsequence can end at any index, not necessarily the last one — the answer is max(dp), found by scanning the entire dp array, not just its last entry.',
 ARRAY['last entry is the answer','dp of n minus 1','final value in the array']),

('dp_apsp',
 'Looping over the intermediate vertex k innermost instead of outermost in Floyd-Warshall.',
 'The intermediate vertex k must be the OUTERMOST loop — dist[i][j] via k depends on dist[i][k] and dist[k][j] already being finalized for smaller-indexed intermediates, which breaks if i or j is looped outermost instead.',
 ARRAY['loop order does not matter','k innermost','any loop order works']),

('dp_apsp',
 'Assuming Floyd-Warshall handles negative-weight cycles correctly just because it handles negative edges.',
 'Floyd-Warshall correctly finds shortest paths with negative EDGES, but a negative-weight CYCLE makes "shortest path" undefined — the algorithm can detect this (a negative value appears on the diagonal) but cannot resolve it.',
 ARRAY['handles negative cycles','works with any negative weights','negative cycle is fine']);

INSERT INTO fallback_probes (topic_id, question, probe_order) VALUES
('dynamic_programming',
 'You mentioned dynamic programming — what''s the difference between memoization and tabulation, and when would you reach for one over the other?',
 1),
('dynamic_programming',
 'Walk me through how you''d define the DP table and recurrence for the 0/1 knapsack problem. Why does it need two dimensions instead of one?',
 2),
('dynamic_programming',
 'If two strings share characters but not in a contiguous block, how would you find their longest common subsequence using DP?',
 3);
