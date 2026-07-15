import { useState } from 'react'
import {
  Eye,
  EyeOff,
  ChevronDown,
  ChevronLeft,
} from 'lucide-react'
import { tenantSignup, tenantVerifyOtp, getGoogleAuthUrl } from '@/lib/api'

interface BusinessSignupProps {
  onBack?: () => void
  onLogin?: () => void
  onSignupSuccess?: (token: string) => void
}

const orgTypes = ['Hospital', 'Clinic', 'HMO', 'NGO', 'Corporate']
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
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [otpStep, setOtpStep] = useState(false)
  const [otp, setOtp] = useState('')

  const handleChange = (field: string, value: string) => {
    setForm({ ...form, [field]: value })
    setOpenDropdown(null)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match')
      return
    }
    setLoading(true)
    try {
      const res = await tenantSignup({
        orgName: form.orgName,
        orgType: form.orgType,
        country: form.country,
        email: form.email,
        phone: form.phone,
        orgSize: form.orgSize,
        password: form.password,
      })
      if (res.emailSent !== false) {
        setOtpStep(true)
      } else {
        setError('Could not send OTP email. Contact support.')
      }
    } catch (err: any) {
      setError(err?.message || 'Signup failed')
    } finally {
      setLoading(false)
    }
  }

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const res = await tenantVerifyOtp(form.email, otp)
      if (res.token) {
        onSignupSuccess?.(res.token)
      }
    } catch (err: any) {
      setError(err?.message || 'Verification failed')
    } finally {
      setLoading(false)
    }
  }

  if (otpStep) {
    return (
      <div className="min-h-screen bg-[#EFF6FF] flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-6 sm:p-8 text-center">
          <div className="w-16 h-16 bg-[#073B4C] rounded-full flex items-center justify-center mx-auto mb-4">
            <img src="/assets/Logoico.png" alt="MedBot" className="h-8 w-auto" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Verify Your Email</h2>
          <p className="text-sm text-gray-500 mb-6">
            We sent a 6-digit code to <strong>{form.email}</strong>
          </p>
          <form onSubmit={handleVerifyOtp} className="space-y-4">
            <input
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
              placeholder="Enter OTP"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg text-lg text-center tracking-[0.5em] font-mono focus:outline-none focus:ring-2 focus:ring-[#073B4C]/30"
              maxLength={6}
            />
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <button
              type="submit"
              disabled={loading || otp.length < 6}
              className="w-full bg-[#073B4C] text-white py-3 rounded-lg font-semibold text-sm hover:bg-[#0A202A] transition-colors disabled:opacity-50"
            >
              {loading ? 'Verifying...' : 'Verify OTP'}
            </button>
          </form>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#EFF6FF] flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-6 sm:p-8">
        <button
          onClick={onBack}
          className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 mb-6 transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          Back to Home
        </button>

        <div className="flex items-center gap-2 mb-6">
          <div className="w-10 h-10 bg-[#073B4C] rounded-xl flex items-center justify-center">
            <img src="/assets/Logoico.png" alt="MedBot" className="h-6 w-auto" />
          </div>
          <div>
            <p className="font-bold text-gray-900 text-sm">MedBot</p>
            <p className="text-xs text-gray-500">Partner Portal</p>
          </div>
        </div>

        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-1 font-display">
          Create Your Organization Account
        </h2>
        <p className="text-sm text-gray-500 mb-6">Fill in your organization details to get started.</p>

        <form onSubmit={handleSubmit} className="space-y-4">
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

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#073B4C] text-white py-3 rounded-lg font-semibold text-sm hover:bg-[#0A202A] transition-colors disabled:opacity-50"
          >
            {loading ? 'Signing up...' : 'Sign Up'}
          </button>
        </form>

        <div className="flex items-center gap-3 my-5">
          <div className="flex-1 h-px bg-gray-200"></div>
          <span className="text-xs text-gray-400">or</span>
          <div className="flex-1 h-px bg-gray-200"></div>
        </div>

        <button
          type="button"
          onClick={() => window.location.href = getGoogleAuthUrl('business')}
          className="w-full flex items-center justify-center gap-2 border border-gray-300 py-3 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
          </svg>
          Continue with Google
        </button>

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
  )
}
