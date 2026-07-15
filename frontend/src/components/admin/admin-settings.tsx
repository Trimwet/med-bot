import { useState } from 'react'
import { Shield, Key, RefreshCw, Eye, EyeOff, Check, Info, Lock, Server, Globe } from 'lucide-react'
import { getAdminSecret, setAdminSecret, clearAdminSecret, adminApi } from './admin-api'

export const AdminSettings = () => {
  const currentSecret = getAdminSecret() || ''
  const [newSecret, setNewSecret] = useState(currentSecret)
  const [showSecret, setShowSecret] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)

  const handleUpdateSecret = async () => {
    if (!newSecret.trim()) return
    setSaving(true)
    setError('')
    try {
      await adminApi.login(newSecret.trim())
      setAdminSecret(newSecret.trim())
      setSaved(true)
      setTimeout(() => setSaved(false), 2500)
    } catch {
      setError('Invalid secret — authentication failed')
    } finally {
      setSaving(false)
    }
  }

  const handleClearSession = () => {
    clearAdminSecret()
    setNewSecret('')
    setSaved(false)
    setError('')
  }

  const isUnchanged = newSecret === currentSecret
  const hasValue = newSecret.trim().length > 0

  return (
    <div className="space-y-6 max-w-2xl">
      {/* Header */}
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-[#e8eaed] tracking-tight">
          Settings
        </h1>
        <p className="text-sm text-gray-500 dark:text-[#6b7080] mt-1">
          Admin configuration and session management
        </p>
      </div>

      {/* Admin Secret Card */}
      <div className="bg-white dark:bg-[#0f1117] rounded-xl border border-gray-200 dark:border-[#1e2028] overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 dark:border-[#1e2028] flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-[#073B4C]/10 flex items-center justify-center shrink-0">
            <Key className="w-4 h-4 text-[#073B4C]" />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-gray-900 dark:text-[#e8eaed]">Admin Secret</h2>
            <p className="text-xs text-gray-500 dark:text-[#6b7080]">
              Used for <code className="font-mono text-[10px] bg-gray-100 dark:bg-[#1a1d25] px-1 py-0.5 rounded">x-core-secret</code> header authentication
            </p>
          </div>
        </div>

        <div className="px-6 py-5 space-y-4">
          <div className="space-y-1.5">
            <label className="block text-xs font-medium text-gray-600 dark:text-[#a0a4ad] uppercase tracking-wide">
              Secret Key
            </label>
            <div className="relative">
              <input
                type={showSecret ? 'text' : 'password'}
                value={newSecret}
                onChange={(e) => setNewSecret(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && !isUnchanged && hasValue && handleUpdateSecret()}
                placeholder="Enter admin secret…"
                className="w-full px-4 py-2.5 pr-10 bg-gray-50 dark:bg-[#1a1d25] border border-gray-200 dark:border-[#1e2028] rounded-lg text-sm text-gray-900 dark:text-[#cdd0d5] placeholder-gray-400 dark:placeholder-[#525666] font-mono focus:outline-none focus:ring-2 focus:ring-[#073B4C]/30 transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowSecret(!showSecret)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-[#a0a4ad] transition-colors"
              >
                {showSecret ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {error && (
            <div className="flex items-start gap-2 px-3 py-2.5 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/50 rounded-lg">
              <Info className="w-4 h-4 text-red-500 mt-0.5 shrink-0" />
              <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
            </div>
          )}

          <div className="flex items-center gap-3">
            <button
              onClick={handleUpdateSecret}
              disabled={!hasValue || isUnchanged || saving}
              className="flex items-center gap-2 px-4 py-2 bg-[#073B4C] hover:bg-[#054A5E] disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm font-medium rounded-lg transition-colors"
            >
              {saving ? (
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <RefreshCw className="w-3.5 h-3.5" />
              )}
              {saving ? 'Verifying…' : 'Update Secret'}
            </button>
            {saved && (
              <span className="flex items-center gap-1.5 text-sm font-medium text-emerald-600 dark:text-emerald-400">
                <Check className="w-4 h-4" />
                Saved
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Session Management Card */}
      <div className="bg-white dark:bg-[#0f1117] rounded-xl border border-gray-200 dark:border-[#1e2028] overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 dark:border-[#1e2028] flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-amber-50 dark:bg-amber-900/20 flex items-center justify-center shrink-0">
            <Lock className="w-4 h-4 text-amber-600 dark:text-amber-400" />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-gray-900 dark:text-[#e8eaed]">Session</h2>
            <p className="text-xs text-gray-500 dark:text-[#6b7080]">Manage your current admin session</p>
          </div>
        </div>
        <div className="px-6 py-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-700 dark:text-[#cdd0d5]">
                Session is currently <span className={`font-semibold ${currentSecret ? 'text-emerald-600 dark:text-emerald-400' : 'text-gray-400'}`}>{currentSecret ? 'active' : 'inactive'}</span>
              </p>
              <p className="text-xs text-gray-400 dark:text-[#525666] mt-0.5">
                Stored locally in <code className="font-mono text-[10px] bg-gray-100 dark:bg-[#1a1d25] px-1 py-0.5 rounded">localStorage</code>
              </p>
            </div>
            <button
              onClick={handleClearSession}
              disabled={!currentSecret}
              className="px-4 py-2 border border-red-200 dark:border-red-800/50 text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/30 disabled:opacity-40 disabled:cursor-not-allowed text-sm font-medium rounded-lg transition-colors"
            >
              Clear Session
            </button>
          </div>
        </div>
      </div>

      {/* Platform Info Card */}
      <div className="bg-white dark:bg-[#0f1117] rounded-xl border border-gray-200 dark:border-[#1e2028] overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 dark:border-[#1e2028] flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center shrink-0">
            <Shield className="w-4 h-4 text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-gray-900 dark:text-[#e8eaed]">About Super Admin</h2>
            <p className="text-xs text-gray-500 dark:text-[#6b7080]">Platform access overview</p>
          </div>
        </div>

        <div className="divide-y divide-gray-100 dark:divide-[#1e2028]">
          {[
            { icon: Server, label: 'Platform', value: 'MedBot Clinical AI', color: '#073B4C' },
            { icon: Globe, label: 'Access Level', value: 'Super Admin — Full Platform', color: '#8B5CF6' },
            { icon: Shield, label: 'Auth Method', value: 'x-core-secret header', color: '#00A8A8' },
          ].map(({ icon: Icon, label, value, color }) => (
            <div key={label} className="flex items-center gap-4 px-6 py-3.5">
              <div className="w-7 h-7 rounded-md flex items-center justify-center shrink-0" style={{ backgroundColor: `${color}15` }}>
                <Icon className="w-3.5 h-3.5" style={{ color }} />
              </div>
              <div className="flex items-center justify-between w-full min-w-0">
                <span className="text-xs text-gray-500 dark:text-[#6b7080]">{label}</span>
                <span className="text-sm font-medium text-gray-800 dark:text-[#cdd0d5] truncate ml-4">{value}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="px-6 py-4 border-t border-gray-100 dark:border-[#1e2028] bg-gray-50 dark:bg-[#1a1d25]/50">
          <p className="text-xs text-gray-400 dark:text-[#525666] leading-relaxed">
            This dashboard provides platform-wide visibility: metrics, tenant management, user administration, API cost tracking, and clinical protocol authoring.
          </p>
        </div>
      </div>
    </div>
  )
}
