import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  User,
  Lock,
  Shield,
  Bell,
  Palette,
  ChevronRight,
  Check,
  AlertTriangle,
} from 'lucide-react'
import { BackButton } from '@/components/ui/back-button'
import { useTheme } from '@/hooks/use-theme'
import { exportUserData, getNotificationPrefs, updateNotificationPrefs, getProfile, updateProfile, getAuthUser, changeUserPassword, setUserPassword } from '@/lib/api'
import { formatPhoneInput, stripPhoneFormat } from '@/lib/utils'

type NavItem = {
  id: string
  label: string
  icon: React.ElementType
}

const NAV_ITEMS: NavItem[] = [
  { id: 'profile', label: 'Personal information', icon: User },
  { id: 'security', label: 'Login & security', icon: Lock },
  { id: 'privacy', label: 'Privacy', icon: Shield },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'appearance', label: 'Appearance', icon: Palette },
]

interface InfoRowProps {
  label: string
  value: string
  onEdit?: () => void
}

function InfoRow({ label, value, onEdit }: InfoRowProps) {
  return (
    <div className="flex items-center justify-between py-4 border-b border-gray-100 last:border-0">
      <div className="min-w-0">
        <p className="text-sm font-medium text-gray-900">{label}</p>
        <p className="text-sm text-gray-500 mt-0.5 truncate">{value}</p>
      </div>
      {onEdit && (
        <button onClick={onEdit} className="text-sm text-[#073B4C] hover:underline shrink-0 ml-4">
          Edit
        </button>
      )}
    </div>
  )
}

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
      <div className="py-4 border-b border-gray-100 dark:border-gray-800 space-y-3">
        <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{label}</p>
        {children}
        <div className="flex gap-2">
          <button onClick={onSave} className="px-4 py-2 text-sm font-medium text-white bg-[#073B4C] dark:bg-teal rounded-lg hover:bg-[#0A202A] dark:hover:bg-teal/80 transition-colors">
            Save
          </button>
          <button onClick={onCancel} className="px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors">
            Cancel
          </button>
        </div>
      </div>
    )
  }
  return (
    <div className="flex items-center justify-between py-4 border-b border-gray-100 dark:border-gray-800 last:border-0">
      <div className="min-w-0">
        <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{label}</p>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5 truncate">{value}</p>
      </div>
      <button onClick={onEdit} className="text-sm text-[#073B4C] dark:text-teal hover:underline shrink-0 ml-4">
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
    <div className="flex items-center justify-between py-4 border-b border-gray-100 dark:border-gray-800 last:border-0">
      <div className="min-w-0 pr-4">
        <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{label}</p>
        {description && <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{description}</p>}
      </div>
      <button
        onClick={() => onChange(!enabled)}
        className={`relative inline-flex h-6 w-11 shrink-0 rounded-full transition-colors ${enabled ? 'bg-[#073B4C] dark:bg-teal' : 'bg-gray-200 dark:bg-gray-700'}`}
      >
        <span className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-sm transition-transform mt-0.5 ${enabled ? 'translate-x-5.5 ml-px' : 'translate-x-0.5'}`} />
      </button>
    </div>
  )
}

function ProfileSection() {
  const [expandedRow, setExpandedRow] = useState<string | null>(null)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [location, setLocation] = useState('')
  const [age, setAge] = useState('')
  const [gender, setGender] = useState('')
  const [height, setHeight] = useState('')
  const [weight, setWeight] = useState('')
  const [bloodGroup, setBloodGroup] = useState('')
  const [allergies, setAllergies] = useState('')
  const [conditions, setConditions] = useState('')
  const [medications, setMedications] = useState('')
  const [emergencyContact, setEmergencyContact] = useState('')

  const [loadingProfile, setLoadingProfile] = useState(true)

  useEffect(() => {
    Promise.all([
      getAuthUser().then((res) => {
        setName(res.user.name || '')
        setEmail(res.user.email || '')
      }),
      getProfile().then((res) => {
        const p = res.profile as Record<string, any>
        if (p.phone) setPhone(p.phone)
        if (p.location) setLocation(p.location)
        if (p.age) setAge(String(p.age))
        if (p.gender) setGender(p.gender)
        if (p.heightCm) setHeight(String(p.heightCm))
        if (p.weightKg) setWeight(String(p.weightKg))
        if (p.bloodGroup) setBloodGroup(p.bloodGroup)
        if (p.allergies) setAllergies(p.allergies)
        if (p.conditions) setConditions(p.conditions)
        if (p.medications) setMedications(p.medications)
        if (p.emergencyContact) setEmergencyContact(p.emergencyContact)
      }),
    ]).catch(() => {}).finally(() => setLoadingProfile(false))
  }, [])

  const inputClass = 'w-full px-3 py-2 text-sm border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#073B4C]/20 focus:border-[#073B4C] bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100'
  const selectClass = inputClass

  const saveHealth = (field: string, value: string) => {
    const update: Record<string, any> = {}
    if (field === 'age') update.age = value ? Number(value) : undefined
    else if (field === 'gender') update.gender = value || undefined
    else if (field === 'heightCm') update.heightCm = value ? Number(value) : undefined
    else if (field === 'weightKg') update.weightKg = value ? Number(value) : undefined
    else if (field === 'bloodGroup') update.bloodGroup = value || undefined
    else if (field === 'allergies') update.allergies = value || undefined
    else if (field === 'conditions') update.conditions = value || undefined
    else if (field === 'medications') update.medications = value || undefined
    else if (field === 'emergencyContact') update.emergencyContact = value || undefined
    updateProfile(update).catch(() => {})
  }

  if (loadingProfile) {
    return (
      <div className="space-y-6 animate-pulse">
        <div>
          <div className="h-6 bg-gray-100 dark:bg-gray-800 rounded w-44 mb-2" />
          <div className="h-4 bg-gray-100 dark:bg-gray-800 rounded w-72" />
        </div>
        <div className="space-y-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="flex items-center justify-between py-3 border-b border-gray-100 dark:border-gray-800">
              <div className="h-4 bg-gray-100 dark:bg-gray-800 rounded w-28" />
              <div className="h-4 bg-gray-100 dark:bg-gray-800 rounded w-32" />
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-1">Personal information</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400">Manage your personal details and contact information.</p>
      </div>

      <EditableRow label="Full name" value={name} expanded={expandedRow === 'name'} onEdit={() => setExpandedRow('name')} onCancel={() => setExpandedRow(null)} onSave={() => setExpandedRow(null)}>
        <input type="text" value={name} onChange={(e) => setName(e.target.value)} className={inputClass} />
      </EditableRow>
      <EditableRow label="Email address" value={email} expanded={expandedRow === 'email'} onEdit={() => setExpandedRow('email')} onCancel={() => setExpandedRow(null)} onSave={() => setExpandedRow(null)}>
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className={inputClass} />
      </EditableRow>
      <EditableRow label="Phone number" value={phone} expanded={expandedRow === 'phone'} onEdit={() => setExpandedRow('phone')} onCancel={() => setExpandedRow(null)} onSave={() => setExpandedRow(null)}>
        <input type="tel" value={phone} onChange={(e) => setPhone(formatPhoneInput(e.target.value))} placeholder="e.g. 09063546819" className={inputClass} />
      </EditableRow>
      <EditableRow label="Location" value={location} expanded={expandedRow === 'location'} onEdit={() => setExpandedRow('location')} onCancel={() => setExpandedRow(null)} onSave={() => setExpandedRow(null)}>
        <input type="text" value={location} onChange={(e) => setLocation(e.target.value)} className={inputClass} />
      </EditableRow>

      <div className="pt-4 border-t border-gray-100 dark:border-gray-800">
        <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-1">Health information</h3>
        <p className="text-xs text-gray-500 dark:text-gray-400">Your medical profile used for triage assessments.</p>
      </div>

      <EditableRow label="Age" value={age} expanded={expandedRow === 'age'} onEdit={() => setExpandedRow('age')} onCancel={() => setExpandedRow(null)} onSave={() => { saveHealth('age', age); setExpandedRow(null) }}>
        <input type="number" value={age} onChange={(e) => setAge(e.target.value)} placeholder="e.g. 28" className={inputClass} />
      </EditableRow>
      <EditableRow label="Gender" value={gender} expanded={expandedRow === 'gender'} onEdit={() => setExpandedRow('gender')} onCancel={() => setExpandedRow(null)} onSave={() => { saveHealth('gender', gender); setExpandedRow(null) }}>
        <select value={gender} onChange={(e) => setGender(e.target.value)} className={selectClass}>
          <option value="">Select</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
          <option value="other">Other</option>
        </select>
      </EditableRow>
      <EditableRow label="Height (cm)" value={height} expanded={expandedRow === 'height'} onEdit={() => setExpandedRow('height')} onCancel={() => setExpandedRow(null)} onSave={() => { saveHealth('heightCm', height); setExpandedRow(null) }}>
        <input type="number" value={height} onChange={(e) => setHeight(e.target.value)} placeholder="e.g. 170" className={inputClass} />
      </EditableRow>
      <EditableRow label="Weight (kg)" value={weight} expanded={expandedRow === 'weight'} onEdit={() => setExpandedRow('weight')} onCancel={() => setExpandedRow(null)} onSave={() => { saveHealth('weightKg', weight); setExpandedRow(null) }}>
        <input type="number" value={weight} onChange={(e) => setWeight(e.target.value)} placeholder="e.g. 70" className={inputClass} />
      </EditableRow>
      <EditableRow label="Blood group" value={bloodGroup} expanded={expandedRow === 'bloodGroup'} onEdit={() => setExpandedRow('bloodGroup')} onCancel={() => setExpandedRow(null)} onSave={() => { saveHealth('bloodGroup', bloodGroup); setExpandedRow(null) }}>
        <select value={bloodGroup} onChange={(e) => setBloodGroup(e.target.value)} className={selectClass}>
          <option value="">Select</option>
          {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map((g) => <option key={g} value={g}>{g}</option>)}
        </select>
      </EditableRow>
      <EditableRow label="Allergies" value={allergies} expanded={expandedRow === 'allergies'} onEdit={() => setExpandedRow('allergies')} onCancel={() => setExpandedRow(null)} onSave={() => { saveHealth('allergies', allergies); setExpandedRow(null) }}>
        <input type="text" value={allergies} onChange={(e) => setAllergies(e.target.value)} placeholder="e.g. Penicillin" className={inputClass} />
      </EditableRow>
      <EditableRow label="Existing conditions" value={conditions} expanded={expandedRow === 'conditions'} onEdit={() => setExpandedRow('conditions')} onCancel={() => setExpandedRow(null)} onSave={() => { saveHealth('conditions', conditions); setExpandedRow(null) }}>
        <input type="text" value={conditions} onChange={(e) => setConditions(e.target.value)} placeholder="e.g. Asthma" className={inputClass} />
      </EditableRow>
      <EditableRow label="Medications" value={medications} expanded={expandedRow === 'medications'} onEdit={() => setExpandedRow('medications')} onCancel={() => setExpandedRow(null)} onSave={() => { saveHealth('medications', medications); setExpandedRow(null) }}>
        <input type="text" value={medications} onChange={(e) => setMedications(e.target.value)} placeholder="e.g. Ibuprofen" className={inputClass} />
      </EditableRow>
      <EditableRow label="Emergency contact" value={emergencyContact} expanded={expandedRow === 'emergencyContact'} onEdit={() => setExpandedRow('emergencyContact')} onCancel={() => setExpandedRow(null)} onSave={() => { saveHealth('emergencyContact', emergencyContact); setExpandedRow(null) }}>
        <input type="text" value={emergencyContact} onChange={(e) => setEmergencyContact(e.target.value)} placeholder="Name and phone number" className={inputClass} />
      </EditableRow>
    </div>
  )
}

function SecuritySection() {
  const [expandedRow, setExpandedRow] = useState<string | null>(null)
  const [hasPassword, setHasPassword] = useState(true)
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [passwordError, setPasswordError] = useState('')
  const [passwordSuccess, setPasswordSuccess] = useState('')
  const [passwordLoading, setPasswordLoading] = useState(false)
  const inputClass = 'w-full px-3 py-2 text-sm border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#073B4C]/20 focus:border-[#073B4C] bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100'

  useEffect(() => {
    getAuthUser().then((res) => {
      // If user has googleId and no password set, they're a Google-only user
      if (res.user.googleId) setHasPassword(false)
    }).catch(() => {})
  }, [])

  async function handleSavePassword() {
    setPasswordError('')
    setPasswordSuccess('')
    if (!newPassword) { setPasswordError('Enter a new password'); return }
    setPasswordLoading(true)
    try {
      if (hasPassword) {
        await changeUserPassword(currentPassword, newPassword)
      } else {
        await setUserPassword(newPassword)
      }
      setPasswordSuccess('Password updated successfully')
      setCurrentPassword('')
      setNewPassword('')
      setHasPassword(true)
      setTimeout(() => setExpandedRow(null), 1500)
    } catch (err: any) {
      setPasswordError(err?.message || 'Failed to update password')
    } finally {
      setPasswordLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-1">Login & security</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400">Manage your password and connected accounts.</p>
      </div>

      <div>
        <p className="text-xs font-medium text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-2">Password</p>
        {hasPassword ? (
          <EditableRow label="Password" value="Last changed recently" expanded={expandedRow === 'password'} onEdit={() => setExpandedRow('password')} onCancel={() => { setExpandedRow(null); setCurrentPassword(''); setNewPassword(''); setPasswordError(''); setPasswordSuccess('') }} onSave={handleSavePassword}>
            <div className="space-y-3">
              <input type="password" placeholder="Current password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} className={inputClass} />
              <input type="password" placeholder="New password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className={inputClass} />
              {passwordError && <p className="text-xs text-red-600">{passwordError}</p>}
              {passwordSuccess && <p className="text-xs text-green-600">{passwordSuccess}</p>}
            </div>
          </EditableRow>
        ) : (
          <div className="py-4 border-b border-gray-100 dark:border-gray-800">
            <div className="flex items-center justify-between mb-3">
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-gray-100">Password</p>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">No password set (Google account)</p>
              </div>
            </div>
            {expandedRow === 'set-password' ? (
              <div className="space-y-3">
                <input type="password" placeholder="New password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className={inputClass} />
                {passwordError && <p className="text-xs text-red-600">{passwordError}</p>}
                {passwordSuccess && <p className="text-xs text-green-600">{passwordSuccess}</p>}
                <div className="flex gap-2">
                  <button onClick={handleSavePassword} disabled={passwordLoading} className="px-4 py-2 text-sm font-medium text-white bg-[#073B4C] dark:bg-teal rounded-lg hover:bg-[#0A202A] dark:hover:bg-teal/80 transition-colors disabled:opacity-50">
                    {passwordLoading ? 'Saving...' : 'Save'}
                  </button>
                  <button onClick={() => { setExpandedRow(null); setNewPassword(''); setPasswordError(''); setPasswordSuccess('') }} className="px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors">
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <button onClick={() => { setExpandedRow('set-password'); setNewPassword(''); setPasswordError(''); setPasswordSuccess('') }} className="px-4 py-2 text-sm font-medium text-[#073B4C] dark:text-teal border border-[#073B4C]/30 dark:border-teal/30 rounded-lg hover:bg-[#073B4C]/5 dark:hover:bg-teal/10 transition-colors">
                Set password
              </button>
            )}
          </div>
        )}
      </div>

      <div>
        <p className="text-xs font-medium text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-2">Danger zone</p>
        <div className="p-4 border border-red-200 dark:border-red-900/50 rounded-lg bg-red-50 dark:bg-red-950/30">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5 shrink-0" />
            <div>
              <p className="text-sm font-medium text-gray-900 dark:text-gray-100">Deactivate account</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">This action cannot be undone. All your data will be permanently deleted.</p>
              <button className="mt-3 px-4 py-2 text-sm font-medium text-red-600 border border-red-300 dark:border-red-800 rounded-lg hover:bg-red-100 dark:hover:bg-red-950 transition-colors">
                Deactivate
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function PrivacySection() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-1">Privacy</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400">Control your privacy settings and data sharing preferences.</p>
      </div>

      <div className="py-4 border-b border-gray-100 dark:border-gray-800">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-900 dark:text-gray-100">Download your data</p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Request a copy of all your personal data</p>
          </div>
          <button
            onClick={() => exportUserData().catch(() => {})}
            className="px-4 py-2 text-sm font-medium text-[#073B4C] dark:text-teal border border-[#073B4C]/30 dark:border-teal/30 rounded-lg hover:bg-[#073B4C]/5 dark:hover:bg-teal/10 transition-colors"
          >
            Download
          </button>
        </div>
      </div>
    </div>
  )
}

function NotificationsSection() {
  const [emailNotif, setEmailNotif] = useState(true)
  const [pushNotif, setPushNotif] = useState(true)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getNotificationPrefs()
      .then(({ preferences }) => {
        setEmailNotif(preferences.emailNotifications ?? true)
        setPushNotif(preferences.pushNotifications ?? true)
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const updatePref = (key: string, value: boolean) => {
    const updates: Record<string, boolean> = {}
    updates[key] = value
    if (key === 'pushNotifications' && value && 'Notification' in window) {
      Notification.requestPermission().then((perm) => {
        if (perm !== 'granted') {
          setPushNotif(false)
          return
        }
        updateNotificationPrefs(updates).catch(() => {})
      })
      return
    }
    updateNotificationPrefs(updates).catch(() => {})
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-1">Notifications</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400">Choose how and when you want to be notified.</p>
      </div>

      <div>
        <p className="text-xs font-medium text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-2">Channels</p>
        <ToggleRow label="Email notifications" description="Receive assessment results via email" enabled={emailNotif} onChange={(v) => { setEmailNotif(v); updatePref('emailNotifications', v) }} />
        <ToggleRow label="Push notifications" description="Receive push notifications in your browser" enabled={pushNotif} onChange={(v) => { setPushNotif(v); updatePref('pushNotifications', v) }} />
      </div>
    </div>
  )
}

function AppearanceSection() {
  const { theme, setTheme } = useTheme()

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-1">Appearance</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400">Customize the look and feel of MedBot.</p>
      </div>

      <div>
        <p className="text-xs font-medium text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-3">Theme</p>
        <div className="grid grid-cols-3 gap-3">
          {(['light', 'dark', 'system'] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTheme(t)}
              className={`relative p-4 rounded-xl border-2 transition-colors text-center ${
                theme === t
                  ? 'border-[#073B4C] bg-[#073B4C]/5 dark:border-teal dark:bg-teal/10'
                  : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
              }`}
            >
              {theme === t && (
                <div className="absolute top-2 right-2 w-5 h-5 bg-[#073B4C] dark:bg-teal rounded-full flex items-center justify-center">
                  <Check className="w-3 h-3 text-white" />
                </div>
              )}
              <div className={`w-full h-16 rounded-lg mb-2 ${
                t === 'light' ? 'bg-white border border-gray-200' :
                t === 'dark' ? 'bg-[#101223]' :
                'bg-gradient-to-r from-white to-[#101223]'
              }`} />
              <span className="text-sm font-medium text-gray-900 dark:text-gray-100 capitalize">{t}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

const SECTIONS: Record<string, React.ComponentType> = {
  profile: ProfileSection,
  security: SecuritySection,
  privacy: PrivacySection,
  notifications: NotificationsSection,
  appearance: AppearanceSection,
}

export const CustomerSettings = () => {
  const [activeNav, setActiveNav] = useState('profile')
  const [mobileView, setMobileView] = useState<'nav' | 'detail'>('nav')
  const navigate = useNavigate()

  const selectNav = (id: string) => {
    setActiveNav(id)
    setMobileView('detail')
  }

  const ActiveSection = SECTIONS[activeNav]

  const sidebar = (
    <div className="py-4 px-3">
      <button
        onClick={() => navigate('/dashboard')}
        className="hidden md:flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 mb-4 px-3 transition-colors"
      >
        <ChevronRight className="w-4 h-4 rotate-180" />
        Back to Dashboard
      </button>
      <p className="px-3 mb-3 text-xs font-medium text-gray-400 dark:text-gray-500 uppercase tracking-wider">Settings</p>
      <nav className="space-y-0.5">
        {NAV_ITEMS.map((item) => {
          const isActive = activeNav === item.id
          return (
            <button
              key={item.id}
              onClick={() => selectNav(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                isActive
                  ? 'bg-[#073B4C]/5 dark:bg-teal/10 text-[#073B4C] dark:text-teal font-medium'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
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
    <div className="flex flex-col h-full bg-white dark:bg-[#0a0c10]">
      {/* Mobile nav view */}
      {mobileView === 'nav' && (
        <>
          <div className="h-14 flex items-center px-4 border-b border-gray-100 dark:border-gray-800 shrink-0 md:hidden">
            <button
              onClick={() => navigate('/dashboard')}
              className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
            >
              <ChevronRight className="w-4 h-4 rotate-180" />
              Back
            </button>
            <h1 className="text-sm font-semibold text-gray-900 dark:text-gray-100 ml-3">Settings</h1>
          </div>
          <div className="flex-1 min-h-0 overflow-y-auto md:hidden">
            {sidebar}
          </div>
        </>
      )}

      {/* Mobile detail view */}
      {mobileView === 'detail' && (
        <>
          <div className="h-14 flex items-center gap-2 px-3 sm:px-6 border-b border-gray-100 dark:border-gray-800 shrink-0 md:hidden">
            <BackButton label="Back to Settings" onClick={() => setMobileView('nav')} />
          </div>
          <div className="flex-1 min-h-0 overflow-y-auto p-4 md:hidden">
            {ActiveSection && <ActiveSection />}
          </div>
        </>
      )}

      {/* Desktop layout: sidebar + content side by side */}
      <div className="hidden md:flex h-full">
        <div className="w-64 shrink-0 border-r border-gray-100 dark:border-gray-800">
          {sidebar}
        </div>
        <div className="flex-1 min-h-0 overflow-y-auto p-6">
          {ActiveSection && <ActiveSection />}
        </div>
      </div>
    </div>
  )
}
