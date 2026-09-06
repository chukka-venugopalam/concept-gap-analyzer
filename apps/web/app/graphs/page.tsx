'use client'

import React, { useEffect, useState } from 'react'
import { AppShell } from '@/components/layout/AppShell'
import { ConceptGraph, LIBRARY_COLORS, NodeItem, EdgeItem } from '@/components/graph/ConceptGraph'
import { TopicClusterMap } from '@/components/graph/TopicClusterMap'
import { Skeleton } from '@/components/ui/Skeleton'
import { topicsAPI } from '@/lib/api/topics'

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
  const [topics, setTopics] = useState<any[]>([])
  const [selectedTopicId, setSelectedTopicId] = useState<string>('')

  const [topicNodes, setTopicNodes] = useState<NodeItem[]>([])
  const [topicEdges, setTopicEdges] = useState<EdgeItem[]>([])
  const [topicLoading, setTopicLoading] = useState(true)

  const [error, setError] = useState('')

  const totalConceptCount = React.useMemo(() => {
    return topics.reduce((sum, t) => sum + (t.concept_count || 0), 0) || 85
  }, [topics])

  // Load topics dynamically
  useEffect(() => {
    async function loadTopics() {
      try {
        const res = await topicsAPI.getAll()
        const list = Array.isArray(res) ? res : res?.topics || res?.data?.topics || []
        if (Array.isArray(list) && list.length > 0) {
          setTopics(list)
          setSelectedTopicId((prev) => prev || list[0].id)
        }
      } catch (err: any) {
        console.error('Failed loading topics:', err)
        setError(err.message || 'Failed loading topics')
      }
    }
    loadTopics()
  }, [])

  // Load single topic graph
  useEffect(() => {
    async function loadTopicData() {
      if (!selectedTopicId) return
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
    if (activeTab === 'topic' && selectedTopicId) {
      loadTopicData()
    }
  }, [selectedTopicId, activeTab])

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
            {topics.map((topic) => {
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

      {/* Tab 2: All Topics Cluster Map */}
      {activeTab === 'all' && (
        <div className="space-y-4">
          <div className="p-3 bg-surface rounded-lg border border-border text-xs text-secondary flex items-center justify-between flex-wrap gap-2">
            <span>
              Curriculum cluster map across all {topics.length || 11} topics ({totalConceptCount} concepts total). Click any topic bubble to open its detailed hierarchical graph.
            </span>
            <span className="font-mono text-muted text-[11px]">
              Tip: Bubble size corresponds to concept count. Connecting lines show cross-topic bridges.
            </span>
          </div>

          <TopicClusterMap
            topics={topics}
            onSelectTopic={(topicId) => {
              setSelectedTopicId(topicId)
              setActiveTab('topic')
            }}
            width={1000}
            height={640}
          />
        </div>
      )}
    </AppShell>
  )
}
