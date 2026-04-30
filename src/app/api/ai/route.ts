import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  try {
    const { prompt } = await req.json()

    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${process.env.GEMINI_API_KEY}`,
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
      }
    )

    const data = await res.json()

    const text =
      data?.candidates?.[0]?.content?.parts?.[0]?.text || 'No response'

    return NextResponse.json({ text })
  } catch (err) {
    console.log(err)
    return NextResponse.json({ text: 'AI failed' }, { status: 500 })
  }
}