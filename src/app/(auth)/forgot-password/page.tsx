'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { forgotSchema } from '@/lib/validators/auth'
import { supabase } from '@/lib/supabase/client'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import { useState } from 'react'

export default function ForgotPassword() {
  const [msg, setMsg] = useState('')

  const { register, handleSubmit } = useForm({
    resolver: zodResolver(forgotSchema),
  })

  const onSubmit = async (data: any) => {
    const { error } = await supabase.auth.resetPasswordForEmail(data.email, {
      redirectTo: `${location.origin}/reset-password`,
    })

    if (error) setMsg(error.message)
    else setMsg('Check your email')
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full max-w-md space-y-4"
      >
        <h1 className="text-2xl font-semibold">Reset Password</h1>

        <Input placeholder="Email" {...register('email')} />

        {msg && <p className="text-sm">{msg}</p>}

        <Button type="submit">Send reset link</Button>
      </form>
    </div>
  )
}