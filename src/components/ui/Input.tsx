import clsx from 'clsx'

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  className?: string
  error?: boolean
  label?: string
}

export default function Input({
  className,
  error,
  label,
  ...props
}: InputProps) {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
          {label}
        </label>
      )}
      <input
        className={clsx(
          'w-full px-4 py-2.5 rounded-lg',
          'bg-white dark:bg-slate-900 text-gray-900 dark:text-white',
          'border border-gray-300 dark:border-slate-600',
          'focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent',
          'dark:focus:ring-indigo-400',
          'placeholder:text-gray-400 dark:placeholder:text-slate-500',
          'transition-all duration-200',
          'disabled:bg-gray-100 dark:disabled:bg-slate-800 disabled:text-gray-600 dark:disabled:text-slate-400 disabled:cursor-not-allowed',
          error && 'border-red-500 focus:ring-red-500 dark:border-red-400',
          className
        )}
        {...props}
      />
    </div>
  )
}