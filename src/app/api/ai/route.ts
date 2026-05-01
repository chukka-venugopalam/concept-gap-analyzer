import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  try {
    const { prompt } = await req.json()

    if (!prompt || typeof prompt !== 'string') {
      return NextResponse.json(
        { error: 'Invalid prompt' },
        { status: 400 }
      )
    }

    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json(
        { error: 'API key not configured' },
        { status: 500 }
      )
    }

    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [{ text: prompt }],
            },
          ],
        }),
        signal: AbortSignal.timeout(30000), // 30 second timeout
      }
    )

    if (!res.ok) {
      const errorData = await res.json()
      console.error('Gemini API error:', errorData)
      return NextResponse.json(
        { error: 'AI service error' },
        { status: 500 }
      )
    }

    const data = await res.json()
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text

    if (!text) {
      console.error('No response from Gemini:', data)
      return NextResponse.json(
        { error: 'No response from AI' },
        { status: 500 }
      )
    }

    // Parse JSON response from AI
    let parsed: any = null
    try {
      // Try to extract JSON from response
      const jsonMatch = text.match(/\{[\s\S]*\}/)
      if (jsonMatch) {
        parsed = JSON.parse(jsonMatch[0])
      }
    } catch (e) {
      // If parsing fails, create structured response from text
      parsed = {
        verdict: 'near',
        feedback: text,
      }
    }

    return NextResponse.json({
      verdict: parsed?.verdict || 'near',
      feedback: parsed?.feedback || text,
    })
  } catch (err) {
    console.error('AI route error:', err)
    return NextResponse.json(
      { error: 'AI service failed', details: String(err) },
      { status: 500 }
    )
  }
}