'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

export default function Login() {
  const router = useRouter()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [show, setShow] = useState(false)

  const handleLogin = async () => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password
    })

    if (error) return alert(error.message)

    router.push('/dashboard')
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">

      <div className="bg-white p-6 rounded-xl shadow w-80 space-y-3">
        <h2 className="text-xl font-semibold text-center">Login</h2>

        <input
          placeholder="Email"
          className="w-full p-2 border rounded"
          onChange={(e)=>setEmail(e.target.value)}
        />

        <div>
          <input
            type={show ? 'text' : 'password'}
            placeholder="Password"
            className="w-full p-2 border rounded"
            onChange={(e)=>setPassword(e.target.value)}
          />
          <p
            className="text-xs text-blue-500 cursor-pointer mt-1"
            onClick={()=>setShow(!show)}
          >
            {show ? 'Hide' : 'Show'} password
          </p>
        </div>

        <button
          onClick={handleLogin}
          className="w-full bg-black text-white p-2 rounded"
        >
          Login
        </button>

        <p className="text-sm text-center">
          New user?{' '}
          <span className="text-blue-500 cursor-pointer"
            onClick={()=>router.push('/signup')}>
            Sign up
          </span>
        </p>
      </div>

    </div>
  )
}