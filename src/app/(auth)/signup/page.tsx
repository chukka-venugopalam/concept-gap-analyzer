'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { signupSchema } from '@/lib/validators/auth'
import { supabase } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import { useState } from 'react'

export default function SignupPage() {
  const router = useRouter()
  const [error, setError] = useState('')

  const { register, handleSubmit } = useForm({
    resolver: zodResolver(signupSchema),
  })

  const onSubmit = async (data: any) => {
    setError('')

    const { error } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
      options: {
        data: {
          username: data.username,
          education: data.education,
        },
      },
    })

    if (error) {
      setError(error.message)
    } else {
      router.push('/dashboard')
      router.refresh()
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full max-w-md space-y-4"
      >
        <h1 className="text-2xl font-semibold">Signup</h1>

        <Input placeholder="Username" {...register('username')} />
        <Input placeholder="Education" {...register('education')} />
        <Input placeholder="Email" {...register('email')} />
        <Input type="password" placeholder="Password" {...register('password')} />

        {error && <p className="text-red-500 text-sm">{error}</p>}

        <Button type="submit">Create account</Button>

        <div className="text-sm">
          <a href="/login">Already have account?</a>
        </div>
      </form>
    </div>
  )
}