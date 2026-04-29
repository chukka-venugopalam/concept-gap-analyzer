'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase/client'

export default function AIInsights() {
  const [output, setOutput] = useState('')

  useEffect(() => {
    const run = async () => {
      const { data } = await supabase.from('attempts').select('*')

      const res = await fetch('/api/ai', {
        method: 'POST',
        body: JSON.stringify({
          prompt: `
Analyze this student data:

${JSON.stringify(data)}

Give:
- weak topics
- patterns in mistakes
- improvement strategy
          `,
        }),
      })

      const result = await res.json()
      setOutput(result.result)
    }

    run()
  }, [])

  return (
    <div className="bg-white p-4 rounded-xl border">
      <h2 className="font-semibold mb-2">AI Insights</h2>
      <pre className="text-sm whitespace-pre-wrap">
        {output}
      </pre>
    </div>
  )
}