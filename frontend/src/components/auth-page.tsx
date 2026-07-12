import React, { useState } from 'react'
import { Eye, EyeOff, Mail, Lock, User, Phone, ChevronLeft } from 'lucide-react'
import { Loader } from '@/components/motion/loader'
import {
  signup,
  login,
  verifyOtp,
  resendOtp,
  verifyLoginOtp,
  resendLoginOtp,
  getGoogleAuthUrl,
  ApiError,
} from '@/lib/api'

type AuthMode = 'login' | 'signup'
type Step = 'form' | 'otp'

interface AuthPageProps {
  initialMode?: AuthMode
  onBack?: () => void
  onToggleMode?: () => void
  onSignupSuccess?: () => void
  onLoginSuccess?: () => void
  onForgotPassword?: () => void
}

export const AuthPage = ({ initialMode = 'signup', onBack, onToggleMode, onSignupSuccess, onLoginSuccess, onForgotPassword }: AuthPageProps) => {
  const [mode, setMode] = useState<AuthMode>(initialMode)
  const [step, setStep] = useState<Step>('form')
  const [showPassword, setShowPassword] = useState(false)

  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [otp, setOtp] = useState('')

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [info, setInfo] = useState('')

  const isSignup = mode === 'signup'

  function saveSession(token?: string, user?: unknown) {
    if (token) localStorage.setItem('token', token)
    if (user) localStorage.setItem('user', JSON.stringify(user))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setInfo('')
    setLoading(true)

    try {
      if (isSignup) {
        await signup({ name, email, password })
        setStep('otp')
        setInfo('We sent a verification code to your email.')
      } else {
        await login({ email, password })
        setStep('otp')
        setInfo('We sent a login code to your email.')
      }
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  async function handleVerifyOtp(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const result = isSignup
        ? await verifyOtp(email, otp)
        : await verifyLoginOtp(email, otp)

      saveSession(result.token, result.user)
      if (isSignup) {
        onSignupSuccess?.()
      } else {
        onLoginSuccess?.()
      }
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Verification failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  async function handleResendOtp() {
    setError('')
    setInfo('')
    setLoading(true)

    try {
      if (isSignup) {
        await resendOtp(email)
      } else {
        await resendLoginOtp(email)
      }
      setInfo('A new code has been sent to your email.')
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Failed to resend code.')
    } finally {
      setLoading(false)
    }
  }

  function handleGoogleAuth() {
    window.location.href = getGoogleAuthUrl()
  }

  if (step === 'otp') {
    return (
      <div className="min-h-screen bg-paper-soft flex flex-col items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-2xl border border-line shadow-sm overflow-hidden">
            <div className="relative px-8 pt-8 pb-2">
              <button
                onClick={() => setStep('form')}
                className="absolute top-6 left-6 flex items-center gap-1.5 text-sm text-muted hover:text-ink transition-colors group"
              >
                <ChevronLeft className="size-4 group-hover:-translate-x-0.5 transition-transform" />
                <span>Back</span>
              </button>

              <div className="flex flex-col items-center pt-4">
                <h1 className="text-2xl font-bold text-ink font-display">
                  {isSignup ? 'Verify your email' : 'Enter login code'}
                </h1>
                <p className="text-sm text-muted mt-2 text-center">
                  Enter the 6-digit code we sent to <strong className="text-ink">{email}</strong>
                </p>
              </div>
            </div>

            <form onSubmit={handleVerifyOtp} className="px-8 pb-8 pt-6 space-y-5">
              <div>
                <label className="block text-sm font-medium text-ink mb-1.5">Verification Code</label>
                <input
                  type="text"
                  inputMode="numeric"
                  maxLength={6}
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                  placeholder="Enter 6-digit code"
                  className="w-full px-4 py-2.5 rounded-lg border border-line bg-white text-ink text-sm text-center tracking-[0.3em] placeholder:text-muted/60 placeholder:tracking-normal focus:outline-none focus:ring-2 focus:ring-teal/20 focus:border-teal/40 transition-all"
                  required
                />
              </div>

              {error && <p className="text-sm text-red-500 text-center">{error}</p>}
              {info && !error && <p className="text-sm text-teal text-center">{info}</p>}

              <button
                type="submit"
                disabled={loading || otp.length !== 6}
                className="w-full py-3 rounded-lg bg-teal text-white font-semibold text-sm hover:bg-teal/80 transition-colors font-display disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? <Loader variant="helix" size={20} speed={0.6} label="Verifying" className="text-white" /> : isSignup ? 'Verify Email' : 'Verify & Log In'}
              </button>

              <button
                type="button"
                onClick={handleResendOtp}
                disabled={loading}
                className="w-full text-sm text-teal hover:text-teal/80 transition-colors disabled:opacity-50"
              >
                Resend code
              </button>
            </form>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-paper-soft flex flex-col items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        {/* Card */}
        <div className="bg-white rounded-2xl border border-line shadow-sm overflow-hidden">
          {/* Card header with back button */}
          <div className="relative px-8 pt-8 pb-2">
            {onBack && (
              <button
                onClick={onBack}
                className="absolute top-6 left-6 flex items-center gap-1.5 text-sm text-muted hover:text-ink transition-colors group"
              >
                <ChevronLeft className="size-4 group-hover:-translate-x-0.5 transition-transform" />
                <span>Back</span>
              </button>
            )}

            {/* Logo */}
            <div className="flex flex-col items-center pt-4">
              <div className="w-18 h-18 rounded-xl bg-teal flex items-center justify-center text-white font-extrabold text-lg font-display mb-4">
                <img src="/assets/Logo.jpeg" alt="MedBot Logo" />
              </div>
              <h1 className="text-2xl font-bold text-ink font-display">
                {isSignup ? 'Create your account' : 'Welcome back'}
              </h1>
              <p className="text-sm text-muted mt-2 text-center">
                {isSignup
                  ? 'Sign up to start your health journey with MedBot.'
                  : 'Log in to access your MedBot dashboard.'}
              </p>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="px-8 pb-8 pt-6 space-y-5">
            {isSignup && (
              <>
                <div>
                  <label className="block text-sm font-medium text-ink mb-1.5">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted" />
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Enter your full name"
                      className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-line bg-white text-ink text-sm placeholder:text-muted/60 focus:outline-none focus:ring-2 focus:ring-teal/20 focus:border-teal/40 transition-all"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-ink mb-1.5">Phone Number</label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted" />
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="Enter your phone number"
                      className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-line bg-white text-ink text-sm placeholder:text-muted/60 focus:outline-none focus:ring-2 focus:ring-teal/20 focus:border-teal/40 transition-all"
                    />
                  </div>
                </div>
              </>
            )}

            <div>
              <label className="block text-sm font-medium text-ink mb-1.5">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address"
                  className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-line bg-white text-ink text-sm placeholder:text-muted/60 focus:outline-none focus:ring-2 focus:ring-teal/20 focus:border-teal/40 transition-all"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-ink mb-1.5">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={isSignup ? 'Create a password' : 'Enter your password'}
                  className="w-full pl-10 pr-10 py-2.5 rounded-lg border border-line bg-white text-ink text-sm placeholder:text-muted/60 focus:outline-none focus:ring-2 focus:ring-teal/20 focus:border-teal/40 transition-all"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-ink transition-colors"
                >
                  {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                </button>
              </div>
            </div>

            {!isSignup && (
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={onForgotPassword}
                  className="text-sm text-teal hover:text-teal/80 transition-colors"
                >
                  Forgot password?
                </button>
              </div>
            )}

            {error && <p className="text-sm text-red-500 text-center">{error}</p>}
            {info && !error && <p className="text-sm text-teal text-center">{info}</p>}

            {/* Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-line"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-3 bg-white text-muted">OR</span>
              </div>
            </div>

            {/* Google button */}
            <button
              type="button"
              onClick={handleGoogleAuth}
              className="w-full flex items-center justify-center gap-3 px-4 py-2.5 rounded-lg border border-line bg-white text-ink text-sm font-medium hover:bg-paper-soft transition-colors"
            >
              <svg className="size-5" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              Continue with Google
            </button>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-lg bg-teal text-white font-semibold text-sm hover:bg-teal/80 transition-colors font-display disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? <Loader variant="helix" size={20} speed={0.6} label="Loading" className="text-white" /> : isSignup ? 'Sign Up' : 'Log In'}
            </button>
          </form>
        </div>

        {/* Toggle */}
        <p className="mt-6 text-center text-sm text-muted">
          {isSignup ? 'Already have an account?' : "Don't have an account?"}{' '}
          <button
            onClick={() => {
              setError('')
              setInfo('')
              setMode(isSignup ? 'login' : 'signup')
              onToggleMode?.()
            }}
            className="text-teal font-semibold hover:text-teal/80 transition-colors"
          >
            {isSignup ? 'Log in' : 'Create account'}
          </button>
        </p>

        {/* Footer disclaimer */}
        <div className="mt-8 text-center">
          <div className="flex items-center justify-center gap-1.5 mb-2">
            <div className="w-1.5 h-1.5 rounded-full bg-red-500" />
            <span className="text-xs font-semibold text-ink">Medical Disclaimer:</span>
          </div>
          <p className="text-xs text-muted max-w-sm mx-auto leading-relaxed">
            MedBot is an AI-powered triage support tool and does not provide professional medical diagnosis.
            For life-threatening emergencies, call <strong className="text-ink">112</strong> immediately.
          </p>
          <p className="text-xs text-muted/60 mt-3">© 2026 MedBot Health. All rights reserved.</p>
        </div>
      </div>
    </div>
  )
}
