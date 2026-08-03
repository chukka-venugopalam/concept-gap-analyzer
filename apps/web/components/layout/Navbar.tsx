'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'

export const Navbar: React.FC = () => {
  const router = useRouter()
  const [dropdownOpen, setDropdownOpen] = useState(false)

  const handleSignOut = async () => {
    document.cookie = 'cip_demo_auth=; path=/; max-age=0'
    if (typeof window !== 'undefined') {
      localStorage.removeItem('cip_demo_token')
    }
    try {
      const supabase = createClient()
      await supabase.auth.signOut()
    } catch (err) {
      console.error('Supabase sign out warning:', err)
    }
    window.location.href = '/auth'
  }

  return (
    <header className="sticky top-0 z-50 h-[56px] bg-bg/80 backdrop-blur-md border-b border-border px-4 md:px-8 flex items-center justify-between">
      <div className="flex items-center gap-8">
        <Link href="/dashboard" className="font-display font-bold text-xl text-accent tracking-tight">
          CIP
        </Link>
        <nav className="hidden md:flex items-center gap-6">
          <Link href="/dashboard" className="text-sm font-medium text-secondary hover:text-primary transition-colors">
            Dashboard
          </Link>
          <Link href="/topics" className="text-sm font-medium text-secondary hover:text-primary transition-colors">
            Topics
          </Link>
        </nav>
      </div>

      <div className="relative">
        <button
          onClick={() => setDropdownOpen(!dropdownOpen)}
          className="w-8 h-8 rounded-full bg-accent/20 border border-accent/40 text-accent font-display font-bold text-xs flex items-center justify-center hover:opacity-80 transition-opacity"
        >
          U
        </button>

        {dropdownOpen && (
          <div className="absolute right-0 mt-2 w-48 bg-surface border border-border rounded-lg shadow-xl py-1 z-50">
            <Link
              href="/topics"
              className="block px-4 py-2 text-sm text-secondary hover:text-primary hover:bg-surface-2"
              onClick={() => setDropdownOpen(false)}
            >
              Topics
            </Link>
            <button
              onClick={handleSignOut}
              className="w-full text-left px-4 py-2 text-sm text-missing hover:bg-surface-2"
            >
              Sign out
            </button>
          </div>
        )}
      </div>
    </header>
  )
}
