'use client'

import React, { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { AppShell } from '@/components/layout/AppShell'
import { ConceptGraph, LIBRARY_COLORS } from '@/components/graph/ConceptGraph'
import { Skeleton } from '@/components/ui/Skeleton'
import { topicsAPI } from '@/lib/api/topics'
import { TOPICS } from '@/lib/topics'

export default function TopicLibraryPage() {
  const params = useParams()
  const topicId = (params?.topicId as string) || ''

  const topicObj = TOPICS.find((t) => t.id === topicId)
  const topicName = topicObj ? topicObj.name : topicId

  const [nodes, setNodes] = useState<any[]>([])
  const [edges, setEdges] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    async function loadLibrary() {
      if (!topicId) return
      try {
        setLoading(true)
        const res = await topicsAPI.getLibrary(topicId)
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
  }, [topicId])

  if (loading) {
    return (
      <AppShell>
        <div className="space-y-6">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-[600px] w-full" />
        </div>
      </AppShell>
    )
  }

  return (
    <AppShell>
      <div className="mb-6">
        <span className="text-xs uppercase font-mono tracking-widest text-accent font-semibold block mb-1">
          Reference Library
        </span>
        <h1 className="font-display font-bold text-2xl text-primary">
          {topicName} — Concept Library
        </h1>
        <p className="text-xs text-secondary mt-1">
          Explore core concepts, definitions, study resources, and curated practice problems for {topicName}.
        </p>
      </div>

      {error ? (
        <div className="p-4 rounded-lg bg-missing-dim text-missing border border-missing/20 text-xs mb-6">
          {error}
        </div>
      ) : (
        <>
          <div className="mb-6">
            <ConceptGraph mode="library" nodes={nodes} edges={edges} />
          </div>

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
        </>
      )}
    </AppShell>
  )
}
