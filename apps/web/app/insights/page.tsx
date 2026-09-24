'use client'

import React, { useEffect, useState } from 'react'
import { AppShell } from '@/components/layout/AppShell'
import { Skeleton } from '@/components/ui/Skeleton'
import { insightsAPI } from '@/lib/api/insights'
import { HelpCircle } from 'lucide-react'

interface LeaderboardEntry {
  concept_id: string
  concept_name: string
  topic_id: string
  topic_name: string
  total_evaluations: number
  misconception_count: number
  misconception_rate: number
}

export default function InsightsPage() {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[] | null>(null)
  const [error, setError] = useState('')

  useEffect(() => {
    async function load() {
      try {
        const res = await insightsAPI.getMisconceptionLeaderboard(20)
        setLeaderboard(res?.data?.leaderboard ?? [])
      } catch (err: any) {
        setError(err.message || 'Could not load misconception stats')
      }
    }
    load()
  }, [])

  return (
    <AppShell>
      <main className="max-w-3xl mx-auto p-6">
        <div className="mb-8">
          <div
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full mb-4 text-xs font-mono"
            style={{ color: 'var(--misconception)', backgroundColor: 'var(--misconception-dim)' }}
          >
            <HelpCircle className="w-3.5 h-3.5" />
            Aggregated across every CIP session
          </div>
          <h1 className="font-display font-bold text-2xl text-primary mb-2">
            What everyone gets confidently wrong
          </h1>
          <p className="text-secondary text-sm max-w-lg">
            Anonymized across every session ever run. No individual answers or
            usernames — just how often each concept trips people up.
          </p>
        </div>

        {error && (
          <p className="text-missing text-sm">{error}</p>
        )}

        {!leaderboard && !error && (
          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <Skeleton key={i} className="h-16 w-full" />
            ))}
          </div>
        )}

        {leaderboard && leaderboard.length === 0 && (
          <p className="text-secondary text-sm">
            Not enough sessions yet for a reliable leaderboard — check back once more people have run diagnostics.
          </p>
        )}

        {leaderboard && leaderboard.length > 0 && (
          <div className="space-y-2">
            {leaderboard.map((entry, i) => (
              <div
                key={entry.concept_id}
                className="flex items-center gap-4 p-4 rounded-xl border border-border-subtle bg-surface"
              >
                <span className="font-mono text-sm text-muted w-6 shrink-0">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <div className="flex-1 min-w-0">
                  <div className="text-sm text-primary font-medium truncate">
                    {entry.concept_name}
                  </div>
                  <div className="text-xs text-muted">{entry.topic_name}</div>
                </div>
                <div className="text-right shrink-0">
                  <div
                    className="font-mono font-semibold text-lg"
                    style={{ color: 'var(--misconception)' }}
                  >
                    {entry.misconception_rate}%
                  </div>
                  <div className="text-xs text-muted">
                    of {entry.total_evaluations} attempts
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </AppShell>
  )
}
