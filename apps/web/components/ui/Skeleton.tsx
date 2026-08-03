'use client'

import React from 'react'
import { cn } from '@/lib/utils'

export const Skeleton: React.FC<{ className?: string }> = ({ className }) => {
  return (
    <div className={cn('bg-surface-2 rounded animate-pulse', className)} />
  )
}
