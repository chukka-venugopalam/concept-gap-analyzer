'use client'

import Link from 'next/link'
import Image from 'next/image'
import { supabase } from '@/lib/supabase/client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Button from './ui/Button'
import { branding } from '@/config/branding'
import { Menu, X } from 'lucide-react'

export default function Navbar() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
      setLoading(false)
    }

    getUser()

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user || null)
      }
    )

    return () => {
      listener.subscription.unsubscribe()
    }
  }, [])

  const logout = async () => {
    await supabase.auth.signOut()
    setUser(null)
    router.push('/login')
    router.refresh()
  }

  return (
    <nav className="sticky top-0 z-50 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md border-b border-gray-200 dark:border-slate-800 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
        
        {/* Logo & Branding */}
        <Link href="/" className="flex items-center gap-2.5 hover:opacity-80 transition-opacity">
          <div className="relative w-8 h-8 sm:w-9 sm:h-9 flex-shrink-0">
            {/* Logo Image - will be replaced with actual logo.png */}
            <div className="w-full h-full rounded-lg bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center text-white font-bold text-sm">
              CG
            </div>
            {/* Uncomment when adding logo: 
            <Image
              src={branding.logo.path}
              alt={branding.appName}
              width={branding.logo.sizes.navbar}
              height={branding.logo.sizes.navbar}
              priority
              className="rounded-lg"
            /> */}
          </div>
          <span className="hidden sm:block gradient-text text-lg font-bold">{branding.appName}</span>
        </Link>

        {/* Desktop Navigation */}
        {loading ? (
          <div className="hidden md:block text-sm text-gray-500">Loading...</div>
        ) : user ? (
          <div className="hidden md:flex items-center gap-4">
            <span className="text-sm text-gray-600 dark:text-slate-400 font-medium">
              {user.email}
            </span>
            <button
              onClick={logout}
              className="px-4 py-1.5 text-sm font-medium rounded-lg bg-red-50 dark:bg-red-950/30 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/50 transition-colors"
            >
              Logout
            </button>
          </div>
        ) : (
          <div className="hidden md:flex gap-3 items-center text-sm">
            <Link href="/login">
              <Button variant="ghost" size="sm">
                Login
              </Button>
            </Link>
            <Link href="/signup">
              <Button size="sm">
                Sign Up
              </Button>
            </Link>
          </div>
        )}

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors"
        >
          {mobileMenuOpen ? (
            <X className="w-5 h-5 text-gray-700 dark:text-slate-300" />
          ) : (
            <Menu className="w-5 h-5 text-gray-700 dark:text-slate-300" />
          )}
        </button>
      </div>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-gray-200 dark:border-slate-800 bg-white/95 dark:bg-slate-950/95 backdrop-blur-md">
          <div className="px-4 py-4 space-y-3">
            {loading ? (
              <div className="text-sm text-gray-500">Loading...</div>
            ) : user ? (
              <>
                <div className="text-sm text-gray-600 dark:text-slate-400 py-2">
                  {user.email}
                </div>
                <button
                  onClick={logout}
                  className="w-full px-4 py-2 text-sm font-medium rounded-lg bg-red-50 dark:bg-red-950/30 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/50 transition-colors"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link href="/login">
                  <Button variant="outline" size="sm" className="w-full">
                    Login
                  </Button>
                </Link>
                <Link href="/signup">
                  <Button size="sm" className="w-full">
                    Sign Up
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  )
}