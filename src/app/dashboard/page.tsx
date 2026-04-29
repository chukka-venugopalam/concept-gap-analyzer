'use client'

import { useState } from 'react'
import AddAttempt from './components/AddAttempt'
import AttemptsList from './components/AttemptsList'
import Insights from './components/Insights'
import ExplanationChecker from './components/ExplanationChecker'
import AIInsights from './components/AIInsights'

export default function Dashboard() {
  const [refresh, setRefresh] = useState(0)

  const triggerRefresh = () => {
    setRefresh((prev) => prev + 1)
  }

  return (
    <div className="space-y-6">
      <AddAttempt onAdd={triggerRefresh} />
      <AttemptsList refresh={refresh} />
      <Insights refresh={refresh} />
      <AIInsights />
      <ExplanationChecker />
    </div>
  )
}