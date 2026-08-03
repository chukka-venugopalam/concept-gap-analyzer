'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { usersAPI } from '@/lib/api/users'
import { Button } from '@/components/ui/Button'
import { cn } from '@/lib/utils'

export default function OnboardingPage() {
  const router = useRouter()
  const [step, setStep] = useState<1 | 2>(1)
  const [selectedGoal, setSelectedGoal] = useState<string>('interview_prep')
  const [loading, setLoading] = useState(false)

  const goals = [
    {
      id: 'interview_prep',
      title: 'SWE Interviews',
      desc: 'Targeting product companies & high-growth tech'
    },
    {
      id: 'college_placement',
      title: 'College Placements',
      desc: 'Campus recruitment & entry-level coding tests'
    },
    {
      id: 'general_understanding',
      title: 'General DSA Understanding',
      desc: 'Building solid fundamental computer science concepts'
    }
  ]

  const handleComplete = async () => {
    setLoading(true)
    try {
      await usersAPI.updateProfile({
        goal: selectedGoal,
        onboarding_done: true
      })
    } catch (error) {
      console.error('Failed to save onboarding:', error)
    } finally {
      setLoading(false)
    }
    router.push('/dashboard')
  }

  return (
    <main className="min-h-screen bg-bg flex items-center justify-center p-4">
      <div className="bg-surface rounded-xl p-8 max-w-md w-full border border-border relative">
        <div className="absolute top-6 right-6 text-xs font-mono text-secondary">
          Step {step} of 2
        </div>

        {step === 1 ? (
          <div>
            <h2 className="font-display font-bold text-2xl text-primary mb-6">
              What are you preparing for?
            </h2>

            <div className="space-y-3 mb-8">
              {goals.map((g) => {
                const isSelected = selectedGoal === g.id
                return (
                  <div
                    key={g.id}
                    onClick={() => setSelectedGoal(g.id)}
                    className={cn(
                      'p-4 rounded-lg border cursor-pointer transition-all',
                      isSelected
                        ? 'border-accent bg-accent-dim'
                        : 'border-border bg-surface-2 hover:border-border-subtle'
                    )}
                  >
                    <h3 className="font-display font-semibold text-sm text-primary">{g.title}</h3>
                    <p className="text-xs text-secondary mt-1">{g.desc}</p>
                  </div>
                )
              })}
            </div>

            <Button
              className="w-full"
              onClick={() => setStep(2)}
            >
              Continue →
            </Button>
          </div>
        ) : (
          <div>
            <h2 className="font-display font-bold text-2xl text-primary mb-6">
              Here's how CIP works
            </h2>

            <div className="space-y-4 mb-8">
              <div className="flex items-start gap-4">
                <span className="font-display font-bold text-accent text-lg">01</span>
                <div>
                  <h4 className="font-display font-semibold text-sm text-primary">
                    Explain a DSA topic in your own words
                  </h4>
                  <p className="text-xs text-secondary mt-0.5">
                    No multiple choice questions. Type out what you remember.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <span className="font-display font-bold text-accent text-lg">02</span>
                <div>
                  <h4 className="font-display font-semibold text-sm text-primary">
                    CIP maps your explanation against an expert concept graph
                  </h4>
                  <p className="text-xs text-secondary mt-0.5">
                    Our AI extracts exact evidence of what you know and missed.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <span className="font-display font-bold text-accent text-lg">03</span>
                <div>
                  <h4 className="font-display font-semibold text-sm text-primary">
                    Get a precise report of exactly what to fix
                  </h4>
                  <p className="text-xs text-secondary mt-0.5">
                    See missing concepts, misconceptions, and your next optimal steps.
                  </p>
                </div>
              </div>
            </div>

            <Button
              className="w-full"
              loading={loading}
              onClick={handleComplete}
            >
              Run My First Diagnostic
            </Button>
          </div>
        )}
      </div>
    </main>
  )
}
