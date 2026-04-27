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

  // 🔥 ANALYSIS ENGINE
  const analysis = Object.entries(
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

      if (!item.result && acc[item.topic].mistakes[item.mistake_type] !== undefined) {
        acc[item.topic].mistakes[item.mistake_type]++
      }

      return acc
    }, {})
  )

  return (
    <div style={{ maxWidth: 600, margin: '40px auto', fontFamily: 'sans-serif' }}>
      <h2>Concept Gap Analyzer</h2>

      <button onClick={async () => { await signOut(); router.push('/') }}>
        Logout
      </button>

      <hr />

      <input
        placeholder="Topic"
        value={topic}
        onChange={(e) => setTopic(e.target.value)}
      />

      <input
        type="number"
        placeholder="Time (sec)"
        value={time}
        onChange={(e) => setTime(Number(e.target.value))}
      />

      <div>
        <button onClick={() => setResult(true)}>Correct</button>
        <button onClick={() => setResult(false)}>Wrong</button>
      </div>

      <div>
        {['concept', 'silly', 'time', 'guess'].map((m) => (
          <button key={m} onClick={() => setMistake(m)}>
            {m}
          </button>
        ))}
      </div>

      <button onClick={handleSubmit}>Save</button>

      <hr />

      <h3>Insights</h3>

      {analysis.map(([topic, val]: any) => {
        const acc = Math.round((val.correct / val.total) * 100)
        const avgTime = Math.round(val.time / val.total)

        let mainIssue = Object.entries(val.mistakes).sort((a: any, b: any) => b[1] - a[1])[0][0]

        return (
          <div key={topic} style={{ marginBottom: 10 }}>
            <b>{topic}</b><br />
            Accuracy: {acc}% | Avg Time: {avgTime}s<br />

            {acc < 60 && val.total >= 3 && (
              <span style={{ color: 'red' }}>
                Weak → Main issue: {mainIssue}
              </span>
            )}
          </div>
        )
      })}
    </div>
  )
}