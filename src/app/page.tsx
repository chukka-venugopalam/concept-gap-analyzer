'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

export default function AuthPage() {
  const router = useRouter()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLogin, setIsLogin] = useState(true)
  const [message, setMessage] = useState('')

  const handleAuth = async () => {
    if (!email || !password) return setMessage('Fill all fields')

    if (isLogin) {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password
      })

      if (error) return setMessage(error.message)
      router.push('/dashboard')
    } else {
      const { error } = await supabase.auth.signUp({
        email,
        password
      })

      if (error) return setMessage(error.message)
      setMessage('Signup successful. Now login.')
      setIsLogin(true)
    }
  }

  return (
    <div className="flex h-screen items-center justify-center bg-gray-100">
      <div className="bg-white p-6 rounded-xl shadow-md w-80">
        <h2 className="text-xl font-semibold mb-4 text-center">
          {isLogin ? 'Login' : 'Sign Up'}
        </h2>

        <input
          className="w-full mb-3 p-2 border rounded"
          placeholder="Email"
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          className="w-full mb-3 p-2 border rounded"
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          onClick={handleAuth}
          className="w-full bg-black text-white p-2 rounded"
        >
          {isLogin ? 'Login' : 'Sign Up'}
        </button>

        <p className="text-sm mt-3 text-center text-gray-600">
          {isLogin ? 'No account?' : 'Already have account?'}{' '}
          <span
            className="text-blue-500 cursor-pointer"
            onClick={() => setIsLogin(!isLogin)}
          >
            {isLogin ? 'Sign up' : 'Login'}
          </span>
        </p>

        {message && (
          <p className="text-red-500 text-sm mt-2 text-center">{message}</p>
        )}
      </div>
    </div>
  )
}