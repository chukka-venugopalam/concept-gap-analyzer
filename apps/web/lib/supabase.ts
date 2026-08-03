import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

export function createClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://iaxoyqxsdqnolhmmbogs.supabase.co'
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlheG95cXhzZHFub2xobW1ib2dzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDY2MDMwMDB9.placeholder'

  return createClientComponentClient({
    supabaseUrl,
    supabaseKey,
  })
}
