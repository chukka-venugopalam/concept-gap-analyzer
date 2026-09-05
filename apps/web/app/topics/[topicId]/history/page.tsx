'use client'

import React, { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { AppShell } from '@/components/layout/AppShell'
import { ScoreTrendChart } from '@/components/dashboard/ScoreTrendChart'
import { Skeleton } from '@/components/ui/Skeleton'
import { usersAPI } from '@/lib/api/users'
import { topicsAPI } from '@/lib/api/topics'
import { formatDuration, getScoreColor } from '@/lib/utils'

export default function TopicHistoryPage() {
  const params = useParams()
  const router = useRouter()
  const topicId = (params?.topicId as string) || ''

  const [topicName, setTopicName] = useState<string>('')
  const [sessions, setSessions] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    async function loadHistory() {
      if (!topicId) return
      try {
        setLoading(true)
        setError('')
        const [result, allTopicsRes] = await Promise.all([
          usersAPI.getSessions(20, topicId),
          topicsAPI.getAll()
        ])
        const sessionData = result?.data || result
        const sessionList = Array.isArray(sessionData)
          ? sessionData
          : Array.isArray(sessionData?.sessions)
          ? sessionData.sessions
          : []
        setSessions(sessionList)

        const topicsData = allTopicsRes?.data?.topics || allTopicsRes?.topics || allTopicsRes?.data || allTopicsRes || []
        const current = Array.isArray(topicsData) ? topicsData.find((t: any) => t.id === topicId) : null
        setTopicName(
          current?.name ||
          (sessionList.length > 0 && sessionList[0].topic_name ? sessionList[0].topic_name : topicId.replace(/_/g, ' '))
        )
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

  const displayName = topicName || topicId.replace(/_/g, ' ')

  return (
    <AppShell>
      <div className="mb-6">
        <span className="text-xs uppercase font-mono tracking-widest text-accent font-semibold block mb-1">
          Session History & Score Trend
        </span>
        <h1 className="font-display font-bold text-2xl text-primary">
          {displayName} History
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
                    {s.topic_name || displayName} — Session #{s.session_number}
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
