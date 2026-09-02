'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { AnimatePresence, motion } from 'framer-motion'
import { createClient } from '@/lib/supabase'
import { usersAPI } from '@/lib/api/users'

export function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()

  const [collapsed, setCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [profile, setProfile] = useState<any>(null)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setCollapsed(localStorage.getItem('cip_sidebar_collapsed') === 'true')
    }
  }, [])

  useEffect(() => {
    async function fetchProfile() {
      try {
        const res = await usersAPI.getProfile()
        const data = res?.data || res
        if (data) setProfile(data)
      } catch (err) {
        console.error('Failed to load profile in sidebar:', err)
      }
    }
    fetchProfile()
  }, [])

  const toggleCollapse = () => {
    const next = !collapsed
    setCollapsed(next)
    if (typeof window !== 'undefined') {
      localStorage.setItem('cip_sidebar_collapsed', String(next))
      window.dispatchEvent(new Event('cip_sidebar_toggle'))
    }
  }

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

  const avatarLetter = (
    profile?.display_name?.[0] ||
    profile?.email?.[0] ||
    'U'
  ).toUpperCase()

  const accountName = profile?.display_name || profile?.email || 'User Account'
  const accountSubtext = profile?.email || 'Settings & Out'

  const navItems = [
    {
      name: 'Dashboard',
      href: '/dashboard',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 00-1-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
          />
        </svg>
      ),
    },
    {
      name: 'Topics',
      href: '/topics',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
          />
        </svg>
      ),
    },
    {
      name: 'Graphs',
      href: '/graphs',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <circle cx="6" cy="6" r="2.5" strokeWidth="2" />
          <circle cx="18" cy="6" r="2.5" strokeWidth="2" />
          <circle cx="12" cy="18" r="2.5" strokeWidth="2" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.5 6h7M7.5 8.2l3 7.6M16.5 8.2l-3 7.6" />
        </svg>
      ),
    },
    {
      name: 'Library',
      href: '/library',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z"
          />
        </svg>
      ),
    },
  ]

  const isLinkActive = (href: string) => {
    if (href === '/dashboard') return pathname === '/dashboard'
    return pathname.startsWith(href)
  }

  const sidebarContent = (isMobile: boolean = false) => (
    <div className="flex flex-col h-full justify-between">
      {/* Top section: Logo & Toggle */}
      <div>
        <div className="h-14 flex items-center justify-between px-4 border-b border-border">
          <Link href="/dashboard" className="flex items-center gap-2">
            {!isMobile && collapsed ? (
              <span className="w-3.5 h-3.5 rounded-full bg-accent inline-block" />
            ) : (
              <span className="font-display font-bold text-xl text-accent tracking-tight">
                CIP
              </span>
            )}
          </Link>

          {!isMobile && (
            <button
              onClick={toggleCollapse}
              className="p-1 rounded-md text-secondary hover:text-primary hover:bg-surface-2 transition-colors"
              title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            >
              <svg
                className={`w-4 h-4 transition-transform duration-200 ${
                  collapsed ? 'rotate-180' : ''
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>
          )}
        </div>

        {/* Quick Command Palette Button */}
        <div className="px-3 pt-3">
          <button
            onClick={() => {
              const event = new KeyboardEvent('keydown', { key: 'k', metaKey: true })
              document.dispatchEvent(event)
            }}
            className={`w-full flex items-center justify-between px-3 py-1.5 rounded-lg bg-surface-2 border border-border text-xs text-secondary hover:text-primary hover:border-border-subtle transition-colors ${
              !isMobile && collapsed ? 'justify-center px-2' : ''
            }`}
            title="Search (⌘K)"
          >
            <div className="flex items-center gap-2">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              {(isMobile || !collapsed) && <span>Search...</span>}
            </div>
            {(isMobile || !collapsed) && (
              <kbd className="text-[10px] font-mono bg-surface px-1.5 py-0.5 rounded border border-border text-muted">
                ⌘K
              </kbd>
            )}
          </button>
        </div>

        {/* Nav links */}
        <nav className="py-3 space-y-1">
          {navItems.map((item) => {
            const active = isLinkActive(item.href)
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => isMobile && setMobileOpen(false)}
                className={`flex items-center gap-3 px-4 py-2.5 text-sm font-medium transition-colors border-l-2 ${
                  active
                    ? 'border-accent text-primary bg-surface-2'
                    : 'border-transparent text-secondary hover:text-primary hover:bg-surface/50'
                }`}
                title={!isMobile && collapsed ? item.name : undefined}
              >
                <span className="shrink-0">{item.icon}</span>
                {(isMobile || !collapsed) && <span>{item.name}</span>}
              </Link>
            )
          })}
        </nav>
      </div>

      {/* Bottom section: User Profile / Sign Out */}
      <div className="p-4 border-t border-border relative">
        <div className="flex items-center justify-between">
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-3 w-full text-left hover:opacity-80 transition-opacity"
          >
            <div className="w-8 h-8 rounded-full bg-accent/20 border border-accent/40 text-accent font-display font-bold text-xs flex items-center justify-center shrink-0">
              {avatarLetter}
            </div>
            {(isMobile || !collapsed) && (
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-primary truncate">{accountName}</p>
                <p className="text-[10px] text-secondary font-mono truncate">{accountSubtext}</p>
              </div>
            )}
          </button>
        </div>

        {/* Dropdown Menu */}
        {dropdownOpen && (
          <div
            className={`absolute bottom-16 ${
              !isMobile && collapsed ? 'left-14 w-44' : 'left-4 right-4'
            } bg-surface border border-border rounded-lg shadow-xl py-1 z-50`}
          >
            <Link
              href="/profile"
              className="block px-4 py-2 text-sm text-secondary hover:text-primary hover:bg-surface-2"
              onClick={() => {
                setDropdownOpen(false)
                if (isMobile) setMobileOpen(false)
              }}
            >
              Profile
            </Link>
            <Link
              href="/topics"
              className="block px-4 py-2 text-sm text-secondary hover:text-primary hover:bg-surface-2"
              onClick={() => {
                setDropdownOpen(false)
                if (isMobile) setMobileOpen(false)
              }}
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
    </div>
  )

  return (
    <>
      {/* Mobile Top Bar (below md) */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-40 h-[56px] bg-bg/80 backdrop-blur-md border-b border-border px-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setMobileOpen(true)}
            className="p-1.5 rounded-md text-secondary hover:text-primary hover:bg-surface-2 transition-colors"
            aria-label="Open navigation menu"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
          <Link href="/dashboard" className="font-display font-bold text-xl text-accent tracking-tight">
            CIP
          </Link>
        </div>
      </div>

      {/* Mobile Slide-in Drawer (below md) */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
              className="md:hidden fixed inset-0 bg-black/60 z-40 backdrop-blur-sm"
            />
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 250 }}
              className="md:hidden fixed top-0 left-0 bottom-0 w-64 bg-surface border-r border-border z-50 shadow-2xl"
            >
              {sidebarContent(true)}
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Desktop Fixed Sidebar (md and up) */}
      <aside
        className={`hidden md:block fixed top-0 left-0 bottom-0 bg-surface border-r border-border z-30 transition-all duration-200 ${
          collapsed ? 'w-[64px]' : 'w-[240px]'
        }`}
      >
        {sidebarContent(false)}
      </aside>
    </>
  )
}
