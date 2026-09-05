'use client'

import React from 'react'
import Link from 'next/link'
import { Toaster } from 'sonner'

interface SessionShellProps {
  topicName?: string
  stageText?: string
  children: React.ReactNode
}

export const SessionShell: React.FC<SessionShellProps> = ({
  topicName = '',
  stageText = '',
  children
}) => {
  return (
    <div className="min-h-screen bg-bg text-primary flex flex-col">
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: 'var(--surface)',
            border: '1px solid var(--border)',
            color: 'var(--primary)',
            fontFamily: 'Inter, sans-serif',
            fontSize: '13px',
          },
          className: 'bg-surface border border-border text-primary shadow-xl',
        }}
      />
      <header className="h-[56px] bg-bg border-b border-border px-4 md:px-8 flex items-center justify-between">
        <Link href="/dashboard" className="font-display font-bold text-accent text-lg">
          CIP <span className="text-xs text-secondary font-normal ml-2">← Exit Diagnostic</span>
        </Link>
        <div className="flex items-center gap-4 text-xs font-mono text-secondary">
          {topicName && <span className="text-primary font-semibold">{topicName}</span>}
          {stageText && <span>{stageText}</span>}
        </div>
      </header>
      <main className="flex-1 max-w-2xl w-full mx-auto px-4 py-8">
        {children}
      </main>
    </div>
  )
}
