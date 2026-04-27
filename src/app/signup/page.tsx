'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

export default function Signup() {
  const router = useRouter()

  const [form, setForm] = useState({
    username: '',
    email: '',
    education: '',
    password: ''
  })

  const handleSignup = async () => {
    const { error } = await supabase.auth.signUp({
      email: form.email,
      password: form.password
    })

    if (error) return alert(error.message)

    router.push('/login')
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">

      <div className="bg-white p-6 rounded-xl shadow w-80 space-y-3">
        <h2 className="text-xl font-semibold text-center">Sign Up</h2>

        <input placeholder="Username"
          className="w-full p-2 border rounded"
          onChange={(e)=>setForm({...form, username:e.target.value})}
        />

        <input placeholder="Email"
          className="w-full p-2 border rounded"
          onChange={(e)=>setForm({...form, email:e.target.value})}
        />

        <input placeholder="Education"
          className="w-full p-2 border rounded"
          onChange={(e)=>setForm({...form, education:e.target.value})}
        />

        <input type="password" placeholder="Password"
          className="w-full p-2 border rounded"
          onChange={(e)=>setForm({...form, password:e.target.value})}
        />

        <button
          onClick={handleSignup}
          className="w-full bg-black text-white p-2 rounded"
        >
          Create Account
        </button>

        <p className="text-sm text-center">
          Already have an account?{' '}
          <span className="text-blue-500 cursor-pointer"
            onClick={()=>router.push('/login')}>
            Login
          </span>
        </p>
      </div>

    </div>
  )
}