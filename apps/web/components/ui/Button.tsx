'use client'

import React, { useState } from 'react'
import { cn } from '@/lib/utils'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  loading?: boolean
}

interface Ripple {
  id: number
  x: number
  y: number
  size: number
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled,
  className,
  children,
  onClick,
  onMouseDown,
  ...props
}) => {
  const [ripples, setRipples] = useState<Ripple[]>([])

  const handleMouseDown = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (disabled || loading) return
    const rect = e.currentTarget.getBoundingClientRect()
    const size = Math.max(rect.width, rect.height) * 2
    const x = e.clientX - rect.left - size / 2
    const y = e.clientY - rect.top - size / 2
    const newRipple = { id: Date.now() + Math.random(), x, y, size }

    setRipples((prev) => [...prev, newRipple])
    setTimeout(() => {
      setRipples((prev) => prev.filter((r) => r.id !== newRipple.id))
    }, 400)

    onMouseDown?.(e)
  }

  const baseStyles =
    'relative overflow-hidden font-display font-semibold transition-all duration-200 inline-flex items-center justify-center cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed select-none'

  const variants = {
    primary:
      'bg-accent text-white hover:opacity-90 hover:scale-[1.02] rounded-full shadow-accent',
    secondary:
      'bg-surface-2 text-primary hover:bg-border border border-border-subtle rounded-lg',
    ghost:
      'bg-transparent text-secondary hover:text-primary hover:bg-surface rounded-lg',
  }

  const sizes = {
    sm: 'text-xs px-3 py-1.5',
    md: 'text-sm px-5 py-2.5',
    lg: 'text-base px-8 py-4',
  }

  return (
    <button
      type="button"
      className={cn(baseStyles, variants[variant], sizes[size], className)}
      disabled={disabled || loading}
      onClick={onClick}
      onMouseDown={handleMouseDown}
      {...props}
    >
      {/* Expanding Ripple Effect */}
      {ripples.map((ripple) => (
        <span
          key={ripple.id}
          className="absolute rounded-full pointer-events-none bg-accent/30"
          style={{
            left: ripple.x,
            top: ripple.y,
            width: ripple.size,
            height: ripple.size,
            animation: 'ripple 400ms cubic-bezier(0, 0, 0.2, 1) forwards',
          }}
        />
      ))}

      {loading ? (
        <span className="inline-flex items-center gap-2">
          <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
          Loading...
        </span>
      ) : (
        children
      )}
    </button>
  )
}
