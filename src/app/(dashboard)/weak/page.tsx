import WeakTopics from '@/app/(dashboard)/components/WeakTopics'

export default function WeakPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Weak Topics</h1>
        <p className="text-gray-600 mt-1">Topics where you need more practice</p>
      </div>
      <WeakTopics refresh={0} />
    </div>
  )
}