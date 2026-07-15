import { useEffect, useState } from 'react'
import { Building2, Users as UsersIcon, Coins, Calendar } from 'lucide-react'
import { adminApi } from './admin-api'

interface Tenant {
  id: string
  name: string
  tier: string
  tokenBalance: number
  sessionCount: number
  patientCount: number
  createdAt: string
}

export const AdminTenants = () => {
  const [tenants, setTenants] = useState<Tenant[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    adminApi.getTenants()
      .then((data) => setTenants(data.tenants || []))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="space-y-4 animate-pulse">
        <div className="h-10 w-48 bg-gray-100 dark:bg-[#1a1d25] rounded-lg" />
        <div className="h-64 bg-gray-100 dark:bg-[#1a1d25] rounded-xl" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-gray-900 dark:text-[#e8eaed]">Tenants</h1>
        <p className="text-sm text-gray-500 dark:text-[#6b7080] mt-0.5">{tenants.length} active tenants</p>
      </div>

      <div className="bg-white dark:bg-[#0f1117] rounded-xl border border-gray-200 dark:border-[#1e2028] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 dark:border-[#1e2028] bg-gray-50 dark:bg-[#1a1d25]">
                <th className="text-left px-5 py-3 font-semibold text-gray-700 dark:text-[#a0a4ad]">Name</th>
                <th className="text-left px-5 py-3 font-semibold text-gray-700 dark:text-[#a0a4ad]">Tier</th>
                <th className="text-right px-5 py-3 font-semibold text-gray-700 dark:text-[#a0a4ad]">Token Balance</th>
                <th className="text-right px-5 py-3 font-semibold text-gray-700 dark:text-[#a0a4ad]">Sessions</th>
                <th className="text-right px-5 py-3 font-semibold text-gray-700 dark:text-[#a0a4ad]">Patients</th>
                <th className="text-right px-5 py-3 font-semibold text-gray-700 dark:text-[#a0a4ad]">Created</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-[#1e2028]">
              {tenants.map((t) => (
                <tr key={t.id} className="hover:bg-gray-50 dark:hover:bg-[#1a1d25] transition-colors">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-[#073B4C]/10 flex items-center justify-center">
                        <Building2 className="w-4 h-4 text-[#073B4C]" />
                      </div>
                      <span className="font-medium text-gray-900 dark:text-[#e8eaed]">{t.name}</span>
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                      t.tier === 'enterprise'
                        ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400'
                        : t.tier === 'growth'
                        ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                        : 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400'
                    }`}>
                      {t.tier}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-right tabular-nums font-medium text-gray-900 dark:text-[#e8eaed]">
                    {t.tokenBalance?.toLocaleString() ?? 0}
                  </td>
                  <td className="px-5 py-4 text-right tabular-nums text-gray-700 dark:text-[#a0a4ad]">
                    {t.sessionCount}
                  </td>
                  <td className="px-5 py-4 text-right tabular-nums text-gray-700 dark:text-[#a0a4ad]">
                    {t.patientCount}
                  </td>
                  <td className="px-5 py-4 text-right text-gray-400 dark:text-[#525666]">
                    {t.createdAt ? new Date(t.createdAt).toLocaleDateString() : '-'}
                  </td>
                </tr>
              ))}
              {tenants.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-5 py-12 text-center text-sm text-gray-400 dark:text-[#525666]">
                    No tenants found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
