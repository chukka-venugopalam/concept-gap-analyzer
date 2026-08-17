'use client'

import React from 'react'
import { getScoreColor } from '@/lib/utils'

interface ScoreTrendChartProps {
  sessions: { score_overall: number; completed_at: string }[]
}

export function ScoreTrendChart({ sessions }: ScoreTrendChartProps) {
  if (!sessions || sessions.length < 2) {
    return (
      <div className="bg-surface rounded-xl p-6 border border-border text-center text-secondary text-xs">
        Complete another session to see your trend
      </div>
    )
  }

  const sorted = [...sessions].sort(
    (a, b) => new Date(a.completed_at).getTime() - new Date(b.completed_at).getTime()
  )

  const paddingX = 30
  const paddingY = 20
  const width = 400
  const height = 120
  const usableWidth = width - 2 * paddingX
  const usableHeight = height - 2 * paddingY

  const points = sorted.map((s, i) => {
    const x = paddingX + (i * usableWidth) / (sorted.length - 1)
    const score = Math.max(0, Math.min(100, s.score_overall ?? 0))
    const y = paddingY + ((100 - score) * usableHeight) / 100
    return { x, y, score }
  })

  const polylinePoints = points.map((p) => `${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' ')
  const latestScore = sorted[sorted.length - 1]?.score_overall ?? 0
  const strokeColor = getScoreColor(latestScore)

  return (
    <div className="bg-surface rounded-xl p-4 border border-border">
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto overflow-visible">
        <polyline
          points={polylinePoints}
          fill="none"
          stroke={strokeColor}
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {points.map((p, idx) => (
          <circle
            key={idx}
            cx={p.x}
            cy={p.y}
            r="4"
            fill={strokeColor}
            className="transition-all"
          >
            <title>{`Session ${idx + 1}: ${p.score}/100`}</title>
          </circle>
        ))}
      </svg>
    </div>
  )
}
