export const API_URL = (import.meta.env.VITE_API_URL as string | undefined) ?? ''

export class ApiError extends Error {
  status: number
  code?: string

  constructor(message: string, status: number, code?: string) {
    super(message)
    this.status = status
    this.code = code
  }
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = localStorage.getItem('token')
  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {}),
    },
  })

  const data = await res.json().catch(() => ({}))

  if (!res.ok) {
    throw new ApiError(data.message || 'Request failed', res.status, data.code)
  }

  return data as T
}

export interface SignupPayload {
  name: string
  email: string
  password: string
}

export interface LoginPayload {
  email: string
  password: string
}

export interface AuthUser {
  id: string
  name?: string
  email: string
  isVerified: boolean
}

export interface AuthResponse {
  message: string
  token?: string
  user?: AuthUser
}

export function signup(payload: SignupPayload) {
  return request<{ message: string }>('/api/auth/signup', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}

export function verifyOtp(email: string, otp: string) {
  return request<AuthResponse>('/api/auth/verify-otp', {
    method: 'POST',
    body: JSON.stringify({ email, otp }),
  })
}

export function resendOtp(email: string) {
  return request<{ message: string }>('/api/auth/resend-otp', {
    method: 'POST',
    body: JSON.stringify({ email }),
  })
}

// Step 1 of login: verify credentials, triggers an OTP email.
// No token comes back here — call verifyLoginOtp next.
export function login(payload: LoginPayload) {
  return request<{ message: string }>('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}

// Step 2 of login: verify the OTP, get the token back.
export function verifyLoginOtp(email: string, otp: string) {
  return request<AuthResponse>('/api/auth/verify-login-otp', {
    method: 'POST',
    body: JSON.stringify({ email, otp }),
  })
}

export function resendLoginOtp(email: string) {
  return request<{ message: string }>('/api/auth/resend-login-otp', {
    method: 'POST',
    body: JSON.stringify({ email }),
  })
}

export function forgotPassword(email: string) {
  return request<{ message: string; emailSent?: boolean }>('/api/auth/forgot-password', {
    method: 'POST',
    body: JSON.stringify({ email }),
  })
}

export function resetPassword(email: string, otp: string, newPassword: string) {
  return request<{ message: string }>('/api/auth/reset-password', {
    method: 'POST',
    body: JSON.stringify({ email, otp, newPassword }),
  })
}

export function getGoogleAuthUrl(from?: string) {
  const base = API_URL || ''
  const params = from ? `?from=${from}` : ''
  return `${base}/api/auth/google${params}`
}

export interface ProfilePayload {
  age?: number
  gender?: string
  heightCm?: number
  weightKg?: number
  bloodGroup?: string
  allergies?: string
  conditions?: string
  medications?: string
  emergencyContact?: string
}

export function updateProfile(payload: ProfilePayload) {
  return request<{ message: string; profile: Record<string, unknown> }>('/api/users/me/profile', {
    method: 'PUT',
    body: JSON.stringify(payload),
  })
}

export interface ChatResponse {
  reply: string
  saved: boolean
  urgency?: 'emergency'
}

export function sendChatMessage(sessionId: string, message: string) {
  return request<ChatResponse>('/chat', {
    method: 'POST',
    body: JSON.stringify({ sessionId, message }),
  })
}

export interface StreamCallbacks {
  onToken: (delta: string) => void
  onDone: () => void
  onError: (error: Error) => void
}

export function sendChatMessageStream(
  sessionId: string,
  message: string,
  callbacks: StreamCallbacks,
): AbortController {
  const controller = new AbortController()
  const token = localStorage.getItem('token')

  fetch(`${API_URL}/chat/stream`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify({ sessionId, message }),
    signal: controller.signal,
  }).then(async (res) => {
    if (!res.ok) {
      const data = await res.json().catch(() => ({}))
      throw new ApiError(data.message || 'Stream request failed', res.status)
    }

    // Check if response is JSON (non-streaming early return: greeting, emergency, consent)
    const contentType = res.headers.get('content-type')
    if (contentType?.includes('application/json')) {
      const data = await res.json()
      if (data.reply) callbacks.onToken(data.reply)
      callbacks.onDone()
      return
    }

    // Otherwise process as SSE stream
    const reader = res.body!.getReader()
    const decoder = new TextDecoder()
    let buffer = ''

    while (true) {
      const { done, value } = await reader.read()
      if (done) break

      buffer += decoder.decode(value, { stream: true })
      const lines = buffer.split('\n')
      buffer = lines.pop() || ''

      for (const line of lines) {
        if (!line.startsWith('data: ')) continue
        const data = line.slice(6).trim()

        try {
          const parsed = JSON.parse(data)
          if (parsed.delta) callbacks.onToken(parsed.delta)
          if (parsed.done) { callbacks.onDone(); return }
        } catch {}
      }
    }
    callbacks.onDone()
  }).catch((err) => {
    if (err.name !== 'AbortError') callbacks.onError(err)
  })

  return controller
}

function stripEmotionTags(text: string): string {
  return text.replace(/\[(calm|warm|empathetic|serious|concerned|gentle|reassuring|urgent|neutral|thoughtful|objective|firm|attentive|chuckling|laugh|sigh|sob|yell|gasp|sarcastic)\]/gi, '').trim()
}

export async function fetchTtsAudio(text: string, speed: number = 1): Promise<Blob> {
  const token = localStorage.getItem('token')
  const res = await fetch(`${API_URL}/api/voice/tts`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    // Fish Audio interprets the leading emotion tag generated by the agent.
    // Do not strip it here; Supertonic below receives plain text instead.
    body: JSON.stringify({ text, format: 'mp3', speed }),
  })
  if (!res.ok) throw new ApiError('TTS request failed', res.status)
  return res.blob()
}

export async function fetchSupertonicAudio(text: string, voice: string = 'M1', speed: number = 1.05): Promise<Blob> {
  const token = localStorage.getItem('token')
  const res = await fetch(`${API_URL}/api/voice/supertonic`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify({ text: stripEmotionTags(text), voice, speed }),
  })
  if (!res.ok) throw new ApiError('Supertonic TTS request failed', res.status)
  return res.blob()
}

