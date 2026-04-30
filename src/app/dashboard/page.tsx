'use client'

import { useState } from 'react'
import AddAttempt from './components/AddAttempt'
import AttemptsList from './components/AttemptsList'
import Insights from './components/Insights'
import WeakTopics from './components/WeakTopics'

export default function Dashboard() {
  const [refresh, setRefresh] = useState(0)

  return (
    <div className="space-y-8">

      {/* HEADER */}
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-gray-500">
          Understand your mistakes and improve faster
        </p>
      </div>

      {/* MAIN */}
      <div className="grid md:grid-cols-2 gap-6">
        <AddAttempt onAdd={() => setRefresh(r => r + 1)} />
        <Insights refresh={refresh} />
      </div>

      <WeakTopics refresh={refresh} />

      <AttemptsList refresh={refresh} />

    </div>
  )
}