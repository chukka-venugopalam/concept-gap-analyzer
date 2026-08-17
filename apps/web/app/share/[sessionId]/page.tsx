'use client'

import React, { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { ResultsView } from '@/components/results/ResultsView'
import { Skeleton } from '@/components/ui/Skeleton'
import { sessionsAPI } from '@/lib/api/sessions'
import { formatDuration } from '@/lib/utils'

export default function PublicShareResultsPage() {
  const params = useParams()
  const sessionId = params?.sessionId as string

  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    async function loadPublicResults() {
      if (!sessionId) return
      try {
        setLoading(true)
        const res = await sessionsAPI.getPublicResults(sessionId)
        setData(res)
      } catch (err: any) {
        setError(err.message || 'Results not found or not yet completed')
      } finally {
        setLoading(false)
      }
    }
    loadPublicResults()
  }, [sessionId])

  if (loading) {
    return (
      <main className="min-h-screen bg-bg text-primary p-6 max-w-4xl mx-auto space-y-6">
        <Skeleton className="h-10 w-48" />
        <Skeleton className="h-48 w-full" />
        <Skeleton className="h-64 w-full" />
      </main>
    )
  }

  if (error || !data) {
    return (
      <main className="min-h-screen bg-bg text-primary flex items-center justify-center p-6 text-center">
        <p className="text-secondary text-sm">Results not found or not yet completed</p>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-bg text-primary p-6 max-w-4xl mx-auto">
      {/* Minimal Header */}
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

      {/* Footer Link */}
      <div className="pt-6 border-t border-border text-center">
        <Link
          href="/"
          className="text-xs text-secondary hover:text-accent font-mono transition-colors"
        >
          Diagnosed with CIP → /
        </Link>
      </div>
    </main>
  )
}
