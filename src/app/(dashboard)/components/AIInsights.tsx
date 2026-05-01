'use client'

import Card from '@/components/ui/Card'

export default function AIInsights() {
  return (
    <Card>
      <h2 className="text-lg font-semibold text-gray-900 mb-3">AI Insights</h2>
      <div className="space-y-3 text-sm text-gray-600">
        <p>📊 AI analyzes your explanations in real-time</p>
        <p>🎯 Get instant feedback on accuracy and completeness</p>
        <p>📈 Track your learning progress over time</p>
        <p className="text-gray-500">More insights coming soon...</p>
      </div>
    </Card>
  )
}
