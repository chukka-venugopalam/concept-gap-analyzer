'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { AppShell } from '@/components/layout/AppShell'
import { usersAPI } from '@/lib/api/users'

export default function TopicsPage() {
  const router = useRouter()
  const [topics, setTopics] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadTopics() {
      try {
        const result = await usersAPI.getTopicStatus()
        const topicList = Array.isArray(result) ? result : (Array.isArray(result?.topics) ? result.topics : [])
        setTopics(topicList)
      } catch (error) {
        console.error('Failed to load topics:', error)
        setTopics([])
      } finally {
        setLoading(false)
      }
    }
    loadTopics()
  }, [])

  const getStatusColor = (status: string) => {
    if (status === 'strong') return 'var(--known)'
    if (status === 'in_progress') return 'var(--weak)'
    return 'var(--secondary)'
  }

  const getStatusLabel = (status: string) => {
    if (status === 'strong') return 'Strong'
    if (status === 'in_progress') return 'In Progress'
    return 'Not Started'
  }

  return (
    <AppShell>
      <div className="mb-8">
        <h1 className="font-display font-bold text-2xl text-primary mb-2">
          What do you want to diagnose today?
        </h1>
        <p className="text-secondary text-sm">
          Pick a topic you have recently studied for the most useful diagnosis.
        </p>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[1,2,3,4].map(i => (
            <div key={i}
              className="bg-surface rounded-xl p-6 border border-border h-44 animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {topics.map((topic) => (
            <div
              key={topic.topic_id}
              className="bg-surface rounded-xl p-6 border border-border hover:border-accent/50 transition-all duration-200"
            >
              <div className="flex items-start justify-between mb-4">
                <h2 className="font-display font-semibold text-lg text-primary">
                  {topic.topic_name}
                </h2>
                <span
                  className="text-xs font-medium px-2 py-1 rounded-full bg-surface-2 border border-border"
                  style={{
                    color: getStatusColor(topic.status)
                  }}
                >
                  {getStatusLabel(topic.status)}
                </span>
              </div>

              <div className="text-xs text-secondary mb-1">
                {topic.concept_count > 0
                  ? `${topic.concept_count} concepts`
                  : '~15 concepts'}
                {' • ~15 mins'}
              </div>

              <div className="text-xs text-secondary mb-4">
                {topic.session_count > 0
                  ? `${topic.session_count} session${
                      topic.session_count > 1 ? 's' : ''
                    } completed`
                  : '0 sessions completed'}
                {topic.last_score !== null &&
                  topic.last_score !== undefined &&
                  ` • Last score: ${topic.last_score}/100`
                }
              </div>

              <button
                onClick={() => router.push(
                  `/session/${topic.topic_id}/intro`
                )}
                className="w-full bg-accent text-white font-display font-semibold py-2.5 px-4 rounded-lg text-sm hover:opacity-90 transition-opacity cursor-pointer"
              >
                Diagnose →
              </button>
            </div>
          ))}
        </div>
      )}
    </AppShell>
  )
}
