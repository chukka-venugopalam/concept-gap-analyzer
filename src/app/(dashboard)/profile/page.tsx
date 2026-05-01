'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase/client'
import Button from '@/components/ui/Button'
import { useRouter } from 'next/navigation'

export default function ProfilePage() {
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

    const { data: listener } = supabase.auth.onAuthStateChange((_, session) => {
      setUser(session?.user || null)
    })

    return () => {
      listener.subscription.unsubscribe()
    }
  }, [])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/login')
  }

  if (loading) {
    return <div className="text-center text-gray-600">Loading...</div>
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Profile</h1>
        <p className="text-gray-600 mt-1">Your account settings</p>
      </div>

      {user && (
        <div className="grid md:grid-cols-2 gap-6">
          <div className="p-6 bg-white rounded-2xl border border-gray-200 shadow-sm space-y-4">
            <h2 className="font-semibold text-gray-900">Account Information</h2>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                value={user.email}
                disabled
                className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-600"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                User ID
              </label>
              <input
                type="text"
                value={user.id}
                disabled
                className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-600 text-xs font-mono"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Member Since
              </label>
              <input
                type="text"
                value={new Date(user.created_at).toLocaleDateString()}
                disabled
                className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-600"
              />
            </div>
          </div>

          <div className="p-6 bg-white rounded-2xl border border-gray-200 shadow-sm space-y-4">
            <h2 className="font-semibold text-gray-900">Actions</h2>

            <Button
              onClick={handleLogout}
              className="w-full bg-red-600 hover:bg-red-700 text-white"
            >
              Logout
            </Button>

            <p className="text-xs text-gray-500 text-center pt-2">
              More settings coming soon
            </p>
          </div>
        </div>
      )}
    </div>
  )
}