'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'

export default function AuthPage() {
  console.log('[AUTH ENV CHECK]', {
    supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL,
    hasAnonKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    apiUrl: process.env.NEXT_PUBLIC_API_URL
  })

  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isSignUp, setIsSignUp] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleDemoAuth = async () => {
    console.log('[AUTH] Demo Auth initiated')
    document.cookie = 'cip_demo_auth=true; path=/; max-age=86400'
    localStorage.setItem('cip_demo_token', 'demo_token_dev')

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'
      await fetch(`${apiUrl}/api/v1/auth/sync-user`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer demo_token_dev',
        },
        body: JSON.stringify({
          email: 'demo@example.com',
          display_name: 'Demo User',
        }),
      })
    } catch (err) {
      console.error('[AUTH] Failed to sync demo user:', err)
    }

    router.push('/onboarding')
  }

  const handleGoogleAuth = async () => {
    console.log('[AUTH] Starting Google OAuth...')
    try {
      const supabase = createClient()
      const { error: oauthErr } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/api/auth/callback`
        }
      })
      if (oauthErr) {
        console.error('[AUTH] Google OAuth error:', oauthErr)
        throw oauthErr
      }
    } catch (err: any) {
      console.error('[AUTH] Google Auth exception:', err)
      setError(err.message || 'Google authentication failed')
    }
  }

  const handleEmailAuth = async () => {
    setError('')
    setLoading(true)

    try {
      console.log('[AUTH] Attempting sign in...')
      
      const supabase = createClient()
      
      if (isSignUp) {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: window.location.origin + '/api/auth/callback'
          }
        })
        console.log('[AUTH] SignUp:', { data, error })
        if (error) throw error
        router.push('/onboarding')
        
      } else {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password
        })
        console.log('[AUTH] SignIn:', { data, error })
        if (error) throw error
        
        const session = data.session
        if (session) {
          const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'
          
          await fetch(apiUrl + '/api/v1/auth/sync-user', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': 'Bearer ' + session.access_token
            },
            body: JSON.stringify({
              email: session.user.email,
              display_name: session.user.email?.split('@')[0]
            })
          })
          
          router.push('/dashboard')
        }
      }
    } catch (err: any) {
      console.error('[AUTH] Error:', err)
      setError(err.message || 'Authentication failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-bg flex items-center justify-center p-4">
      <div className="bg-surface rounded-xl p-8 max-w-sm w-full border border-border">
        <div className="text-center mb-6">
          <h1 className="font-display font-bold text-accent text-2xl mb-1">CIP</h1>
          <p className="text-sm text-secondary">Sign in to start your diagnostic</p>
        </div>

        <button
          onClick={handleGoogleAuth}
          className="w-full bg-white text-bg font-semibold py-3 px-4 rounded-lg text-sm flex items-center justify-center gap-2 hover:bg-slate-100 transition-colors mb-6 cursor-pointer"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
          </svg>
          Continue with Google
        </button>

        <div className="flex items-center gap-3 mb-6">
          <div className="flex-1 h-[1px] bg-border" />
          <span className="text-xs text-muted">or</span>
          <div className="flex-1 h-[1px] bg-border" />
        </div>

        {error && (
          <div className="mb-4 text-xs text-missing bg-missing-dim p-3 rounded border border-missing/20">
            {error}
          </div>
        )}

        <div className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-secondary mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full bg-surface-2 border border-border rounded-lg px-3 py-2 text-sm text-primary placeholder:text-muted focus:outline-none focus:border-accent"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-secondary mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-surface-2 border border-border rounded-lg px-3 py-2 text-sm text-primary placeholder:text-muted focus:outline-none focus:border-accent"
            />
          </div>

          <button
            onClick={handleEmailAuth}
            disabled={loading}
            className="w-full bg-accent text-white font-display font-semibold py-2.5 px-4 rounded-lg text-sm hover:opacity-90 transition-opacity disabled:opacity-50 cursor-pointer"
          >
            {loading ? 'Processing...' : isSignUp ? 'Sign Up' : 'Sign In'}
          </button>
        </div>

        <div className="mt-6 text-center space-y-3">
          <button
            onClick={() => setIsSignUp(!isSignUp)}
            className="text-xs text-secondary hover:text-accent transition-colors cursor-pointer block w-full"
          >
            {isSignUp ? 'Already have an account? Sign In' : "Don't have an account? Sign Up"}
          </button>

          <div className="pt-2 border-t border-border">
            <button
              onClick={handleDemoAuth}
              className="w-full bg-surface-2 border border-accent/40 text-accent font-display text-xs font-semibold py-2 px-3 rounded-lg hover:bg-accent-dim transition-colors cursor-pointer"
            >
              ⚡ Continue in Demo Mode (Local Test)
            </button>
          </div>
        </div>
      </div>
    </main>
  )
}
