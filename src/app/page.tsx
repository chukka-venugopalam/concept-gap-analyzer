'use client'

import { useRouter } from 'next/navigation'

export default function Landing() {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-100 flex flex-col items-center justify-center px-6">

      <h1 className="text-3xl font-bold text-center mb-4">
        Concept Gap Analyzer
      </h1>

      <p className="text-center text-gray-600 mb-6 max-w-md">
        Track your mistakes, identify weak concepts, and improve faster.
        This tool doesn’t just track progress — it diagnoses your thinking.
      </p>

      <div className="flex gap-3">
        <button
          onClick={() => router.push('/login')}
          className="bg-black text-white px-5 py-2 rounded-lg"
        >
          Login
        </button>

        <button
          onClick={() => router.push('/signup')}
          className="border px-5 py-2 rounded-lg"
        >
          Sign Up
        </button>
      </div>

      <div className="mt-10 text-sm text-gray-500 text-center">
        ✔ Find weak topics automatically <br />
        ✔ Track mistake patterns <br />
        ✔ Improve efficiently
      </div>

    </div>
  )
}