import { NextResponse } from 'next/server'
import { askAI } from '@/lib/ai/gemini'

export async function POST(req: Request) {
  const { prompt } = await req.json()

  const result = await askAI(prompt)

  return NextResponse.json({ result })
}