import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Building2,
  Shield,
  Bell,
  Users,
  LogOut,
  ChevronLeft,
  AlertTriangle,
  Key,
  Plus,
  Eye,
  EyeOff,
  Copy,
  Trash2,
  Check,
  Globe,
} from 'lucide-react'
import { formatPhoneInput } from '@/lib/utils'
import { API_URL } from '@/lib/api'

type NavItem = {
  id: string
  label: string
  icon: React.ElementType
}

const NAV_ITEMS: NavItem[] = [
  { id: 'profile', label: 'Hospital profile', icon: Building2 },
  { id: 'embed', label: 'Website embed', icon: Globe },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'security', label: 'Security', icon: Shield },
  { id: 'staff', label: 'Staff & roles', icon: Users },
  { id: 'api-keys', label: 'API Keys', icon: Key },
  { id: 'logout', label: 'Logout', icon: LogOut },
]

interface EditableRowProps {
  label: string
  value: string
  expanded: boolean
  onEdit: () => void
  onCancel: () => void
  onSave: () => void
  children: React.ReactNode
}

function EditableRow({ label, value, expanded, onEdit, onCancel, onSave, children }: EditableRowProps) {
  if (expanded) {
    return (
      <div className="py-4 border-b border-gray-100 dark:border-[#1e2028] last:border-0 space-y-3">
        <p className="text-sm font-medium text-gray-900 dark:text-[#e8eaed]">{label}</p>
        {children}
        <div className="flex gap-2">
          <button onClick={onSave} className="px-4 py-2 text-sm font-medium text-white bg-[#073B4C] rounded-lg hover:bg-[#0A202A] transition-colors">
            Save
          </button>
          <button onClick={onCancel} className="px-4 py-2 text-sm font-medium text-gray-600 dark:text-[#a0a4ad] hover:text-gray-900 dark:hover:text-[#e8eaed] transition-colors">
            Cancel
          </button>
        </div>
      </div>
    )
  }
  return (
    <div className="flex items-center justify-between py-4 border-b border-gray-100 dark:border-[#1e2028] last:border-0">
      <div className="min-w-0">
        <p className="text-sm font-medium text-gray-900 dark:text-[#e8eaed]">{label}</p>
        <p className="text-sm text-gray-500 dark:text-[#6b7080] mt-0.5 truncate">{value}</p>
      </div>
      <button onClick={onEdit} className="text-sm text-[#073B4C] hover:underline shrink-0 ml-4">
        Edit
      </button>
    </div>
  )
}

interface ToggleRowProps {
  label: string
  description?: string
  enabled: boolean
  onChange: (v: boolean) => void
}

