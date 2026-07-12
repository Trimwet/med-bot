import { useState } from 'react'
import { Eye, EyeOff, ArrowRight, Globe, ChevronLeft, BarChart3, HeartPulse, ShieldCheck } from 'lucide-react'

interface BusinessLoginProps {
  onBack?: () => void
  onSignup?: () => void
  onLoginSuccess?: () => void
  onForgotPassword?: () => void
}

const features = [
  { icon: BarChart3, label: 'Data-Driven Insights' },
  { icon: HeartPulse, label: 'Improve Outcomes' },
  { icon: ShieldCheck, label: 'Secure & Reliable' },
]

export const BusinessLogin = ({ onBack, onSignup, onLoginSuccess, onForgotPassword }: BusinessLoginProps) => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onLoginSuccess?.()
  }

  return (
    <div className="min-h-screen bg-[#EFF6FF] flex items-center justify-center p-4">
      <div className="w-full max-w-4xl bg-white rounded-2xl shadow-xl overflow-hidden flex flex-col lg:flex-row">
        {/* Left Panel */}
        <div className="lg:w-[45%] bg-gray-50 p-6 sm:p-8 lg:p-10 flex flex-col items-center justify-between">
          <div className="w-full">
            {/* Language Toggle */}
            <div className="flex justify-end mb-6">
              <button className="flex items-center gap-1.5 text-xs text-gray-500 border border-gray-200 rounded-full px-3 py-1.5 hover:bg-gray-100 transition-colors">
                <Globe className="w-3.5 h-3.5" />
                English ▾
              </button>
            </div>

            {/* Logo & Branding */}
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-[#073B4C] rounded-2xl flex items-center justify-center mx-auto mb-4">
                <img src="/assets/Logoico.png" alt="MedBot" className="h-10 w-auto" />
              </div>
              <p className="font-bold text-gray-900 text-sm">MedBot</p>
              <p className="text-xs text-gray-500 mb-4">Your AI Health Assistant</p>
              <h1 className="text-xl font-bold text-gray-900 font-display">Partner Portal</h1>
              <p className="text-sm text-gray-500 mt-1">
                Powerful insights. Smarter decisions. Better healthcare outcomes.
              </p>
            </div>

            {/* Dashboard Preview */}
            <div className="bg-white rounded-xl shadow-sm p-4 mb-6 border border-gray-100">
              <div className="bg-gradient-to-br from-[#073B4C] to-[#0A4A5E] rounded-lg p-4 text-white">
                <p className="text-xs font-semibold mb-2">Welcome, Partner</p>
                <div className="bg-white/10 rounded-lg p-3">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-6 h-6 bg-white/20 rounded-full"></div>
                    <div className="flex-1 h-2 bg-white/20 rounded-full"></div>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="bg-white/10 rounded p-2">
                      <div className="h-1.5 bg-white/30 rounded-full mb-1 w-1/2"></div>
                      <div className="h-1 bg-white/20 rounded-full w-3/4"></div>
                    </div>
                    <div className="bg-white/10 rounded p-2">
                      <div className="h-1.5 bg-white/30 rounded-full mb-1 w-1/2"></div>
                      <div className="h-1 bg-white/20 rounded-full w-3/4"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Features */}
          <div className="grid grid-cols-3 gap-3 w-full">
            {features.map((f) => (
              <div key={f.label} className="text-center">
                <div className="w-10 h-10 bg-white rounded-xl shadow-sm flex items-center justify-center mx-auto mb-1.5 border border-gray-100">
                  <f.icon className="w-4.5 h-4.5 text-[#073B4C]" strokeWidth={1.75} />
                </div>
                <p className="text-[10px] text-gray-600 leading-tight">{f.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Right Panel - Form */}
        <div className="lg:w-[55%] p-6 sm:p-8 lg:p-10 flex flex-col justify-center">
          <button
            onClick={onBack}
            className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 mb-6 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            Back to Home
          </button>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-1 font-display">
            Welcome Back
          </h2>
          <p className="text-sm text-gray-500 mb-6">Sign in to access your partner dashboard.</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email */}
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

            {/* Password */}
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

            {/* Remember & Forgot */}
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

            {/* Submit */}
            <button
              type="submit"
              className="w-full bg-[#073B4C] text-white py-3 rounded-lg font-semibold text-sm hover:bg-[#0A202A] transition-colors flex items-center justify-center gap-2"
            >
              Sign In
              <ArrowRight className="w-4 h-4" />
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

          {/* Signup Link */}
          <p className="text-center text-sm text-gray-500 mt-5">
            Don't have an account?{' '}
            <button onClick={onSignup} className="text-[#073B4C] font-semibold hover:underline">
              Become a Partner
            </button>
          </p>

          {/* Footer Links */}
          <div className="flex items-center justify-center gap-4 mt-6 text-[10px] text-gray-400">
            <a href="#" className="hover:text-gray-600">Privacy Policy</a>
            <span>·</span>
            <a href="#" className="hover:text-gray-600">Terms of Service</a>
            <span>·</span>
            <a href="#" className="hover:text-gray-600">Support</a>
          </div>
        </div>
      </div>
    </div>
  )
}
