const ADMIN_SECRET_KEY = 'admin_secret'

export function getAdminSecret(): string | null {
  return localStorage.getItem(ADMIN_SECRET_KEY)
}

export function setAdminSecret(secret: string): void {
  localStorage.setItem(ADMIN_SECRET_KEY, secret)
}

export function clearAdminSecret(): void {
  localStorage.removeItem(ADMIN_SECRET_KEY)
}

export function isAdminAuthenticated(): boolean {
  return !!getAdminSecret()
}

async function adminFetch(url: string, options?: RequestInit): Promise<any> {
  const secret = getAdminSecret()
  if (!secret) throw new Error('Not authenticated')

  const res = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
      'x-core-secret': secret,
    },
  })

  if (!res.ok) {
    if (res.status === 401 || res.status === 403) {
      clearAdminSecret()
      window.location.href = '/admin/login'
    }
    const body = await res.json().catch(() => ({ error: res.statusText }))
    throw new Error(body.error || `Request failed: ${res.status}`)
  }

  if (res.status === 204) return null
  return res.json()
}

const API = import.meta.env.VITE_API_URL || ''

export const adminApi = {
  async login(secret: string) {
    const res = await fetch(`${API}/api/admin/stats`, {
      headers: {
        'Content-Type': 'application/json',
        'x-core-secret': secret,
      },
    })
    if (!res.ok) throw new Error('Invalid admin secret')
    return res.json()
  },

  getStats() {
    return adminFetch(`${API}/api/admin/stats`)
  },

  getDailyAnalytics() {
    return adminFetch(`${API}/api/admin/analytics/daily`)
  },

  getUsers() {
    return adminFetch(`${API}/api/admin/users`)
  },

  getTenants() {
    return adminFetch(`${API}/api/v1/analytics/tenants`)
  },

  getTokenUsage(days = 30) {
    return adminFetch(`${API}/api/v1/analytics/tokens?days=${days}`)
  },

  deleteUser(userId: string) {
    return adminFetch(`${API}/api/admin/users/${userId}`, { method: 'DELETE' })
  },
}
