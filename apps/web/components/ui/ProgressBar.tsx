'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

interface ProgressBarProps {
  value: number
  color?: string
  label?: string
  showPercent?: boolean
  className?: string
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  value,
  color = '#6B6BF0',
  label,
  showPercent = true,
  className
}) => {
  const safeVal = Math.min(Math.max(value, 0), 100)

  return (
    <div className={cn('w-full', className)}>
      {(label || showPercent) && (
        <div className="flex justify-between items-center mb-1 text-xs">
          {label && <span className="text-secondary font-medium">{label}</span>}
          {showPercent && <span className="text-primary font-mono">{safeVal}%</span>}
        </div>
      )}
      <div className="h-2 w-full bg-surface-2 rounded-full overflow-hidden">
        <motion.div
          className="h-full rounded-full"
          style={{ backgroundColor: color }}
          initial={{ width: 0 }}
          animate={{ width: `${safeVal}%` }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        />
      </div>
    </div>
  )
}
