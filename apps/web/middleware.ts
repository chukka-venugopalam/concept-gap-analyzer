import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  const demoCookie = req.cookies.get('cip_demo_auth')
  const PUBLIC_ROUTES = ['/', '/auth']
  const isPublic = PUBLIC_ROUTES.includes(req.nextUrl.pathname)

  if (demoCookie?.value) {
    if (isPublic) {
      return NextResponse.redirect(new URL('/dashboard', req.url))
    }
    return res
  }

  const supabase = createMiddlewareClient({ req, res })

  // This line is critical - refreshes session
  const { data: { session } } = await supabase.auth.getSession()

  console.log('[MIDDLEWARE] Path:', req.nextUrl.pathname)
  console.log('[MIDDLEWARE] Session:', session ? 'exists' : 'null')

  if (!session && !isPublic) {
    return NextResponse.redirect(new URL('/auth', req.url))
  }
  if (session && isPublic) {
    return NextResponse.redirect(new URL('/dashboard', req.url))
  }
  return res
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
}
