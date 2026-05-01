'use client'

import { useState } from 'react'
import AddAttempt from '@/app/(dashboard)/components/AddAttempt'
import AttemptsList from '@/app/(dashboard)/components/AttemptsList'
import WeakTopics from '@/app/(dashboard)/components/WeakTopics'

export default function DashboardPage() {
  const [refresh, setRefresh] = useState(0)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-1">Explain concepts and get instant AI feedback</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <AddAttempt onAdd={() => setRefresh(r => r + 1)} />
        </div>

        <div>
          <WeakTopics refresh={refresh} />
        </div>
      </div>

      <AttemptsList refresh={refresh} />
    </div>
  )
}