'use client'

import React, { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { SessionShell } from '@/components/layout/SessionShell'
import { Button } from '@/components/ui/Button'
import { usersAPI } from '@/lib/api/users'
import { TOPICS } from '@/lib/topics'

export default function SessionIntroPage() {
  const params = useParams()
  const router = useRouter()
  const topicId = (params?.topicId as string) || 'arrays_hashing'

  const topicObj = TOPICS.find((t) => t.id === topicId)
  const topicName = topicObj ? topicObj.name : topicId

  const [lastSession, setLastSession] = useState<any>(null)

  useEffect(() => {
    async function loadLastSession() {
      try {
        const res = await usersAPI.getSessions(1, topicId)
        if (res.data?.sessions?.length > 0) {
          setLastSession(res.data.sessions[0])
        }
      } catch {
        // ignore
      }
    }
    loadLastSession()
  }, [topicId])

  return (
    <SessionShell topicName={topicName}>
      <div className="py-6">
        <p className="text-xs uppercase font-mono tracking-widest text-accent mb-4 font-semibold">
          {topicName} Diagnostic
        </p>

        <h1 className="font-display font-bold text-3xl md:text-4xl text-primary mb-6">
          You're about to explain {topicName}
        </h1>

        <div className="text-secondary text-base space-y-4 mb-8 leading-relaxed">
          <p>
            Explain this topic as if you're in a technical interview. There are no trick questions and no wrong starting points. We're mapping your understanding, not testing your vocabulary.
          </p>
          <p>
            Try to cover: what it is, how it works, when you'd use it, and any properties or operations you remember.
          </p>
        </div>

        {lastSession && (
          <div className="bg-surface-2 border border-border rounded-lg p-4 mb-8 text-xs text-secondary">
            <span className="font-semibold text-primary">Last session score: </span>
            <span className="font-mono text-accent font-bold">{lastSession.score_overall}/100</span>
          </div>
        )}

        <Button
          size="lg"
          className="w-full font-display font-semibold"
          onClick={() => router.push(`/session/${topicId}/run`)}
        >
          I'm Ready — Start Diagnostic
        </Button>
      </div>
    </SessionShell>
  )
}
