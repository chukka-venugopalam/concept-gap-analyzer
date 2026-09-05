import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDelta(delta: number | null) {
  if (delta === null || delta === undefined) return null
  return delta > 0 ? `+${delta}` : `${delta}`
}

export function getScoreColor(score: number): string {
  if (score >= 80) return 'var(--known)'
  if (score >= 60) return 'var(--weak)'
  return 'var(--accent)'
}

export function formatDuration(seconds: number): string {
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return `${m}m ${s}s`
}
