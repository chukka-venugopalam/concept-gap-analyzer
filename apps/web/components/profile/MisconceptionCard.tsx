'use client'

import React from 'react'
import { Badge } from '@/components/ui/Badge'

interface MisconceptionCardProps {
  conceptName: string
  whatUserSaid: string
  correction: string
  confidence?: number
}

export const MisconceptionCard: React.FC<MisconceptionCardProps> = ({
  conceptName,
  whatUserSaid,
  correction,
  confidence
}) => {
  return (
    <div className="border-l-4 border-l-misconception bg-misconception-dim/40 rounded-r-lg p-4 mb-3 border border-border">
      <div className="flex items-center justify-between mb-3">
        <h4 className="font-display font-semibold text-sm text-primary">{conceptName}</h4>
        <Badge variant="misconception">Misconception</Badge>
      </div>

      <div className="space-y-3 text-xs">
        <div>
          <span className="text-muted block font-medium mb-1">You said:</span>
          <p className="font-mono text-secondary italic bg-surface-2 p-2 rounded">
            "{whatUserSaid}"
          </p>
        </div>
        <div>
          <span className="text-known font-medium block mb-1">Actually:</span>
          <p className="text-primary">{correction}</p>
        </div>
      </div>
    </div>
  )
}
