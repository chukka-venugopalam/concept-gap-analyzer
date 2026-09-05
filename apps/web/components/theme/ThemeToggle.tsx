'use client'

import React, { useEffect, useState } from 'react'
import { useTheme } from 'next-themes'
import { Moon, Sun } from 'lucide-react'

interface ThemeToggleProps {
  collapsed?: boolean
}

export function ThemeToggle({ collapsed = false }: ThemeToggleProps) {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <div className={`rounded-lg bg-surface-2 border border-border ${collapsed ? 'w-8 h-8' : 'w-full h-8'}`} />
    )
  }

  const isDark = theme === 'dark'

  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      className={`flex items-center gap-2.5 rounded-lg text-secondary hover:text-primary hover:bg-surface-2 transition-colors border border-border-subtle ${
        collapsed ? 'justify-center w-8 h-8 p-0' : 'w-full px-3 py-1.5 text-xs font-medium'
      }`}
      aria-label={`Switch to ${isDark ? 'light' : 'dark'} theme`}
      title={`Switch to ${isDark ? 'light' : 'dark'} theme`}
    >
      {isDark ? (
        <Sun className="w-4 h-4 text-accent shrink-0" />
      ) : (
        <Moon className="w-4 h-4 text-accent shrink-0" />
      )}
      {!collapsed && (
        <span className="truncate">
          {isDark ? 'Light Mode' : 'Dark Mode'}
        </span>
      )}
    </button>
  )
}
