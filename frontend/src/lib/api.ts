const API_URL = (import.meta.env.VITE_API_URL as string | undefined) ?? ''

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

export function getGoogleAuthUrl() {
  return `${API_URL}/api/auth/google`
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

export async function fetchTtsAudio(text: string): Promise<Blob> {
  const token = localStorage.getItem('token')
  const res = await fetch(`${API_URL}/api/voice/tts`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify({ text, format: 'mp3' }),
  })
  if (!res.ok) throw new ApiError('TTS request failed', res.status)
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
}

export interface SessionsResponse {
  sessions: SessionEntry[]
  total: number
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

export function changeUserPassword(currentPassword: string, newPassword: string) {
  return request<{ message: string }>('/api/auth/change-password', {
    method: 'POST',
    body: JSON.stringify({ currentPassword, newPassword }),
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
