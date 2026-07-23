import { useEffect, useState } from 'react'
import { Building2, Search, Plus, Download, MoreVertical, Coins, Star } from 'lucide-react'
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

type TierFilter = 'all' | 'enterprise' | 'growth' | 'starter'

export const AdminTenants = () => {
  const [tenants, setTenants] = useState<Tenant[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [tierFilter, setTierFilter] = useState<TierFilter>('all')

  useEffect(() => {
    adminApi.getTenants()
      .then((data) => setTenants(data.tenants || []))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  const filtered = tenants.filter((t) => {
    const matchSearch = !search || t.name.toLowerCase().includes(search.toLowerCase())
    const matchTier = tierFilter === 'all' || t.tier === tierFilter
    return matchSearch && matchTier
  })

  const enterpriseCount = tenants.filter((t) => t.tier === 'enterprise').length
  const totalTokens = tenants.reduce((s, t) => s + (t.tokenBalance || 0), 0)

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="flex items-center justify-between">
          <div className="h-8 w-36 bg-gray-100 dark:bg-[#1a1d25] rounded-lg" />
          <div className="flex gap-3">
            <div className="h-9 w-24 bg-gray-100 dark:bg-[#1a1d25] rounded-lg" />
            <div className="h-9 w-28 bg-gray-100 dark:bg-[#1a1d25] rounded-lg" />
          </div>
        </div>
        <div className="grid grid-cols-3 gap-4">
          {[...Array(3)].map((_, i) => <div key={i} className="h-24 bg-gray-100 dark:bg-[#1a1d25] rounded-xl" />)}
        </div>
        <div className="h-64 bg-gray-100 dark:bg-[#1a1d25] rounded-xl" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-[#e8eaed]">Tenants</h1>
          <p className="text-sm text-gray-500 dark:text-[#6b7080] mt-1">{tenants.length} registered hospital tenants</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-3 py-2 border border-gray-200 dark:border-[#1e2028] rounded-lg text-sm font-medium text-gray-700 dark:text-[#a0a4ad] hover:bg-gray-50 dark:hover:bg-[#1a1d25] transition-colors">
            <Download className="w-4 h-4" />
            <span className="hidden sm:inline">Export</span>
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-[#073B4C] text-white rounded-lg text-sm font-semibold hover:bg-[#054A5E] transition-colors">
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">Add Tenant</span>
            <span className="sm:hidden">Add</span>
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: 'Total Tenants', value: tenants.length, icon: Building2, color: '#073B4C' },
          { label: 'Enterprise Partners', value: enterpriseCount, icon: Star, color: '#8B5CF6' },
          { label: 'Platform Token Pool', value: totalTokens >= 1000 ? `${(totalTokens / 1000).toFixed(0)}k` : String(totalTokens), icon: Coins, color: '#F59E0B' },
        ].map((item) => {
          const Icon = item.icon
          return (
            <div key={item.label} className="bg-white dark:bg-[#0f1117] border border-gray-200 dark:border-[#1e2028] rounded-xl p-5 flex items-center gap-4 transition-colors">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0" style={{ backgroundColor: `${item.color}15` }}>
                <Icon className="w-4 h-4" style={{ color: item.color }} />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900 dark:text-[#e8eaed] tabular-nums tracking-tight">{item.value}</p>
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
            placeholder="Search tenants..."
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

      {/* Table — desktop */}
      <div className="bg-white dark:bg-[#0f1117] rounded-xl border border-gray-200 dark:border-[#1e2028] overflow-hidden hidden md:block">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 dark:border-[#1e2028] bg-gray-50 dark:bg-[#1a1d25]">
                <th className="text-left px-5 py-3 font-semibold text-gray-500 dark:text-[#6b7080] text-xs uppercase tracking-wide">Tenant</th>
                <th className="text-left px-5 py-3 font-semibold text-gray-500 dark:text-[#6b7080] text-xs uppercase tracking-wide">Plan</th>
                <th className="text-right px-5 py-3 font-semibold text-gray-500 dark:text-[#6b7080] text-xs uppercase tracking-wide">Tokens</th>
                <th className="text-right px-5 py-3 font-semibold text-gray-500 dark:text-[#6b7080] text-xs uppercase tracking-wide">Sessions</th>
                <th className="text-right px-5 py-3 font-semibold text-gray-500 dark:text-[#6b7080] text-xs uppercase tracking-wide">Patients</th>
                <th className="text-right px-5 py-3 font-semibold text-gray-500 dark:text-[#6b7080] text-xs uppercase tracking-wide">Created</th>
                <th className="px-3 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-[#1e2028]">
              {filtered.map((t) => (
                <tr key={t.id} className="hover:bg-gray-50 dark:hover:bg-[#1a1d25] transition-colors group">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-[#073B4C]/10 flex items-center justify-center shrink-0">
                        <Building2 className="w-4 h-4 text-[#073B4C]" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 dark:text-[#e8eaed]">{t.name}</p>
                        <p className="text-[10px] text-gray-400 dark:text-[#525666] font-mono">{t.id.slice(0, 12)}…</p>
                      </div>
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
                      {t.tier || 'starter'}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-right tabular-nums font-medium text-gray-900 dark:text-[#e8eaed]">
                    {(t.tokenBalance ?? 0).toLocaleString()}
                  </td>
                  <td className="px-5 py-4 text-right tabular-nums text-gray-600 dark:text-[#a0a4ad]">{t.sessionCount}</td>
                  <td className="px-5 py-4 text-right tabular-nums text-gray-600 dark:text-[#a0a4ad]">{t.patientCount}</td>
                  <td className="px-5 py-4 text-right text-xs text-gray-400 dark:text-[#525666]">
                    {t.createdAt ? new Date(t.createdAt).toLocaleDateString('en-NG', { day: '2-digit', month: 'short', year: 'numeric' }) : '-'}
                  </td>
                  <td className="px-3 py-4">
                    <button className="p-1.5 text-gray-300 dark:text-[#525666] hover:text-gray-500 dark:hover:text-[#a0a4ad] hover:bg-gray-100 dark:hover:bg-[#1e2028] rounded-lg transition-colors opacity-0 group-hover:opacity-100">
                      <MoreVertical className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filtered.length > 0 && (
          <div className="px-5 py-3 border-t border-gray-100 dark:border-[#1e2028]">
            <p className="text-xs text-gray-400 dark:text-[#525666]">Showing {filtered.length} of {tenants.length} tenants</p>
          </div>
        )}
        {filtered.length === 0 && (
          <div className="px-5 py-16 text-center">
            <Building2 className="w-8 h-8 text-gray-200 dark:text-[#2a2d35] mx-auto mb-3" />
            <p className="text-sm font-medium text-gray-400 dark:text-[#525666]">
              {search ? `No tenants matching "${search}"` : 'No tenants found'}
            </p>
            {search && (
              <button onClick={() => setSearch('')} className="mt-2 text-xs text-[#073B4C] dark:text-[#00A8A8] hover:underline">
                Clear search
              </button>
            )}
          </div>
        )}
      </div>

      {/* Cards — mobile */}
      <div className="space-y-3 md:hidden">
        {filtered.map((t) => (
          <div key={t.id} className="bg-white dark:bg-[#0f1117] border border-gray-200 dark:border-[#1e2028] rounded-xl p-4">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-3 min-w-0">
                <div className="w-9 h-9 rounded-lg bg-[#073B4C]/10 flex items-center justify-center shrink-0">
                  <Building2 className="w-4 h-4 text-[#073B4C]" />
                </div>
                <div className="min-w-0 break-words">
                  <p className="font-medium text-gray-900 dark:text-[#e8eaed] break-words">{t.name}</p>
                  <p className="text-[10px] text-gray-400 dark:text-[#525666] font-mono break-all">{t.id.slice(0, 12)}…</p>
                </div>
              </div>
              <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium shrink-0 ${
                t.tier === 'enterprise'
                  ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400'
                  : t.tier === 'growth'
                  ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                  : 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400'
              }`}>
                {t.tier || 'starter'}
              </span>
            </div>
            <div className="grid grid-cols-3 gap-3 mt-3 pt-3 border-t border-gray-100 dark:border-[#1e2028]">
              <div className="text-center">
                <p className="text-sm font-bold text-gray-900 dark:text-[#e8eaed] tabular-nums">{(t.tokenBalance ?? 0).toLocaleString()}</p>
                <p className="text-[10px] text-gray-400 dark:text-[#525666]">Tokens</p>
              </div>
              <div className="text-center">
                <p className="text-sm font-bold text-gray-900 dark:text-[#e8eaed] tabular-nums">{t.sessionCount}</p>
                <p className="text-[10px] text-gray-400 dark:text-[#525666]">Sessions</p>
              </div>
              <div className="text-center">
                <p className="text-sm font-bold text-gray-900 dark:text-[#e8eaed] tabular-nums">{t.patientCount}</p>
                <p className="text-[10px] text-gray-400 dark:text-[#525666]">Patients</p>
              </div>
            </div>
          </div>
        ))}
        {filtered.length === 0 && (
          <div className="bg-white dark:bg-[#0f1117] border border-gray-200 dark:border-[#1e2028] rounded-xl px-5 py-16 text-center">
            <Building2 className="w-8 h-8 text-gray-200 dark:text-[#2a2d35] mx-auto mb-3" />
            <p className="text-sm font-medium text-gray-400 dark:text-[#525666]">
              {search ? `No tenants matching "${search}"` : 'No tenants found'}
            </p>
          </div>
        )}
        {filtered.length > 0 && (
          <p className="text-xs text-gray-400 dark:text-[#525666] text-center pt-1">Showing {filtered.length} of {tenants.length} tenants</p>
        )}
      </div>
    </div>
  )
}
