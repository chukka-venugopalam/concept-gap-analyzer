'use client'

export default function Error({ error, reset }: { error: Error, reset: () => void }) {
  console.error('Results page error:', error)
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-bg text-primary">
      <p className="text-secondary text-sm">Something went wrong loading this session.</p>
      <button onClick={reset} className="text-accent text-sm underline">Try again</button>
    </div>
  )
}
