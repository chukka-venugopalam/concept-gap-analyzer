'use client'

import React from 'react'
import { ThemeToggle } from '@/components/theme/ThemeToggle'

export function Header() {
  return (
    <header className="h-14 border-b border-border bg-bg/80 backdrop-blur-md px-4 sm:px-6 md:px-8 flex items-center justify-end sticky top-0 z-20">
      <div className="flex items-center gap-3">
        <ThemeToggle collapsed />
      </div>
    </header>
  )
}
