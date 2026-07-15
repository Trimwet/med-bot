import { useEffect, useState } from 'react'
import {
  Building2,
  Users,
  Search,
  Download,
  MoreVertical,
  Activity,
  Star,
} from 'lucide-react'
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

type TierFilter = 'all' | 'enterprise' | 'growth' | 'starter'

const TIER_BADGE: Record<string, string> = {
  enterprise: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
  growth: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  starter: 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400',
}

export const AdminPartners = () => {
  const [partners, setPartners] = useState<Partner[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [tierFilter, setTierFilter] = useState<TierFilter>('all')

  useEffect(() => {
    adminApi.getTenants()
      .then((data) => setPartners(data.tenants || []))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  const filtered = partners.filter((p) => {
    const matchSearch = !search || p.name.toLowerCase().includes(search.toLowerCase())
    const matchTier = tierFilter === 'all' || p.tier === tierFilter
    return matchSearch && matchTier
  })

  const totalPatients = partners.reduce((s, p) => s + (p.patientCount || 0), 0)
  const totalSessions = partners.reduce((s, p) => s + (p.sessionCount || 0), 0)
  const enterpriseCount = partners.filter((p) => p.tier === 'enterprise').length

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="flex items-center justify-between">
          <div className="h-8 w-44 bg-gray-100 dark:bg-[#1a1d25] rounded-lg" />
          <div className="flex gap-3">
            <div className="h-9 w-24 bg-gray-100 dark:bg-[#1a1d25] rounded-lg" />
            <div className="h-9 w-28 bg-gray-100 dark:bg-[#1a1d25] rounded-lg" />
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-24 bg-gray-100 dark:bg-[#1a1d25] rounded-xl" />
          ))}
        </div>
        <div className="h-72 bg-gray-100 dark:bg-[#1a1d25] rounded-xl" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-[#e8eaed] tracking-tight">
            Partner Hospitals
          </h1>
          <p className="text-sm text-gray-500 dark:text-[#6b7080] mt-1">
            {partners.length} hospital partners across all tiers
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-3 py-2 border border-gray-200 dark:border-[#1e2028] rounded-lg text-sm font-medium text-gray-700 dark:text-[#a0a4ad] hover:bg-gray-50 dark:hover:bg-[#1a1d25] transition-colors">
            <Download className="w-4 h-4" />
            <span className="hidden sm:inline">Export</span>
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Partners', value: partners.length, icon: Building2, color: '#073B4C', sub: 'All tiers' },
          { label: 'Enterprise', value: enterpriseCount, icon: Star, color: '#8B5CF6', sub: 'Premium tier' },
          { label: 'Combined Patients', value: totalPatients, icon: Users, color: '#00A8A8', sub: 'Active records' },
          { label: 'Total Sessions', value: totalSessions, icon: Activity, color: '#F59E0B', sub: 'Platform-wide' },
        ].map((item) => {
          const Icon = item.icon
          return (
            <div
              key={item.label}
              className="bg-white dark:bg-[#0f1117] border border-gray-200 dark:border-[#1e2028] rounded-xl p-5 flex items-center gap-4 transition-all hover:dark:border-white/[0.1]"
            >
              <div
                className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0"
                style={{ backgroundColor: `${item.color}15` }}
              >
                <Icon className="w-4 h-4" style={{ color: item.color }} />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900 dark:text-[#e8eaed] tabular-nums tracking-tight">
                  {item.value.toLocaleString()}
                </p>
                <p className="text-xs text-gray-500 dark:text-[#6b7080]">{item.label}</p>
              </div>
            </div>
          )
        })}
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-[#525666]" />
          <input
            type="text"
            placeholder="Search hospitals..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-white dark:bg-[#0f1117] border border-gray-200 dark:border-[#1e2028] rounded-lg text-sm text-gray-900 dark:text-[#cdd0d5] placeholder-gray-400 dark:placeholder-[#525666] focus:outline-none focus:ring-2 focus:ring-[#073B4C]/30 transition-colors"
          />
        </div>
        <div className="flex items-center gap-1.5 bg-gray-100 dark:bg-[#1a1d25] rounded-lg p-1">
          {(['all', 'enterprise', 'growth', 'starter'] as TierFilter[]).map((tier) => (
            <button
              key={tier}
              onClick={() => setTierFilter(tier)}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors capitalize ${
                tierFilter === tier
                  ? 'bg-[#073B4C] text-white shadow-sm'
                  : 'text-gray-500 dark:text-[#6b7080] hover:text-gray-700 dark:hover:text-gray-300'
              }`}
            >
              {tier}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-[#0f1117] rounded-xl border border-gray-200 dark:border-[#1e2028] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 dark:border-[#1e2028] bg-gray-50 dark:bg-[#1a1d25]">
                <th className="text-left px-5 py-3 font-semibold text-gray-500 dark:text-[#6b7080] text-xs uppercase tracking-wide">
                  Hospital
                </th>
                <th className="text-left px-5 py-3 font-semibold text-gray-500 dark:text-[#6b7080] text-xs uppercase tracking-wide">
                  Plan
                </th>
                <th className="text-right px-5 py-3 font-semibold text-gray-500 dark:text-[#6b7080] text-xs uppercase tracking-wide">
                  Patients
                </th>
                <th className="text-right px-5 py-3 font-semibold text-gray-500 dark:text-[#6b7080] text-xs uppercase tracking-wide">
                  Sessions
                </th>
                <th className="text-right px-5 py-3 font-semibold text-gray-500 dark:text-[#6b7080] text-xs uppercase tracking-wide">
                  Token Balance
                </th>
                <th className="text-right px-5 py-3 font-semibold text-gray-500 dark:text-[#6b7080] text-xs uppercase tracking-wide hidden md:table-cell">
                  Since
                </th>
                <th className="px-3 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-[#1e2028]">
              {filtered.map((p) => (
                <tr
                  key={p.id}
                  className="hover:bg-gray-50 dark:hover:bg-[#1a1d25] transition-colors group"
                >
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-[#073B4C]/10 flex items-center justify-center shrink-0">
                        <Building2 className="w-4 h-4 text-[#073B4C]" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 dark:text-[#e8eaed]">{p.name}</p>
                        <p className="text-[10px] text-gray-400 dark:text-[#525666] font-mono">
                          {p.id.slice(0, 12)}…
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <span
                      className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                        TIER_BADGE[p.tier] ?? TIER_BADGE.starter
                      }`}
                    >
                      {p.tier || 'starter'}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-right tabular-nums font-medium text-gray-900 dark:text-[#e8eaed]">
                    {(p.patientCount ?? 0).toLocaleString()}
                  </td>
                  <td className="px-5 py-4 text-right tabular-nums text-gray-600 dark:text-[#a0a4ad]">
                    {(p.sessionCount ?? 0).toLocaleString()}
                  </td>
                  <td className="px-5 py-4 text-right tabular-nums text-gray-600 dark:text-[#a0a4ad]">
                    {(p.tokenBalance ?? 0).toLocaleString()}
                  </td>
                  <td className="px-5 py-4 text-right text-xs text-gray-400 dark:text-[#525666] hidden md:table-cell">
                    {p.createdAt
                      ? new Date(p.createdAt).toLocaleDateString('en-NG', {
                          day: '2-digit',
                          month: 'short',
                          year: 'numeric',
                        })
                      : '—'}
                  </td>
                  <td className="px-3 py-4">
                    <button className="p-1.5 text-gray-300 dark:text-[#525666] hover:text-gray-500 dark:hover:text-[#a0a4ad] hover:bg-gray-100 dark:hover:bg-[#1e2028] rounded-lg transition-colors opacity-0 group-hover:opacity-100">
                      <MoreVertical className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-5 py-16 text-center">
                    <Building2 className="w-8 h-8 text-gray-200 dark:text-[#2a2d35] mx-auto mb-3" />
                    <p className="text-sm font-medium text-gray-400 dark:text-[#525666]">
                      {search ? `No partners matching "${search}"` : 'No partners found'}
                    </p>
                    {search && (
                      <button
                        onClick={() => setSearch('')}
                        className="mt-2 text-xs text-[#073B4C] dark:text-[#00A8A8] hover:underline"
                      >
                        Clear search
                      </button>
                    )}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        {filtered.length > 0 && (
          <div className="px-5 py-3 border-t border-gray-100 dark:border-[#1e2028]">
            <p className="text-xs text-gray-400 dark:text-[#525666]">
              Showing {filtered.length} of {partners.length} partners
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
