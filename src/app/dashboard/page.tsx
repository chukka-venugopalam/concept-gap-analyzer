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

  const stats = Object.entries(
    data.reduce((acc: any, item) => {
      if (!acc[item.topic]) acc[item.topic] = { total: 0, correct: 0 }
      acc[item.topic].total++
      if (item.result) acc[item.topic].correct++
      return acc
    }, {})
  )

  const chartData = {
    labels: stats.map(([t]) => t),
    datasets: [
      {
        label: 'Accuracy %',
        data: stats.map(([_, v]: any) => Math.round((v.correct / v.total) * 100))
      }
    ]
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white p-6 flex justify-center">
      <div className="w-full max-w-xl space-y-6">

        {/* Header */}
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-semibold">Dashboard</h1>
          <button onClick={async () => { await signOut(); router.push('/') }}>
            Logout
          </button>
        </div>

        {/* Input Card */}
        <div className="bg-white p-5 rounded-2xl shadow space-y-3">
          <input
            className="w-full p-3 border rounded-lg"
            placeholder="Topic"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
          />

          <input
            type="number"
            className="w-full p-3 border rounded-lg"
            placeholder="Time (sec)"
            value={time}
            onChange={(e) => setTime(Number(e.target.value))}
          />

          <div className="flex gap-2">
            <button onClick={() => setResult(true)} className="flex-1 bg-green-100 p-2 rounded">Correct</button>
            <button onClick={() => setResult(false)} className="flex-1 bg-red-100 p-2 rounded">Wrong</button>
          </div>

          <div className="flex gap-2 flex-wrap">
            {['concept','silly','time','guess'].map(m => (
              <button key={m} onClick={()=>setMistake(m)} className="bg-gray-100 px-3 py-1 rounded text-sm">
                {m}
              </button>
            ))}
          </div>

          <button onClick={handleSubmit} className="w-full bg-black text-white p-3 rounded-lg">
            Save
          </button>
        </div>

        {/* Chart */}
        <div className="bg-white p-5 rounded-2xl shadow">
          <h3 className="mb-3 font-semibold">Accuracy Overview</h3>
          <Bar data={chartData} />
        </div>

        {/* Insights */}
        <div className="bg-white p-5 rounded-2xl shadow">
          <h3 className="font-semibold mb-2">Insights</h3>

          {stats.map(([topic, val]: any) => {
            const acc = Math.round((val.correct / val.total) * 100)

            return (
              <div key={topic} className="border rounded p-3 mb-2">
                <b>{topic}</b> — {acc}%
                {acc < 60 && val.total >= 3 && (
                  <span className="text-red-500 ml-2">Weak</span>
                )}
              </div>
            )
          })}
        </div>

        {/* Premium teaser */}
        <div className="bg-gradient-to-r from-black to-gray-700 text-white p-5 rounded-2xl shadow">
          <h3 className="font-semibold">Upgrade</h3>
          <p className="text-sm">
            Get AI insights, smart revision plans, and deep analytics.
          </p>
        </div>

      </div>
    </div>
  )
}