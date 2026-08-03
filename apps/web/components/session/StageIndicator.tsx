'use client'

import React from 'react'
import { cn } from '@/lib/utils'

interface StageIndicatorProps {
  currentStage: 1 | 2 | 3 | 'loading' | 'done'
}

export const StageIndicator: React.FC<StageIndicatorProps> = ({ currentStage }) => {
  const stages = [
    { num: 1, label: 'Stage 1: Open Explanation' },
    { num: 2, label: 'Stage 2: Follow-up Probes' },
    { num: 3, label: 'Stage 3: Challenge Task' },
  ]

  const activeNum = typeof currentStage === 'number' ? currentStage : 3

  return (
    <div className="w-full mb-8">
      <div className="flex items-center justify-between gap-2">
        {stages.map((st) => {
          const isDone = st.num < activeNum
          const isActive = st.num === activeNum
          return (
            <div key={st.num} className="flex-1 flex items-center gap-2">
              <div
                className={cn(
                  'w-8 h-8 rounded-full flex items-center justify-center font-display text-xs font-bold transition-all',
                  isDone && 'bg-accent/40 text-primary border border-accent',
                  isActive && 'bg-accent text-white shadow-accent ring-2 ring-accent/30',
                  !isDone && !isActive && 'bg-surface-2 text-muted border border-border'
                )}
              >
                {st.num}
              </div>
              <span
                className={cn(
                  'hidden md:inline text-xs font-medium',
                  isActive ? 'text-primary' : 'text-muted'
                )}
              >
                {st.label}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
