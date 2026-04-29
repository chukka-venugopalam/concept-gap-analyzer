'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { loginSchema } from '@/lib/validators/auth'
import { supabase } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import { useState } from 'react'

export default function LoginPage() {
  const router = useRouter()
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const { register, handleSubmit } = useForm({
    resolver: zodResolver(loginSchema),
  })

  const onSubmit = async (data: any) => {
    setLoading(true)
    setError('')

    const { error } = await supabase.auth.signInWithPassword(data)

    if (error) {
      setError(error.message)
      setLoading(false)
    } else {
      router.push('/dashboard')
      router.refresh()
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full max-w-md bg-white p-6 rounded-2xl border space-y-4 shadow-sm"
      >
        <h1 className="text-2xl font-semibold text-center">
          Login
        </h1>

        <Input placeholder="Email" {...register('email')} />
        <Input type="password" placeholder="Password" {...register('password')} />

        {error && (
          <p className="text-red-500 text-sm">{error}</p>
        )}

        <Button type="submit" className="w-full">
          {loading ? 'Logging in...' : 'Login'}
        </Button>

        <div className="text-sm text-center">
          <a href="/forgot-password">Forgot password?</a>
        </div>
      </form>
    </div>
  )
}