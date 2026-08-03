'use client'

import React from 'react'
import { useRouter } from 'next/navigation'

export default function LandingPage() {
  const router = useRouter()

  return (
    <main className="min-h-screen bg-bg flex flex-col items-center justify-center p-6 text-center">
      <div className="max-w-2xl flex flex-col items-center">
        <p className="font-display text-xs tracking-widest uppercase text-accent mb-6 font-semibold">
          Interview Prep Diagnostic
        </p>

        <h1 className="font-display font-bold text-5xl md:text-6xl text-primary leading-tight mb-6">
          Find out exactly what <br />
          <span className="text-accent">you don't understand.</span>
        </h1>

        <p className="font-body text-lg text-secondary max-w-md mb-10">
          CIP maps your DSA knowledge, identifies your exact gaps, and tells you precisely what to fix.
        </p>

        <button
          onClick={() => router.push('/auth')}
          className="bg-accent text-white font-display font-semibold text-base px-8 py-4 rounded-full hover:opacity-90 hover:scale-[1.02] transition-all shadow-accent cursor-pointer"
        >
          Start Free Diagnostic →
        </button>

        <p className="mt-4 text-xs text-muted">
          No credit card. No course to buy.
        </p>
      </div>
    </main>
  )
}