function ToggleRow({ label, description, enabled, onChange }: ToggleRowProps) {
  return (
    <div className="flex items-center justify-between py-4 border-b border-gray-100 dark:border-[#1e2028] last:border-0">
      <div className="min-w-0 pr-4">
        <p className="text-sm font-medium text-gray-900 dark:text-[#e8eaed]">{label}</p>
        {description && <p className="text-xs text-gray-500 dark:text-[#6b7080] mt-0.5">{description}</p>}
      </div>
      <button
        onClick={() => onChange(!enabled)}
        className={`relative inline-flex h-6 w-11 shrink-0 rounded-full transition-colors ${enabled ? 'bg-[#073B4C]' : 'bg-gray-200 dark:bg-[#2a2d35]'}`}
      >
        <span className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-sm transition-transform mt-0.5 ${enabled ? 'translate-x-5.5 ml-px' : 'translate-x-0.5'}`} />
      </button>
    </div>
  )
}

function ProfileSection() {
  const [expandedRow, setExpandedRow] = useState<string | null>(null)
  const [hospitalName, setHospitalName] = useState('')
  const [address, setAddress] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [website, setWebsite] = useState('')

  useEffect(() => {
    // TODO: Fetch hospital profile from API
  }, [])

  const inputClass = 'w-full px-3 py-2 text-sm border border-gray-200 dark:border-[#2a2d35] bg-white dark:bg-[#1a1d25] text-gray-900 dark:text-[#e8eaed] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#073B4C]/20 focus:border-[#073B4C]'

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-gray-900 dark:text-[#e8eaed] mb-1">Hospital profile</h2>
        <p className="text-sm text-gray-500 dark:text-[#6b7080]">Manage your hospital information and contact details.</p>
      </div>

      <div className="space-y-0">
        <EditableRow label="Hospital name" value={hospitalName || '-'} expanded={expandedRow === 'name'} onEdit={() => setExpandedRow('name')} onCancel={() => setExpandedRow(null)} onSave={() => setExpandedRow(null)}>
          <input type="text" value={hospitalName} onChange={(e) => setHospitalName(e.target.value)} className={inputClass} />
        </EditableRow>
        <EditableRow label="Address" value={address || '-'} expanded={expandedRow === 'address'} onEdit={() => setExpandedRow('address')} onCancel={() => setExpandedRow(null)} onSave={() => setExpandedRow(null)}>
          <input type="text" value={address} onChange={(e) => setAddress(e.target.value)} className={inputClass} />
        </EditableRow>
        <EditableRow label="Phone number" value={phone || '-'} expanded={expandedRow === 'phone'} onEdit={() => setExpandedRow('phone')} onCancel={() => setExpandedRow(null)} onSave={() => setExpandedRow(null)}>
          <input type="tel" value={phone} onChange={(e) => setPhone(formatPhoneInput(e.target.value))} placeholder="e.g. 09063546819" className={inputClass} />
        </EditableRow>
        <EditableRow label="Email" value={email || '-'} expanded={expandedRow === 'email'} onEdit={() => setExpandedRow('email')} onCancel={() => setExpandedRow(null)} onSave={() => setExpandedRow(null)}>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className={inputClass} />
        </EditableRow>
        <EditableRow label="Website" value={website || '-'} expanded={expandedRow === 'website'} onEdit={() => setExpandedRow('website')} onCancel={() => setExpandedRow(null)} onSave={() => setExpandedRow(null)}>
          <input type="text" value={website} onChange={(e) => setWebsite(e.target.value)} className={inputClass} />
        </EditableRow>
      </div>
    </div>
  )
}

function NotificationsSection() {
  const [emailNotif, setEmailNotif] = useState(true)
  const [smsNotif, setSmsNotif] = useState(true)
  const [pushNotif, setPushNotif] = useState(false)
  const [assessmentAlerts, setAssessmentAlerts] = useState(true)
  const [triageAlerts, setTriageAlerts] = useState(true)
  const [weeklyDigest, setWeeklyDigest] = useState(false)

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-gray-900 dark:text-[#e8eaed] mb-1">Notifications</h2>
        <p className="text-sm text-gray-500 dark:text-[#6b7080]">Configure how your hospital receives alerts and updates.</p>
      </div>

      <div>
        <p className="text-xs font-medium text-gray-400 dark:text-[#525666] uppercase tracking-wider mb-2">Channels</p>
        <ToggleRow label="Email notifications" description="Receive notifications via email" enabled={emailNotif} onChange={setEmailNotif} />
        <ToggleRow label="SMS notifications" description="Receive text message alerts" enabled={smsNotif} onChange={setSmsNotif} />
        <ToggleRow label="Push notifications" description="Receive push notifications in your browser" enabled={pushNotif} onChange={setPushNotif} />
      </div>

      <div>
        <p className="text-xs font-medium text-gray-400 dark:text-[#525666] uppercase tracking-wider mb-2">Types</p>
        <ToggleRow label="Triage alerts" description="Get notified when a patient completes a triage assessment" enabled={triageAlerts} onChange={setTriageAlerts} />
        <ToggleRow label="Assessment follow-ups" description="Alerts for follow-up actions on patient assessments" enabled={assessmentAlerts} onChange={setAssessmentAlerts} />
        <ToggleRow label="Weekly digest" description="Receive a weekly summary of hospital activity" enabled={weeklyDigest} onChange={setWeeklyDigest} />
      </div>
    </div>
  )
}

function SecuritySection() {
  const [expandedRow, setExpandedRow] = useState<string | null>(null)
  const [twoFactor, setTwoFactor] = useState(false)
  const inputClass = 'w-full px-3 py-2 text-sm border border-gray-200 dark:border-[#2a2d35] bg-white dark:bg-[#1a1d25] text-gray-900 dark:text-[#e8eaed] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#073B4C]/20 focus:border-[#073B4C]'

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-gray-900 dark:text-[#e8eaed] mb-1">Security</h2>
        <p className="text-sm text-gray-500 dark:text-[#6b7080]">Manage passwords, two-factor authentication, and sessions.</p>
      </div>

      <div>
        <p className="text-xs font-medium text-gray-400 dark:text-[#525666] uppercase tracking-wider mb-2">Password</p>
        <EditableRow label="Password" value="Last changed 2 months ago" expanded={expandedRow === 'password'} onEdit={() => setExpandedRow('password')} onCancel={() => setExpandedRow(null)} onSave={() => setExpandedRow(null)}>
          <input type="password" placeholder="New password" className={inputClass} />
        </EditableRow>
      </div>

      <div>
        <p className="text-xs font-medium text-gray-400 dark:text-[#525666] uppercase tracking-wider mb-2">Two-factor authentication</p>
        <ToggleRow label="Enable 2FA" description="Add an extra layer of security to your account" enabled={twoFactor} onChange={setTwoFactor} />
      </div>

      <div>
        <p className="text-xs font-medium text-gray-400 dark:text-[#525666] uppercase tracking-wider mb-2">Sessions</p>
        <div className="flex items-center justify-between py-4">
          <div>
            <p className="text-sm font-medium text-gray-900 dark:text-[#e8eaed]">Active sessions</p>
            <p className="text-xs text-gray-500 dark:text-[#6b7080] mt-0.5">2 devices currently logged in</p>
          </div>
          <button className="text-sm text-red-600 hover:underline">Sign out all</button>
        </div>
      </div>
    </div>
  )
}

function StaffSection() {
  const [requireApproval, setRequireApproval] = useState(true)
  const [allowExport, setAllowExport] = useState(false)

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-gray-900 dark:text-[#e8eaed] mb-1">Staff & roles</h2>
        <p className="text-sm text-gray-500 dark:text-[#6b7080]">Manage staff access permissions and roles.</p>
      </div>

      <div>
        <p className="text-xs font-medium text-gray-400 dark:text-[#525666] uppercase tracking-wider mb-2">Permissions</p>
        <ToggleRow label="Require admin approval" description="New staff accounts need admin approval before activation" enabled={requireApproval} onChange={setRequireApproval} />
        <ToggleRow label="Allow data export" description="Let staff members export patient data" enabled={allowExport} onChange={setAllowExport} />
      </div>

      <div>
        <p className="text-xs font-medium text-gray-400 dark:text-[#525666] uppercase tracking-wider mb-2">Roles</p>
        <div className="space-y-2">
          {/* TODO: Fetch roles from API */}
        </div>
      </div>
    </div>
  )
}

function LogoutSection() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-gray-900 dark:text-[#e8eaed] mb-1">Logout</h2>
        <p className="text-sm text-gray-500 dark:text-[#6b7080]">Sign out of your hospital dashboard.</p>
      </div>

      <div className="p-4 border border-red-200 dark:border-red-900/30 rounded-lg bg-red-50 dark:bg-red-900/10">
        <div className="flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400 mt-0.5 shrink-0" />
          <div>
            <p className="text-sm font-medium text-gray-900 dark:text-[#e8eaed]">Sign out</p>
            <p className="text-xs text-gray-500 dark:text-[#6b7080] mt-0.5">You will be redirected to the login page. Any unsaved changes will be lost.</p>
            <button
              onClick={() => {
                localStorage.removeItem('token')
                window.location.href = '/'
              }}
              className="mt-3 px-4 py-2 text-sm font-medium text-red-600 dark:text-red-400 border border-red-300 dark:border-red-800 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/20 transition-colors">
              Sign out
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

const API_BASE = API_URL

const businessFetch = async (path: string, options?: RequestInit) => {
  const token = localStorage.getItem('token')
  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options?.headers || {}),
    },
  })
  if (!res.ok) throw new Error(`Request failed: ${res.status}`)
  if (res.status === 204) return null
  return res.json()
}

interface ApiKeyRecord {
  _id: string
  label: string
  keyPrefix: string
  isActive: boolean
  expiresAt: string | null
  lastUsedAt: string | null
  createdAt: string
}

function ApiKeysSection() {
  const [keys, setKeys] = useState<ApiKeyRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [newKey, setNewKey] = useState<{ rawKey: string; label: string } | null>(null)
  const [showRaw, setShowRaw] = useState(false)
  const [copied, setCopied] = useState(false)
  const [label, setLabel] = useState('')
  const [creating, setCreating] = useState(false)
  const [tenantId, setTenantId] = useState<string | null>(null)
  const [noTenant, setNoTenant] = useState(false)

  useEffect(() => {
    try {
      const token = localStorage.getItem('token')
      if (token) {
        const payload = JSON.parse(atob(token.split('.')[1]))
        if (payload.tenantId) {
          setTenantId(payload.tenantId)
        } else {
          setNoTenant(true)
          setLoading(false)
        }
      } else {
        setLoading(false)
      }
    } catch {
      setLoading(false)
    }
  }, [])

  const fetchKeys = useCallback(async () => {
    if (!tenantId) return
    try {
      const data = await businessFetch(`/api/v1/tenants/${tenantId}/api-keys`)
      setKeys(data.keys || [])
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }, [tenantId])

  useEffect(() => {
    if (tenantId) fetchKeys()
  }, [tenantId, fetchKeys])

  const handleCreate = async () => {
    if (!label.trim() || !tenantId) return
    setCreating(true)
    try {
      const data = await businessFetch(`/api/v1/tenants/${tenantId}/api-keys`, {
        method: 'POST',
        body: JSON.stringify({ label: label.trim() }),
      })
      setNewKey({ rawKey: data.rawKey, label: label.trim() })
      setLabel('')
      await fetchKeys()
    } catch (err) {
      console.error(err)
    } finally {
      setCreating(false)
    }
  }

  const handleRevoke = async (keyId: string) => {
    if (!tenantId) return
    try {
      await businessFetch(`/api/v1/tenants/${tenantId}/api-keys/${keyId}`, { method: 'DELETE' })
      setKeys((prev) => prev.filter((k) => k._id !== keyId))
    } catch (err) {
      console.error(err)
    }
  }

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  if (noTenant) {
    return (
      <div className="space-y-6 max-w-xl">
        <div>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-[#e8eaed]">API Keys</h2>
          <p className="text-sm text-gray-500 dark:text-[#6b7080] mt-0.5">Manage API keys for programmatic access to MedBot</p>
        </div>
        <div className="bg-gray-50 dark:bg-[#0f1117] border border-gray-200 dark:border-[#1e2028] rounded-xl p-8 text-center">
          <Key className="w-8 h-8 text-gray-300 dark:text-[#525666] mx-auto mb-3" />
          <p className="text-sm font-medium text-gray-600 dark:text-[#a0a4ad]">No tenant linked to your account</p>
          <p className="text-xs text-gray-400 dark:text-[#525666] mt-1">Contact an administrator to link your account to a hospital tenant.</p>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="animate-pulse space-y-4">
        <div className="h-6 w-32 bg-gray-100 dark:bg-[#1a1d25] rounded-lg" />
        <div className="h-20 bg-gray-100 dark:bg-[#1a1d25] rounded-xl" />
        <div className="h-40 bg-gray-100 dark:bg-[#1a1d25] rounded-xl" />
      </div>
    )
  }

  return (
    <div className="space-y-6 max-w-xl">
      <div>
        <h2 className="text-lg font-semibold text-gray-900 dark:text-[#e8eaed]">API Keys</h2>
        <p className="text-sm text-gray-500 dark:text-[#6b7080] mt-0.5">Manage API keys for programmatic access to MedBot</p>
      </div>

      <div className="bg-white dark:bg-[#0f1117] border border-gray-200 dark:border-[#1e2028] rounded-xl p-5">
        <h3 className="text-sm font-semibold text-gray-900 dark:text-[#e8eaed] mb-3">Create API Key</h3>
        <div className="flex gap-3">
          <input
            type="text"
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            placeholder="e.g. Production Integration"
            className="flex-1 px-3 py-2 bg-gray-50 dark:bg-[#1a1d25] border border-gray-200 dark:border-[#2a2d35] rounded-lg text-sm text-gray-900 dark:text-[#e8eaed] placeholder-gray-400 dark:placeholder-[#525666] focus:outline-none focus:ring-2 focus:ring-[#073B4C]/30"
          />
          <button
            onClick={handleCreate}
            disabled={!label.trim() || creating}
            className="px-4 py-2 bg-[#073B4C] hover:bg-[#054A5E] disabled:opacity-50 text-white text-sm font-medium rounded-lg transition-colors flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            {creating ? 'Creating...' : 'Create'}
          </button>
        </div>
      </div>

      {newKey && (
        <div className="bg-yellow-50 dark:bg-yellow-900/10 border border-yellow-200 dark:border-yellow-800/30 rounded-xl p-5 space-y-3">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-yellow-600 dark:text-yellow-400 shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-yellow-800 dark:text-yellow-200">Key created — copy it now</p>
              <p className="text-xs text-yellow-700 dark:text-yellow-300 mt-0.5">You won't be able to see it again. Store it securely.</p>
            </div>
          </div>
          <div className="flex items-center gap-2 bg-white dark:bg-[#1a1d25] border border-yellow-300 dark:border-yellow-700 rounded-lg px-3 py-2">
            <code className="flex-1 text-xs font-mono text-gray-900 dark:text-[#e8eaed] break-all">
              {showRaw ? newKey.rawKey : `${newKey.rawKey.slice(0, 12)}••••••••`}
            </code>
            <button onClick={() => setShowRaw(!showRaw)} className="text-gray-400 dark:text-[#525666] hover:text-gray-600 dark:hover:text-[#a0a4ad]">
              {showRaw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
            <button onClick={() => handleCopy(newKey.rawKey)} className="text-gray-400 dark:text-[#525666] hover:text-gray-600 dark:hover:text-[#a0a4ad]">
              {copied ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>
          <button onClick={() => setNewKey(null)} className="text-xs text-yellow-700 dark:text-yellow-400 hover:text-yellow-800 dark:hover:text-yellow-300 font-medium">
            Dismiss
          </button>
        </div>
      )}

      <div className="space-y-2">
        {keys.length === 0 ? (
          <p className="text-sm text-gray-400 dark:text-[#525666] text-center py-8">No API keys created yet</p>
        ) : (
          keys.map((key) => (
            <div key={key._id} className="bg-white dark:bg-[#0f1117] border border-gray-200 dark:border-[#1e2028] rounded-xl p-4 flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-[#e8eaed]">{key.label}</p>
                <div className="flex items-center gap-3 mt-1">
                  <code className="text-xs font-mono text-gray-400 dark:text-[#525666] bg-gray-50 dark:bg-[#1a1d25] px-2 py-0.5 rounded">
                    {key.keyPrefix}...
                  </code>
                  <span className="text-xs text-gray-400 dark:text-[#525666]">
                    Created {new Date(key.createdAt).toLocaleDateString()}
                  </span>
                  {key.lastUsedAt && (
                    <span className="text-xs text-gray-400 dark:text-[#525666]">
                      Last used {new Date(key.lastUsedAt).toLocaleDateString()}
                    </span>
                  )}
                </div>
              </div>
              <button
                onClick={() => handleRevoke(key._id)}
                className="p-2 text-gray-400 dark:text-[#525666] hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                title="Revoke key"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

function EmbedSection() {
  const [copied, setCopied] = useState(false)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [tenantId, setTenantId] = useState('')
  const [tenantSlug, setTenantSlug] = useState('')
  const [branding, setBranding] = useState({
    primaryColor: '#00A8A8',
    secondaryColor: '#073B4C',
    welcomeMessage: 'Hello! I\'m MedBot, your medical triage assistant. How can I help you today?',
    theme: 'light' as 'light' | 'dark',
  })

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) { setLoading(false); return }
    fetch(`${API_BASE}/api/tenants/me`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(r => r.ok ? r.json() : null)
      .then(data => {
        if (!data) return
        setTenantId(data._id || '')
        setTenantSlug(data.slug || '')
        if (data.whitelabelConfig) {
          setBranding({
            primaryColor: data.whitelabelConfig.primaryColor || '#00A8A8',
            secondaryColor: data.whitelabelConfig.accentColor || '#073B4C',
            welcomeMessage: data.whitelabelConfig.welcomeMessage || 'Hello! I\'m MedBot, your medical triage assistant. How can I help you today?',
            theme: data.whitelabelConfig.theme || 'light',
          })
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const handleSave = async () => {
    if (!tenantId) return
    setSaving(true)
    setSaved(false)
    try {
      const token = localStorage.getItem('token')
      await fetch(`${API_BASE}/api/tenants/${tenantId}/branding`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          primaryColor: branding.primaryColor,
          accentColor: branding.secondaryColor,
          welcomeMessage: branding.welcomeMessage,
          theme: branding.theme,
        }),
      })
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    } catch {}
    setSaving(false)
  }

  const embedCode = tenantSlug
    ? `<!-- MedBot Triage Widget -->\n<script\n  src="https://embed.medbot.ng/v1.js"\n  data-tenant="${tenantSlug}"\n  data-theme="${branding.theme}"\n  data-locale="en-NG"\n  data-welcome="${branding.welcomeMessage}"\n  data-primary-color="${branding.primaryColor}"\n  data-secondary-color="${branding.secondaryColor}"\n></script>`
    : '<!-- Complete signup to get your embed code -->'

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const inputClass = 'w-full px-3 py-2 text-sm border border-gray-200 dark:border-[#2a2d35] bg-white dark:bg-[#1a1d25] text-gray-900 dark:text-[#e8eaed] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#073B4C]/20 focus:border-[#073B4C] transition-colors'

  if (loading) {
    return (
      <div className="space-y-6 max-w-4xl">
        <div className="animate-pulse space-y-4">
          <div className="h-7 w-48 bg-gray-100 dark:bg-[#1a1d25] rounded-lg" />
          <div className="h-4 w-80 bg-gray-100 dark:bg-[#1a1d25] rounded-lg" />
          <div className="flex gap-6">
            <div className="flex-1 space-y-4">
              <div className="h-44 bg-gray-100 dark:bg-[#1a1d25] rounded-xl" />
              <div className="h-64 bg-gray-100 dark:bg-[#1a1d25] rounded-xl" />
            </div>
            <div className="w-[380px] h-[560px] bg-gray-100 dark:bg-[#1a1d25] rounded-xl shrink-0" />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h2 className="text-lg font-semibold text-gray-900 dark:text-[#e8eaed] mb-1">Website embed</h2>
        <p className="text-sm text-gray-500 dark:text-[#6b7080]">Add MedBot triage to your website in minutes. Patients use it on your site; you get safe triage outcomes, emergency flags, and demand insights.</p>
      </div>

      <div className="flex flex-col xl:flex-row gap-6">
        <div className="flex-1 space-y-6">
          <div className="bg-white dark:bg-[#0f1117] border border-gray-200 dark:border-[#1e2028] rounded-xl p-5 space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-[#073B4C]/10 rounded-lg flex items-center justify-center">
                <Globe className="w-4 h-4 text-[#073B4C]" />
              </div>
              <h3 className="text-sm font-semibold text-gray-900 dark:text-[#e8eaed]">Embed code</h3>
            </div>
            <p className="text-xs text-gray-500 dark:text-[#6b7080]">Paste this before the closing &lt;/body&gt; tag on your website.</p>
            <div className="relative group">
              <pre className="bg-gray-900 text-green-400 rounded-lg p-4 text-xs font-mono overflow-x-auto whitespace-pre-wrap leading-relaxed pr-10">{embedCode}</pre>
              <button
                onClick={() => handleCopy(embedCode)}
                className="absolute top-2.5 right-2.5 p-1.5 rounded-md bg-gray-800 text-gray-400 hover:text-white hover:bg-gray-700 transition-colors opacity-80 group-hover:opacity-100"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>

          <div className="bg-white dark:bg-[#0f1117] border border-gray-200 dark:border-[#1e2028] rounded-xl p-5 space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-[#00A8A8]/10 rounded-lg flex items-center justify-center">
                <svg viewBox="0 0 24 24" fill="none" stroke="#00A8A8" strokeWidth="2" className="w-4 h-4">
                  <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
                </svg>
              </div>
              <h3 className="text-sm font-semibold text-gray-900 dark:text-[#e8eaed]">Branding</h3>
            </div>
            <p className="text-xs text-gray-500 dark:text-[#6b7080]">Customize the widget appearance to match your brand.</p>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-gray-500 dark:text-[#6b7080] mb-1.5">Primary color</label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={branding.primaryColor}
                    onChange={(e) => setBranding({ ...branding, primaryColor: e.target.value })}
                    className="w-8 h-8 rounded border border-gray-200 dark:border-[#2a2d35] cursor-pointer bg-transparent"
                  />
                  <input
                    type="text"
                    value={branding.primaryColor}
                    onChange={(e) => setBranding({ ...branding, primaryColor: e.target.value })}
                    className={inputClass}
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 dark:text-[#6b7080] mb-1.5">Secondary color</label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={branding.secondaryColor}
                    onChange={(e) => setBranding({ ...branding, secondaryColor: e.target.value })}
                    className="w-8 h-8 rounded border border-gray-200 dark:border-[#2a2d35] cursor-pointer bg-transparent"
                  />
                  <input
                    type="text"
                    value={branding.secondaryColor}
                    onChange={(e) => setBranding({ ...branding, secondaryColor: e.target.value })}
                    className={inputClass}
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-500 dark:text-[#6b7080] mb-1.5">Welcome message</label>
              <input
                type="text"
                value={branding.welcomeMessage}
                onChange={(e) => setBranding({ ...branding, welcomeMessage: e.target.value })}
                className={inputClass}
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-500 dark:text-[#6b7080] mb-1.5">Theme</label>
              <select
                value={branding.theme}
                onChange={(e) => setBranding({ ...branding, theme: e.target.value as 'light' | 'dark' })}
                className={inputClass}
              >
                <option value="light">Light</option>
                <option value="dark">Dark</option>
              </select>
            </div>

            <div className="flex items-center gap-3 pt-1">
              <button
                onClick={handleSave}
                disabled={saving}
                className="px-4 py-2 bg-[#073B4C] hover:bg-[#054A5E] disabled:opacity-50 text-white text-sm font-medium rounded-lg transition-colors flex items-center gap-2"
              >
                {saving ? 'Saving...' : saved ? 'Saved' : 'Save changes'}
                {saved && <Check className="w-3.5 h-3.5" />}
              </button>
              <button
                onClick={() => setBranding({ primaryColor: '#00A8A8', secondaryColor: '#073B4C', welcomeMessage: 'Hello! I\'m MedBot, your medical triage assistant. How can I help you today?', theme: 'light' })}
                className="px-4 py-2 text-sm font-medium text-gray-600 dark:text-[#a0a4ad] hover:text-gray-900 dark:hover:text-[#e8eaed] transition-colors"
              >
                Reset
              </button>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-[#0f1117] border border-gray-200 dark:border-[#1e2028] rounded-xl p-5 xl:w-[380px] shrink-0 flex flex-col">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 bg-gray-100 dark:bg-[#1a1d25] rounded-lg flex items-center justify-center">
              <Eye className="w-4 h-4 text-gray-500 dark:text-[#6b7080]" />
            </div>
            <h3 className="text-sm font-semibold text-gray-900 dark:text-[#e8eaed]">Widget preview</h3>
          </div>

          <div className="flex-1 border border-gray-200 dark:border-[#2a2d35] rounded-xl bg-gray-50 dark:bg-[#1a1d25] relative overflow-hidden">
            <div className="absolute inset-0 flex flex-col">
              <div className="px-5 pt-4 pb-3">
                <p className="text-[10px] text-gray-400 dark:text-[#525666] font-medium uppercase tracking-wider">Live preview</p>
              </div>

              <div className="flex-1 mx-4 mb-4 bg-white dark:bg-[#0f1117] rounded-xl border border-gray-200 dark:border-[#1e2028] shadow-md overflow-hidden flex flex-col">
                <div className="px-5 py-4 flex items-center gap-3 shrink-0" style={{ backgroundColor: branding.secondaryColor }}>
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: branding.primaryColor }}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" className="w-5 h-5">
                      <path d="M22 12h-4l-3 9L9 3l-3 9H2"/>
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white leading-tight">Medical Triage</p>
                    <p className="text-[11px] text-white/60">AI-powered health assessment</p>
                  </div>
                </div>

                <div className="flex-1 px-5 py-5 space-y-4 overflow-y-auto">
                  <div className="bg-gray-100 dark:bg-[#1a1d25] rounded-2xl rounded-tl-md px-4 py-3 text-[13px] text-gray-700 dark:text-[#a0a4ad] max-w-[85%] leading-relaxed">
                    {branding.welcomeMessage}
                  </div>
                  <div className="flex justify-end">
                    <div className="rounded-2xl rounded-tr-md px-4 py-3 text-[13px] text-white max-w-[85%] leading-relaxed" style={{ backgroundColor: branding.primaryColor }}>
                      I have a headache and fever
                    </div>
                  </div>
                  <div className="bg-gray-100 dark:bg-[#1a1d25] rounded-2xl rounded-tl-md px-4 py-3 text-[13px] text-gray-700 dark:text-[#a0a4ad] max-w-[85%] leading-relaxed">
                    I understand you're experiencing a headache and fever. How long have you had these symptoms?
                  </div>
                  <div className="flex justify-end">
                    <div className="rounded-2xl rounded-tr-md px-4 py-3 text-[13px] text-white max-w-[85%] leading-relaxed" style={{ backgroundColor: branding.primaryColor }}>
                      Since this morning, about 6 hours
                    </div>
                  </div>
                  <div className="bg-gray-100 dark:bg-[#1a1d25] rounded-2xl rounded-tl-md px-4 py-3 text-[13px] text-gray-700 dark:text-[#a0a4ad] max-w-[85%] leading-relaxed">
                    Thank you. Based on your symptoms, I recommend consulting with a healthcare professional. If your symptoms worsen, please seek immediate medical attention.
                  </div>
                </div>

                <div className="px-3 pb-3 pt-1 shrink-0">
                  <div className="rounded-3xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm">
                    <div className="px-4 pt-3.5 pb-1">
                      <p className="text-[13px] text-gray-400 dark:text-gray-500">Describe your symptoms...</p>
                    </div>
                    <div className="flex items-center justify-end px-2 pb-2 pt-1">
                      <div className="w-8 h-8 flex items-center justify-center rounded-full text-white shrink-0" style={{ backgroundColor: branding.primaryColor }}>
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-[18px] h-[18px]">
                          <line x1="12" y1="19" x2="12" y2="5"/>
                          <polyline points="5 12 12 5 19 12"/>
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>
                <p className="text-center text-[10px] text-gray-300 dark:text-[#525666] py-2.5 border-t border-gray-100 dark:border-[#1e2028] shrink-0">Powered by MedBot</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-[#0f1117] border border-gray-200 dark:border-[#1e2028] rounded-xl p-5 space-y-4">
        <h3 className="text-sm font-semibold text-gray-900 dark:text-[#e8eaed]">How it works</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { step: '1', title: 'Copy the code', desc: 'Grab the embed snippet above and paste it into your website.' },
            { step: '2', title: 'Patients use it', desc: 'The chat widget appears on your site for 24/7 triage access.' },
            { step: '3', title: 'You get insights', desc: 'View triage outcomes, emergency flags, and demand analytics here.' },
          ].map((item) => (
            <div key={item.step} className="flex gap-3">
              <div className="w-7 h-7 rounded-full bg-[#073B4C] text-white flex items-center justify-center text-xs font-bold shrink-0">
                {item.step}
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-[#e8eaed]">{item.title}</p>
                <p className="text-xs text-gray-500 dark:text-[#6b7080] mt-0.5 leading-relaxed">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

const SECTIONS: Record<string, React.ComponentType> = {
  profile: ProfileSection,
  embed: EmbedSection,
  notifications: NotificationsSection,
  security: SecuritySection,
  staff: StaffSection,
  'api-keys': ApiKeysSection,
  logout: LogoutSection,
}

const SECTION_TITLES: Record<string, string> = Object.fromEntries(
  NAV_ITEMS.map(item => [item.id, item.label])
)

export const BusinessSettings = () => {
  const [activeNav, setActiveNav] = useState('profile')
  const [mobileView, setMobileView] = useState<'nav' | 'detail'>('nav')
  const navigate = useNavigate()

  const handleLogout = () => {
    localStorage.removeItem('token')
    navigate('/')
  }

  const selectNav = (id: string) => {
    setActiveNav(id)
    setMobileView('detail')
  }

  const ActiveSection = SECTIONS[activeNav]

  const sidebar = (
    <div className="py-4 px-3">
      <p className="px-3 mb-3 text-xs font-medium text-gray-400 dark:text-[#525666] uppercase tracking-wider">Settings</p>
      <nav className="space-y-0.5">
        {NAV_ITEMS.map((item) => {
          const isActive = activeNav === item.id
          const isLogout = item.id === 'logout'
          return (
            <button
              key={item.id}
              onClick={() => selectNav(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                isLogout
                  ? isActive
                    ? 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 font-medium'
                    : 'text-red-500 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20'
                  : isActive
                    ? 'bg-[#073B4C]/5 text-[#073B4C] dark:text-[#00A8A8] font-medium'
                    : 'text-gray-600 dark:text-[#a0a4ad] hover:bg-gray-100 dark:hover:bg-[#1a1d25]'
              }`}
            >
              <item.icon className="w-4 h-4 shrink-0" />
              <span className="truncate">{item.label}</span>
            </button>
          )
        })}
      </nav>
    </div>
  )

  return (
    <div className="flex flex-col h-full bg-white dark:bg-[#0f1117]">
      {/* Mobile nav view */}
      {mobileView === 'nav' && (
        <>
          <div className="h-14 flex items-center px-4 border-b border-gray-100 dark:border-[#1e2028] shrink-0 md:hidden">
            <h1 className="text-sm font-semibold text-gray-900 dark:text-[#e8eaed]">Settings</h1>
          </div>
          <div className="flex-1 min-h-0 overflow-y-auto md:hidden">
            {sidebar}
          </div>
        </>
      )}

      {/* Mobile detail view */}
      {mobileView === 'detail' && (
        <>
          <div className="h-14 flex items-center gap-2 px-4 border-b border-gray-100 dark:border-[#1e2028] shrink-0 md:hidden">
            <button
              onClick={() => setMobileView('nav')}
              className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-500 dark:text-[#6b7080] hover:text-gray-700 dark:hover:text-[#a0a4ad] hover:bg-gray-100 dark:hover:bg-[#1a1d25] transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <h1 className="text-sm font-semibold text-gray-900 dark:text-[#e8eaed] truncate">{SECTION_TITLES[activeNav]}</h1>
          </div>
          <div className="flex-1 min-h-0 overflow-y-auto p-4 md:hidden">
            {ActiveSection && <ActiveSection />}
          </div>
        </>
      )}

      {/* Desktop layout: sidebar + content */}
      <div className="hidden md:flex h-full">
        <div className="w-64 shrink-0 border-r border-gray-100 dark:border-[#1e2028]">
          {sidebar}
        </div>
        <div className="flex-1 min-h-0 overflow-y-auto p-6">
          {ActiveSection && <ActiveSection />}
        </div>
      </div>
    </div>
  )
}
