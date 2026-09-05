'use client'

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Command } from 'cmdk'
import { topicsAPI } from '@/lib/api/topics'

interface ConceptSearchItem {
  id: string
  name: string
  topicId: string
  topicName: string
}

const ALL_CONCEPTS: ConceptSearchItem[] = [
  // Arrays & Hashing
  { id: 'arr_indexing', name: 'Array Indexing', topicId: 'arrays_hashing', topicName: 'Arrays & Hashing' },
  { id: 'arr_dynamic', name: 'Dynamic Arrays', topicId: 'arrays_hashing', topicName: 'Arrays & Hashing' },
  { id: 'arr_two_pointer', name: 'Two Pointer Technique', topicId: 'arrays_hashing', topicName: 'Arrays & Hashing' },
  { id: 'arr_sliding_window', name: 'Sliding Window', topicId: 'arrays_hashing', topicName: 'Arrays & Hashing' },
  { id: 'arr_prefix_sum', name: 'Prefix Sum', topicId: 'arrays_hashing', topicName: 'Arrays & Hashing' },
  { id: 'hash_map_basics', name: 'Hash Map Basics', topicId: 'arrays_hashing', topicName: 'Arrays & Hashing' },
  { id: 'hash_collision', name: 'Hash Collision Handling', topicId: 'arrays_hashing', topicName: 'Arrays & Hashing' },
  { id: 'hash_set', name: 'Hash Set', topicId: 'arrays_hashing', topicName: 'Arrays & Hashing' },
  { id: 'arr_sorting', name: 'Sorting Fundamentals', topicId: 'arrays_hashing', topicName: 'Arrays & Hashing' },
  { id: 'arr_kadane', name: 'Kadane Algorithm', topicId: 'arrays_hashing', topicName: 'Arrays & Hashing' },

  // Linked Lists
  { id: 'll_node', name: 'Linked List Node', topicId: 'linked_lists', topicName: 'Linked Lists' },
  { id: 'll_singly', name: 'Singly Linked List', topicId: 'linked_lists', topicName: 'Linked Lists' },
  { id: 'll_doubly', name: 'Doubly Linked List', topicId: 'linked_lists', topicName: 'Linked Lists' },
  { id: 'll_traversal', name: 'List Traversal', topicId: 'linked_lists', topicName: 'Linked Lists' },
  { id: 'll_insertion', name: 'Node Insertion', topicId: 'linked_lists', topicName: 'Linked Lists' },
  { id: 'll_deletion', name: 'Node Deletion', topicId: 'linked_lists', topicName: 'Linked Lists' },
  { id: 'll_fast_slow', name: 'Fast and Slow Pointers', topicId: 'linked_lists', topicName: 'Linked Lists' },
  { id: 'll_cycle', name: 'Cycle Detection', topicId: 'linked_lists', topicName: 'Linked Lists' },
  { id: 'll_reversal', name: 'List Reversal', topicId: 'linked_lists', topicName: 'Linked Lists' },
  { id: 'll_dummy_node', name: 'Dummy Head Node', topicId: 'linked_lists', topicName: 'Linked Lists' },

  // Binary Trees
  { id: 'bt_node', name: 'Tree Node', topicId: 'binary_trees', topicName: 'Binary Trees' },
  { id: 'bt_structure', name: 'Binary Tree Structure', topicId: 'binary_trees', topicName: 'Binary Trees' },
  { id: 'bt_leaf', name: 'Leaf Node', topicId: 'binary_trees', topicName: 'Binary Trees' },
  { id: 'bt_height', name: 'Tree Height and Depth', topicId: 'binary_trees', topicName: 'Binary Trees' },
  { id: 'bst_property', name: 'BST Property', topicId: 'binary_trees', topicName: 'Binary Trees' },
  { id: 'bt_inorder', name: 'In-order Traversal', topicId: 'binary_trees', topicName: 'Binary Trees' },
  { id: 'bt_preorder', name: 'Pre-order Traversal', topicId: 'binary_trees', topicName: 'Binary Trees' },
  { id: 'bt_postorder', name: 'Post-order Traversal', topicId: 'binary_trees', topicName: 'Binary Trees' },
  { id: 'bt_bfs', name: 'Level Order Traversal BFS', topicId: 'binary_trees', topicName: 'Binary Trees' },
  { id: 'bt_balanced', name: 'Balanced vs Unbalanced Trees', topicId: 'binary_trees', topicName: 'Binary Trees' },
  { id: 'bt_recursion', name: 'Tree Recursion Pattern', topicId: 'binary_trees', topicName: 'Binary Trees' },

  // Graphs
  { id: 'graph_basics', name: 'Graph Definition', topicId: 'graphs', topicName: 'Graphs' },
  { id: 'graph_adj_list', name: 'Adjacency List', topicId: 'graphs', topicName: 'Graphs' },
  { id: 'graph_adj_matrix', name: 'Adjacency Matrix', topicId: 'graphs', topicName: 'Graphs' },
  { id: 'graph_bfs', name: 'Breadth First Search', topicId: 'graphs', topicName: 'Graphs' },
  { id: 'graph_dfs', name: 'Depth First Search', topicId: 'graphs', topicName: 'Graphs' },
  { id: 'graph_visited', name: 'Visited Tracking', topicId: 'graphs', topicName: 'Graphs' },
  { id: 'graph_connected', name: 'Connected Components', topicId: 'graphs', topicName: 'Graphs' },
  { id: 'graph_cycle', name: 'Cycle Detection', topicId: 'graphs', topicName: 'Graphs' },
  { id: 'graph_topo', name: 'Topological Sort', topicId: 'graphs', topicName: 'Graphs' },
  { id: 'graph_bipartite', name: 'Bipartite Graphs', topicId: 'graphs', topicName: 'Graphs' },

  // Dynamic Programming
  { id: 'dp_memo_tab', name: 'Memoization vs Tabulation', topicId: 'dynamic_programming', topicName: 'Dynamic Programming' },
  { id: 'dp_knapsack', name: '0/1 Knapsack', topicId: 'dynamic_programming', topicName: 'Dynamic Programming' },
  { id: 'dp_lcs', name: 'Longest Common Subsequence', topicId: 'dynamic_programming', topicName: 'Dynamic Programming' },
  { id: 'dp_mcm', name: 'Matrix Chain Multiplication', topicId: 'dynamic_programming', topicName: 'Dynamic Programming' },
  { id: 'dp_lis', name: 'Longest Increasing Subsequence', topicId: 'dynamic_programming', topicName: 'Dynamic Programming' },
  { id: 'dp_apsp', name: 'All-Pairs Shortest Path', topicId: 'dynamic_programming', topicName: 'Dynamic Programming' },

  // Heaps
  { id: 'heap_property', name: 'Heap Property', topicId: 'heaps', topicName: 'Heaps' },
  { id: 'heap_array_rep', name: 'Array Representation', topicId: 'heaps', topicName: 'Heaps' },
  { id: 'heap_insert', name: 'Insertion (Sift-Up)', topicId: 'heaps', topicName: 'Heaps' },
  { id: 'heap_extract', name: 'Extraction (Sift-Down)', topicId: 'heaps', topicName: 'Heaps' },
  { id: 'heap_build', name: 'Build-Heap (Heapify)', topicId: 'heaps', topicName: 'Heaps' },
  { id: 'heap_priority_queue', name: 'Priority Queue', topicId: 'heaps', topicName: 'Heaps' },

  // Tries
  { id: 'trie_structure', name: 'Trie Structure', topicId: 'tries', topicName: 'Tries' },
  { id: 'trie_lookup_complexity', name: 'O(L) Lookup and Insert', topicId: 'tries', topicName: 'Tries' },
  { id: 'trie_end_marker', name: 'End-of-Word Marker', topicId: 'tries', topicName: 'Tries' },
  { id: 'trie_memory_tradeoff', name: 'Memory Tradeoffs', topicId: 'tries', topicName: 'Tries' },
  { id: 'trie_applications', name: 'Prefix Matching and Autocomplete', topicId: 'tries', topicName: 'Tries' },

  // Stacks & Queues
  { id: 'sq_stack_basics', name: 'Stack (LIFO)', topicId: 'stacks_queues', topicName: 'Stacks & Queues' },
  { id: 'sq_queue_basics', name: 'Queue (FIFO)', topicId: 'stacks_queues', topicName: 'Stacks & Queues' },
  { id: 'sq_queue_via_stacks', name: 'Queue via Two Stacks', topicId: 'stacks_queues', topicName: 'Stacks & Queues' },
  { id: 'sq_monotonic_stack', name: 'Monotonic Stack', topicId: 'stacks_queues', topicName: 'Stacks & Queues' },
  { id: 'sq_monotonic_deque', name: 'Monotonic Deque', topicId: 'stacks_queues', topicName: 'Stacks & Queues' },
  { id: 'sq_expression_parsing', name: 'Expression Parsing with Stacks', topicId: 'stacks_queues', topicName: 'Stacks & Queues' },
  { id: 'sq_string_stack_processing', name: 'Stack-Based String Processing', topicId: 'stacks_queues', topicName: 'Stacks & Queues' },

  // Bit & String Manipulation
  { id: 'bit_operators', name: 'Bitwise Operators', topicId: 'bit_string_manipulation', topicName: 'Bit & String Manipulation' },
  { id: 'bit_xor_properties', name: 'XOR Properties', topicId: 'bit_string_manipulation', topicName: 'Bit & String Manipulation' },
  { id: 'bit_counting', name: 'Counting & Checking Set Bits', topicId: 'bit_string_manipulation', topicName: 'Bit & String Manipulation' },
  { id: 'bit_masking_subsets', name: 'Bitmasking for Subsets', topicId: 'bit_string_manipulation', topicName: 'Bit & String Manipulation' },
  { id: 'str_palindrome', name: 'Palindrome Checking', topicId: 'bit_string_manipulation', topicName: 'Bit & String Manipulation' },
  { id: 'str_anagram', name: 'Anagram Detection', topicId: 'bit_string_manipulation', topicName: 'Bit & String Manipulation' },
  { id: 'str_pattern_matching', name: 'Pattern Matching & KMP Basics', topicId: 'bit_string_manipulation', topicName: 'Bit & String Manipulation' },
  { id: 'str_common_prefix', name: 'Longest Common Prefix / Substring', topicId: 'bit_string_manipulation', topicName: 'Bit & String Manipulation' },

  // Patterns
  { id: 'pat_merge_intervals', name: 'Merge Intervals', topicId: 'patterns', topicName: 'Patterns' },
  { id: 'pat_cyclic_sort', name: 'Cyclic Sort', topicId: 'patterns', topicName: 'Patterns' },
  { id: 'pat_two_heaps', name: 'Two Heaps', topicId: 'patterns', topicName: 'Patterns' },
  { id: 'pat_subsets_backtracking', name: 'Subsets & Backtracking', topicId: 'patterns', topicName: 'Patterns' },
  { id: 'pat_modified_binary_search', name: 'Modified Binary Search', topicId: 'patterns', topicName: 'Patterns' },
  { id: 'pat_kway_merge', name: 'K-way Merge', topicId: 'patterns', topicName: 'Patterns' },

  // Sorting Fundamentals
  { id: 'sort_bubble', name: 'Bubble Sort', topicId: 'sorting_fundamentals', topicName: 'Sorting Fundamentals' },
  { id: 'sort_insertion', name: 'Insertion Sort', topicId: 'sorting_fundamentals', topicName: 'Sorting Fundamentals' },
  { id: 'sort_merge', name: 'Merge Sort', topicId: 'sorting_fundamentals', topicName: 'Sorting Fundamentals' },
  { id: 'sort_quicksort', name: 'Quicksort', topicId: 'sorting_fundamentals', topicName: 'Sorting Fundamentals' },
  { id: 'sort_heapsort', name: 'Heapsort', topicId: 'sorting_fundamentals', topicName: 'Sorting Fundamentals' },
  { id: 'sort_complexity_analysis', name: 'Complexity Analysis & Stability', topicId: 'sorting_fundamentals', topicName: 'Sorting Fundamentals' },
]

