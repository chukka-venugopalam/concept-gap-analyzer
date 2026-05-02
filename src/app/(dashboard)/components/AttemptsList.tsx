'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase/client'
import Card from '@/components/ui/Card'

interface Attempt {
  id: string
  topic: string
  verdict: 'correct' | 'near' | 'wrong'
  confidence: 'high' | 'medium' | 'low'
  created_at: string
}

export default function AttemptsList({ refresh }: { refresh: number }) {
  const [attempts, setAttempts] = useState<Attempt[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
  const fetchAttempts = async () => {
    setLoading(true)

    const {
      data: { user },
    } = await supabase.auth.getUser()

    console.log("USER:", user)

    if (!user) {
      console.log("No user found")
      setAttempts([])
      setLoading(false)
      return
    }

    const { data, error } = await supabase
      .from('attempts')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })

    console.log("DATA:", data)
    console.log("ERROR:", error)

    if (error) {
      console.error("FETCH ERROR:", error.message)
      setAttempts([])
    } else {
      setAttempts(data || [])
    }

    setLoading(false)
  }

  fetchAttempts()
}, [refresh])

  const getVerdictBadge = (verdict: string) => {
    switch (verdict) {
      case 'correct':
        return <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded">✓ Correct</span>
      case 'near':
        return <span className="px-2 py-1 bg-yellow-100 text-yellow-700 text-xs font-semibold rounded">◐ Near</span>
      case 'wrong':
        return <span className="px-2 py-1 bg-red-100 text-red-700 text-xs font-semibold rounded">✗ Wrong</span>
      default:
        return null
    }
  }

  if (loading) {
    return <Card><div className="text-center text-gray-500">Loading attempts...</div></Card>
  }

  if (!attempts.length) {
    return (
      <Card>
        <p className="text-center text-gray-500">No attempts yet. Start by writing an explanation!</p>
      </Card>
    )
  }

  const correct = attempts.filter(a => a.verdict === 'correct').length
  const accuracy = ((correct / attempts.length) * 100).toFixed(0)

  return (
    <Card>
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold text-gray-900">Recent Attempts</h2>
          <div className="text-sm text-gray-600">
            <span className="font-semibold text-green-600">{correct}</span>/<span>{attempts.length}</span>
            <span className="text-gray-500 ml-2">({accuracy}%)</span>
          </div>
        </div>

        <div className="space-y-2 max-h-96 overflow-y-auto">
          {attempts.map((attempt) => (
            <div
              key={attempt.id}
              className="p-3 bg-gray-50 rounded-lg border border-gray-200 flex justify-between items-center hover:bg-gray-100 transition"
            >
              <div>
                <p className="font-medium text-gray-900">{attempt.topic}</p>
                <p className="text-xs text-gray-500">
                  {new Date(attempt.created_at).toLocaleDateString()} at{' '}
                  {new Date(attempt.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs px-2 py-1 bg-gray-200 text-gray-700 rounded capitalize">
                  {attempt.confidence}
                </span>
                {getVerdictBadge(attempt.verdict)}
              </div>
            </div>
          ))}
        </div>
      </div>
    </Card>
  )
}
