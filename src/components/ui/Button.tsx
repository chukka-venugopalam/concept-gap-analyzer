import clsx from 'clsx'

export default function Button({
  children,
  className,
  disabled,
  ...props
}: any) {
  return (
    <button
      disabled={disabled}
      className={clsx(
        'px-4 py-2.5 rounded-lg text-white font-semibold',
        'bg-gradient-to-r from-indigo-600 to-purple-600',
        'hover:shadow-lg hover:from-indigo-700 hover:to-purple-700',
        'active:scale-95 transition-all duration-150',
        'disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-none',
        className
      )}
      {...props}
    >
      {children}
    </button>
  )
}