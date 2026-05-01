import clsx from 'clsx'

export default function Input({
  className,
  ...props
}: any) {
  return (
    <input
      className={clsx(
        'w-full px-3 py-2 border border-gray-300 rounded-lg',
        'focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500',
        'placeholder:text-gray-500 transition-colors',
        'disabled:bg-gray-100 disabled:text-gray-600',
        className
      )}
      {...props}
    />
  )
}