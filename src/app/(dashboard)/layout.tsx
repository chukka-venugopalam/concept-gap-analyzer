'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase/client'
import Loader from '@/components/ui/Loader'

const nav = [
  { name: 'Dashboard', href: '/dashboard' },
  { name: 'Insights', href: '/insights' },
  { name: 'Weak Topics', href: '/weak' },
  { name: 'Revision', href: '/revision' },
  { name: 'Profile', href: '/profile' },
]

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const path = usePathname()
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [authenticated, setAuthenticated] = useState(false)

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) {
          router.push('/login')
          return
        }
        setAuthenticated(true)
        setLoading(false)
      } catch (err) {
        router.push('/login')
      }
    }

    checkAuth()

    const { data: listener } = supabase.auth.onAuthStateChange((_, session) => {
      if (!session?.user) {
        router.push('/login')
        setAuthenticated(false)
      } else {
        setAuthenticated(true)
      }
    })

    return () => {
      listener?.subscription?.unsubscribe?.()
    }
  }, [router])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-br from-indigo-50 to-purple-50">
        <Loader />
      </div>
    )
  }

  if (!authenticated) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-br from-indigo-50 to-purple-50">
        <p className="text-gray-600">Redirecting to login...</p>
      </div>
    )
  }

  return (
    <div className="flex h-screen bg-gradient-to-br from-indigo-50 to-purple-50">
      {/* SIDEBAR */}
      <aside className="w-64 bg-white border-r border-gray-200 shadow-sm flex flex-col sticky top-0 h-screen">
        
        <div className="p-6 border-b border-gray-200">
          <Link href="/" className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            ConceptGap
          </Link>
          <p className="text-xs text-gray-500 mt-1">Learn what you know</p>
        </div>

        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {nav.map((item) => {
            const isActive = path === item.href
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`block px-4 py-3 rounded-lg text-sm font-medium transition ${
                  isActive
                    ? 'bg-indigo-100 text-indigo-700 shadow-sm'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                {item.name}
              </Link>
            )
          })}
        </nav>

        <div className="p-4 border-t border-gray-200 text-xs text-gray-400">
          v1.0
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 overflow-y-auto">
        <div className="p-8 max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  )
}