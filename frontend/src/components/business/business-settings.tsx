import { useState } from 'react'
import {
  Building2,
  Lock,
  Shield,
  Bell,
  Users,
  LogOut,
  ChevronLeft,
  Globe,
  Phone,
  Mail,
  MapPin,
  AlertTriangle,
} from 'lucide-react'

type NavItem = {
  id: string
  label: string
  icon: React.ElementType
}

const NAV_ITEMS: NavItem[] = [
  { id: 'profile', label: 'Hospital profile', icon: Building2 },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'security', label: 'Security', icon: Shield },
  { id: 'staff', label: 'Staff & roles', icon: Users },
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
      <div className="py-4 border-b border-gray-100 last:border-0 space-y-3">
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
  const [hospitalName, setHospitalName] = useState('Lagos University Teaching Hospital')
  const [address, setAddress] = useState('1-25 Idi-Araba, Mushin, Lagos')
  const [phone, setPhone] = useState('+234 1 234 5678')
  const [email, setEmail] = useState('info@luth.gov.ng')
  const [website, setWebsite] = useState('www.luth.gov.ng')

  const inputClass = 'w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#073B4C]/20 focus:border-[#073B4C]'

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-1">Hospital profile</h2>
        <p className="text-sm text-gray-500">Manage your hospital information and contact details.</p>
      </div>

      <div className="space-y-0">
        <EditableRow label="Hospital name" value={hospitalName} expanded={expandedRow === 'name'} onEdit={() => setExpandedRow('name')} onCancel={() => setExpandedRow(null)} onSave={() => setExpandedRow(null)}>
          <input type="text" value={hospitalName} onChange={(e) => setHospitalName(e.target.value)} className={inputClass} />
        </EditableRow>
        <EditableRow label="Address" value={address} expanded={expandedRow === 'address'} onEdit={() => setExpandedRow('address')} onCancel={() => setExpandedRow(null)} onSave={() => setExpandedRow(null)}>
          <input type="text" value={address} onChange={(e) => setAddress(e.target.value)} className={inputClass} />
        </EditableRow>
        <EditableRow label="Phone number" value={phone} expanded={expandedRow === 'phone'} onEdit={() => setExpandedRow('phone')} onCancel={() => setExpandedRow(null)} onSave={() => setExpandedRow(null)}>
          <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} className={inputClass} />
        </EditableRow>
        <EditableRow label="Email" value={email} expanded={expandedRow === 'email'} onEdit={() => setExpandedRow('email')} onCancel={() => setExpandedRow(null)} onSave={() => setExpandedRow(null)}>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className={inputClass} />
        </EditableRow>
        <EditableRow label="Website" value={website} expanded={expandedRow === 'website'} onEdit={() => setExpandedRow('website')} onCancel={() => setExpandedRow(null)} onSave={() => setExpandedRow(null)}>
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
        <h2 className="text-lg font-semibold text-gray-900 mb-1">Notifications</h2>
        <p className="text-sm text-gray-500">Configure how your hospital receives alerts and updates.</p>
      </div>

      <div>
        <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-2">Channels</p>
        <ToggleRow label="Email notifications" description="Receive notifications via email" enabled={emailNotif} onChange={setEmailNotif} />
        <ToggleRow label="SMS notifications" description="Receive text message alerts" enabled={smsNotif} onChange={setSmsNotif} />
        <ToggleRow label="Push notifications" description="Receive push notifications in your browser" enabled={pushNotif} onChange={setPushNotif} />
      </div>

      <div>
        <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-2">Types</p>
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
  const inputClass = 'w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#073B4C]/20 focus:border-[#073B4C]'

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-1">Security</h2>
        <p className="text-sm text-gray-500">Manage passwords, two-factor authentication, and sessions.</p>
      </div>

      <div>
        <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-2">Password</p>
        <EditableRow label="Password" value="Last changed 2 months ago" expanded={expandedRow === 'password'} onEdit={() => setExpandedRow('password')} onCancel={() => setExpandedRow(null)} onSave={() => setExpandedRow(null)}>
          <input type="password" placeholder="New password" className={inputClass} />
        </EditableRow>
      </div>

      <div>
        <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-2">Two-factor authentication</p>
        <ToggleRow label="Enable 2FA" description="Add an extra layer of security to your account" enabled={twoFactor} onChange={setTwoFactor} />
      </div>

      <div>
        <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-2">Sessions</p>
        <div className="flex items-center justify-between py-4">
          <div>
            <p className="text-sm font-medium text-gray-900">Active sessions</p>
            <p className="text-xs text-gray-500 mt-0.5">2 devices currently logged in</p>
          </div>
          <button className="text-sm text-red-600 hover:underline">Sign out all</button>
        </div>
      </div>
    </div>
  )
}

function StaffSection() {
  const [expandedRow, setExpandedRow] = useState<string | null>(null)
  const [requireApproval, setRequireApproval] = useState(true)
  const [allowExport, setAllowExport] = useState(false)

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-1">Staff & roles</h2>
        <p className="text-sm text-gray-500">Manage staff access permissions and roles.</p>
      </div>

      <div>
        <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-2">Permissions</p>
        <ToggleRow label="Require admin approval" description="New staff accounts need admin approval before activation" enabled={requireApproval} onChange={setRequireApproval} />
        <ToggleRow label="Allow data export" description="Let staff members export patient data" enabled={allowExport} onChange={setAllowExport} />
      </div>

      <div>
        <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-2">Roles</p>
        <div className="space-y-2">
          {[
            { role: 'Admin', count: 2, color: 'bg-[#073B4C]/10 text-[#073B4C]' },
            { role: 'Doctor', count: 8, color: 'bg-[#00A8A8]/10 text-[#00A8A8]' },
            { role: 'Nurse', count: 15, color: 'bg-purple-50 text-purple-600' },
            { role: 'Receptionist', count: 4, color: 'bg-green-50 text-green-600' },
          ].map((r) => (
            <div key={r.role} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
              <div className="flex items-center gap-3">
                <span className={`px-2.5 py-1 rounded-md text-xs font-medium ${r.color}`}>{r.role}</span>
                <span className="text-sm text-gray-500">{r.count} staff</span>
              </div>
              <button className="text-sm text-[#073B4C] hover:underline">Manage</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function LogoutSection() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-1">Logout</h2>
        <p className="text-sm text-gray-500">Sign out of your hospital dashboard.</p>
      </div>

      <div className="p-4 border border-red-200 rounded-lg bg-red-50">
        <div className="flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5 shrink-0" />
          <div>
            <p className="text-sm font-medium text-gray-900">Sign out</p>
            <p className="text-xs text-gray-500 mt-0.5">You will be redirected to the login page. Any unsaved changes will be lost.</p>
            <button className="mt-3 px-4 py-2 text-sm font-medium text-red-600 border border-red-300 rounded-lg hover:bg-red-100 transition-colors">
              Sign out
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

const SECTIONS: Record<string, React.ComponentType> = {
  profile: ProfileSection,
  notifications: NotificationsSection,
  security: SecuritySection,
  staff: StaffSection,
  logout: LogoutSection,
}

const SECTION_TITLES: Record<string, string> = Object.fromEntries(
  NAV_ITEMS.map(item => [item.id, item.label])
)

export const BusinessSettings = () => {
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
          const isLogout = item.id === 'logout'
          return (
            <button
              key={item.id}
              onClick={() => selectNav(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                isLogout
                  ? isActive
                    ? 'bg-red-50 text-red-600 font-medium'
                    : 'text-red-500 hover:bg-red-50'
                  : isActive
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

      {/* Desktop layout: sidebar + content */}
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
