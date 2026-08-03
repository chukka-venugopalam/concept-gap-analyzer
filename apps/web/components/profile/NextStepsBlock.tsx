'use client'

import React from 'react'

interface NextStepItem {
  concept_id: string
  concept_name: string
  reason: string
}

export const NextStepsBlock: React.FC<{ items: NextStepItem[] }> = ({ items }) => {
  if (!items || items.length === 0) return null

  return (
    <div className="space-y-3">
      {items.map((item, idx) => (
        <div
          key={item.concept_id}
          className="border-l-2 border-accent bg-surface p-4 rounded-r-lg border border-border-subtle flex items-start gap-4"
        >
          <span className="font-display font-bold text-accent text-lg leading-none">
            0{idx + 1}
          </span>
          <div>
            <h4 className="font-display font-semibold text-sm text-primary mb-1">
              {item.concept_name}
            </h4>
            <p className="text-xs text-secondary">{item.reason}</p>
          </div>
        </div>
      ))}
    </div>
  )
}
