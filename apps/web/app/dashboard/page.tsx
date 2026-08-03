'use client'

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { AppShell } from '@/components/layout/AppShell'
import { TopicCard } from '@/components/dashboard/TopicCard'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { Skeleton } from '@/components/ui/Skeleton'
import { usersAPI } from '@/lib/api/users'
import { formatDuration, getScoreColor } from '@/lib/utils'

export default function DashboardPage() {
  const router = useRouter()
  const [profile, setProfile] = useState<any>(null)
  const [topics, setTopics] = useState<any[]>([])
  const [recentSessions, setRecentSessions] = useState<any[]>([])
  const [weaknesses, setWeaknesses] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadDashboard() {
      setLoading(true)

      try {
        const result = await usersAPI.getProfile()
        setProfile(result || null)
      } catch (error) {
        console.error('Failed to load profile:', error)
        setProfile(null)
      }

      try {
        const result = await usersAPI.getTopicStatus()
        setTopics(result?.topics || [])
      } catch (error) {
        console.error('Failed to load topic status:', error)
        setTopics([])
      }

      try {
        const result = await usersAPI.getSessions(3)
        setRecentSessions(result?.sessions || [])
      } catch (error) {
        console.error('Failed to load sessions:', error)
        setRecentSessions([])
      }

      try {
        const result = await usersAPI.getTopWeaknesses(5)
        setWeaknesses(result?.weaknesses || [])
      } catch (error) {
        console.error('Failed to load weaknesses:', error)
        setWeaknesses([])
      }

      setLoading(false)
    }

    loadDashboard()
  }, [])

  return (
    <AppShell>
      {/* Section A: Welcome Bar */}
      <section className="bg-surface rounded-xl p-6 border border-border mb-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="font-display font-semibold text-2xl text-primary mb-1">
            Welcome back{profile?.display_name ? `, ${profile.display_name}` : ''}
          </h1>
          <p className="text-xs text-secondary">
            {recentSessions.length > 0
              ? `Last session completed on ${new Date(recentSessions[0].completed_at).toLocaleDateString()}`
              : 'Start your first conceptual diagnostic session to map your knowledge.'}
          </p>
        </div>
        <Button onClick={() => router.push('/topics')}>
          Start Diagnostic
        </Button>
      </section>

      {/* Section B: Topic Grid */}
      <section className="mb-10">
        <h2 className="font-display font-semibold text-lg text-primary mb-4">
          Diagnostic Domains
        </h2>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Skeleton className="h-44" />
            <Skeleton className="h-44" />
            <Skeleton className="h-44" />
            <Skeleton className="h-44" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {topics.map((t) => (
              <TopicCard
                key={t.topic_id}
                topicId={t.topic_id}
                topicName={t.topic_name}
                conceptCount={t.concept_count}
                lastScore={t.last_score}
                sessionCount={t.session_count}
                status={t.status}
              />
            ))}
          </div>
        )}
      </section>

      {/* Section C: Recent Sessions */}
      {recentSessions.length > 0 && (
        <section className="mb-10">
          <h2 className="font-display font-semibold text-lg text-primary mb-4">
            Recent Diagnostic Sessions
          </h2>
          <div className="bg-surface rounded-lg border border-border divide-y divide-border">
            {recentSessions.map((s) => (
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
        </section>
      )}

      {/* Section D: Top Weaknesses */}
      {weaknesses.length > 0 && (
        <section>
          <h2 className="font-display font-semibold text-lg text-primary mb-4">
            Concepts to Focus On
          </h2>
          <div className="space-y-3">
            {weaknesses.map((w) => (
              <div
                key={w.concept_id}
                className="bg-surface p-4 rounded-lg border border-border flex items-center justify-between"
              >
                <div>
                  <h4 className="font-display font-semibold text-sm text-primary">
                    {w.concept_name}
                  </h4>
                  <span className="text-xs text-secondary">{w.topic_name}</span>
                </div>
                <Badge variant={w.current_status === 'missing' ? 'missing' : 'weak'}>
                  {w.current_status === 'missing' ? 'Missing' : 'Weak'}
                </Badge>
              </div>
            ))}
          </div>
        </section>
      )}
    </AppShell>
  )
}
