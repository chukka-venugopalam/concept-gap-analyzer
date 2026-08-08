import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const PUBLIC_ROUTES = ['/', '/auth']
const AUTH_ROUTES = ['/api/auth']

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  const demoCookie = req.cookies.get('cip_demo_auth')

  if (demoCookie?.value) {
    const path = req.nextUrl.pathname
    if (PUBLIC_ROUTES.includes(path)) {
      return NextResponse.redirect(new URL('/dashboard', req.url))
    }
    return res
  }

  try {
    const supabase = createMiddlewareClient({ req, res })
    const { data: { session } } = await supabase.auth.getSession()

    const path = req.nextUrl.pathname
    const isPublic = PUBLIC_ROUTES.some((r) => path === r)
    const isAuthRoute = AUTH_ROUTES.some((r) => path.startsWith(r))

    if (isAuthRoute) return res

    if (!session && !isPublic) {
      const redirectUrl = new URL('/auth', req.url)
      return NextResponse.redirect(redirectUrl)
    }

    if (session && path === '/auth') {
      const redirectUrl = new URL('/dashboard', req.url)
      return NextResponse.redirect(redirectUrl)
    }

    return res
  } catch (error) {
    console.error('[MIDDLEWARE] Error:', error)
    return res
  }
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
}
