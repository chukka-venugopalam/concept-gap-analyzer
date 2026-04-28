// src/app/api/ai/route.ts

import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  try {
    const { data } = await req.json()

    const prompt = `
You are a study performance analyst.

Analyze this student data and give:
1. Weak topics
2. Main mistake pattern
3. Time inefficiency
4. What to do next

Data:
${JSON.stringify(data)}
`

    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [{ text: prompt }]
            }
          ]
        })
      }
    )

    const json = await res.json()

    console.log('FULL AI RESPONSE:', JSON.stringify(json, null, 2))

    let text = 'No response from AI'

    if (json.candidates && json.candidates.length > 0) {
      const parts = json.candidates[0].content.parts
      text = parts.map((p: any) => p.text).join('\n')
    }

    return NextResponse.json({ text })
  } catch (error) {
    console.log('AI ERROR:', error)
    return NextResponse.json({ text: 'Error generating AI response' })
  }
}