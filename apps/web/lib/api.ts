import { createClient } from './supabase'

const API_BASE =
  (process.env.NEXT_PUBLIC_API_URL
  || 'http://localhost:8000')
  + '/api/v1'

export class APIError extends Error {
  constructor(
    public code: string,
    public message: string,
    public status: number,
    public field?: string
  ) {
    super(message)
  }
}

async function request<T>(
  method: string,
  path: string,
  body?: object,
  params?: Record<string, string>
): Promise<T> {
  const supabase = createClient()
  const { data: { session }, error } = await supabase.auth.getSession()

  console.log('[API DEBUG] Session:', session ? 'exists' : 'null')
  console.log('[API DEBUG] Token:', session?.access_token ? session.access_token.substring(0, 20) + '...' : 'MISSING')
  console.log('[API DEBUG] Error:', error)

  const demoToken = typeof window !== 'undefined' ? localStorage.getItem('cip_demo_token') : null
  const accessToken = session?.access_token || demoToken || 'demo_token_dev'

  const url = new URL(API_BASE + path)
  if (params) {
    Object.entries(params).forEach(([k, v]) => {
      if (v !== undefined && v !== null) {
        url.searchParams.set(k, v)
      }
    })
  }

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  }
  if (accessToken) {
    headers['Authorization'] = `Bearer ${accessToken}`
  }

  const res = await fetch(url.toString(), {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  })

  const json = await res.json()
  if (!res.ok) {
    throw new APIError(
      json.error?.code ?? 'unknown_error',
      json.error?.message ?? 'An error occurred',
      res.status,
      json.error?.field
    )
  }
  return json.data as T
}

export const api = {
  get: <T>(path: string, params?: Record<string, string>) =>
    request<T>('GET', path, undefined, params),

  post: <T>(path: string, body?: object) =>
    request<T>('POST', path, body),

  patch: <T>(path: string, body?: object) =>
    request<T>('PATCH', path, body),
}
