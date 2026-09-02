'use client'

import React, { useEffect, useState } from 'react'
import { AppShell } from '@/components/layout/AppShell'
import { ConceptGraph, LIBRARY_COLORS, NodeItem, EdgeItem } from '@/components/graph/ConceptGraph'
import { Skeleton } from '@/components/ui/Skeleton'
import { topicsAPI } from '@/lib/api/topics'
import { TOPICS } from '@/lib/topics'

// Known cross-topic concept relationships
const CROSS_TOPIC_EDGES: EdgeItem[] = [
  { source: 'arr_two_pointer', target: 'll_fast_slow', isCrossTopic: true, type: 'cross_topic' },
  { source: 'bt_bfs', target: 'graph_bfs', isCrossTopic: true, type: 'cross_topic' },
  { source: 'bt_recursion', target: 'dp_memo_tab', isCrossTopic: true, type: 'cross_topic' },
  { source: 'heap_priority_queue', target: 'graph_bfs', isCrossTopic: true, type: 'cross_topic' },
  { source: 'hash_set', target: 'graph_visited', isCrossTopic: true, type: 'cross_topic' },
  { source: 'bt_structure', target: 'trie_structure', isCrossTopic: true, type: 'cross_topic' },
  { source: 'arr_indexing', target: 'heap_array_rep', isCrossTopic: true, type: 'cross_topic' },
]

