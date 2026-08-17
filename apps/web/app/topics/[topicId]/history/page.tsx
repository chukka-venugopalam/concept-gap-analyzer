'use client'

import React, { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { AppShell } from '@/components/layout/AppShell'
import { ScoreTrendChart } from '@/components/dashboard/ScoreTrendChart'
import { Skeleton } from '@/components/ui/Skeleton'
import { usersAPI } from '@/lib/api/users'
import { TOPICS } from '@/lib/topics'
import { formatDuration, getScoreColor } from '@/lib/utils'

export default function TopicHistoryPage() {
  const params = useParams()
  const router = useRouter()
  const topicId = (params?.topicId as string) || ''

  const topicObj = TOPICS.find((t) => t.id === topicId)

  const [sessions, setSessions] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    async function loadHistory() {
      if (!topicId) return
      try {
        setLoading(true)
        const result = await usersAPI.getSessions(20, topicId)
        const sessionList = Array.isArray(result)
          ? result
          : Array.isArray(result?.sessions)
          ? result.sessions
          : []
        setSessions(sessionList)
      } catch (err: any) {
        console.error('Failed loading session history:', err)
        setError(err.message || 'Failed loading session history')
        setSessions([])
      } finally {
        setLoading(false)
      }
    }
    loadHistory()
  }, [topicId])

  const topicName =
    sessions.length > 0 && sessions[0].topic_name
      ? sessions[0].topic_name
      : topicObj
      ? topicObj.name
      : topicId

  if (loading) {
    return (
      <AppShell>
        <div className="space-y-6">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-36 w-full" />
          <Skeleton className="h-48 w-full" />
        </div>
      </AppShell>
    )
  }

  return (
    <AppShell>
      <div className="mb-6">
        <span className="text-xs uppercase font-mono tracking-widest text-accent font-semibold block mb-1">
          Session History & Score Trend
        </span>
        <h1 className="font-display font-bold text-2xl text-primary">
          {topicName} History
        </h1>
      </div>

      {error ? (
        <div className="p-4 rounded-lg bg-missing-dim text-missing border border-missing/20 text-xs mb-6">
          {error}
        </div>
      ) : null}

      <div className="mb-8">
        <ScoreTrendChart sessions={sessions} />
      </div>

      <div className="mb-8">
        <h2 className="font-display font-semibold text-lg text-primary mb-4">
          Past Diagnostic Sessions
        </h2>
        {sessions.length === 0 ? (
          <div className="bg-surface rounded-lg p-6 border border-border text-center text-secondary text-xs">
            No completed diagnostic sessions yet for this topic.
          </div>
        ) : (
          <div className="bg-surface rounded-lg border border-border divide-y divide-border">
            {sessions.map((s) => (
              <div
                key={s.session_id}
                onClick={() => router.push(`/results/${s.session_id}`)}
                className="p-4 flex items-center justify-between hover:bg-surface-2 cursor-pointer transition-colors"
              >
                <div>
                  <h4 className="font-display font-semibold text-sm text-primary">
                    {s.topic_name} — Session #{s.session_number}
                  </h4>
                  <span className="text-xs text-secondary">
                    {new Date(s.completed_at).toLocaleDateString()}
                    {s.duration_seconds && ` • ${formatDuration(s.duration_seconds)}`}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <span
                    className="font-display font-bold text-base"
                    style={{ color: getScoreColor(s.score_overall) }}
                  >
                    {s.score_overall}/100
                  </span>
                  <span className="text-xs text-muted">→</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AppShell>
  )
}
