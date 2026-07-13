import { useState } from 'react'
import {
  User,
  Lock,
  Shield,
  Bell,
  Palette,
  ChevronRight,
  ChevronLeft,
  Check,
  Camera,
  AlertTriangle,
  Globe,
} from 'lucide-react'

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
      <div className="py-4 border-b border-gray-100 space-y-3">
        <p className="text-sm font-medium text-gray-900">{label}</p>
        {children}
        <div className="flex gap-2">
          <button onClick={onSave} className="px-4 py-2 text-sm font-medium text-white bg-[#073B4C] rounded-lg hover:bg-[#0A202A] transition-colors">
            Save
          </button>
          <button onClick={onCancel} className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">
            Cancel
          </button>
        </div>
      </div>
    )
  }
  return (
    <div className="flex items-center justify-between py-4 border-b border-gray-100 last:border-0">
      <div className="min-w-0">
        <p className="text-sm font-medium text-gray-900">{label}</p>
        <p className="text-sm text-gray-500 mt-0.5 truncate">{value}</p>
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
    <div className="flex items-center justify-between py-4 border-b border-gray-100 last:border-0">
      <div className="min-w-0 pr-4">
        <p className="text-sm font-medium text-gray-900">{label}</p>
        {description && <p className="text-xs text-gray-500 mt-0.5">{description}</p>}
      </div>
      <button
        onClick={() => onChange(!enabled)}
        className={`relative inline-flex h-6 w-11 shrink-0 rounded-full transition-colors ${enabled ? 'bg-[#073B4C]' : 'bg-gray-200'}`}
      >
        <span className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-sm transition-transform mt-0.5 ${enabled ? 'translate-x-5.5 ml-px' : 'translate-x-0.5'}`} />
      </button>
    </div>
  )
}

function ProfileSection() {
  const [expandedRow, setExpandedRow] = useState<string | null>(null)
  const [name, setName] = useState('Aisha Bello')
  const [email, setEmail] = useState('aisha@example.com')
  const [phone, setPhone] = useState('+234 801 234 5678')
  const [location, setLocation] = useState('Lagos, Nigeria')

  const inputClass = 'w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#073B4C]/20 focus:border-[#073B4C]'

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-1">Personal information</h2>
        <p className="text-sm text-gray-500">Manage your personal details and contact information.</p>
      </div>

      {/* Avatar */}
      <div className="flex items-center gap-4 py-4 border-b border-gray-100">
        <div className="relative">
          <div className="w-16 h-16 rounded-full bg-[#073B4C]/10 flex items-center justify-center">
            <User className="w-7 h-7 text-[#073B4C]" />
          </div>
          <button className="absolute -bottom-1 -right-1 w-7 h-7 bg-white border border-gray-200 rounded-full flex items-center justify-center hover:bg-gray-50 transition-colors">
            <Camera className="w-3.5 h-3.5 text-gray-600" />
          </button>
        </div>
        <div>
          <p className="text-sm font-medium text-gray-900">Profile photo</p>
          <p className="text-xs text-gray-500">JPG, PNG or GIF. Max 2MB.</p>
        </div>
      </div>

      <EditableRow label="Full name" value={name} expanded={expandedRow === 'name'} onEdit={() => setExpandedRow('name')} onCancel={() => setExpandedRow(null)} onSave={() => setExpandedRow(null)}>
        <input type="text" value={name} onChange={(e) => setName(e.target.value)} className={inputClass} />
      </EditableRow>
      <EditableRow label="Email address" value={email} expanded={expandedRow === 'email'} onEdit={() => setExpandedRow('email')} onCancel={() => setExpandedRow(null)} onSave={() => setExpandedRow(null)}>
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className={inputClass} />
      </EditableRow>
      <EditableRow label="Phone number" value={phone} expanded={expandedRow === 'phone'} onEdit={() => setExpandedRow('phone')} onCancel={() => setExpandedRow(null)} onSave={() => setExpandedRow(null)}>
        <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} className={inputClass} />
      </EditableRow>
      <EditableRow label="Location" value={location} expanded={expandedRow === 'location'} onEdit={() => setExpandedRow('location')} onCancel={() => setExpandedRow(null)} onSave={() => setExpandedRow(null)}>
        <input type="text" value={location} onChange={(e) => setLocation(e.target.value)} className={inputClass} />
      </EditableRow>
    </div>
  )
}

function SecuritySection() {
  const [expandedRow, setExpandedRow] = useState<string | null>(null)
  const inputClass = 'w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#073B4C]/20 focus:border-[#073B4C]'

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-1">Login & security</h2>
        <p className="text-sm text-gray-500">Manage your password and connected accounts.</p>
      </div>

      <div>
        <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-2">Password</p>
        <EditableRow label="Password" value="Last changed 3 months ago" expanded={expandedRow === 'password'} onEdit={() => setExpandedRow('password')} onCancel={() => setExpandedRow(null)} onSave={() => setExpandedRow(null)}>
          <input type="password" placeholder="New password" className={inputClass} />
        </EditableRow>
      </div>

      <div>
        <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-2">Connected accounts</p>
        <div className="flex items-center justify-between py-4 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center">
              <Globe className="w-4 h-4 text-gray-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">Google</p>
              <p className="text-xs text-gray-500">Connected</p>
            </div>
          </div>
          <button className="text-sm text-red-600 hover:underline">Disconnect</button>
        </div>
      </div>

      <div>
        <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-2">Danger zone</p>
        <div className="p-4 border border-red-200 rounded-lg bg-red-50">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5 shrink-0" />
            <div>
              <p className="text-sm font-medium text-gray-900">Deactivate account</p>
              <p className="text-xs text-gray-500 mt-0.5">This action cannot be undone. All your data will be permanently deleted.</p>
              <button className="mt-3 px-4 py-2 text-sm font-medium text-red-600 border border-red-300 rounded-lg hover:bg-red-100 transition-colors">
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
  const [readReceipts, setReadReceipts] = useState(true)
  const [shareData, setShareData] = useState(false)
  const [aiTraining, setAiTraining] = useState(false)

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-1">Privacy</h2>
        <p className="text-sm text-gray-500">Control your privacy settings and data sharing preferences.</p>
      </div>

      <div>
        <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-2">Messaging</p>
        <ToggleRow label="Read receipts" description="Let others know when you've read their messages" enabled={readReceipts} onChange={setReadReceipts} />
      </div>

      <div>
        <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-2">Data</p>
        <ToggleRow label="Share usage data" description="Help improve MedBot by sharing anonymous usage data" enabled={shareData} onChange={setShareData} />
        <ToggleRow label="AI training" description="Allow your data to be used for AI model improvement" enabled={aiTraining} onChange={setAiTraining} />
      </div>

      <div className="py-4 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-900">Download your data</p>
            <p className="text-xs text-gray-500 mt-0.5">Request a copy of all your personal data</p>
          </div>
          <button className="px-4 py-2 text-sm font-medium text-[#073B4C] border border-[#073B4C]/30 rounded-lg hover:bg-[#073B4C]/5 transition-colors">
            Request
          </button>
        </div>
      </div>
    </div>
  )
}

function NotificationsSection() {
  const [emailNotif, setEmailNotif] = useState(true)
  const [pushNotif, setPushNotif] = useState(true)
  const [assessmentAlerts, setAssessmentAlerts] = useState(true)
  const [weeklyDigest, setWeeklyDigest] = useState(false)

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-1">Notifications</h2>
        <p className="text-sm text-gray-500">Choose how and when you want to be notified.</p>
      </div>

      <div>
        <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-2">Channels</p>
        <ToggleRow label="Email notifications" description="Receive notifications via email" enabled={emailNotif} onChange={setEmailNotif} />
        <ToggleRow label="Push notifications" description="Receive push notifications in your browser" enabled={pushNotif} onChange={setPushNotif} />
      </div>

      <div>
        <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-2">Types</p>
        <ToggleRow label="Assessment alerts" description="Get notified when new assessments are completed" enabled={assessmentAlerts} onChange={setAssessmentAlerts} />
        <ToggleRow label="Weekly digest" description="Receive a weekly summary of activity" enabled={weeklyDigest} onChange={setWeeklyDigest} />
      </div>
    </div>
  )
}

function AppearanceSection() {
  const [theme, setTheme] = useState<'light' | 'dark' | 'system'>('light')

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-1">Appearance</h2>
        <p className="text-sm text-gray-500">Customize the look and feel of MedBot.</p>
      </div>

      <div>
        <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-3">Theme</p>
        <div className="grid grid-cols-3 gap-3">
          {(['light', 'dark', 'system'] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTheme(t)}
              className={`relative p-4 rounded-xl border-2 transition-colors text-center ${
                theme === t
                  ? 'border-[#073B4C] bg-[#073B4C]/5'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              {theme === t && (
                <div className="absolute top-2 right-2 w-5 h-5 bg-[#073B4C] rounded-full flex items-center justify-center">
                  <Check className="w-3 h-3 text-white" />
                </div>
              )}
              <div className={`w-full h-16 rounded-lg mb-2 ${
                t === 'light' ? 'bg-white border border-gray-200' :
                t === 'dark' ? 'bg-[#101223]' :
                'bg-gradient-to-r from-white to-[#101223]'
              }`} />
              <span className="text-sm font-medium text-gray-900 capitalize">{t}</span>
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

const SECTION_TITLES: Record<string, string> = Object.fromEntries(
  NAV_ITEMS.map(item => [item.id, item.label])
)

export const CustomerSettings = () => {
  const [activeNav, setActiveNav] = useState('profile')
  const [mobileView, setMobileView] = useState<'nav' | 'detail'>('nav')

  const selectNav = (id: string) => {
    setActiveNav(id)
    setMobileView('detail')
  }

  const ActiveSection = SECTIONS[activeNav]

  const sidebar = (
    <div className="py-4 px-3">
      <p className="px-3 mb-3 text-xs font-medium text-gray-400 uppercase tracking-wider">Settings</p>
      <nav className="space-y-0.5">
        {NAV_ITEMS.map((item) => {
          const isActive = activeNav === item.id
          return (
            <button
              key={item.id}
              onClick={() => selectNav(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                isActive
                  ? 'bg-[#073B4C]/5 text-[#073B4C] font-medium'
                  : 'text-gray-600 hover:bg-gray-100'
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
    <div className="flex flex-col h-full bg-white">
      {/* Mobile nav view */}
      {mobileView === 'nav' && (
        <>
          <div className="h-14 flex items-center px-4 border-b border-gray-100 shrink-0 md:hidden">
            <h1 className="text-sm font-semibold text-gray-900">Settings</h1>
          </div>
          <div className="flex-1 min-h-0 overflow-y-auto md:hidden">
            {sidebar}
          </div>
        </>
      )}

      {/* Mobile detail view */}
      {mobileView === 'detail' && (
        <>
          <div className="h-14 flex items-center gap-2 px-4 border-b border-gray-100 shrink-0 md:hidden">
            <button
              onClick={() => setMobileView('nav')}
              className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <h1 className="text-sm font-semibold text-gray-900 truncate">{SECTION_TITLES[activeNav]}</h1>
          </div>
          <div className="flex-1 min-h-0 overflow-y-auto p-4 md:hidden">
            {ActiveSection && <ActiveSection />}
          </div>
        </>
      )}

      {/* Desktop layout: sidebar + content side by side */}
      <div className="hidden md:flex h-full">
        <div className="w-64 shrink-0 border-r border-gray-100">
          {sidebar}
        </div>
        <div className="flex-1 min-h-0 overflow-y-auto p-6">
          {ActiveSection && <ActiveSection />}
        </div>
      </div>
    </div>
  )
}
