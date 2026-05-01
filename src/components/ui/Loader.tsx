export default function Loader() {
  return (
    <div className="flex items-center justify-center">
      <div className="relative w-8 h-8">
        <div className="absolute inset-0 rounded-full border-2 border-indigo-200" />
        <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-indigo-600 animate-spin" />
      </div>
      <span className="ml-2 text-sm text-gray-600">Processing...</span>
    </div>
  )
}
