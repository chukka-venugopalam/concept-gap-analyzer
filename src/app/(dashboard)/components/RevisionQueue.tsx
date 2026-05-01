'use client'

import Card from '@/components/ui/Card'

export default function RevisionQueue() {
  return (
    <Card>
      <h2 className="text-lg font-semibold text-gray-900 mb-3">Revision Queue</h2>
      <div className="flex items-center justify-center py-12 text-gray-500">
        📋 Your revision items will appear here
      </div>
    </Card>
  )
}
