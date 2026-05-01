'use client'

import Link from 'next/link'
import { supabase } from '@/lib/supabase/client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Button from './ui/Button'

export default function Navbar() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
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
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur border-b border-gray-200">
      <div className="max-w-6xl mx-auto px-4 py-3 flex justify-between items-center">
        
        <Link href="/" className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
          ConceptGap
        </Link>

        {loading ? (
          <div className="text-sm text-gray-500">Loading...</div>
        ) : user ? (
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-700 font-medium">
              {user.email}
            </span>
            <button
              onClick={logout}
              className="px-4 py-1.5 text-sm font-medium rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition"
            >
              Logout
            </button>
          </div>
        ) : (
          <div className="flex gap-3 text-sm">
            <Link href="/login" className="px-4 py-1.5 text-gray-700 font-medium hover:text-indigo-600 transition">
              Login
            </Link>
            <Link href="/signup">
              <Button className="px-4 py-1.5 text-sm">
                Sign Up
              </Button>
            </Link>
          </div>
        )}

      </div>
    </nav>
  )
}