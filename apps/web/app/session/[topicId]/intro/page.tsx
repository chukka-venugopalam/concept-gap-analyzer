'use client'

import React, { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { SessionShell } from '@/components/layout/SessionShell'
import { Button } from '@/components/ui/Button'
import { usersAPI } from '@/lib/api/users'
import { topicsAPI } from '@/lib/api/topics'

export default function SessionIntroPage() {
  const params = useParams()
  const router = useRouter()
  const topicId = (params?.topicId as string) || 'arrays_hashing'

  const [topicName, setTopicName] = useState<string>(topicId.replace(/_/g, ' '))
  const [lastSession, setLastSession] = useState<any>(null)

  useEffect(() => {
    async function loadData() {
      try {
        const [sessRes, topicsRes] = await Promise.all([
          usersAPI.getSessions(1, topicId),
          topicsAPI.getAll()
        ])
        if (sessRes?.sessions?.length > 0) {
          setLastSession(sessRes.sessions[0])
        }
        const topicsList = Array.isArray(topicsRes) ? topicsRes : topicsRes?.topics || topicsRes?.data?.topics || []
        const current = Array.isArray(topicsList) ? topicsList.find((t: any) => t.id === topicId) : null
        if (current?.name) {
          setTopicName(current.name)
        }
      } catch {
        // ignore
      }
    }
    loadData()
  }, [topicId])

  return (
    <SessionShell topicName={topicName}>
      <div className="py-6">
        <p className="text-xs uppercase font-mono tracking-widest text-accent mb-4 font-semibold">
          {topicName} Diagnostic
        </p>

        <h1 className="font-display font-bold text-3xl md:text-4xl text-primary mb-6">
          You&apos;re about to explain {topicName}
        </h1>

        <div className="text-secondary text-base space-y-4 mb-8 leading-relaxed">
          <p>
            Explain this topic as if you&apos;re in a technical interview. There are no trick questions and no wrong starting points. We&apos;re mapping your understanding, not testing your vocabulary.
          </p>
          <p>
            Try to cover: what it is, how it works, when you&apos;d use it, and any properties or operations you remember.
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
          I&apos;m Ready — Start Diagnostic
        </Button>
      </div>
    </SessionShell>
  )
}