export interface SessionEntry {
  sessionId: string
  activeNodeId?: string
  verdict?: string
  status: string
  createdAt: string
  updatedAt: string
  messageCount: number
  firstMessage?: string
  summary?: string
}

export interface SessionsResponse {
  sessions: SessionEntry[]
  total: number
}

export interface SessionDetail {
  sessionId: string
  messages: Array<{ role: 'user' | 'assistant' | 'system'; content: string; timestamp: string }>
  createdAt: string
  updatedAt: string
}

export function getSession(sessionId: string) {
  return request<SessionDetail>(`/session/${encodeURIComponent(sessionId)}`)
}

export function listSessions(params?: { status?: string; limit?: number; offset?: number }) {
  const query = new URLSearchParams()
  if (params?.status) query.set('status', params.status)
  if (params?.limit) query.set('limit', String(params.limit))
  if (params?.offset) query.set('offset', String(params.offset))
  return request<SessionsResponse>(`/api/sessions?${query}`)
}

export function deleteUserSession(sessionId: string) {
  return request<void>(`/api/sessions/${encodeURIComponent(sessionId)}`, {
    method: 'DELETE',
  })
}

export function getProfile() {
  return request<{ profile: Record<string, unknown> }>('/api/users/me/profile')
}

export function getAuthUser() {
  return request<{ user: { id: string, name?: string, email: string, googleId?: string, isVerified: boolean, createdAt?: string, updatedAt?: string } }>('/api/auth/me')
}

export function changeUserPassword(currentPassword: string, newPassword: string) {
  return request<{ message: string }>('/api/auth/change-password', {
    method: 'POST',
    body: JSON.stringify({ currentPassword, newPassword }),
  })
}

