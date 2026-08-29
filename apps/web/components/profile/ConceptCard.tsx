'use client'

import React, { useState } from 'react'
import { Badge } from '@/components/ui/Badge'
import { cn } from '@/lib/utils'

interface ConceptCardProps {
  conceptName: string
  status: 'known' | 'weak' | 'missing'
  evidenceQuote?: string
  gapExplanation?: string
  importance?: string
  defaultExpanded?: boolean
  resources?: { title: string; url: string }[]
  real_world_example?: string | null
  practice_problems?: { platform: string; title: string; url: string; difficulty: string }[]
}

export const ConceptCard: React.FC<ConceptCardProps> = ({
  conceptName,
  status,
  evidenceQuote,
  gapExplanation,
  importance,
  defaultExpanded = false,
  resources,
  real_world_example,
  practice_problems
}) => {
  const [expanded, setExpanded] = useState(defaultExpanded || status === 'weak')

  const borderColors = {
    known: 'border-l-known bg-known-dim/40',
    weak: 'border-l-weak bg-weak-dim/40',
    missing: 'border-l-missing bg-missing-dim/40'
  }

  const problemsByPlatform: Record<string, { platform: string; title: string; url: string; difficulty: string }[]> = {}
  if (practice_problems) {
    practice_problems.forEach((p) => {
      const platform = p.platform || 'General'
      if (!problemsByPlatform[platform]) problemsByPlatform[platform] = []
      problemsByPlatform[platform].push(p)
    })
  }

  const getDifficultyBadge = (difficulty: string) => {
    const diff = difficulty.toLowerCase()
    if (diff === 'easy') {
      return <Badge variant="known">Easy</Badge>
    }
    if (diff === 'medium') {
      return <Badge variant="weak">Medium</Badge>
    }
    if (diff === 'hard') {
      return <Badge variant="missing">Hard</Badge>
    }
    return <Badge variant="default">{difficulty}</Badge>
  }

  return (
    <div
      onClick={() => setExpanded(!expanded)}
      className={cn(
        'border-l-4 rounded-r-lg p-4 mb-3 border border-border cursor-pointer transition-all hover:border-border-subtle',
        borderColors[status]
      )}
    >
      <div className="flex items-center justify-between">
        <h4 className="font-display font-semibold text-sm text-primary">{conceptName}</h4>
        <div className="flex items-center gap-2">
          {importance && (
            <span className="text-[10px] uppercase font-mono tracking-wider text-muted">
              {importance} importance
            </span>
          )}
          <Badge variant={status}>
            {status === 'known' ? 'Known' : status === 'weak' ? 'Needs Depth' : 'Missing'}
          </Badge>
        </div>
      </div>

      {expanded && (
        <div className="mt-3 pt-3 border-t border-border/40 text-xs space-y-3">
          {gapExplanation && (
            <p className="text-secondary">{gapExplanation}</p>
          )}
          {evidenceQuote && (
            <p className="text-muted italic font-mono bg-surface-2 p-2 rounded">
              "{evidenceQuote}"
            </p>
          )}
          {real_world_example && (
            <div className="p-2.5 rounded bg-surface-2 border border-border/50 text-xs">
              <span className="text-[10px] uppercase font-mono tracking-wider text-accent font-semibold block mb-0.5">
                In practice:
              </span>
              <p className="text-secondary italic">{real_world_example}</p>
            </div>
          )}
          {resources && resources.length > 0 && (
            <div className="pt-1">
              <span className="text-[10px] uppercase font-mono tracking-wider text-muted block mb-1">
                Remediation Resources
              </span>
              <ul className="space-y-1">
                {resources.map((res, idx) => (
                  <li key={idx}>
                    <a
                      href={res.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="text-accent hover:underline font-medium inline-flex items-center gap-1"
                    >
                      <span>{res.title}</span>
                      <span className="text-[10px]">↗</span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}
          {practice_problems && practice_problems.length > 0 && (
            <div className="pt-1 border-t border-border/30">
              <span className="text-[10px] uppercase font-mono tracking-wider text-muted block mb-2">
                Practice Problems
              </span>
              <div className="space-y-2.5">
                {Object.entries(problemsByPlatform).map(([platform, problems]) => (
                  <div key={platform}>
                    <span className="text-[10px] font-mono text-secondary font-semibold uppercase block mb-1">
                      {platform}
                    </span>
                    <ul className="space-y-1">
                      {problems.map((prob, idx) => (
                        <li key={idx} className="flex items-center justify-between gap-2">
                          <a
                            href={prob.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="text-primary hover:text-accent hover:underline font-medium truncate inline-flex items-center gap-1"
                          >
                            <span>{prob.title}</span>
                            <span className="text-[10px] text-muted">↗</span>
                          </a>
                          {getDifficultyBadge(prob.difficulty)}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
