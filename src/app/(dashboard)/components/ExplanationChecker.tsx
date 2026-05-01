'use client'

import Card from '@/components/ui/Card'

export default function ExplanationChecker() {
  return (
    <Card>
      <h2 className="text-lg font-semibold text-gray-900 mb-3">Explanation Checker</h2>
      <div className="space-y-2 text-sm text-gray-600">
        <p>✓ Checks for accuracy and completeness</p>
        <p>✓ Identifies missing concepts</p>
        <p>✓ Suggests improvements</p>
      </div>
    </Card>
  )
}
