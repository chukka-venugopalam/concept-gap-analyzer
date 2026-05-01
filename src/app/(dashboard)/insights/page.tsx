export default function InsightsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Insights</h1>
        <p className="text-gray-600 mt-1">AI analysis of your learning patterns</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="p-6 bg-white rounded-2xl border border-gray-200 shadow-sm">
          <h3 className="font-semibold text-gray-900 mb-3">📊 Performance Analysis</h3>
          <p className="text-sm text-gray-600">Your performance metrics and trends will appear here.</p>
        </div>

        <div className="p-6 bg-white rounded-2xl border border-gray-200 shadow-sm">
          <h3 className="font-semibold text-gray-900 mb-3">🎯 Recommendations</h3>
          <p className="text-sm text-gray-600">Personalized study recommendations coming soon.</p>
        </div>
      </div>
    </div>
  )
}