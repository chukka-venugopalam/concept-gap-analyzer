export default function RevisionPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Revision Plan</h1>
        <p className="text-gray-600 mt-1">Topics suggested for revision</p>
      </div>

      <div className="p-6 bg-white rounded-2xl border border-gray-200 shadow-sm">
        <h3 className="font-semibold text-gray-900 mb-3">📋 Your Revision Queue</h3>
        <p className="text-sm text-gray-600">Topics where you scored below 70% will appear here for focused revision.</p>
      </div>
    </div>
  )
}