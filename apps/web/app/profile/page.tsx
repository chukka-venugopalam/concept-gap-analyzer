'use client'

import React, { useEffect, useState } from 'react'
import { AppShell } from '@/components/layout/AppShell'
import { Button } from '@/components/ui/Button'
import { Skeleton } from '@/components/ui/Skeleton'
import { usersAPI } from '@/lib/api/users'
import { cn } from '@/lib/utils'

const GOALS = [
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

export default function ProfilePage() {
  const [email, setEmail] = useState('')
  const [displayName, setDisplayName] = useState('')
  const [selectedGoal, setSelectedGoal] = useState('interview_prep')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    async function loadProfile() {
      try {
        setLoading(true)
        const res = await usersAPI.getProfile()
        const data = res?.data || res
        if (data) {
          setEmail(data.email || '')
          setDisplayName(data.display_name || '')
          if (data.goal) {
            setSelectedGoal(data.goal)
          }
        }
      } catch (err: any) {
        console.error('Failed to load profile:', err)
        setError(err.message || 'Failed to load profile')
      } finally {
        setLoading(false)
      }
    }
    loadProfile()
  }, [])

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      setSaving(true)
      await usersAPI.updateProfile({
        display_name: displayName,
        goal: selectedGoal
      })
      setSaved(true)
      setTimeout(() => {
        setSaved(false)
      }, 2000)
    } catch (err: any) {
      console.error('Failed to update profile:', err)
      setError(err.message || 'Failed to update profile')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <AppShell>
        <div className="space-y-6 max-w-xl">
          <Skeleton className="h-8 w-40" />
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-48 w-full" />
        </div>
      </AppShell>
    )
  }

  return (
    <AppShell>
      <div className="max-w-xl">
        <div className="mb-6">
          <h1 className="font-display font-bold text-2xl text-primary">
            Account Settings
          </h1>
          <p className="text-xs text-secondary mt-1">
            Manage your personal profile and diagnostic goals
          </p>
        </div>

        {error && (
          <div className="p-4 rounded-lg bg-missing-dim text-missing border border-missing/20 text-xs mb-6">
            {error}
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-6">
          {/* Email (Read-only) */}
          <div className="space-y-2">
            <label className="text-xs font-mono uppercase tracking-wider text-muted block">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              disabled
              className="w-full bg-surface-2 border border-border rounded-lg px-4 py-2.5 text-sm text-secondary cursor-not-allowed opacity-75 focus:outline-none"
            />
            <span className="text-[10px] text-muted font-mono block">
              Email cannot be changed (primary authentication identity)
            </span>
          </div>

          {/* Display Name */}
          <div className="space-y-2">
            <label className="text-xs font-mono uppercase tracking-wider text-muted block">
              Display Name
            </label>
            <input
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="Enter your name"
              className="w-full bg-surface border border-border rounded-lg px-4 py-2.5 text-sm text-primary focus:outline-none focus:border-accent transition-colors"
            />
          </div>

          {/* Preparation Goal */}
          <div className="space-y-3">
            <label className="text-xs font-mono uppercase tracking-wider text-muted block">
              Preparation Goal
            </label>
            <div className="space-y-3">
              {GOALS.map((g) => {
                const isSelected = selectedGoal === g.id
                return (
                  <div
                    key={g.id}
                    onClick={() => setSelectedGoal(g.id)}
                    className={cn(
                      'p-4 rounded-lg border cursor-pointer transition-all',
                      isSelected
                        ? 'border-accent bg-accent-dim'
                        : 'border-border bg-surface hover:border-border-subtle'
                    )}
                  >
                    <h3 className="font-display font-semibold text-sm text-primary">{g.title}</h3>
                    <p className="text-xs text-secondary mt-1">{g.desc}</p>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Save Button */}
          <div className="pt-2 flex items-center gap-3">
            <Button type="submit" loading={saving} disabled={saving}>
              {saved ? 'Saved ✓' : 'Save Changes'}
            </Button>
            {saved && (
              <span className="text-xs text-known font-mono animate-fade-in">
                Profile updated successfully!
              </span>
            )}
          </div>
        </form>
      </div>
    </AppShell>
  )
}
