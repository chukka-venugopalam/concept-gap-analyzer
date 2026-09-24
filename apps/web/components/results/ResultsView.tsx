'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { ProgressBar } from '@/components/ui/ProgressBar'
import { ConceptCard } from '@/components/profile/ConceptCard'
import { MisconceptionCard } from '@/components/profile/MisconceptionCard'
import { NextStepsBlock } from '@/components/profile/NextStepsBlock'
import { formatDelta, getScoreColor } from '@/lib/utils'

// Plain-language explanation of what each sub-score actually measures and
// how much it counts toward Overall. Pulled directly from the real formula
// in apps/api/services/scoring_service.py — not a paraphrase, the actual
// weights and logic.
const SCORE_METHODOLOGY = [
  { key: 'coverage', label: 'Coverage', weight: 35, desc: 'How much of this topic you addressed at all, weighted by how important each concept is.' },
  { key: 'depth', label: 'Depth', weight: 25, desc: 'How confidently you explained the concepts you got right — not just that you mentioned them.' },
  { key: 'accuracy', label: 'Accuracy', weight: 25, desc: 'Starts at 100. Each misconception costs points, scaled by how important that concept is.' },
  { key: 'connectivity', label: 'Connectivity', weight: 15, desc: 'Whether you connected ideas together — using words like "because," "requires," or "builds on" — rather than listing facts in isolation.' },
] as const

function ScoreMethodology() {
  const [open, setOpen] = React.useState(false)
  return (
    <div className="mt-3">
      <button
        onClick={() => setOpen(!open)}
        className="text-xs font-mono text-muted hover:text-accent transition-colors"
      >
        {open ? '− how this is calculated' : '+ how this is calculated'}
      </button>
      {open && (
        <div className="mt-3 space-y-2.5 text-left">
          {SCORE_METHODOLOGY.map((s) => (
            <div key={s.key} className="text-xs">
              <span className="font-mono text-secondary font-medium">{s.label} ({s.weight}%)</span>
              <span className="text-muted"> — {s.desc}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// A deterministic one-line synthesis, computed from data already present —
// no extra AI call needed, consistent with this project's "AI handles
// language, code handles logic" split (the language extraction already
// happened; this just narrates the resulting counts).
function sessionSummary(topicName: string, concepts: any, misconceptions: any[]): string {
  const knownCount = concepts.known?.length || 0
  const weakCount = concepts.weak?.length || 0
  const missingCount = concepts.missing?.length || 0
  const mcCount = misconceptions?.length || 0

  const parts: string[] = []
  if (knownCount > 0) parts.push(`solidly explained ${knownCount} concept${knownCount === 1 ? '' : 's'}`)
  if (weakCount > 0) parts.push(`got partway through ${weakCount} more`)
  if (mcCount > 0) {
    parts.push(
      `— but ${mcCount} thing${mcCount === 1 ? '' : 's'} you sounded sure about ${mcCount === 1 ? 'was' : 'were'} actually wrong`
    )
  }
  if (missingCount > 0 && mcCount === 0) {
    parts.push(`with ${missingCount} concept${missingCount === 1 ? '' : 's'} not covered yet`)
  }

  if (parts.length === 0) return `No concepts were extracted from this ${topicName} session.`
  return `In this ${topicName} session, you ${parts.join(', ')}.`
}

export function ResultsView({ data }: { data: any }) {
  if (!data) return null

  const score = data.score || { overall: 0, coverage: 0, depth: 0, accuracy: 0, connectivity: 0 }
  const concepts = data.concepts || { known: [], weak: [], missing: [] }
  const misconceptions = data.misconceptions || []
  const nextConcepts = data.next_concepts || []

  const deltaText = formatDelta(score.delta)
  const summary = sessionSummary(data.topic_name || 'this', concepts, misconceptions)

  return (
    <>
      {/* SECTION 1 — Narrative Summary */}
      <p className="text-secondary text-sm leading-relaxed mb-6 max-w-2xl">{summary}</p>

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
        <ScoreMethodology />
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
