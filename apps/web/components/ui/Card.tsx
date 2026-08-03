'use client'

import React from 'react'
import { cn } from '@/lib/utils'

interface CardProps {
  variant?: 'default' | 'elevated' | 'bordered'
  className?: string
  children: React.ReactNode
}

export const Card: React.FC<CardProps> = ({
  variant = 'default',
  className,
  children
}) => {
  const base = 'bg-surface rounded-lg p-6'
  const variants = {
    default: '',
    elevated: 'shadow-lg border border-border-subtle',
    bordered: 'border border-border'
  }

  return (
    <div className={cn(base, variants[variant], className)}>
      {children}
    </div>
  )
}
