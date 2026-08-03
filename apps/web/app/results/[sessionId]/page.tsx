'use client'

import React, { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { AppShell } from '@/components/layout/AppShell'
import { ProgressBar } from '@/components/ui/ProgressBar'
import { ConceptCard } from '@/components/profile/ConceptCard'
import { MisconceptionCard } from '@/components/profile/MisconceptionCard'
import { NextStepsBlock } from '@/components/profile/NextStepsBlock'
import { Button } from '@/components/ui/Button'
import { Skeleton } from '@/components/ui/Skeleton'
import { sessionsAPI } from '@/lib/api/sessions'
import { formatDelta, formatDuration, getScoreColor } from '@/lib/utils'

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
        setData(res.data)
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

  const score = data.score || { overall: 0, coverage: 0, depth: 0, accuracy: 0, connectivity: 0 }
  const concepts = data.concepts || { known: [], weak: [], missing: [] }
  const misconceptions = data.misconceptions || []
  const nextConcepts = data.next_concepts || []

  const deltaText = formatDelta(score.delta)

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

      {/* SECTION 2 — Score Block */}
      <section className="bg-surface border border-border rounded-xl p-6 mb-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-6">
          <div className="text-center md:text-left">
            <span className="text-xs uppercase text-muted tracking-wider font-mono block mb-1">
              Overall Score
            </span>
            <div className="flex items-baseline justify-center md:justify-start gap-3">
              <motion.span
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6 }}
                className="font-display font-bold text-6xl"
                style={{ color: getScoreColor(score.overall) }}
              >
                {score.overall}
              </motion.span>
              <span className="text-secondary text-sm font-mono">/ 100</span>
            </div>
            {deltaText && (
              <span
                className={`inline-block mt-1 text-xs font-mono font-medium ${
                  score.delta >= 0 ? 'text-known' : 'text-missing'
                }`}
              >
                {deltaText} from last session {score.delta >= 0 ? '↑' : '↓'}
              </span>
            )}
          </div>

          <div className="w-full md:w-64 space-y-3">
            <ProgressBar value={score.coverage} label="Coverage" />
            <ProgressBar value={score.depth} label="Depth" />
            <ProgressBar value={score.accuracy} label="Accuracy" />
            <ProgressBar value={score.connectivity} label="Connectivity" />
          </div>
        </div>
      </section>

      {/* SECTION 3 — Concept Status */}
      <section className="space-y-6 mb-8">
        {concepts.known?.length > 0 && (
          <div>
            <h3 className="font-display font-semibold text-sm text-known mb-3 flex items-center gap-2">
              <span>✓</span> Understood ({concepts.known.length})
            </h3>
            {concepts.known.map((c: any) => (
              <ConceptCard
                key={c.concept_id}
                conceptName={c.concept_name}
                status="known"
                evidenceQuote={c.evidence_quote}
              />
            ))}
          </div>
        )}

        {concepts.weak?.length > 0 && (
          <div>
            <h3 className="font-display font-semibold text-sm text-weak mb-3 flex items-center gap-2">
              <span>◐</span> Needs Depth ({concepts.weak.length})
            </h3>
            {concepts.weak.map((c: any) => (
              <ConceptCard
                key={c.concept_id}
                conceptName={c.concept_name}
                status="weak"
                gapExplanation={c.gap_explanation}
                evidenceQuote={c.evidence_quote}
              />
            ))}
          </div>
        )}

        {concepts.missing?.length > 0 && (
          <div>
            <h3 className="font-display font-semibold text-sm text-missing mb-3 flex items-center gap-2">
              <span>○</span> Not Covered ({concepts.missing.length})
            </h3>
            {concepts.missing.map((c: any) => (
              <ConceptCard
                key={c.concept_id}
                conceptName={c.concept_name}
                status="missing"
                importance={c.importance}
              />
            ))}
          </div>
        )}

        {misconceptions?.length > 0 && (
          <div>
            <h3 className="font-display font-semibold text-sm text-misconception mb-3 flex items-center gap-2">
              <span>✗</span> Misconception Detected ({misconceptions.length})
            </h3>
            {misconceptions.map((m: any) => (
              <MisconceptionCard
                key={m.concept_id}
                conceptName={m.concept_name}
                whatUserSaid={m.what_user_said}
                correction={m.correction}
                confidence={m.confidence}
              />
            ))}
          </div>
        )}
      </section>

      {/* SECTION 4 — Next Steps */}
      {nextConcepts?.length > 0 && (
        <section className="mb-8">
          <h3 className="font-display font-semibold text-base text-primary mb-4">
            What to Study Next
          </h3>
          <NextStepsBlock items={nextConcepts} />
        </section>
      )}

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
