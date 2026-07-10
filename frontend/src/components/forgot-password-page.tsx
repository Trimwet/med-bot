import React, { useState } from 'react'
import { Mail, ChevronLeft, CheckCircle } from 'lucide-react'
import { Loader } from '@/components/motion/loader'

interface ForgotPasswordPageProps {
  onBack?: () => void
  onLogin?: () => void
}

export const ForgotPasswordPage = ({ onBack, onLogin }: ForgotPasswordPageProps) => {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)

    // Simulate API call — no backend wired
    await new Promise((resolve) => setTimeout(resolve, 1500))
    setSent(true)
    setLoading(false)
  }

  if (sent) {
    return (
      <div className="min-h-screen bg-paper-soft flex flex-col items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-2xl border border-line shadow-sm overflow-hidden">
            <div className="px-8 pt-8 pb-2">
              <div className="flex flex-col items-center pt-4">
                <div className="w-16 h-16 rounded-full bg-teal/10 flex items-center justify-center mb-4">
                  <CheckCircle className="size-8 text-teal" />
                </div>
                <h1 className="text-2xl font-bold text-ink font-display text-center">
                  Check your email
                </h1>
                <p className="text-sm text-muted mt-2 text-center">
                  We sent a password reset link to{' '}
                  <strong className="text-ink">{email}</strong>
                </p>
              </div>
            </div>

            <div className="px-8 pb-8 pt-6 space-y-5">
              <p className="text-sm text-muted text-center leading-relaxed">
                Click the link in the email to reset your password. If you don't see
                it, check your spam folder.
              </p>

              <button
                onClick={() => {
                  setSent(false)
                  setEmail('')
                }}
                className="w-full py-3 rounded-lg border border-line bg-white text-ink font-semibold text-sm hover:bg-paper-soft transition-colors font-display"
              >
                Send another email
              </button>

              <button
                onClick={onLogin}
                className="w-full py-3 rounded-lg bg-teal text-white font-semibold text-sm hover:bg-teal/80 transition-colors font-display"
              >
                Back to Log In
              </button>
            </div>
          </div>

          <p className="mt-8 text-center text-xs text-muted/60">
            © 2026 MedBot Health. All rights reserved.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-paper-soft flex flex-col items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl border border-line shadow-sm overflow-hidden">
          <div className="relative px-8 pt-8 pb-2">
            <button
              onClick={onBack}
              className="absolute top-6 left-6 flex items-center gap-1.5 text-sm text-muted hover:text-ink transition-colors group"
            >
              <ChevronLeft className="size-4 group-hover:-translate-x-0.5 transition-transform" />
              <span>Back</span>
            </button>

            <div className="flex flex-col items-center pt-4">
              <div className="w-18 h-18 rounded-xl bg-teal flex items-center justify-center text-white font-extrabold text-lg font-display mb-4">
                <img src="/assets/Logo.jpeg" alt="MedBot Logo" />
              </div>
              <h1 className="text-2xl font-bold text-ink font-display">
                Reset your password
              </h1>
              <p className="text-sm text-muted mt-2 text-center">
                Enter your email and we'll send you a link to reset your password.
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="px-8 pb-8 pt-6 space-y-5">
            <div>
              <label className="block text-sm font-medium text-ink mb-1.5">
                Email Address
              </label>
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

            {error && <p className="text-sm text-red-500 text-center">{error}</p>}

            <button
              type="submit"
              disabled={loading || !email}
              className="w-full py-3 rounded-lg bg-teal text-white font-semibold text-sm hover:bg-teal/80 transition-colors font-display disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? <Loader variant="helix" size={20} speed={0.6} label="Sending" className="text-white" /> : 'Send Reset Link'}
            </button>
          </form>
        </div>

        <p className="mt-6 text-center text-sm text-muted">
          Remember your password?{' '}
          <button
            onClick={onLogin}
            className="text-teal font-semibold hover:text-teal/80 transition-colors"
          >
            Log in
          </button>
        </p>

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

export default ForgotPasswordPage