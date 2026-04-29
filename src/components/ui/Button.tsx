import clsx from 'clsx'

export default function Button({
  children,
  className,
  ...props
}: any) {
  return (
    <button
      className={clsx(
        'px-5 py-2 rounded-xl text-white font-medium',
        'bg-gradient-to-r from-indigo-500 to-purple-500',
        'hover:opacity-90 active:scale-95 transition',
        className
      )}
      {...props}
    >
      {children}
    </button>
  )
}