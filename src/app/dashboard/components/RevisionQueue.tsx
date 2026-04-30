'use client'

export default function RevisionQueue({ weak }: { weak: any[] }) {
  if (!weak.length) return null

  return (
    <div className="bg-white p-6 rounded-2xl border">
      <h2 className="font-semibold mb-4">Revision Plan</h2>

      <div className="space-y-2 text-sm">
        {weak.map((t, i) => (
          <div key={i} className="p-3 border rounded-xl">
            Revise: <strong>{t.topic}</strong>
          </div>
        ))}
      </div>
    </div>
  )
}