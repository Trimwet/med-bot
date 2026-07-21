import { API_URL, ApiError } from './api'

const TOKEN_KEY = 'medbot-demo-session-token'
const BROWSER_KEY = 'medbot-demo-browser-binding'

export interface DemoStatus {
  demoId: string
  remainingRequests: number
  requestLimit: number
  consented: boolean
  expiresAt: string
}

type DemoStart = DemoStatus & { token: string }

function browserBinding() {
  let binding = localStorage.getItem(BROWSER_KEY)
  if (!binding) {
    binding = crypto.randomUUID() + crypto.randomUUID()
    localStorage.setItem(BROWSER_KEY, binding)
  }
  return binding
}

function headers() {
  const token = localStorage.getItem(TOKEN_KEY)
  const binding = localStorage.getItem(BROWSER_KEY)
  if (!token || !binding) throw new ApiError('Temporary session token not found', 401, 'DEMO_TOKEN_MISSING')
  return { 'Content-Type': 'application/json', 'x-demo-token': token, 'x-demo-browser': binding }
}

async function demoRequest<T>(path: string, init: RequestInit = {}): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, { ...init, headers: { ...headers(), ...(init.headers || {}) } })
  const data = await res.json().catch(() => ({}))
  if (!res.ok) throw new ApiError(data.message || 'Demo request failed', res.status, data.error)
  return data as T
}

export function hasDemoSession() {
  return Boolean(localStorage.getItem(TOKEN_KEY) && localStorage.getItem(BROWSER_KEY))
}

export async function startDemo(): Promise<DemoStatus> {
  const binding = browserBinding()
  const res = await fetch(`${API_URL}/api/demo/start`, {
    method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ browserBinding: binding }),
  })
  const data = await res.json().catch(() => ({})) as DemoStart
  if (!res.ok) throw new ApiError((data as any).message || 'Unable to start demo', res.status, (data as any).error)
  localStorage.setItem(TOKEN_KEY, data.token)
  return data
}

export function getDemoStatus() { return demoRequest<DemoStatus>('/api/demo/status') }
export function consentToDemo() { return demoRequest<DemoStatus>('/api/demo/consent', { method: 'POST' }) }
export function sendDemoMessage(message: string) {
  return demoRequest<{ reply: string; saved: boolean; remainingRequests: number; requestLimit: number }>('/api/demo/chat', {
    method: 'POST', body: JSON.stringify({ message }),
  })
}
