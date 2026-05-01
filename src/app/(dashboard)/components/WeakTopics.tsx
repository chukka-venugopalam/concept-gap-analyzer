'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase/client'
import Card from '@/components/ui/Card'

interface WeakTopic {
  topic: string
  accuracy: number
  attempts: number
}

export default function WeakTopics({ refresh }: { refresh: number }) {
  const [weakTopics, setWeakTopics] = useState<WeakTopic[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchWeakTopics = async () => {
      setLoading(true)
      try {
        const { data: { user } } = await supabase.auth.getUser()
        
        if (!user) {
          setWeakTopics([])
          setLoading(false)
          return
        }

        const { data, error } = await supabase
          .from('attempts')
          .select('topic, verdict')
          .eq('user_id', user.id)

        if (error) throw error

        // Calculate accuracy per topic
        const topicMap: Record<string, { total: number; correct: number }> = {}

        data?.forEach((attempt) => {
          if (!topicMap[attempt.topic]) {
            topicMap[attempt.topic] = { total: 0, correct: 0 }
          }
          topicMap[attempt.topic].total++
          if (attempt.verdict === 'correct') {
            topicMap[attempt.topic].correct++
          }
        })

        // Filter to weak topics (< 70% accuracy)
        const weak = Object.entries(topicMap)
          .map(([topic, stats]) => ({
            topic,
            accuracy: (stats.correct / stats.total) * 100,
            attempts: stats.total,
          }))
          .filter((t) => t.accuracy < 70)
          .sort((a, b) => a.accuracy - b.accuracy)

        setWeakTopics(weak)
      } catch (err) {
        console.error('Error fetching weak topics:', err)
        setWeakTopics([])
      } finally {
        setLoading(false)
      }
    }

    fetchWeakTopics()
  }, [refresh])

  if (loading) {
    return <Card><div className="text-center text-gray-500">Loading...</div></Card>
  }

  if (!weakTopics.length) {
    return (
      <Card>
        <h2 className="text-lg font-semibold text-gray-900 mb-2">Weak Topics</h2>
        <p className="text-center text-gray-500">Great! No weak topics detected yet.</p>
      </Card>
    )
  }

  return (
    <Card>
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Weak Topics to Study</h2>
      
      <div className="space-y-2">
        {weakTopics.map((topic, idx) => (
          <div
            key={idx}
            className="p-3 bg-gradient-to-r from-red-50 to-orange-50 border border-red-200 rounded-lg"
          >
            <div className="flex justify-between items-center mb-1">
              <span className="font-medium text-gray-900">{topic.topic}</span>
              <span className="text-sm font-semibold text-red-600">
                {topic.accuracy.toFixed(0)}% accuracy
              </span>
            </div>
            
            {/* Progress Bar */}
            <div className="w-full bg-red-200 rounded-full h-2">
              <div
                className="bg-red-500 h-2 rounded-full transition-all"
                style={{ width: `${topic.accuracy}%` }}
              />
            </div>

            <p className="text-xs text-gray-600 mt-1">
              {topic.attempts} attempt{topic.attempts > 1 ? 's' : ''} • Focus on this topic
            </p>
          </div>
        ))}
      </div>

      {weakTopics.length > 0 && (
        <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-blue-800">
            💡 <strong>Tip:</strong> Practice these {weakTopics.length} weak topic{weakTopics.length > 1 ? 's' : ''} more to improve.
          </p>
        </div>
      )}
    </Card>
  )
}
