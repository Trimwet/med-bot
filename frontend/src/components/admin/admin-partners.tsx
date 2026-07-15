import { useEffect, useState } from 'react'
import { Building2, Users, Coins, Calendar, Globe } from 'lucide-react'
import { adminApi } from './admin-api'

interface Partner extends Record<string, any> {
  id: string
  name: string
  tier: string
  tokenBalance: number
  sessionCount: number
  patientCount: number
  createdAt: string
}

export const AdminPartners = () => {
  const [partners, setPartners] = useState<Partner[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    adminApi.getTenants()
      .then((data) => setPartners(data.tenants || []))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="space-y-4 animate-pulse">
        <div className="h-10 w-48 bg-gray-100 dark:bg-[#1a1d25] rounded-lg" />
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-28 bg-gray-100 dark:bg-[#1a1d25] rounded-xl" />
          ))}
        </div>
      </div>
    )
  }

  const totalPatients = partners.reduce((s, p) => s + p.patientCount, 0)
  const totalSessions = partners.reduce((s, p) => s + p.sessionCount, 0)
  const enterpriseCount = partners.filter((p) => p.tier === 'enterprise').length

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-gray-900 dark:text-[#e8eaed]">Partner Hospitals</h1>
        <p className="text-sm text-gray-500 dark:text-[#6b7080] mt-0.5">{partners.length} hospital partners</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: 'Total Partners', value: partners.length, icon: Building2, color: '#073B4C' },
          { label: 'Enterprise', value: enterpriseCount, icon: Globe, color: '#8B5CF6' },
          { label: 'Combined Patients', value: totalPatients, icon: Users, color: '#00A8A8' },
        ].map((item) => {
          const Icon = item.icon
          return (
            <div
              key={item.label}
              className="bg-white dark:bg-[#0f1117] border border-gray-200 dark:border-[#1e2028] rounded-xl p-5 transition-colors"
            >
              <div className="flex items-center justify-between mb-3">
                <div
                  className="w-9 h-9 rounded-lg flex items-center justify-center"
                  style={{ backgroundColor: `${item.color}15` }}
                >
                  <Icon className="w-4 h-4" style={{ color: item.color }} />
                </div>
              </div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white tabular-nums">{item.value}</p>
              <p className="text-sm text-gray-500 dark:text-[#6b7080] mt-1">{item.label}</p>
            </div>
          )
        })}
      </div>

      <div className="bg-white dark:bg-[#0f1117] rounded-xl border border-gray-200 dark:border-[#1e2028] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 dark:border-[#1e2028] bg-gray-50 dark:bg-[#1a1d25]">
                <th className="text-left px-5 py-3 font-semibold text-gray-700 dark:text-[#a0a4ad]">Hospital</th>
                <th className="text-left px-5 py-3 font-semibold text-gray-700 dark:text-[#a0a4ad]">Tier</th>
                <th className="text-right px-5 py-3 font-semibold text-gray-700 dark:text-[#a0a4ad]">Patients</th>
                <th className="text-right px-5 py-3 font-semibold text-gray-700 dark:text-[#a0a4ad]">Sessions</th>
                <th className="text-right px-5 py-3 font-semibold text-gray-700 dark:text-[#a0a4ad]">Token Balance</th>
                <th className="text-right px-5 py-3 font-semibold text-gray-700 dark:text-[#a0a4ad]">Since</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-[#1e2028]">
              {partners.map((p) => (
                <tr key={p.id} className="hover:bg-gray-50 dark:hover:bg-[#1a1d25] transition-colors">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-[#073B4C]/10 flex items-center justify-center">
                        <Building2 className="w-4 h-4 text-[#073B4C]" />
                      </div>
                      <span className="font-medium text-gray-900 dark:text-[#e8eaed]">{p.name}</span>
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                      p.tier === 'enterprise'
                        ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400'
                        : p.tier === 'growth'
                        ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                        : 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400'
                    }`}>
                      {p.tier}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-right tabular-nums text-gray-900 dark:text-[#e8eaed] font-medium">
                    {p.patientCount}
                  </td>
                  <td className="px-5 py-4 text-right tabular-nums text-gray-700 dark:text-[#a0a4ad]">
                    {p.sessionCount}
                  </td>
                  <td className="px-5 py-4 text-right tabular-nums text-gray-700 dark:text-[#a0a4ad]">
                    {(p.tokenBalance ?? 0).toLocaleString()}
                  </td>
                  <td className="px-5 py-4 text-right text-gray-400 dark:text-[#525666]">
                    {p.createdAt ? new Date(p.createdAt).toLocaleDateString() : '-'}
                  </td>
                </tr>
              ))}
              {partners.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-5 py-12 text-center text-sm text-gray-400 dark:text-[#525666]">
                    No partners found
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
