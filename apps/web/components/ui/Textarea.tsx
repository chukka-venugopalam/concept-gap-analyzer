'use client'

import React from 'react'
import { cn } from '@/lib/utils'

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  showWordCount?: boolean
  minHeight?: string
}

export const Textarea: React.FC<TextareaProps> = ({
  value = '',
  onChange,
  placeholder,
  showWordCount = false,
  minHeight = 'min-h-[200px]',
  className,
  ...props
}) => {
  const text = String(value || '')
  const wordCount = text.trim() ? text.trim().split(/\s+/).length : 0

  return (
    <div className="relative w-full">
      <textarea
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={cn(
          'w-full bg-surface border border-border rounded-lg p-4 text-primary placeholder:text-muted focus:outline-none focus:border-accent focus:shadow-accent transition-all resize-y font-body text-base',
          minHeight,
          className
        )}
        {...props}
      />
      {showWordCount && (
        <div className="absolute bottom-3 right-3 text-xs text-muted font-mono pointer-events-none">
          {wordCount} words
        </div>
      )}
    </div>
  )
}
