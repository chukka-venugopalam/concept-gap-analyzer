'use client'

import { useState, useEffect, useRef } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { Button } from '@/components/ui/Button'
import { mockInterviewAPI } from '@/lib/api/mockInterview'

interface ChatTurn {
  role: 'candidate' | 'ai'
  message: string
  action?: 'hint' | 'follow_up' | 'acknowledge'
  timestamp?: number
}

export default function MockInterviewPage() {
  const params = useParams()
  const router = useRouter()
  const questionId = Number(params?.questionId)

  const [sessionId, setSessionId] = useState<string | null>(null)
  const [problemPrompt, setProblemPrompt] = useState('')
  const [turns, setTurns] = useState<ChatTurn[]>([])
  const [input, setInput] = useState('')
  const [finalCode, setFinalCode] = useState('')
  const [showCodeInput, setShowCodeInput] = useState(false)
  const [starting, setStarting] = useState(true)
  const [sending, setSending] = useState(false)
  const [finishing, setFinishing] = useState(false)
  const [results, setResults] = useState<any>(null)
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!questionId) return
    const start = async () => {
      try {
        const res = await mockInterviewAPI.start(questionId)
        const data = res.data ?? res
        setSessionId(data.id)
        setProblemPrompt(data.problem_prompt)
        setTurns([{ role: 'ai', message: data.opening_prompt }])
      } catch (err) {
        toast.error('Could not start the interview — try again in a moment.')
      } finally {
        setStarting(false)
      }
    }
    start()
  }, [questionId])

  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: 'smooth',
    })
  }, [turns])

  const handleSend = async () => {
    if (!input.trim() || !sessionId || sending) return
    const message = input.trim()
    setTurns((prev) => [...prev, { role: 'candidate', message }])
    setInput('')
    setSending(true)
    try {
      const res = await mockInterviewAPI.submitTurn(sessionId, message)
      const data = res.data ?? res
      setTurns((prev) => [
        ...prev,
        { role: 'ai', message: data.message, action: data.action },
      ])
    } catch (err) {
      toast.error('Something went wrong on our end — try again in a moment.')
    } finally {
      setSending(false)
    }
  }

  const handleFinish = async () => {
    if (!sessionId || finishing) return
    setFinishing(true)
    try {
      const res = await mockInterviewAPI.finish(
        sessionId,
        finalCode.trim() || undefined
      )
      const data = res.data ?? res
      setResults(data)
    } catch (err) {
      toast.error('Could not score the interview — try again in a moment.')
    } finally {
      setFinishing(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  if (starting) {
    return (
      <div className="flex items-center justify-center h-64 text-secondary">
        Starting your mock interview…
      </div>
    )
  }

  if (results) {
    return (
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="text-xs uppercase tracking-wide text-accent">
          Mock Interview Results
        </div>
        <div className="bg-surface border border-border rounded-lg p-6">
          <div className="text-secondary text-sm mb-1">Overall Score</div>
          <div className="text-4xl font-bold text-known">
            {results.score_overall}
            <span className="text-lg text-secondary"> / 100</span>
          </div>
        </div>
        <div className="space-y-3">
          {Object.entries(results.rubric_scores || {}).map(
            ([dimension, score]) => (
              <div
                key={dimension}
                className="flex items-center justify-between bg-surface border border-border rounded-lg px-4 py-3"
              >
                <span className="text-primary capitalize">
                  {dimension.replace(/_/g, ' ')}
                </span>
                <span className="text-accent font-semibold">
                  {score as number}
                </span>
              </div>
            )
          )}
        </div>
        <Button onClick={() => router.push('/interview')}>
          Back to Interview Questions
        </Button>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto flex flex-col h-[80vh]">
      <div className="bg-surface-2 border border-border rounded-lg p-4 mb-4 text-sm text-secondary">
        {problemPrompt}
      </div>

      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto space-y-3 px-1"
      >
        {turns.map((turn, i) => (
          <div
            key={i}
            className={
              turn.role === 'candidate'
                ? 'flex justify-end'
                : 'flex justify-start'
            }
          >
            <div
              className={
                turn.role === 'candidate'
                  ? 'bg-accent-dim border border-accent/30 text-primary rounded-lg px-4 py-2 max-w-[85%]'
                  : 'bg-surface border border-border text-primary rounded-lg px-4 py-2 max-w-[85%]'
              }
            >
              {turn.message}
            </div>
          </div>
        ))}
      </div>

      {showCodeInput ? (
        <div className="mt-4 space-y-2">
          <textarea
            value={finalCode}
            onChange={(e) => setFinalCode(e.target.value)}
            placeholder="Paste your final code here (optional)…"
            className="w-full h-32 bg-surface border border-border rounded-lg p-3 text-primary font-mono text-sm resize-none"
          />
          <div className="flex gap-2">
            <Button onClick={handleFinish} loading={finishing}>
              Submit &amp; Score Interview
            </Button>
            <Button onClick={() => setShowCodeInput(false)}>
              Back to Chat
            </Button>
          </div>
        </div>
      ) : (
        <div className="mt-4 flex gap-2 items-end">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Explain your approach, or paste code…"
            className="flex-1 bg-surface border border-border rounded-lg p-3 text-primary text-sm resize-none h-16"
          />
          <Button onClick={handleSend} loading={sending}>
            Send
          </Button>
          <Button onClick={() => setShowCodeInput(true)}>
            Finish
          </Button>
        </div>
      )}
    </div>
  )
}
