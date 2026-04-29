'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { resetSchema } from '@/lib/validators/auth'
import { supabase } from '@/lib/supabase/client'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

export default function ResetPassword() {
  const router = useRouter()
  const [msg, setMsg] = useState('')

  const { register, handleSubmit } = useForm({
    resolver: zodResolver(resetSchema),
  })

  const onSubmit = async (data: any) => {
    const { error } = await supabase.auth.updateUser({
      password: data.password,
    })

    if (error) setMsg(error.message)
    else {
      setMsg('Password updated')
      setTimeout(() => router.push('/login'), 1500)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full max-w-md space-y-4"
      >
        <h1 className="text-2xl font-semibold">Set new password</h1>

        <Input type="password" placeholder="New password" {...register('password')} />

        {msg && <p className="text-sm">{msg}</p>}

        <Button type="submit">Update password</Button>
      </form>
    </div>
  )
}