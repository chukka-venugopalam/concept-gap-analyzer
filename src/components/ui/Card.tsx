import clsx from 'clsx'

interface CardProps {
  children: React.ReactNode
  className?: string
  hover?: boolean
  gradient?: boolean
}

export default function Card({ children, className, hover = true, gradient = false }: CardProps) {
  return (
    <div
      className={clsx(
        'card-base',
        'p-6 rounded-xl',
        gradient && 'bg-gradient-to-br from-white/60 to-purple-50/30 dark:from-slate-900/60 dark:to-indigo-950/30',
        hover && 'card-hover',
        className
      )}
    >
      {children}
    </div>
  )
}