export default function GraphsPage() {
  const [activeTab, setActiveTab] = useState<'topic' | 'all'>('topic')
  const [selectedTopicId, setSelectedTopicId] = useState<string>(TOPICS[0].id)

  const [topicNodes, setTopicNodes] = useState<NodeItem[]>([])
  const [topicEdges, setTopicEdges] = useState<EdgeItem[]>([])
  const [topicLoading, setTopicLoading] = useState(true)

  const [allNodes, setAllNodes] = useState<NodeItem[]>([])
  const [allEdges, setAllEdges] = useState<EdgeItem[]>([])
  const [allLoading, setAllLoading] = useState(false)
  const [allLoaded, setAllLoaded] = useState(false)

  const [error, setError] = useState('')

  // Load single topic graph
  useEffect(() => {
    async function loadTopicData() {
      try {
        setTopicLoading(true)
        setError('')
        const res = await topicsAPI.getLibrary(selectedTopicId)
        const data = res?.data || res
        setTopicNodes(data?.nodes || [])
        setTopicEdges(data?.edges || [])
      } catch (err: any) {
        console.error('Failed loading topic graph:', err)
        setError(err.message || 'Failed loading topic graph')
      } finally {
        setTopicLoading(false)
      }
    }
    if (activeTab === 'topic') {
      loadTopicData()
    }
  }, [selectedTopicId, activeTab])

  // Load all topics combined graph
  useEffect(() => {
    async function loadAllData() {
      if (allLoaded) return
      try {
        setAllLoading(true)
        setError('')
        const responses = await Promise.all(
          TOPICS.map(async (t) => {
            try {
              const res = await topicsAPI.getLibrary(t.id)
              const data = res?.data || res
              const nodes: NodeItem[] = (data?.nodes || []).map((n: NodeItem) => ({
                ...n,
                topic_id: t.id,
                topic_name: t.name,
              }))
              const edges: EdgeItem[] = (data?.edges || []).map((e: EdgeItem) => ({
                ...e,
                type: 'hard',
                isCrossTopic: false,
              }))
              return { nodes, edges }
            } catch {
              return { nodes: [], edges: [] }
            }
          })
        )

        const combinedNodes: NodeItem[] = []
        const combinedEdges: EdgeItem[] = []

        responses.forEach((r) => {
          combinedNodes.push(...r.nodes)
          combinedEdges.push(...r.edges)
        })

        // Add valid cross-topic edges where both endpoints exist
        const nodeIds = new Set(combinedNodes.map((n) => n.id))
        const validCrossEdges = CROSS_TOPIC_EDGES.filter(
          (e) => nodeIds.has(e.source) && nodeIds.has(e.target)
        )
        combinedEdges.push(...validCrossEdges)

        setAllNodes(combinedNodes)
        setAllEdges(combinedEdges)
        setAllLoaded(true)
      } catch (err: any) {
        console.error('Failed loading all topic graphs:', err)
        setError(err.message || 'Failed loading all topic graphs')
      } finally {
        setAllLoading(false)
      }
    }
    if (activeTab === 'all') {
      loadAllData()
    }
  }, [activeTab, allLoaded])

  const currentTopic = TOPICS.find((t) => t.id === selectedTopicId) || TOPICS[0]

  return (
    <AppShell>
      {/* Header */}
      <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <span className="text-xs uppercase font-mono tracking-widest text-accent font-semibold block mb-1">
            Knowledge Visualization
          </span>
          <h1 className="font-display font-bold text-2xl text-primary">
            Concept Dependency Graphs
          </h1>
          <p className="text-xs text-secondary mt-1">
            Explore concept hierarchies, prerequisites, and cross-domain connections.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center bg-surface-2 p-1 rounded-lg border border-border shrink-0 self-start">
          <button
            onClick={() => setActiveTab('topic')}
            className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
              activeTab === 'topic'
                ? 'bg-surface text-primary shadow-sm'
                : 'text-secondary hover:text-primary'
            }`}
          >
            By Topic
          </button>
          <button
            onClick={() => setActiveTab('all')}
            className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
              activeTab === 'all'
                ? 'bg-surface text-primary shadow-sm'
                : 'text-secondary hover:text-primary'
            }`}
          >
            All Topics
          </button>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-lg bg-missing-dim text-missing border border-missing/20 text-xs mb-6">
          {error}
        </div>
      )}

      {/* Tab 1: By Topic */}
      {activeTab === 'topic' && (
        <div className="space-y-4">
          {/* Topic Picker */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            {TOPICS.map((topic) => {
              const active = topic.id === selectedTopicId
              return (
                <button
                  key={topic.id}
                  onClick={() => setSelectedTopicId(topic.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all border ${
                    active
                      ? 'bg-accent/15 border-accent text-primary shadow-accent'
                      : 'bg-surface border-border text-secondary hover:text-primary hover:border-border-subtle'
                  }`}
                >
                  {topic.name}
                </button>
              )
            })}
          </div>

          {topicLoading ? (
            <div className="space-y-4">
              <Skeleton className="h-[600px] w-full" />
            </div>
          ) : (
            <>
              <ConceptGraph
                mode="library"
                nodes={topicNodes}
                edges={topicEdges}
                width={900}
                height={600}
              />

              {/* Legend */}
              <div className="bg-surface rounded-xl p-4 border border-border flex flex-wrap items-center justify-between gap-4 text-xs font-mono">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <span
                      className="w-3 h-3 rounded-full inline-block"
                      style={{ backgroundColor: LIBRARY_COLORS[3] }}
                    />
                    <span className="text-secondary">Core (Weight 3)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span
                      className="w-3 h-3 rounded-full inline-block"
                      style={{ backgroundColor: LIBRARY_COLORS[2] }}
                    />
                    <span className="text-secondary">Key (Weight 2)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span
                      className="w-3 h-3 rounded-full inline-block"
                      style={{ backgroundColor: LIBRARY_COLORS[1] }}
                    />
                    <span className="text-secondary">Foundational (Weight 1)</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="w-6 h-0.5 bg-accent inline-block" />
                  <span className="text-secondary">Prerequisite Edge</span>
                </div>
              </div>
            </>
          )}
        </div>
      )}

      {/* Tab 2: All Topics */}
      {activeTab === 'all' && (
        <div className="space-y-4">
          <div className="p-3 bg-surface rounded-lg border border-border text-xs text-secondary flex items-center justify-between flex-wrap gap-2">
            <span>
              Combined concept graph across all {TOPICS.length} topics ({allNodes.length} concepts, {allEdges.length} connections).
            </span>
            <span className="font-mono text-muted text-[11px]">
              Tip: Click any node to open its study details and practice problems.
            </span>
          </div>

          {allLoading ? (
            <div className="space-y-4">
              <Skeleton className="h-[650px] w-full" />
            </div>
          ) : (
            <>
              <ConceptGraph
                mode="library"
                nodes={allNodes}
                edges={allEdges}
                width={1000}
                height={650}
              />

              {/* Full Multi-Topic Legend */}
              <div className="bg-surface rounded-xl p-4 border border-border flex flex-wrap items-center justify-between gap-4 text-xs font-mono">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <span
                      className="w-3 h-3 rounded-full inline-block"
                      style={{ backgroundColor: LIBRARY_COLORS[3] }}
                    />
                    <span className="text-secondary">Core / High Weight</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span
                      className="w-3 h-3 rounded-full inline-block"
                      style={{ backgroundColor: LIBRARY_COLORS[2] }}
                    />
                    <span className="text-secondary">Key Concept</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span
                      className="w-3 h-3 rounded-full inline-block"
                      style={{ backgroundColor: LIBRARY_COLORS[1] }}
                    />
                    <span className="text-secondary">Foundational</span>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-0.5 bg-accent inline-block" />
                    <span className="text-secondary">In-Topic Prerequisite</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-0.5 border-t border-dashed border-muted inline-block" />
                    <span className="text-secondary">Cross-Topic Connection</span>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </AppShell>
  )
}
