'use client'

import React from 'react'
import { cn } from '@/lib/utils'

interface BadgeProps {
  variant?: 'known' | 'weak' | 'missing' | 'misconception' | 'default'
  className?: string
  children: React.ReactNode
}

export const Badge: React.FC<BadgeProps> = ({
  variant = 'default',
  className,
  children
}) => {
  const base = 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium'
  const variants = {
    default: 'bg-surface-2 text-secondary border border-border',
    known: 'bg-known-dim text-known border border-known/20',
    weak: 'bg-weak-dim text-weak border border-weak/20',
    missing: 'bg-missing-dim text-missing border border-missing/20',
    misconception: 'bg-misconception-dim text-misconception border border-misconception/20'
  }

  return (
    <span className={cn(base, variants[variant], className)}>
      {children}
    </span>
  )
}
