'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase/client'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'

export default function AddAttempt({
  onAdd,
}: {
  onAdd?: () => void
}) {
  const [form, setForm] = useState({
    topic: '',
    result: true,
    time: '',
    mistake: '',
  })

  const [loading, setLoading] = useState(false)

  const handleSubmit = async () => {
    if (!form.topic || !form.time) return

    setLoading(true)

    // ✅ GET USER PROPERLY
    const res = await supabase.auth.getUser()
    const user = res.data.user

    if (!user) {
      alert('Not logged in')
      setLoading(false)
      return
    }

    const { data, error } = await supabase
      .from('attempts')
      .insert([
        {
          user_id: user.id,
          topic: form.topic,
          result: form.result,
          time_taken: Number(form.time),
          mistake_type: form.mistake,
        },
      ])

    console.log('INSERT RESULT:', data, error)

    if (error) {
      alert(error.message)
    } else {
      setForm({
        topic: '',
        result: true,
        time: '',
        mistake: '',
      })
      onAdd?.()
    }

    setLoading(false)
  }

  return (
    <div className="bg-white p-6 rounded-2xl border shadow-sm space-y-4">
      <h2 className="font-semibold text-lg">Add Attempt</h2>

      <Input
        placeholder="Topic"
        value={form.topic}
        onChange={(e: any) =>
          setForm({ ...form, topic: e.target.value })
        }
      />

      <select
        value={String(form.result)}
        onChange={(e) =>
          setForm({ ...form, result: e.target.value === 'true' })
        }
        className="w-full border p-2 rounded-xl"
      >
        <option value="true">Correct</option>
        <option value="false">Wrong</option>
      </select>

      <Input
        placeholder="Time (seconds)"
        value={form.time}
        onChange={(e: any) =>
          setForm({ ...form, time: e.target.value })
        }
      />

      <Input
        placeholder="Mistake Type"
        value={form.mistake}
        onChange={(e: any) =>
          setForm({ ...form, mistake: e.target.value })
        }
      />

      <Button onClick={handleSubmit}>
        {loading ? 'Adding...' : 'Add Attempt'}
      </Button>
    </div>
  )
}