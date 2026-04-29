'use client'

import { useState } from 'react'
import Button from '@/components/ui/Button'

export default function ExplanationChecker() {
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const [loading, setLoading] = useState(false)

  const check = async () => {
    setLoading(true)

    const res = await fetch('/api/ai', {
      method: 'POST',
      body: JSON.stringify({
        prompt: `
You are a strict tutor.

Evaluate this student's explanation:

"${input}"

Return:
1. Accuracy (0-100)
2. Missing concepts
3. Mistakes
4. Improved explanation
        `,
      }),
    })

    const data = await res.json()
    setOutput(data.result)
    setLoading(false)
  }

  return (
    <div className="bg-white p-4 rounded-xl border space-y-3">
      <h2 className="font-semibold">Explanation Checker</h2>

      <textarea
        className="w-full border p-2 rounded-xl"
        rows={4}
        placeholder="Write your explanation..."
        onChange={(e) => setInput(e.target.value)}
      />

      <Button onClick={check}>
        {loading ? 'Checking...' : 'Check'}
      </Button>

      {output && (
        <pre className="text-sm whitespace-pre-wrap">
          {output}
        </pre>
      )}
    </div>
  )
}