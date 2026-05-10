'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase/client'
import Loader from '@/components/ui/Loader'
import { branding } from '@/config/branding'
import { Plus, BarChart3, AlertCircle, RotateCcw, User, LogOut } from 'lucide-react'

const nav = [
  { name: 'New Attempt', href: '/dashboard', icon: Plus },
  { name: 'Insights', href: '/insights', icon: BarChart3 },
  { name: 'Weak Topics', href: '/weak', icon: AlertCircle },
  { name: 'Revision', href: '/revision', icon: RotateCcw },
  { name: 'Profile', href: '/profile', icon: User },
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
  const [user, setUser] = useState<any>(null)
  const [sidebarOpen, setSidebarOpen] = useState(true)

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) {
          router.push('/login')
          return
        }
        setUser(user)
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
        setUser(session.user)
        setAuthenticated(true)
      }
    })

    return () => {
      listener?.subscription?.unsubscribe?.()
    }
  }, [router])

  const logout = async () => {
    await supabase.auth.signOut()
    setAuthenticated(false)
    router.push('/login')
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-slate-950 dark:via-slate-900 dark:to-indigo-950">
        <Loader />
      </div>
    )
  }

  if (!authenticated) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-slate-950 dark:via-slate-900 dark:to-indigo-950">
        <p className="text-gray-600 dark:text-slate-400">Redirecting to login...</p>
      </div>
    )
  }

  return (
    <div className="flex h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-slate-950 dark:via-slate-900 dark:to-indigo-950">
      {/* SIDEBAR */}
      <aside className="w-64 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border-r border-gray-200 dark:border-slate-800 shadow-sm flex flex-col sticky top-0 h-screen overflow-y-auto">
        
        {/* Logo Section */}
        <div className="p-6 border-b border-gray-200 dark:border-slate-800">
          <Link href="/" className="flex items-center gap-2.5 group hover:opacity-80 transition-opacity mb-1">
            <div className="relative w-10 h-10 flex-shrink-0 rounded-lg bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center text-white font-bold">
              CG
            </div>
            <div>
              <p className="gradient-text text-lg font-bold">{branding.appName}</p>
            </div>
          </Link>
          <p className="text-xs text-gray-500 dark:text-slate-500 mt-2">{branding.tagline}</p>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1.5 overflow-y-auto">
          {nav.map((item) => {
            const isActive = path === item.href
            const Icon = item.icon
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 group ${
                  isActive
                    ? 'bg-indigo-100 dark:bg-indigo-950/50 text-indigo-700 dark:text-indigo-300 shadow-sm'
                    : 'text-gray-600 dark:text-slate-400 hover:bg-gray-100 dark:hover:bg-slate-800/50'
                }`}
              >
                <Icon className={`w-4 h-4 transition-transform ${isActive ? 'scale-110' : 'group-hover:scale-110'}`} />
                <span>{item.name}</span>
              </Link>
            )
          })}
        </nav>

        {/* User Section */}
        <div className="p-4 border-t border-gray-200 dark:border-slate-800 space-y-3">
          <div className="px-3 py-2 rounded-lg bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-950/30 dark:to-purple-950/30 border border-gray-200 dark:border-slate-700">
            <p className="text-xs font-medium text-gray-700 dark:text-slate-300 truncate">
              {user?.email}
            </p>
            <p className="text-xs text-gray-500 dark:text-slate-500 mt-1">
              Logged in
            </p>
          </div>
          <button
            onClick={logout}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-red-50 dark:bg-red-950/30 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/50 transition-colors text-sm font-medium"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
          <p className="text-xs text-gray-400 dark:text-slate-600 text-center">
            v1.0
          </p>
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