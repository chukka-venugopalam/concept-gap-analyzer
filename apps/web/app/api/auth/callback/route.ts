import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  const url = new URL(req.url)
  const code = url.searchParams.get('code')

  if (code) {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://iaxoyqxsdqnolhmmbogs.supabase.co'
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlheG95cXhzZHFub2xobW1ib2dzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDY2MDMwMDB9.placeholder'
    const supabase = createRouteHandlerClient({ cookies }, { supabaseUrl, supabaseKey })
    const { data: { session } } = await supabase.auth.exchangeCodeForSession(code)

    if (session) {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'
        await fetch(`${apiUrl}/api/v1/auth/sync-user`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${session.access_token}`,
          },
          body: JSON.stringify({
            email: session.user.email,
            display_name: session.user.user_metadata?.full_name
                          ?? session.user.email?.split('@')[0]
                          ?? 'User',
          }),
        })

        const profileRes = await fetch(`${apiUrl}/api/v1/user/profile`, {
          headers: {
            Authorization: `Bearer ${session.access_token}`,
          },
        })
        const profileData = await profileRes.json()
        const onboardingDone = profileData?.data?.onboarding_done

        if (onboardingDone) {
          return NextResponse.redirect(new URL('/dashboard', req.url))
        } else {
          return NextResponse.redirect(new URL('/onboarding', req.url))
        }
      } catch {
        return NextResponse.redirect(new URL('/onboarding', req.url))
      }
    }
  }

  return NextResponse.redirect(new URL('/auth', req.url))
}