export function setUserPassword(newPassword: string) {
  return request<{ message: string }>('/api/auth/set-password', {
    method: 'POST',
    body: JSON.stringify({ newPassword }),
  })
}

export function deleteAccount() {
  return request<{ message: string }>('/api/users/me', {
    method: 'DELETE',
  })
}

export function getAdminStats() {
  return request<{
    totalSessions: number
    activeSessions: number
    completedSessions: number
    emergencySessions: number
    totalUsers: number
    totalProtocols: number
    totalRules: number
    verdictBreakdown: Record<string, number>
    recentSessions: Array<{ sessionId: string; userId: string; verdict?: string; status: string; createdAt: string }>
  }>('/api/admin/stats')
}

export interface Tenant {
  id: string
  name: string
  tier: string
  email: string
  createdAt: string
}

export interface TenantAuthResponse {
  message: string
  token?: string
  tenant?: Tenant
  emailSent?: boolean
}

export interface TenantSignupPayload {
  orgName: string
  orgType: string
  country: string
  email: string
  phone: string
  orgSize: string
  password: string
}

export function tenantSignup(payload: TenantSignupPayload) {
  return request<TenantAuthResponse>('/api/tenants/signup', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}

export function tenantVerifyOtp(email: string, otp: string) {
  return request<TenantAuthResponse>('/api/tenants/verify-otp', {
    method: 'POST',
    body: JSON.stringify({ email, otp }),
  })
}

export function tenantLogin(email: string, password: string) {
  return request<TenantAuthResponse>('/api/tenants/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  })
}

export function tenantVerifyLoginOtp(email: string, otp: string) {
  return request<TenantAuthResponse>('/api/tenants/verify-login-otp', {
    method: 'POST',
    body: JSON.stringify({ email, otp }),
  })
}

// ── Tenant Analytics API ──

export interface TenantOverview {
  totalSessions: number
  activeSessions: number
  completedSessions: number
  emergencySessions: number
  weeklyChange: number
  verdictBreakdown: {
    self_care: number
    consult: number
    emergency: number
  }
}

export function getTenantOverview() {
  return request<TenantOverview>('/api/tenant/analytics/overview')
}

export interface TenantSessionEntry {
  sessionId: string
  userId: string
  verdict: string | null
  status: string
  messageCount: number
  firstMessage: string
  symptoms: string[]
  severityScore: number | null
  createdAt: string
  updatedAt: string
}

export interface TenantSessionsResponse {
  sessions: TenantSessionEntry[]
  total: number
  page: number
  pageSize: number
  totalPages: number
}

export function getTenantSessions(params?: {
  status?: string
  verdict?: string
  search?: string
  page?: number
  limit?: number
}) {
  const query = new URLSearchParams()
  if (params?.status) query.set('status', params.status)
  if (params?.verdict) query.set('verdict', params.verdict)
  if (params?.search) query.set('search', params.search)
  if (params?.page) query.set('page', String(params.page))
  if (params?.limit) query.set('limit', String(params.limit))
  return request<TenantSessionsResponse>(`/api/tenant/analytics/sessions?${query}`)
}

export interface TenantTrendsResponse {
  daily: Array<{
    date: string
    total: number
    emergency: number
    consult: number
    self_care: number
  }>
  topSymptoms: Array<{ name: string; count: number }>
}

export function getTenantTrends(range: string = '30d') {
  return request<TenantTrendsResponse>(`/api/tenant/analytics/trends?range=${range}`)
}

export interface TenantSessionDetail {
  sessionId: string
  userId: string
  verdict: string | null
  status: string
  messages: Array<{ role: string; content: string; timestamp: string }>
  symptoms: string[]
  severityScore: number | null
  durationHours: number | null
  createdAt: string
  updatedAt: string
}

export function getTenantSessionDetail(sessionId: string) {
  return request<TenantSessionDetail>(`/api/tenant/analytics/session/${encodeURIComponent(sessionId)}`)
}
