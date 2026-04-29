'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase/client'
import Chart from './Chart'

export default function Insights({
  refresh,
}: {
  refresh: number
}) {
  const [chartData, setChartData] = useState<any>(null)

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

      const labels = Object.keys(map)
      const values = labels.map(
        (t) => (map[t].correct / map[t].total) * 100
      )

      setChartData({
        labels,
        datasets: [
          {
            label: 'Accuracy %',
            data: values,
          },
        ],
      })
    }

    fetch()
  }, [refresh])

  if (!chartData)
    return <div className="text-sm text-gray-500">Loading insights...</div>

  return (
    <div className="bg-white p-6 rounded-2xl border">
      <h2 className="font-semibold mb-4">Insights</h2>
      <Chart data={chartData} />
    </div>
  )
}