'use client'

import React from 'react'
import { useRouter } from 'next/navigation'
import { Badge } from '@/components/ui/Badge'
import { ProgressBar } from '@/components/ui/ProgressBar'
import { Button } from '@/components/ui/Button'
import { getScoreColor } from '@/lib/utils'

interface TopicCardProps {
  topicId: string
  topicName: string
  conceptCount?: number
  lastScore?: number | null
  sessionCount?: number
  status?: string
}

export const TopicCard: React.FC<TopicCardProps> = ({
  topicId,
  topicName,
  conceptCount = 10,
  lastScore,
  sessionCount = 0,
  status = 'not_started'
}) => {
  const router = Router()

  function Router() {
    return useRouter()
  }

  const badgeVariant = status === 'strong' ? 'known' : status === 'in_progress' ? 'weak' : 'default'
  const badgeText = status === 'strong' ? 'Strong' : status === 'in_progress' ? 'In Progress' : 'Not Started'

  return (
    <div className="bg-surface rounded-lg p-5 border border-border flex flex-col justify-between hover:border-border-subtle transition-all">
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-display font-semibold text-base text-primary">{topicName}</h3>
          <Badge variant={badgeVariant}>{badgeText}</Badge>
        </div>

        <div className="text-xs text-secondary mb-4 space-y-1">
          <p>{conceptCount} core concepts • ~15 mins</p>
          <p>{sessionCount} session{sessionCount === 1 ? '' : 's'} completed</p>
        </div>

        {lastScore !== undefined && lastScore !== null && (
          <div className="mb-4">
            <div className="flex justify-between items-baseline mb-1">
              <span className="text-xs text-secondary">Last score</span>
              <span className="font-display font-bold text-lg" style={{ color: getScoreColor(lastScore) }}>
                {lastScore}/100
              </span>
            </div>
            <ProgressBar value={lastScore} color={getScoreColor(lastScore)} showPercent={false} />
          </div>
        )}

        {sessionCount > 0 && (
          <div className="mb-4 flex items-center gap-3">
            <button
              onClick={(e) => {
                e.stopPropagation()
                router.push(`/topics/${topicId}/history`)
              }}
              className="text-xs text-accent hover:underline font-medium transition-all cursor-pointer"
            >
              View history →
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation()
                router.push(`/topics/${topicId}/graph`)
              }}
              className="text-xs text-accent hover:underline font-medium transition-all cursor-pointer"
            >
              View graph →
            </button>
          </div>
        )}
      </div>

      <Button
        variant={status === 'not_started' ? 'primary' : 'secondary'}
        size="sm"
        className="w-full mt-2"
        onClick={() => router.push(`/session/${topicId}/intro`)}
      >
        {status === 'not_started' ? 'Diagnose →' : 'Re-diagnose →'}
      </Button>
    </div>
  )
}
