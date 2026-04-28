'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { signOut } from '@/lib/auth'
import { useRouter } from 'next/navigation'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend
} from 'chart.js'
import { Bar } from 'react-chartjs-2'

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend)

export default function Dashboard() {
  const router = useRouter()

  const [topic, setTopic] = useState('')
  const [result, setResult] = useState(true)
  const [time, setTime] = useState(0)
  const [mistake, setMistake] = useState('concept')
  const [data, setData] = useState<any[]>([])

  const [explanation, setExplanation] = useState('')
  const [feedback, setFeedback] = useState('')

  const loadData = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return router.push('/')

    const { data: attempts } = await supabase
      .from('attempts')
      .select('*')
      .eq('user_id', user.id)

    setData(attempts || [])
  }

  useEffect(() => { loadData() }, [])

  const handleSubmit = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user || !topic || time <= 0) return

    await supabase.from('attempts').insert([
      { user_id: user.id, topic, result, time_taken: time, mistake_type: mistake }
    ])

    setTopic('')
    setTime(0)
    setMistake('concept')
    loadData()
  }

  // -------- Explanation Checker --------
  const checkExplanation = () => {
    if (!topic || !explanation) return

    const keywords: any = {
      'binary trees': ['node', 'left', 'right', 'tree'],
      'k-maps': ['boolean', 'simplify', 'group'],
      'graphs': ['node', 'edge', 'path', 'traverse']
    }

    const key = topic.toLowerCase()
    const expected = keywords[key] || []

    let score = 0

    expected.forEach((word: string) => {
      if (explanation.toLowerCase().includes(word)) score++
    })

    if (score === 0) {
      setFeedback('Weak explanation — missing core concepts')
    } else if (score < expected.length) {
      setFeedback('Partial understanding — improve explanation')
    } else {
      setFeedback('Good understanding')
    }
  }

  // -------- Stats --------
  const stats = Object.entries(
    data.reduce((acc: any, item) => {
      if (!acc[item.topic]) acc[item.topic] = { total: 0, correct: 0 }
      acc[item.topic].total++
      if (item.result) acc[item.topic].correct++
      return acc
    }, {})
  )

  // -------- Chart --------
  const chartData = {
    labels: stats.map(([t]) => t),
    datasets: [
      {
        label: 'Accuracy %',
        data: stats.map(([_, v]: any) =>
          Math.round((v.correct / v.total) * 100)
        )
      }
    ]
  }

  // -------- Revision System --------
  const revision = stats
    .filter(([_, val]: any) => {
      const acc = (val.correct / val.total) * 100
      return acc < 60 && val.total >= 2
    })
    .map(([topic]) => topic)

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white p-6 flex justify-center">
      <div className="w-full max-w-xl space-y-6">

        {/* Header */}
        <div className="flex justify-between">
          <h1 className="text-xl font-semibold">Dashboard</h1>
          <button onClick={async () => { await signOut(); router.push('/') }}>
            Logout
          </button>
        </div>

        {/* Input */}
        <div className="bg-white p-4 rounded shadow space-y-2">
          <input
            className="w-full border p-2 rounded"
            placeholder="Topic"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
          />

          <input
            type="number"
            className="w-full border p-2 rounded"
            placeholder="Time"
            value={time}
            onChange={(e) => setTime(Number(e.target.value))}
          />

          <div className="flex gap-2">
            <button onClick={() => setResult(true)} className="flex-1 bg-green-100 p-2 rounded">Correct</button>
            <button onClick={() => setResult(false)} className="flex-1 bg-red-100 p-2 rounded">Wrong</button>
          </div>

          <div className="flex gap-2 flex-wrap">
            {['concept','silly','time','guess'].map(m => (
              <button key={m} onClick={()=>setMistake(m)} className="bg-gray-100 px-2 py-1 rounded text-sm">
                {m}
              </button>
            ))}
          </div>

          {/* Explanation */}
          <textarea
            placeholder="Explain the concept"
            className="w-full border p-2 rounded"
            value={explanation}
            onChange={(e) => setExplanation(e.target.value)}
          />

          <button onClick={checkExplanation} className="w-full bg-purple-600 text-white p-2 rounded">
            Check Explanation
          </button>

          {feedback && (
            <div className="bg-gray-100 p-2 rounded text-sm">
              {feedback}
            </div>
          )}

          <button onClick={handleSubmit} className="w-full bg-black text-white p-2 rounded">
            Save
          </button>
        </div>

        {/* Chart */}
        <div className="bg-white p-4 rounded shadow">
          <Bar data={chartData} />
        </div>

        {/* Insights */}
        <div className="bg-white p-4 rounded shadow">
          <h3 className="font-semibold mb-2">Insights</h3>

          {stats.map(([topic, val]: any) => {
            const acc = Math.round((val.correct / val.total) * 100)

            return (
              <div key={topic} className="text-sm">
                {topic} — {acc}%
                {acc < 60 && val.total >= 3 && (
                  <span className="text-red-500 ml-2">Weak</span>
                )}
              </div>
            )
          })}
        </div>

        {/* Revision */}
        <div className="bg-white p-4 rounded shadow">
          <h3 className="font-semibold mb-2">Revision Plan</h3>

          {revision.length === 0 ? (
            <p className="text-sm text-gray-500">No weak topics</p>
          ) : (
            revision.map((t) => (
              <div key={t} className="text-sm">
                Revise: {t}
              </div>
            ))
          )}
        </div>

      </div>
    </div>
  )
}