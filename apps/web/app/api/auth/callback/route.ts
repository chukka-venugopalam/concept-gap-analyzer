import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  const url = new URL(req.url)
  const code = url.searchParams.get('code')

  if (code) {
    const supabase = createRouteHandlerClient({ cookies })
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
