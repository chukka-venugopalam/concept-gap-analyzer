'use client'

import React, { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { SessionShell } from '@/components/layout/SessionShell'
import { StageIndicator } from '@/components/session/StageIndicator'
import { Textarea } from '@/components/ui/Textarea'
import { Button } from '@/components/ui/Button'
import { sessionsAPI } from '@/lib/api/sessions'
import { TOPICS } from '@/lib/topics'

export default function SessionRunPage() {
  const params = useParams()
  const router = useRouter()
  const topicId = (params?.topicId as string) || 'arrays_hashing'

  const topicObj = TOPICS.find((t) => t.id === topicId)
  const topicName = topicObj ? topicObj.name : topicId

  const [stage, setStage] = useState<1 | 2 | 3 | 'loading'>(1)
  const [sessionId, setSessionId] = useState<string | null>(null)
  
  // Stage 1
  const [stage1Text, setStage1Text] = useState('')
  
  // Stage 2
  const [probes, setProbes] = useState<any[]>([])
  const [currentProbeIndex, setCurrentProbeIndex] = useState(0)
  const [currentProbeResponse, setCurrentProbeResponse] = useState('')
  const [probeResponses, setProbeResponses] = useState<{ probe_id: string; response: string }[]>([])
  
  // Stage 3
  const [challengeTask, setChallengeTask] = useState<any>(null)
  const [stage3Text, setStage3Text] = useState('')

  const [loading, setLoading] = useState(true)
  const [loadingText, setLoadingText] = useState('Initializing session...')
  const [error, setError] = useState('')

  useEffect(() => {
    async function initSession() {
      try {
        setLoading(true)
        setError('')
        const newSession = await sessionsAPI.start(topicId)
        const sid = newSession?.session_id || newSession?.data?.session_id || newSession?.id || newSession?.data?.id
        if (sid) {
          setSessionId(sid)
        } else {
          setError('Session initialization failed: Could not obtain session ID.')
        }
      } catch (err: any) {
        console.error('[SESSION] Init failed:', err)
        setError('Session initialization failed: ' + (err.message || 'Network error'))
      } finally {
        setLoading(false)
      }
    }
    if (topicId) {
      initSession()
    }
  }, [topicId])

  const handleStage1Submit = async () => {
    if (!sessionId) return
    try {
      setLoading(true)
      setStage('loading')
      setLoadingText('Mapping your explanation...')

      const res = await sessionsAPI.analyzeStage1(sessionId, stage1Text)
      const generatedProbes = Array.isArray(res?.probes) ? res.probes : []
      const safeProbes = generatedProbes.length > 0 ? generatedProbes : [
        { id: 'fp_client_1', context_reference: '', question: `What key properties or operations are most important when working with ${topicName}?`, target_concept_id: '' },
        { id: 'fp_client_2', context_reference: '', question: `What are the time and space complexity trade-offs for ${topicName}?`, target_concept_id: '' }
      ]
      setProbes(safeProbes)
      setCurrentProbeIndex(0)
      setStage(2)
    } catch (err: any) {
      setError(err.message || 'Stage 1 processing failed')
      setStage(1)
    } finally {
      setLoading(false)
    }
  }

  const handleProbeNext = async () => {
    if (!probes[currentProbeIndex]) return

    const currentProbe = probes[currentProbeIndex]
    const updatedResponses = [
      ...probeResponses,
      { probe_id: currentProbe.id, response: currentProbeResponse }
    ]
    setProbeResponses(updatedResponses)
    setCurrentProbeResponse('')

    if (currentProbeIndex < probes.length - 1) {
      setCurrentProbeIndex(currentProbeIndex + 1)
    } else {
      // Final probe submitted
      if (!sessionId) return
      try {
        setLoading(true)
        setStage('loading')
        setLoadingText('Preparing challenge task...')

        const res = await sessionsAPI.analyzeStage2(sessionId, updatedResponses)
        setChallengeTask(res?.challenge_task)
        setStage(3)
      } catch (err: any) {
        setError(err.message || 'Stage 2 processing failed')
        setStage(2)
      } finally {
        setLoading(false)
      }
    }
  }

  const handleStage3Submit = async () => {
    if (!sessionId) return
    try {
      setLoading(true)
      setStage('loading')
      setLoadingText('Evaluating understanding profile...')

      await sessionsAPI.analyzeStage3(sessionId, stage3Text)
      const evalRes = await sessionsAPI.evaluate(sessionId)

      if (evalRes?.session_id) {
        router.push(`/results/${evalRes.session_id}`)
      }
    } catch (err: any) {
      setError(err.message || 'Evaluation failed')
      setStage(3)
      setLoading(false)
    }
  }

  const wordCount = stage1Text.trim() ? stage1Text.trim().split(/\s+/).filter((w) => w.length > 0).length : 0

  return (
    <SessionShell topicName={topicName} stageText={typeof stage === 'number' ? `Stage ${stage} of 3` : ''}>
      <StageIndicator currentStage={stage} />

      {error && (
        <div className="mb-6 p-4 rounded-lg bg-missing-dim text-missing border border-missing/20 text-xs">
          {error}
        </div>
      )}

      {stage === 'loading' || loading ? (
        <div className="py-20 flex flex-col items-center justify-center text-center">
          <div className="w-10 h-10 border-4 border-accent border-t-transparent rounded-full animate-spin mb-4" />
          <p className="font-display font-medium text-sm text-secondary">{loadingText}</p>
        </div>
      ) : stage === 1 ? (
        <div className="space-y-6">
          <div>
            <h2 className="font-display font-bold text-2xl text-primary mb-2">
              Explain {topicName} in your own words.
            </h2>
            <p className="text-xs text-secondary">
              Minimum 50 words. Be thorough: mention key components, time complexities, properties, or edge cases.
            </p>
          </div>

          <Textarea
            value={stage1Text}
            onChange={(e) => setStage1Text(e.target.value)}
            placeholder={`Start explaining ${topicName}...`}
            showWordCount={true}
            minHeight="min-h-[260px]"
          />

          <Button
            size="lg"
            className="w-full"
            disabled={loading || !sessionId || wordCount < 50}
            onClick={handleStage1Submit}
          >
            Continue →
          </Button>
        </div>
      ) : stage === 2 ? (
        <div className="space-y-6">
          <div>
            <span className="text-xs font-mono text-muted uppercase tracking-wider block mb-1">
              Follow-up Probe {currentProbeIndex + 1} of {probes.length}
            </span>
            {probes[currentProbeIndex]?.context_reference && (
              <p className="text-xs text-secondary italic mb-2">
                Referring to: "{probes[currentProbeIndex].context_reference}"
              </p>
            )}
            <h3 className="font-display font-semibold text-lg text-primary">
              {probes[currentProbeIndex]?.question}
            </h3>
          </div>

          <Textarea
            value={currentProbeResponse}
            onChange={(e) => setCurrentProbeResponse(e.target.value)}
            placeholder="Type your response here..."
            minHeight="min-h-[160px]"
          />

          <Button
            size="lg"
            className="w-full"
            disabled={!currentProbeResponse.trim()}
            onClick={handleProbeNext}
          >
            {currentProbeIndex < probes.length - 1 ? 'Next Question →' : 'Final Question →'}
          </Button>
        </div>
      ) : stage === 3 ? (
        <div className="space-y-6">
          <div>
            <h2 className="font-display font-bold text-2xl text-primary mb-2">
              One last thing.
            </h2>
            <p className="text-xs text-secondary mb-4">
              {challengeTask?.instruction || "Read this and tell us what's right, wrong, or incomplete."}
            </p>

            <div className="bg-surface-2 border border-border rounded-lg p-4 font-mono text-sm text-primary mb-6">
              {challengeTask?.content}
            </div>
          </div>

          <Textarea
            value={stage3Text}
            onChange={(e) => setStage3Text(e.target.value)}
            placeholder="Analyze the statement above..."
            showWordCount={true}
            minHeight="min-h-[180px]"
          />

          <Button
            size="lg"
            className="w-full"
            disabled={stage3Text.trim().length < 20}
            onClick={handleStage3Submit}
          >
            Show Me My Results →
          </Button>
        </div>
      ) : null}
    </SessionShell>
  )
}
