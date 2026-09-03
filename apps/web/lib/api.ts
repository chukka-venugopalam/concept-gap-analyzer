import { toast } from 'sonner'
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

  if (error) {
    console.error('[API AUTH] Session check warning:', error)
  }

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

  let res: Response
  try {
    res = await fetch(url.toString(), {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
    })
  } catch (netErr: any) {
    const userMessage = 'Something went wrong on our end — try again in a moment.'
    if (typeof window !== 'undefined') {
      toast.error(userMessage)
    }
    throw new APIError('network_error', userMessage, 0)
  }

  let json: any = null
  try {
    json = await res.json()
  } catch {
    // Non-JSON response
  }

  if (!res.ok) {
    let userMessage = 'Something went wrong.'

    if (res.status === 401) {
      userMessage = 'Your session expired — please log back in.'
    } else if (res.status >= 500) {
      userMessage = 'Something went wrong on our end — try again in a moment.'
    } else if (json?.error?.message && typeof json.error.message === 'string') {
      userMessage = json.error.message
    } else if (json?.detail && typeof json.detail === 'string') {
      userMessage = json.detail
    }

    if (typeof window !== 'undefined') {
      toast.error(userMessage)
    }

    throw new APIError(
      json?.error?.code ?? (res.status === 401 ? 'unauthorized' : 'api_error'),
      userMessage,
      res.status,
      json?.error?.field
    )
  }

  return json?.data as T
}

export const api = {
  get: <T>(path: string, params?: Record<string, string>) =>
    request<T>('GET', path, undefined, params),

  post: <T>(path: string, body?: object) =>
    request<T>('POST', path, body),

  patch: <T>(path: string, body?: object) =>
    request<T>('PATCH', path, body),
}
