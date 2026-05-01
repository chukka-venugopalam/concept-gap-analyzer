'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase/client'
import Button from '@/components/ui/Button'
import Card from '@/components/ui/Card'
import Loader from '@/components/ui/Loader'
import type { AIResponse } from '@/types'

interface AddAttemptProps {
  onAdd?: () => void
}

export default function AddAttempt({ onAdd }: AddAttemptProps) {
  const [topic, setTopic] = useState('')
  const [explanation, setExplanation] = useState('')
  const [confidence, setConfidence] = useState<'high' | 'medium' | 'low'>('high')

  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<AIResponse | null>(null)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!topic.trim() || !explanation.trim()) {
      setError('Please fill in all fields')
      return
    }

    setLoading(true)
    setError('')
    setResult(null)

    try {
      // Get current user
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        setError('Please log in first')
        setLoading(false)
        return
      }

      // 1. CALL AI API
      const prompt = `You are a strict evaluator.

Topic: ${topic}

Student explanation:
${explanation}

Evaluate:
1. Is it correct, near, or wrong?
2. If wrong: explain why
3. If near: what is missing
4. Give short feedback

Respond ONLY with valid JSON (no markdown, no backticks):
{
  "verdict": "correct" | "near" | "wrong",
  "feedback": "..."
}
`

      const aiRes = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
      })

      if (!aiRes.ok) {
        throw new Error('AI service failed')
      }

      const aiData: AIResponse = await aiRes.json()

      if (!aiData.verdict || !aiData.feedback) {
        throw new Error('Invalid AI response')
      }

      setResult(aiData)

      // 2. SAVE TO SUPABASE
      const { error: insertError } = await supabase.from('attempts').insert([
        {
          user_id: user.id,
          topic: topic.trim(),
          explanation: explanation.trim(),
          confidence,
          verdict: aiData.verdict,
          ai_feedback: aiData.feedback,
        },
      ])

      if (insertError) {
        console.error('Insert error:', insertError)
        throw new Error('Failed to save attempt')
      }

      // Reset form
      setTopic('')
      setExplanation('')
      setConfidence('high')
      onAdd?.()
    } catch (err) {
      console.error('Error:', err)
      setError(err instanceof Error ? err.message : 'Something went wrong')
      setResult(null)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="space-y-4">
      <h2 className="text-lg font-semibold text-gray-900">Write an Explanation</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Topic Input */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Topic/Concept
          </label>
          <input
            type="text"
            placeholder="e.g., Photosynthesis, Binary Search, Calculus..."
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            disabled={loading}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:bg-gray-100"
          />
        </div>

        {/* Explanation Input */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Your Explanation
          </label>
          <textarea
            placeholder="Explain what you understand about this topic..."
            value={explanation}
            onChange={(e) => setExplanation(e.target.value)}
            disabled={loading}
            rows={5}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:bg-gray-100"
          />
        </div>

        {/* Confidence Level */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Confidence Level
          </label>
          <select
            value={confidence}
            onChange={(e) => setConfidence(e.target.value as any)}
            disabled={loading}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:bg-gray-100"
          >
            <option value="high">High - Very confident</option>
            <option value="medium">Medium - Somewhat confident</option>
            <option value="low">Low - Not confident</option>
          </select>
        </div>

        {/* Error Message */}
        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
            {error}
          </div>
        )}

        {/* Submit Button */}
        <Button
          type="submit"
          disabled={loading}
          className="w-full"
        >
          {loading ? 'Evaluating...' : 'Get AI Feedback'}
        </Button>
      </form>

      {/* Result Display */}
      {result && (
        <div className="mt-6 p-4 bg-gradient-to-br from-indigo-50 to-purple-50 border border-indigo-200 rounded-lg space-y-3">
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-gray-700">Verdict:</span>
            <span
              className={`px-3 py-1 rounded-full text-sm font-semibold ${
                result.verdict === 'correct'
                  ? 'bg-green-100 text-green-700'
                  : result.verdict === 'near'
                  ? 'bg-yellow-100 text-yellow-700'
                  : 'bg-red-100 text-red-700'
              }`}
            >
              {result.verdict === 'correct'
                ? '✓ Correct'
                : result.verdict === 'near'
                ? '◐ Near'
                : '✗ Wrong'}
            </span>
          </div>
          <div className="space-y-2">
            <p className="text-sm font-semibold text-gray-700">Feedback:</p>
            <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">
              {result.feedback}
            </p>
          </div>
        </div>
      )}

      {loading && (
        <div className="flex items-center justify-center py-4">
          <Loader />
        </div>
      )}
    </Card>
  )
}