export function CommandPalette() {
  const [open, setOpen] = useState(false)
  const [topics, setTopics] = useState<any[]>([])
  const [concepts, setConcepts] = useState<ConceptSearchItem[]>(ALL_CONCEPTS)
  const router = useRouter()

  useEffect(() => {
    let isMounted = true
    async function loadData() {
      try {
        const res = await topicsAPI.getAll()
        const topicList = Array.isArray(res) ? res : res?.topics || res?.data?.topics || []
        if (!Array.isArray(topicList) || topicList.length === 0) return

        if (isMounted) {
          setTopics(topicList)
        }

        const libraries = await Promise.all(
          topicList.map(async (t: any) => {
            try {
              const lib = await topicsAPI.getLibrary(t.id)
              const data = lib?.data || lib
              const nodes: any[] = data?.nodes || []
              return nodes.map((node: any) => ({
                id: node.id,
                name: node.name,
                topicId: t.id,
                topicName: t.name,
              }))
            } catch {
              return []
            }
          })
        )

        if (isMounted) {
          const fetchedConcepts = libraries.flat()
          if (fetchedConcepts.length > 0) {
            setConcepts(fetchedConcepts)
          }
        }
      } catch (err) {
        console.error('Failed loading command palette data:', err)
      }
    }
    loadData()
    return () => {
      isMounted = false
    }
  }, [])

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if ((e.key === 'k' && (e.metaKey || e.ctrlKey)) || e.key === '/') {
        if (
          (e.target instanceof HTMLElement && e.target.isContentEditable) ||
          e.target instanceof HTMLInputElement ||
          e.target instanceof HTMLTextAreaElement ||
          e.target instanceof HTMLSelectElement
        ) {
          return
        }
        e.preventDefault()
        setOpen((prev) => !prev)
      }
    }

    document.addEventListener('keydown', down)
    return () => document.removeEventListener('keydown', down)
  }, [])

  const handleSelect = (callback: () => void) => {
    setOpen(false)
    callback()
  }

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-start justify-center pt-[15vh] px-4 animate-in fade-in duration-150">
      <div
        className="fixed inset-0"
        onClick={() => setOpen(false)}
      />

      <div className="relative w-full max-w-lg bg-surface border border-border rounded-xl shadow-2xl overflow-hidden z-10 animate-in zoom-in-95 duration-150">
        <Command
          label="Global Search Command Menu"
          className="w-full flex flex-col bg-surface"
        >
          {/* Search Bar Input */}
          <div className="flex items-center px-4 border-b border-border">
            <svg
              className="w-4 h-4 text-secondary shrink-0 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <Command.Input
              placeholder="Search concepts, topics, or navigation (e.g. Monotonic Stack, Stacks & Queues)..."
              className="w-full bg-transparent py-3.5 text-sm text-primary placeholder-muted outline-none"
              autoFocus
            />
            <button
              onClick={() => setOpen(false)}
              className="text-xs text-muted font-mono bg-surface-2 px-1.5 py-0.5 rounded border border-border hover:text-primary"
            >
              ESC
            </button>
          </div>

          {/* Results List */}
          <Command.List className="max-h-80 overflow-y-auto p-2 space-y-2 scrollbar-none">
            <Command.Empty className="py-6 text-center text-xs text-muted font-mono">
              No results found.
            </Command.Empty>

            {/* Navigation Group */}
            <Command.Group
              heading={
                <span className="text-[10px] font-mono uppercase tracking-wider text-muted px-2 py-1 block">
                  Navigation
                </span>
              }
            >
              <Command.Item
                onSelect={() => handleSelect(() => router.push('/dashboard'))}
                className="flex items-center justify-between px-3 py-2 text-xs rounded-lg text-secondary cursor-pointer transition-colors hover:bg-surface-2 hover:text-primary aria-selected:bg-accent/15 aria-selected:text-primary aria-selected:border-l-2 aria-selected:border-accent"
              >
                <div className="flex items-center gap-2">
                  <span className="text-accent">◈</span>
                  <span className="font-medium text-primary">Dashboard</span>
                </div>
                <span className="text-[10px] font-mono text-muted">/dashboard</span>
              </Command.Item>

              <Command.Item
                onSelect={() => handleSelect(() => router.push('/topics'))}
                className="flex items-center justify-between px-3 py-2 text-xs rounded-lg text-secondary cursor-pointer transition-colors hover:bg-surface-2 hover:text-primary aria-selected:bg-accent/15 aria-selected:text-primary aria-selected:border-l-2 aria-selected:border-accent"
              >
                <div className="flex items-center gap-2">
                  <span className="text-accent">◈</span>
                  <span className="font-medium text-primary">All Topics</span>
                </div>
                <span className="text-[10px] font-mono text-muted">/topics</span>
              </Command.Item>

              <Command.Item
                onSelect={() => handleSelect(() => router.push('/graphs'))}
                className="flex items-center justify-between px-3 py-2 text-xs rounded-lg text-secondary cursor-pointer transition-colors hover:bg-surface-2 hover:text-primary aria-selected:bg-accent/15 aria-selected:text-primary aria-selected:border-l-2 aria-selected:border-accent"
              >
                <div className="flex items-center gap-2">
                  <span className="text-accent">◈</span>
                  <span className="font-medium text-primary">Concept Graphs</span>
                </div>
                <span className="text-[10px] font-mono text-muted">/graphs</span>
              </Command.Item>

              <Command.Item
                onSelect={() => handleSelect(() => router.push('/library'))}
                className="flex items-center justify-between px-3 py-2 text-xs rounded-lg text-secondary cursor-pointer transition-colors hover:bg-surface-2 hover:text-primary aria-selected:bg-accent/15 aria-selected:text-primary aria-selected:border-l-2 aria-selected:border-accent"
              >
                <div className="flex items-center gap-2">
                  <span className="text-accent">◈</span>
                  <span className="font-medium text-primary">Concept Library</span>
                </div>
                <span className="text-[10px] font-mono text-muted">/library</span>
              </Command.Item>

              <Command.Item
                onSelect={() => handleSelect(() => router.push('/profile'))}
                className="flex items-center justify-between px-3 py-2 text-xs rounded-lg text-secondary cursor-pointer transition-colors hover:bg-surface-2 hover:text-primary aria-selected:bg-accent/15 aria-selected:text-primary aria-selected:border-l-2 aria-selected:border-accent"
              >
                <div className="flex items-center gap-2">
                  <span className="text-accent">◈</span>
                  <span className="font-medium text-primary">Profile & Goals</span>
                </div>
                <span className="text-[10px] font-mono text-muted">/profile</span>
              </Command.Item>
            </Command.Group>

            {/* Topics Group */}
            {topics.length > 0 && (
              <Command.Group
                heading={
                  <span className="text-[10px] font-mono uppercase tracking-wider text-muted px-2 py-1 block">
                    Topics ({topics.length})
                  </span>
                }
              >
                {topics.map((topic) => (
                  <Command.Item
                    key={topic.id}
                    onSelect={() =>
                      handleSelect(() => router.push(`/topics/${topic.id}/history`))
                    }
                    className="flex items-center justify-between px-3 py-2 text-xs rounded-lg text-secondary cursor-pointer transition-colors hover:bg-surface-2 hover:text-primary aria-selected:bg-accent/15 aria-selected:text-primary aria-selected:border-l-2 aria-selected:border-accent"
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-known font-mono">#</span>
                      <span className="font-medium text-primary">{topic.name}</span>
                    </div>
                    <span className="text-[10px] font-mono text-muted">Topic</span>
                  </Command.Item>
                ))}
              </Command.Group>
            )}

            {/* Concepts Group */}
            <Command.Group
              heading={
                <span className="text-[10px] font-mono uppercase tracking-wider text-muted px-2 py-1 block">
                  Concepts ({concepts.length})
                </span>
              }
            >
              {concepts.map((concept) => (
                <Command.Item
                  key={concept.id}
                  value={`${concept.name} ${concept.topicName} ${concept.id}`}
                  onSelect={() =>
                    handleSelect(() => router.push('/library'))
                  }
                  className="flex items-center justify-between px-3 py-2 text-xs rounded-lg text-secondary cursor-pointer transition-colors hover:bg-surface-2 hover:text-primary aria-selected:bg-accent/15 aria-selected:text-primary aria-selected:border-l-2 aria-selected:border-accent"
                >
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-accent inline-block" />
                    <span className="font-medium text-primary">{concept.name}</span>
                  </div>
                  <span className="text-[10px] font-mono text-muted">
                    {concept.topicName}
                  </span>
                </Command.Item>
              ))}
            </Command.Group>
          </Command.List>

          {/* Footer Bar */}
          <div className="px-4 py-2 border-t border-border/60 bg-surface-2/40 text-[10px] font-mono text-muted flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span>↑↓ Navigate</span>
              <span>↵ Open</span>
              <span>ESC Close</span>
            </div>
            <span>⌘K / Ctrl+K</span>
          </div>
        </Command>
      </div>
    </div>
  )
}
