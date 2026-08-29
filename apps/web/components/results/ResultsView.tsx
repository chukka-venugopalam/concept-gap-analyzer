'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { ProgressBar } from '@/components/ui/ProgressBar'
import { ConceptCard } from '@/components/profile/ConceptCard'
import { MisconceptionCard } from '@/components/profile/MisconceptionCard'
import { NextStepsBlock } from '@/components/profile/NextStepsBlock'
import { formatDelta, getScoreColor } from '@/lib/utils'

export function ResultsView({ data }: { data: any }) {
  if (!data) return null

  const score = data.score || { overall: 0, coverage: 0, depth: 0, accuracy: 0, connectivity: 0 }
  const concepts = data.concepts || { known: [], weak: [], missing: [] }
  const misconceptions = data.misconceptions || []
  const nextConcepts = data.next_concepts || []

  const deltaText = formatDelta(score.delta)

  return (
    <>
      {data.extraction_degraded && (
        <div className="bg-weak/10 text-weak border border-weak/20 p-4 rounded-xl mb-6 text-xs flex items-start gap-2">
          <span className="shrink-0">⚠️</span>
          <span>
            AI analysis was temporarily degraded during this session (high demand on our AI provider). This score may not reflect what you actually know — consider retaking this diagnostic.
          </span>
        </div>
      )}

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
                resources={c.resources}
                real_world_example={c.real_world_example}
                practice_problems={c.practice_problems}
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
                resources={c.resources}
                real_world_example={c.real_world_example}
                practice_problems={c.practice_problems}
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
    </>
  )
}
