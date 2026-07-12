import { useState } from 'react'
import {
  Eye,
  EyeOff,
  ChevronDown,
  ChevronLeft,
  BarChart3,
  Users,
  FileBarChart,
  ShieldCheck,
  Activity,
  AlertTriangle,
  Share2,
  Gauge,
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface BusinessSignupProps {
  onBack?: () => void
  onLogin?: () => void
  onSignupSuccess?: () => void
}

const orgTypes = ['Hospital', 'Clinic', 'HMO', 'NGO', 'Corporate']

// Nigeria first since this is MedBot's primary market, then nearby
// African markets, then the rest alphabetically.
const countries = [
  'Nigeria',
  'Ghana',
  'Kenya',
  'South Africa',
  'Canada',
  'Germany',
  'India',
  'United Kingdom',
  'United States',
]

const orgSizes = ['1-10', '11-50', '51-200', '201-500', '500+']

const features = [
  { icon: BarChart3, label: 'Advanced\nAnalytics' },
  { icon: Users, label: 'Patient\nInsights' },
  { icon: FileBarChart, label: 'Automated\nReports' },
  { icon: ShieldCheck, label: 'Secure &\nCompliant' },
]

const STAT_TILES = [
  { icon: Activity, label: 'Total', value: '2,450', color: 'text-[#073B4C]', bg: 'bg-[#073B4C]/5' },
  { icon: AlertTriangle, label: 'Urgent', value: '320', color: 'text-red-600', bg: 'bg-red-50' },
  { icon: Share2, label: 'Referrals', value: '1,120', color: 'text-purple-600', bg: 'bg-purple-50' },
  { icon: Gauge, label: 'Active', value: '85%', color: 'text-teal-600', bg: 'bg-teal-50' },
]

const CHART_BARS = [40, 60, 30, 70, 50, 80, 45, 65, 55, 75, 40, 60]

export const BusinessSignup = ({ onBack, onLogin, onSignupSuccess }: BusinessSignupProps) => {
  const [form, setForm] = useState({
    orgName: '',
    orgType: '',
    country: '',
    email: '',
    phone: '',
    orgSize: '',
    password: '',
    confirmPassword: '',
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [openDropdown, setOpenDropdown] = useState<string | null>(null)

  const handleChange = (field: string, value: string) => {
    setForm({ ...form, [field]: value })
    setOpenDropdown(null)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSignupSuccess?.()
  }

  return (
    <div className="min-h-screen bg-[#EFF6FF] flex items-center justify-center p-4">
      <div className="w-full max-w-5xl bg-white rounded-2xl shadow-xl overflow-hidden flex flex-col lg:flex-row">
        {/* Left Panel */}
        <div className="lg:w-[45%] bg-[#EFF6FF] p-6 sm:p-8 lg:p-10 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-8">
              <img src="/assets/Logoico.png" alt="MedBot" className="h-8 w-auto" />
              <div>
                <p className="font-bold text-gray-900 text-sm">MedBot</p>
                <p className="text-xs text-gray-500">For Healthcare Partners</p>
              </div>
            </div>

            <span className="inline-flex px-3 py-1 text-[10px] font-bold uppercase tracking-wider bg-[#073B4C] text-white rounded-full mb-4">
              B2B Partner Portal
            </span>

            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3 font-display">
              Join MedBot Partner Network
            </h1>
            <p className="text-sm text-gray-500 mb-6 leading-relaxed">
              Create your organization account to access powerful analytics, patient insights, and symptom trend reports.
            </p>

            {/* Stats Card */}
            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 mb-6">
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-semibold text-gray-900">Live Overview</span>
                <span className="flex items-center gap-1.5 text-[10px] font-medium text-teal-600 bg-teal-50 px-2 py-0.5 rounded-full">
                  <span className="w-1.5 h-1.5 rounded-full bg-teal-500 animate-pulse" />
                  This month
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 mb-4">
                {STAT_TILES.map((tile) => (
                  <div key={tile.label} className={`rounded-lg p-2.5 ${tile.bg}`}>
                    <div className="flex items-center gap-1.5 mb-1">
                      <tile.icon className={`w-3 h-3 ${tile.color}`} strokeWidth={2} />
                      <p className="text-[9px] font-medium text-gray-500 uppercase tracking-wide">{tile.label}</p>
                    </div>
                    <p className={`text-base font-bold ${tile.color}`}>{tile.value}</p>
                  </div>
                ))}
              </div>

              <p className="text-[10px] font-medium text-gray-400 uppercase tracking-wide mb-2">
                Weekly assessment volume
              </p>
              <div className="flex items-end gap-1 h-16 border-b border-gray-100 pb-0.5">
                {CHART_BARS.map((h, i) => (
                  <div
                    key={i}
                    className={cn(
                      'flex-1 rounded-t-sm transition-all',
                      i % 3 === 0 ? 'bg-[#073B4C]' : 'bg-[#073B4C]/25'
                    )}
                    style={{ height: `${h}%` }}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Features */}
          <div className="grid grid-cols-4 gap-2 mb-6">
            {features.map((f) => (
              <div key={f.label} className="text-center">
                <div className="w-10 h-10 bg-white rounded-xl shadow-sm flex items-center justify-center mx-auto mb-1.5">
                  <f.icon className="w-4.5 h-4.5 text-[#073B4C]" strokeWidth={1.75} />
                </div>
                <p className="text-[10px] text-gray-600 whitespace-pre-line leading-tight">{f.label}</p>
              </div>
            ))}
          </div>

          <p className="text-[10px] text-gray-400 leading-relaxed">
            Trusted by hospitals, clinics, HMOs, NGOs, corporate organizations and more. Join a community of over 500+ global healthcare providers.
          </p>
        </div>

        {/* Right Panel - Form */}
        <div className="lg:w-[55%] p-6 sm:p-8 lg:p-10">
          <button
            onClick={onBack}
            className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 mb-6 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            Back to Home
          </button>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-1 font-display">
            Create Your Organization Account
          </h2>
          <p className="text-sm text-gray-500 mb-6">Fill in your organization details to get started.</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Organization Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Organization Name</label>
              <input
                type="text"
                value={form.orgName}
                onChange={(e) => handleChange('orgName', e.target.value)}
                placeholder="Enter organization name"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#073B4C]/30"
              />
            </div>

            {/* Org Type & Country */}
            <div className="grid grid-cols-2 gap-3">
              <div className="relative">
                <label className="block text-sm font-medium text-gray-700 mb-1">Organization Type</label>
                <button
                  type="button"
                  onClick={() => setOpenDropdown(openDropdown === 'orgType' ? null : 'orgType')}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm text-left flex items-center justify-between focus:outline-none focus:ring-2 focus:ring-[#073B4C]/30"
                >
                  <span className={form.orgType ? 'text-gray-900' : 'text-gray-400'}>
                    {form.orgType || 'Select type'}
                  </span>
                  <ChevronDown className="w-4 h-4 text-gray-400" />
                </button>
                {openDropdown === 'orgType' && (
                  <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg">
                    {orgTypes.map((t) => (
                      <button
                        key={t}
                        type="button"
                        onClick={() => handleChange('orgType', t)}
                        className="w-full px-4 py-2 text-sm text-left hover:bg-gray-50"
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div className="relative">
                <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
                <button
                  type="button"
                  onClick={() => setOpenDropdown(openDropdown === 'country' ? null : 'country')}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm text-left flex items-center justify-between focus:outline-none focus:ring-2 focus:ring-[#073B4C]/30"
                >
                  <span className={form.country ? 'text-gray-900' : 'text-gray-400'}>
                    {form.country || 'Select country'}
                  </span>
                  <ChevronDown className="w-4 h-4 text-gray-400" />
                </button>
                {openDropdown === 'country' && (
                  <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-56 overflow-y-auto">
                    {countries.map((c) => (
                      <button
                        key={c}
                        type="button"
                        onClick={() => handleChange('country', c)}
                        className={`w-full px-4 py-2 text-sm text-left hover:bg-gray-50 ${
                          c === 'Nigeria' ? 'font-semibold text-[#073B4C]' : ''
                        }`}
                      >
                        {c}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email Address (Work)</label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => handleChange('email', e.target.value)}
                placeholder="Enter work email address"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#073B4C]/30"
              />
            </div>

            {/* Phone & Org Size */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                <input
                  type="tel"
                  value={form.phone}
                  onChange={(e) => handleChange('phone', e.target.value)}
                  placeholder="Enter phone number"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#073B4C]/30"
                />
              </div>

              <div className="relative">
                <label className="block text-sm font-medium text-gray-700 mb-1">Organization Size</label>
                <button
                  type="button"
                  onClick={() => setOpenDropdown(openDropdown === 'orgSize' ? null : 'orgSize')}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm text-left flex items-center justify-between focus:outline-none focus:ring-2 focus:ring-[#073B4C]/30"
                >
                  <span className={form.orgSize ? 'text-gray-900' : 'text-gray-400'}>
                    {form.orgSize || 'Select size'}
                  </span>
                  <ChevronDown className="w-4 h-4 text-gray-400" />
                </button>
                {openDropdown === 'orgSize' && (
                  <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg">
                    {orgSizes.map((s) => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => handleChange('orgSize', s)}
                        className="w-full px-4 py-2 text-sm text-left hover:bg-gray-50"
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={form.password}
                  onChange={(e) => handleChange('password', e.target.value)}
                  placeholder="Create a password"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#073B4C]/30 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={form.confirmPassword}
                  onChange={(e) => handleChange('confirmPassword', e.target.value)}
                  placeholder="Confirm your password"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#073B4C]/30 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="w-full bg-[#073B4C] text-white py-3 rounded-lg font-semibold text-sm hover:bg-[#0A202A] transition-colors"
            >
              Sign Up
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-3 my-5">
            <div className="flex-1 h-px bg-gray-200"></div>
            <span className="text-xs text-gray-400">or</span>
            <div className="flex-1 h-px bg-gray-200"></div>
          </div>

          {/* Google */}
          <button className="w-full flex items-center justify-center gap-2 border border-gray-300 py-3 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            Continue with Google
          </button>

          {/* Login Link */}
          <p className="text-center text-sm text-gray-500 mt-5">
            Already have an account?{' '}
            <button onClick={onLogin} className="text-[#073B4C] font-semibold hover:underline">
              Log in
            </button>
          </p>

          <p className="text-center text-[10px] text-gray-400 mt-3">
            By signing up, you agree to our Terms of Service and Privacy Policy.
          </p>
        </div>
      </div>
    </div>
  )
}
