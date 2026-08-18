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
}

export const ConceptCard: React.FC<ConceptCardProps> = ({
  conceptName,
  status,
  evidenceQuote,
  gapExplanation,
  importance,
  defaultExpanded = false,
  resources
}) => {
  const [expanded, setExpanded] = useState(defaultExpanded || status === 'weak')

  const borderColors = {
    known: 'border-l-known bg-known-dim/40',
    weak: 'border-l-weak bg-weak-dim/40',
    missing: 'border-l-missing bg-missing-dim/40'
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
        <div className="mt-3 pt-3 border-t border-border/40 text-xs space-y-2">
          {gapExplanation && (
            <p className="text-secondary">{gapExplanation}</p>
          )}
          {evidenceQuote && (
            <p className="text-muted italic font-mono bg-surface-2 p-2 rounded">
              "{evidenceQuote}"
            </p>
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
        </div>
      )}
    </div>
  )
}
