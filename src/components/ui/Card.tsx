import clsx from 'clsx'

export default function Card({ children, className }: any) {
  return (
    <div
      className={clsx(
        'bg-white p-6 rounded-2xl shadow-sm border border-gray-200',
        'hover:shadow-md transition-shadow',
        className
      )}
    >
      {children}
    </div>
  )
}