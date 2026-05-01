'use client'

import Card from '@/components/ui/Card'

export default function Insights() {
  return (
    <Card>
      <h2 className="text-lg font-semibold text-gray-900 mb-3">Your Insights</h2>
      <div className="space-y-2 text-sm text-gray-600">
        <p>🎓 Detailed analysis of your learning patterns</p>
        <p>📈 Progress tracking and recommendations</p>
      </div>
    </Card>
  )
}
