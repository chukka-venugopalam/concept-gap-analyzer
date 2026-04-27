'use client'

import { useState } from 'react'
import { signIn, signUp } from '@/lib/auth'
import { useRouter } from 'next/navigation'

export default function Home() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const router = useRouter()

  const handleLogin = async () => {
    const { error } = await signIn(email, password)
    if (error) alert(error.message)
    else router.push('/dashboard')
  }

  const handleSignup = async () => {
    const { error } = await signUp(email, password)
    if (error) alert(error.message)
    else alert('Signup success')
  }

  return (
    <div style={{ maxWidth: 400, margin: '50px auto' }}>
      <h2>Login</h2>

      <input
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <div>
        <button onClick={handleLogin}>Login</button>
        <button onClick={handleSignup}>Signup</button>
      </div>
    </div>
  )
}