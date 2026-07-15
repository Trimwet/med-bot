import { useState } from 'react'
import { Shield, Key, RefreshCw, Eye, EyeOff, Check } from 'lucide-react'
import { getAdminSecret, setAdminSecret, clearAdminSecret, adminApi } from './admin-api'

export const AdminSettings = () => {
  const currentSecret = getAdminSecret() || ''
  const [newSecret, setNewSecret] = useState(currentSecret)
  const [showSecret, setShowSecret] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState('')

  const handleUpdateSecret = async () => {
    if (!newSecret.trim()) return
    setError('')
    try {
      await adminApi.login(newSecret.trim())
      setAdminSecret(newSecret.trim())
      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
    } catch {
      setError('Invalid secret — update failed')
    }
  }

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-xl font-bold text-gray-900 dark:text-[#e8eaed]">Settings</h1>
        <p className="text-sm text-gray-500 dark:text-[#6b7080] mt-0.5">Admin configuration</p>
      </div>

      {/* Admin Secret */}
      <div className="bg-white dark:bg-[#0f1117] rounded-xl border border-gray-200 dark:border-[#1e2028] p-6 transition-colors">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-lg bg-[#073B4C]/10 flex items-center justify-center">
            <Key className="w-5 h-5 text-[#073B4C]" />
          </div>
          <div>
            <h2 className="font-semibold text-gray-900 dark:text-[#e8eaed]">Admin Secret</h2>
            <p className="text-xs text-gray-500 dark:text-[#6b7080]">Used for x-core-secret authentication</p>
          </div>
        </div>

        <div className="space-y-3">
          <div className="relative">
            <input
              type={showSecret ? 'text' : 'password'}
              value={newSecret}
              onChange={(e) => setNewSecret(e.target.value)}
              className="w-full px-4 py-2.5 pr-10 bg-gray-50 dark:bg-[#1a1d25] border border-gray-200 dark:border-[#1e2028] rounded-lg text-sm text-gray-900 dark:text-[#cdd0d5] placeholder-gray-400 dark:placeholder-[#525666] font-mono focus:outline-none focus:ring-2 focus:ring-[#073B4C]/30 transition-colors"
            />
            <button
              type="button"
              onClick={() => setShowSecret(!showSecret)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-[#a0a4ad]"
            >
              {showSecret ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>

          {error && (
            <p className="text-sm text-red-500 dark:text-red-400 bg-red-50 dark:bg-red-900/20 px-3 py-2 rounded-lg">{error}</p>
          )}

          <div className="flex items-center gap-3">
            <button
              onClick={handleUpdateSecret}
              disabled={!newSecret.trim() || newSecret === currentSecret}
              className="px-4 py-2 bg-[#073B4C] hover:bg-[#054A5E] disabled:opacity-50 text-white text-sm font-medium rounded-lg transition-colors flex items-center gap-2"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Update Secret
            </button>
            {saved && (
              <span className="text-sm text-green-600 dark:text-green-400 flex items-center gap-1">
                <Check className="w-4 h-4" /> Saved
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Info card */}
      <div className="bg-white dark:bg-[#0f1117] rounded-xl border border-gray-200 dark:border-[#1e2028] p-6 transition-colors">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-lg bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center">
            <Shield className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <h2 className="font-semibold text-gray-900 dark:text-[#e8eaed]">About Super Admin</h2>
            <p className="text-xs text-gray-500 dark:text-[#6b7080]">Platform administration</p>
          </div>
        </div>
        <div className="space-y-2 text-sm text-gray-600 dark:text-[#a0a4ad]">
          <p>This dashboard provides super admin access to MedBot platform data.</p>
          <ul className="list-disc list-inside space-y-1 ml-1 text-xs text-gray-500 dark:text-[#6b7080]">
            <li>View platform-wide metrics and session activity</li>
            <li>Manage tenants and view usage data</li>
            <li>Monitor API token consumption and costs</li>
            <li>View registered users and their verification status</li>
            <li>Review partner hospital statistics</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
