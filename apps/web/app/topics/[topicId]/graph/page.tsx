'use client'

import React, { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { AppShell } from '@/components/layout/AppShell'
import { ConceptGraph, STATUS_COLORS, STATUS_LABELS } from '@/components/graph/ConceptGraph'
import { Skeleton } from '@/components/ui/Skeleton'
import { topicsAPI } from '@/lib/api/topics'

export default function TopicGraphPage() {
  const params = useParams()
  const topicId = (params?.topicId as string) || ''

  const [topicName, setTopicName] = useState<string>('')
  const [nodes, setNodes] = useState<any[]>([])
  const [edges, setEdges] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    async function loadGraph() {
      if (!topicId) return
      try {
        setLoading(true)
        setError('')
        const [graphRes, allTopicsRes] = await Promise.all([
          topicsAPI.getGraph(topicId),
          topicsAPI.getAll()
        ])
        const graphData = graphRes?.data || graphRes
        setNodes(graphData?.nodes || [])
        setEdges(graphData?.edges || [])

        const topicsData = allTopicsRes?.data?.topics || allTopicsRes?.topics || allTopicsRes?.data || allTopicsRes || []
        const current = Array.isArray(topicsData) ? topicsData.find((t: any) => t.id === topicId) : null
        setTopicName(current?.name || topicId.replace(/_/g, ' '))
      } catch (err: any) {
        console.error('Failed loading concept graph:', err)
        setError(err.message || 'Failed loading concept graph')
      } finally {
        setLoading(false)
      }
    }
    loadGraph()
  }, [topicId])

  if (loading) {
    return (
      <AppShell>
        <div className="space-y-6">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-[600px] w-full" />
        </div>
      </AppShell>
    )
  }

  const displayName = topicName || topicId.replace(/_/g, ' ')

  return (
    <AppShell>
      <div className="mb-6">
        <span className="text-xs uppercase font-mono tracking-widest text-accent font-semibold block mb-1">
          Concept Dependency Map
        </span>
        <h1 className="font-display font-bold text-2xl text-primary">
          {displayName} Dependency Graph
        </h1>
      </div>

      {error ? (
        <div className="p-4 rounded-lg bg-missing-dim text-missing border border-missing/20 text-xs mb-6">
          {error}
        </div>
      ) : (
        <>
          <div className="mb-6">
            <ConceptGraph nodes={nodes} edges={edges} />
          </div>

          {/* Legend */}
          <div className="bg-surface rounded-xl p-4 border border-border">
            <h3 className="text-xs uppercase font-mono text-muted tracking-wider mb-3">
              Mastery Legend
            </h3>
            <div className="flex flex-wrap items-center justify-between gap-4 text-xs font-mono">
              {['known', 'weak', 'missing', 'misconception', 'not_assessed'].map((statusKey) => (
                <div key={statusKey} className="flex items-center gap-2">
                  <span
                    className="w-3 h-3 rounded-full inline-block"
                    style={{ backgroundColor: STATUS_COLORS[statusKey] }}
                  />
                  <span className="text-secondary">{STATUS_LABELS[statusKey]}</span>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </AppShell>
  )
}
