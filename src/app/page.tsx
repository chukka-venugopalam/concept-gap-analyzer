'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

export default function Home() {
  const [topic, setTopic] = useState('')
  const [result, setResult] = useState(true)
  const [time, setTime] = useState(0)
  const [mistake, setMistake] = useState('none')
  const [data, setData] = useState<any[]>([])

  const fetchData = async () => {
    const { data, error } = await supabase
      .from('attempts')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(50)

    if (!error) setData(data || [])
  }

  useEffect(() => {
    fetchData()
  }, [])

  const handleSubmit = async () => {
    if (!topic) return alert('Enter topic')
    if (time <= 0) return alert('Enter valid time')

    const { error } = await supabase.from('attempts').insert([
      {
        user_id: null,
        topic,
        result,
        time_taken: time,
        mistake_type: mistake
      }
    ])

    if (error) {
      alert('Error saving')
    } else {
      setTopic('')
      setTime(0)
      setMistake('none')
      await fetchData()
    }
  }

  const topicStats = Object.entries(
    data.reduce((acc: any, item) => {
      if (!acc[item.topic]) {
        acc[item.topic] = { total: 0, correct: 0 }
      }
      acc[item.topic].total += 1
      if (item.result) acc[item.topic].correct += 1
      return acc
    }, {})
  )

  return (
    <div style={{ maxWidth: 400, margin: '50px auto', fontFamily: 'sans-serif' }}>
      <h2>Concept Gap Analyzer</h2>

      <input
        placeholder="Topic"
        value={topic}
        onChange={(e) => setTopic(e.target.value)}
        style={{ width: '100%', marginBottom: 10 }}
      />

      <input
        type="number"
        placeholder="Time (sec)"
        value={time}
        onChange={(e) => setTime(Number(e.target.value))}
        style={{ width: '100%', marginBottom: 10 }}
      />

      <div style={{ marginBottom: 10 }}>
        <button
          style={{ background: result ? 'green' : 'white', marginRight: 5 }}
          onClick={() => setResult(true)}
        >
          Correct
        </button>
        <button
          style={{ background: !result ? 'red' : 'white' }}
          onClick={() => setResult(false)}
        >
          Wrong
        </button>
      </div>

      <div style={{ marginBottom: 10 }}>
        {['concept', 'silly', 'time', 'guess'].map((m) => (
          <button
            key={m}
            style={{
              background: mistake === m ? 'lightblue' : 'white',
              marginRight: 5
            }}
            onClick={() => setMistake(m)}
          >
            {m}
          </button>
        ))}
      </div>

      <button onClick={handleSubmit}>Save</button>

      <hr />

      <h3>Recent</h3>
      {data.map((item) => (
        <div key={item.id}>
          {item.topic} - {item.result ? 'Correct' : 'Wrong'} - {item.time_taken}s
        </div>
      ))}

      <hr />

      <h3>Topic Accuracy</h3>
      {topicStats.map(([topic, val]: any) => {
        const percent = Math.round((val.correct / val.total) * 100)
        return (
          <div key={topic}>
            {topic} - {percent}%
          </div>
        )
      })}

      <hr />

      <h3>Weak Topics</h3>
      {topicStats
        .filter(([_, val]: any) => {
          const percent = (val.correct / val.total) * 100
          return percent < 60 && val.total >= 3
        })
        .map(([topic, val]: any) => {
          const percent = Math.round((val.correct / val.total) * 100)
          return (
            <div key={topic} style={{ color: 'red' }}>
              {topic} - {percent}% (Weak)
            </div>
          )
        })}
    </div>
  )
}