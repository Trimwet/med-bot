import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Shield, Eye, EyeOff, ArrowLeft } from 'lucide-react'
import { adminApi, setAdminSecret } from './admin-api'

interface AdminLoginProps {
  onBack: () => void
}

export const AdminLogin = ({ onBack }: AdminLoginProps) => {
  const navigate = useNavigate()
  const [secret, setSecret] = useState('')
  const [showSecret, setShowSecret] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!secret.trim()) return
    setLoading(true)
    setError('')
    try {
      await adminApi.login(secret.trim())
      setAdminSecret(secret.trim())
      navigate('/admin/dashboard')
    } catch {
      setError('Invalid admin secret')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#080a0e] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 dark:text-[#6b7080] dark:hover:text-[#cdd0d5] mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to site
        </button>

        <div className="bg-white dark:bg-[#0f1117] rounded-xl border border-gray-200 dark:border-[#1e2028] p-8 shadow-sm">
          <div className="flex flex-col items-center mb-8">
            <div className="w-14 h-14 rounded-xl bg-[#073B4C] flex items-center justify-center mb-4">
              <Shield className="w-7 h-7 text-white" />
            </div>
            <h1 className="text-xl font-bold text-gray-900 dark:text-[#e8eaed]">Super Admin</h1>
            <p className="text-sm text-gray-500 dark:text-[#6b7080] mt-1">Enter your admin secret to continue</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-[#a0a4ad] mb-1.5">
                Admin Secret
              </label>
              <div className="relative">
                <input
                  type={showSecret ? 'text' : 'password'}
                  value={secret}
                  onChange={(e) => setSecret(e.target.value)}
                  placeholder="Enter your secret key"
                  className="w-full px-4 py-2.5 pr-10 bg-gray-50 dark:bg-[#1a1d25] border border-gray-200 dark:border-[#1e2028] rounded-lg text-sm text-gray-900 dark:text-[#cdd0d5] placeholder-gray-400 dark:placeholder-[#525666] focus:outline-none focus:ring-2 focus:ring-[#073B4C]/30 transition-colors"
                  autoFocus
                />
                <button
                  type="button"
                  onClick={() => setShowSecret(!showSecret)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-[#a0a4ad]"
                >
                  {showSecret ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {error && (
              <p className="text-sm text-red-500 dark:text-red-400 bg-red-50 dark:bg-red-900/20 px-3 py-2 rounded-lg">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading || !secret.trim()}
              className="w-full py-2.5 bg-[#073B4C] hover:bg-[#054A5E] disabled:opacity-50 text-white text-sm font-medium rounded-lg transition-colors"
            >
              {loading ? 'Verifying...' : 'Access Dashboard'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
