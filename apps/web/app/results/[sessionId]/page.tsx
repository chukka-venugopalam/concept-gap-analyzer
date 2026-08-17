'use client'

import React, { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { AppShell } from '@/components/layout/AppShell'
import { ResultsView } from '@/components/results/ResultsView'
import { Button } from '@/components/ui/Button'
import { Skeleton } from '@/components/ui/Skeleton'
import { sessionsAPI } from '@/lib/api/sessions'
import { formatDuration } from '@/lib/utils'

export default function ResultsPage() {
  const params = useParams()
  const router = useRouter()
  const sessionId = params?.sessionId as string

  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    async function loadResults() {
      if (!sessionId) return
      try {
        setLoading(true)
        const res = await sessionsAPI.getResults(sessionId)
        setData(res)
      } catch (err: any) {
        setError(err.message || 'Failed loading results')
      } finally {
        setLoading(false)
      }
    }
    loadResults()
  }, [sessionId])

  if (loading) {
    return (
      <AppShell>
        <div className="space-y-6">
          <Skeleton className="h-10 w-48" />
          <Skeleton className="h-48 w-full" />
          <Skeleton className="h-64 w-full" />
        </div>
      </AppShell>
    )
  }

  if (error || !data) {
    return (
      <AppShell>
        <div className="py-12 text-center">
          <p className="text-missing text-base mb-4">{error || 'Results not found'}</p>
          <Button onClick={() => router.push('/topics')}>Back to Topics</Button>
        </div>
      </AppShell>
    )
  }

  return (
    <AppShell>
      {/* SECTION 1 — Header */}
      <div className="mb-6">
        <span className="text-xs uppercase font-mono tracking-widest text-accent font-semibold block mb-1">
          {data.topic_name} Diagnostic Profile
        </span>
        <div className="flex items-center justify-between">
          <h1 className="font-display font-bold text-2xl text-primary">
            Session #{data.session_number || 1} Report
          </h1>
          <span className="text-xs text-secondary font-mono">
            {data.completed_at ? new Date(data.completed_at).toLocaleDateString() : ''}
            {data.duration_seconds && ` • ${formatDuration(data.duration_seconds)}`}
          </span>
        </div>
      </div>

      <ResultsView data={data} />

      {/* SECTION 5 — Actions */}
      <section className="flex flex-col sm:flex-row gap-4 pt-4 border-t border-border">
        <Button className="flex-1" onClick={() => router.push('/topics')}>
          Diagnose Another Topic
        </Button>
        <Button
          variant="secondary"
          className="flex-1"
          onClick={() => router.push(`/session/${data.topic_id}/intro`)}
        >
          Retake {data.topic_name}
        </Button>
      </section>
    </AppShell>
  )
}
