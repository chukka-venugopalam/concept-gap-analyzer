'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase/client'

export default function WeakTopics({ refresh }: { refresh: number }) {
  const [weak, setWeak] = useState<any[]>([])

  useEffect(() => {
    const fetch = async () => {
      const { data } = await supabase.from('attempts').select('*')

      const map: any = {}

      data?.forEach((a) => {
        if (!map[a.topic]) {
          map[a.topic] = { total: 0, correct: 0 }
        }
        map[a.topic].total++
        if (a.result) map[a.topic].correct++
      })

      const weakTopics = Object.keys(map)
        .map((t) => {
          const acc = (map[t].correct / map[t].total) * 100
          return { topic: t, accuracy: acc }
        })
        .filter((t) => t.accuracy < 60)

      setWeak(weakTopics)
    }

    fetch()
  }, [refresh])

  if (!weak.length)
    return (
      <div className="bg-white p-6 rounded-2xl border">
        <h2 className="font-semibold mb-2">Weak Topics</h2>
        <p className="text-sm text-gray-500">No weak topics</p>
      </div>
    )

  return (
    <div className="bg-white p-6 rounded-2xl border">
      <h2 className="font-semibold mb-4">Weak Topics</h2>

      <div className="space-y-2">
        {weak.map((t, i) => (
          <div
            key={i}
            className="flex justify-between p-3 bg-red-50 rounded-xl"
          >
            <span>{t.topic}</span>
            <span className="text-red-600 text-sm">
              {t.accuracy.toFixed(0)}%
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}