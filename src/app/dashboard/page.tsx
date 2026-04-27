'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { signOut } from '@/lib/auth'
import { useRouter } from 'next/navigation'

export default function Dashboard() {
  const router = useRouter()

  const [topic, setTopic] = useState('')
  const [result, setResult] = useState(true)
  const [time, setTime] = useState(0)
  const [mistake, setMistake] = useState('concept')
  const [data, setData] = useState<any[]>([])

  const loadData = async () => {
    const {
      data: { user }
    } = await supabase.auth.getUser()

    if (!user) {
      router.push('/')
      return
    }

    const { data: attempts } = await supabase
      .from('attempts')
      .select('*')
      .eq('user_id', user.id)

    setData(attempts || [])
  }

  useEffect(() => {
    loadData()
  }, [])

  const handleSubmit = async () => {
    const {
      data: { user }
    } = await supabase.auth.getUser()

    if (!user || !topic || time <= 0) return

    await supabase.from('attempts').insert([
      {
        user_id: user.id,
        topic,
        result,
        time_taken: time,
        mistake_type: mistake
      }
    ])

    setTopic('')
    setTime(0)
    setMistake('concept')
    loadData()
  }

  // 🔥 ANALYSIS
  const stats = Object.entries(
    data.reduce((acc: any, item) => {
      if (!acc[item.topic]) {
        acc[item.topic] = {
          total: 0,
          correct: 0,
          time: 0,
          mistakes: { concept: 0, silly: 0, time: 0, guess: 0 }
        }
      }

      acc[item.topic].total++
      if (item.result) acc[item.topic].correct++
      acc[item.topic].time += item.time_taken

      if (!item.result) {
        acc[item.topic].mistakes[item.mistake_type]++
      }

      return acc
    }, {})
  )

  // 🔥 STREAK
  const today = new Date().toDateString()
  const streak = data.filter(d =>
    new Date(d.created_at).toDateString() === today
  ).length

  return (
    <div className="min-h-screen bg-gray-50 p-4 flex justify-center">
      <div className="w-full max-w-md space-y-4">

        {/* Header */}
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold">Dashboard</h2>
          <button onClick={async () => { await signOut(); router.push('/') }}>
            Logout
          </button>
        </div>

        {/* Streak */}
        <div className="bg-white p-3 rounded shadow text-sm">
          🔥 Today Attempts: {streak}
        </div>

        {/* Input */}
        <div className="bg-white p-4 rounded shadow space-y-3">
          <input
            className="w-full p-2 border rounded"
            placeholder="Topic"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
          />

          <input
            type="number"
            className="w-full p-2 border rounded"
            placeholder="Time (sec)"
            value={time}
            onChange={(e) => setTime(Number(e.target.value))}
          />

          <div className="flex gap-2">
            <button onClick={() => setResult(true)} className="flex-1 bg-green-100 p-2 rounded">Correct</button>
            <button onClick={() => setResult(false)} className="flex-1 bg-red-100 p-2 rounded">Wrong</button>
          </div>

          <div className="flex gap-2 flex-wrap">
            {['concept', 'silly', 'time', 'guess'].map((m) => (
              <button key={m} onClick={() => setMistake(m)} className="bg-gray-100 px-2 py-1 rounded text-xs">
                {m}
              </button>
            ))}
          </div>

          <button onClick={handleSubmit} className="w-full bg-black text-white p-2 rounded">
            Save
          </button>
        </div>

        {/* Insights */}
        <div className="bg-white p-4 rounded shadow">
          <h3 className="font-semibold mb-2">Insights</h3>

          {stats.map(([topic, val]: any) => {
            const acc = Math.round((val.correct / val.total) * 100)
            const avgTime = Math.round(val.time / val.total)
            const mainIssue = Object.entries(val.mistakes).sort((a: any, b: any) => b[1] - a[1])[0][0]

            return (
              <div key={topic} className="border p-2 rounded mb-2 text-sm">
                <b>{topic}</b><br />
                {acc}% accuracy | {avgTime}s avg

                {acc < 60 && val.total >= 3 && (
                  <div className="text-red-500">
                    Weak → {mainIssue}
                  </div>
                )}
              </div>
            )
          })}
        </div>

        {/* 🔒 PREMIUM PREVIEW */}
        <div className="bg-white p-4 rounded shadow text-sm">
          <h3 className="font-semibold mb-2">Advanced Insights (Premium)</h3>
          <p className="text-gray-500">
            Pattern detection, smart revision plan, and AI feedback coming soon.
          </p>
        </div>

      </div>
    </div>
  )
}