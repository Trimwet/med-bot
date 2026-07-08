import React, { useState } from 'react'
import { Eye, EyeOff, Mail, Lock, User, Phone } from 'lucide-react'
import { cn } from '@/lib/utils'

type AuthMode = 'login' | 'signup'

export const AuthPage = ({ initialMode = 'signup' }: { initialMode?: AuthMode }) => {
  const [mode, setMode] = useState<AuthMode>(initialMode)
  const [showPassword, setShowPassword] = useState(false)

  return (
    <div className="min-h-screen bg-paper-soft flex flex-col">
      {/* Main card */}
      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-xl border border-line shadow-sm p-8">
            {/* Logo */}
            <div className="flex flex-col items-center mb-8">
              <div className="w-12 h-12 rounded-xl bg-navy flex items-center justify-center text-white font-extrabold text-lg font-display mb-3">
                M
              </div>
              <h1 className="text-2xl font-bold text-ink font-display">
                {mode === 'signup' ? 'Create your account' : 'Welcome back'}
              </h1>
              <p className="text-sm text-muted mt-2 text-center">
                {mode === 'signup'
                  ? 'Sign up to start your health journey with MedBot.'
                  : 'Log in to access your MedBot dashboard.'}
              </p>
            </div>

            {/* Form */}
            <form onSubmit={(e) => e.preventDefault()} className="space-y-5">
              {mode === 'signup' && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-ink mb-1.5">Full Name</label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted" />
                      <input
                        type="text"
                        placeholder="Enter your full name"
                        className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-line bg-white text-ink text-sm placeholder:text-muted/60 focus:outline-none focus:ring-2 focus:ring-navy/20 focus:border-navy/40 transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-ink mb-1.5">Phone Number</label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted" />
                      <input
                        type="tel"
                        placeholder="Enter your phone number"
                        className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-line bg-white text-ink text-sm placeholder:text-muted/60 focus:outline-none focus:ring-2 focus:ring-navy/20 focus:border-navy/40 transition-all"
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
                    placeholder="Enter your email address"
                    className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-line bg-white text-ink text-sm placeholder:text-muted/60 focus:outline-none focus:ring-2 focus:ring-navy/20 focus:border-navy/40 transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-ink mb-1.5">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder={mode === 'signup' ? 'Create a password' : 'Enter your password'}
                    className="w-full pl-10 pr-10 py-2.5 rounded-lg border border-line bg-white text-ink text-sm placeholder:text-muted/60 focus:outline-none focus:ring-2 focus:ring-navy/20 focus:border-navy/40 transition-all"
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

              {mode === 'login' && (
                <div className="flex justify-end">
                  <a href="#" className="text-sm text-navy hover:text-navy-deep transition-colors">
                    Forgot password?
                  </a>
                </div>
              )}

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
                className="w-full py-3 rounded-lg bg-navy text-white font-semibold text-sm hover:bg-navy-deep transition-colors font-display"
              >
                {mode === 'signup' ? 'Sign Up' : 'Log In'}
              </button>
            </form>

            {/* Toggle */}
            <p className="mt-6 text-center text-sm text-muted">
              {mode === 'signup' ? 'Already have an account?' : "Don't have an account?"}{' '}
              <button
                onClick={() => setMode(mode === 'signup' ? 'login' : 'signup')}
                className="text-navy font-semibold hover:text-navy-deep transition-colors"
              >
                {mode === 'signup' ? 'Log in' : 'Sign up'}
              </button>
            </p>
          </div>
        </div>
      </div>

      {/* Footer disclaimer */}
      <div className="px-6 pb-8 text-center">
        <div className="flex items-center justify-center gap-1.5 mb-2">
          <div className="w-1.5 h-1.5 rounded-full bg-red-500" />
          <span className="text-xs font-semibold text-ink">Medical Disclaimer:</span>
        </div>
        <p className="text-xs text-muted max-w-md mx-auto leading-relaxed">
          MedBot is an AI-powered triage support tool and does not provide professional medical diagnosis.
          For life-threatening emergencies, call <strong className="text-ink">112</strong> immediately.
        </p>
        <p className="text-xs text-muted/60 mt-3">© 2026 MedBot Health. All rights reserved.</p>
      </div>
    </div>
  )
}
