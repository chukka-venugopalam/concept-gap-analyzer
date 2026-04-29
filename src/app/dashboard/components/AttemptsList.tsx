'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase/client'

export default function AttemptsList({
  refresh,
}: {
  refresh: number
}) {
  const [data, setData] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const fetchData = async () => {
    setLoading(true)
    const { data } = await supabase
      .from('attempts')
      .select('*')
      .order('created_at', { ascending: false })

    setData(data || [])
    setLoading(false)
  }

  useEffect(() => {
    fetchData()
  }, [refresh])

  if (loading) return <div>Loading attempts...</div>

  if (!data.length)
    return (
      <div className="bg-white p-6 rounded-2xl border text-sm text-gray-500">
        No attempts yet
      </div>
    )

  return (
    <div className="bg-white p-6 rounded-2xl border">
      <h2 className="font-semibold mb-4">Recent Attempts</h2>

      <div className="space-y-2">
        {data.map((a) => (
          <div key={a.id} className="flex justify-between text-sm border-b py-2">
            <span>{a.topic}</span>
            <span>{a.result ? '✔' : '✘'}</span>
            <span>{a.time_taken}s</span>
          </div>
        ))}
      </div>
    </div>
  )
}