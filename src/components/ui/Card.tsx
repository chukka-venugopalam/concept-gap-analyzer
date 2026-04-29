export default function Card({ children }: any) {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border">
      {children}
    </div>
  )
}