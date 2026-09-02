'use client'

import React, { useEffect, useState } from 'react'
import { AppShell } from '@/components/layout/AppShell'
import { ConceptGraph, LIBRARY_COLORS, NodeItem, EdgeItem } from '@/components/graph/ConceptGraph'
import { Skeleton } from '@/components/ui/Skeleton'
import { topicsAPI } from '@/lib/api/topics'
import { TOPICS } from '@/lib/topics'

export default function LibraryPage() {
  const [selectedTopicId, setSelectedTopicId] = useState<string>(TOPICS[0].id)
  const [nodes, setNodes] = useState<NodeItem[]>([])
  const [edges, setEdges] = useState<EdgeItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    async function loadLibrary() {
      try {
        setLoading(true)
        setError('')
        const res = await topicsAPI.getLibrary(selectedTopicId)
        const libraryData = res?.data || res
        setNodes(libraryData?.nodes || [])
        setEdges(libraryData?.edges || [])
      } catch (err: any) {
        console.error('Failed loading concept library:', err)
        setError(err.message || 'Failed loading concept library')
      } finally {
        setLoading(false)
      }
    }
    loadLibrary()
  }, [selectedTopicId])

  const currentTopic = TOPICS.find((t) => t.id === selectedTopicId) || TOPICS[0]

  return (
    <AppShell>
      <div className="mb-6">
        <span className="text-xs uppercase font-mono tracking-widest text-accent font-semibold block mb-1">
          Reference & Practice
        </span>
        <h1 className="font-display font-bold text-2xl text-primary">
          Concept Library
        </h1>
        <p className="text-xs text-secondary mt-1">
          Explore core definitions, practical applications, study resources, and curated practice problems without diagnostic gating.
        </p>
      </div>

      {/* Topic Picker */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 mb-6 scrollbar-none">
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

      {error ? (
        <div className="p-4 rounded-lg bg-missing-dim text-missing border border-missing/20 text-xs mb-6">
          {error}
        </div>
      ) : loading ? (
        <div className="space-y-6">
          <Skeleton className="h-[600px] w-full" />
        </div>
      ) : (
        <div className="space-y-6">
          <ConceptGraph mode="library" nodes={nodes} edges={edges} />

          {/* Priority / Importance Legend */}
          <div className="bg-surface rounded-xl p-4 border border-border">
            <h3 className="text-xs uppercase font-mono text-muted tracking-wider mb-3">
              Concept Hierarchy
            </h3>
            <div className="flex flex-wrap items-center justify-between gap-4 text-xs font-mono">
              <div className="flex items-center gap-2">
                <span
                  className="w-3 h-3 rounded-full inline-block"
                  style={{ backgroundColor: LIBRARY_COLORS[3] }}
                />
                <span className="text-secondary">Core / High Importance</span>
              </div>
              <div className="flex items-center gap-2">
                <span
                  className="w-3 h-3 rounded-full inline-block"
                  style={{ backgroundColor: LIBRARY_COLORS[2] }}
                />
                <span className="text-secondary">Key Topic Concept</span>
              </div>
              <div className="flex items-center gap-2">
                <span
                  className="w-3 h-3 rounded-full inline-block"
                  style={{ backgroundColor: LIBRARY_COLORS[1] }}
                />
                <span className="text-secondary">Foundational Concept</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </AppShell>
  )
}
