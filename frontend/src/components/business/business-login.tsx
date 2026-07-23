import { useState } from 'react'
import { Eye, EyeOff, ArrowRight, ChevronLeft } from 'lucide-react'
import { tenantLogin } from '@/lib/api'

// NOTE: To re-enable OTP verification for business login:
// 1. Import tenantVerifyLoginOtp from '@/lib/api'
// 2. Restore the otpStep state and OTP input UI
// 3. In handleSubmit, set otpStep(true) after tenantLogin instead of calling onLoginSuccess directly
// 4. Add back handleVerifyOtp that calls tenantVerifyLoginOtp(email, otp) and calls onLoginSuccess with the returned token
// 5. On the backend, restore OTP generation in requestTenantLoginOtp and the sendOtpEmail/verifyTenantLoginOtp flow

interface BusinessLoginProps {
  onBack?: () => void
  onSignup?: () => void
  onLoginSuccess?: (token: string) => void
  onForgotPassword?: () => void
}

export const BusinessLogin = ({ onBack, onSignup, onLoginSuccess, onForgotPassword }: BusinessLoginProps) => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const res = await tenantLogin(email, password)
      if (res.token) {
        onLoginSuccess?.(res.token)
      } else {
        setError('Login succeeded but no token received.')
      }
    } catch (err: any) {
      setError(err?.message || 'Login failed')
    } finally {
      setLoading(false)
    }
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
          <img src="/assets/Logoico.png" alt="MedBot" className="w-10 h-10 rounded-xl" />
          <div>
            <p className="font-bold text-gray-900 text-sm">MedBot</p>
            <p className="text-xs text-gray-500">Partner Portal</p>
          </div>
        </div>

        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-1 font-display">
          Welcome Back
        </h2>
        <p className="text-sm text-gray-500 mb-6">Sign in to access your partner dashboard.</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </span>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address"
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#073B4C]/30"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </span>
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="w-full pl-10 pr-10 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#073B4C]/30"
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

          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 rounded border-gray-300 text-[#073B4C] focus:ring-[#073B4C]"
              />
              <span className="text-sm text-gray-600">Remember me</span>
            </label>
            <button
              type="button"
              onClick={onForgotPassword}
              className="text-sm font-semibold text-[#073B4C] hover:underline"
            >
              Forgot Password?
            </button>
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#073B4C] text-white py-3 rounded-lg font-semibold text-sm hover:bg-[#0A202A] transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading ? 'Signing in...' : 'Sign In'}
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-5">
          Don't have an account?{' '}
          <button onClick={onSignup} className="text-[#073B4C] font-semibold hover:underline">
            Become a Partner
          </button>
        </p>
      </div>
    </div>
  )
}
