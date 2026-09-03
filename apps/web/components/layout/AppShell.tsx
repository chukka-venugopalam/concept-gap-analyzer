'use client'

import React, { useEffect, useState } from 'react'
import { Sidebar } from './Sidebar'
import { CommandPalette } from '@/components/command/CommandPalette'
import { Toaster } from 'sonner'

export const AppShell: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false)

  useEffect(() => {
    const sync = () => {
      if (typeof window !== 'undefined') {
        setCollapsed(localStorage.getItem('cip_sidebar_collapsed') === 'true')
      }
    }
    sync()
    window.addEventListener('cip_sidebar_toggle', sync)
    return () => window.removeEventListener('cip_sidebar_toggle', sync)
  }, [])

  return (
    <div className="min-h-screen bg-bg text-primary flex flex-col md:flex-row">
      <Sidebar />
      <CommandPalette />
      <Toaster
        theme="dark"
        position="top-right"
        toastOptions={{
          style: {
            background: '#13131A',
            border: '1px solid #2A2A3D',
            color: '#F0F0F5',
            fontFamily: 'Inter, sans-serif',
            fontSize: '13px',
          },
          className: 'bg-surface border border-border text-primary shadow-xl',
        }}
      />
      <div
        className={`flex-1 flex flex-col transition-all duration-200 pt-[56px] md:pt-0 ${
          collapsed ? 'md:pl-[64px]' : 'md:pl-[240px]'
        }`}
      >
        <main className="flex-1 max-w-3xl w-full mx-auto px-4 py-8">
          {children}
        </main>
      </div>
    </div>
  )
}
