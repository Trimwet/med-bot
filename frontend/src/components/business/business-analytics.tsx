import { useState, useEffect, useCallback } from 'react'
import { AlertCircle, Search, ChevronLeft, ChevronRight, ExternalLink, RefreshCw } from 'lucide-react'
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import { cn } from '@/lib/utils'
import { useChartTheme, CustomTooltip } from '@/components/ui/chart-theme'
import {
  getTenantOverview,
  getTenantSessions,
  getTenantTrends,
  type TenantOverview,
  type TenantSessionEntry,
  type TenantTrendsResponse,
} from '@/lib/api'

type TimeRange = '7d' | '30d' | '90d'

const verdictColors: Record<string, string> = {
  self_care: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
  consult: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
  emergency: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
}

const verdictLabels: Record<string, string> = {
  self_care: 'Self-Care',
  consult: 'Consult',
  emergency: 'Emergency',
}

const cardStyle = cn(
  'rounded-xl p-6',
  'bg-white border border-gray-200',
  'dark:bg-[#0f1117] dark:border-[#1e2028]',
)

const sectionTitle = 'text-sm font-semibold tracking-tight text-gray-900 dark:text-white'

export const BusinessAnalytics = () => {
  const [activeRange, setActiveRange] = useState<TimeRange>('30d')
  const [overview, setOverview] = useState<TenantOverview | null>(null)
  const [sessions, setSessions] = useState<TenantSessionEntry[]>([])
  const [sessionsTotal, setSessionsTotal] = useState(0)
  const [sessionsPage, setSessionsPage] = useState(1)
  const [sessionsTotalPages, setSessionsTotalPages] = useState(1)
  const [trends, setTrends] = useState<TenantTrendsResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [searchInput, setSearchInput] = useState('')
  const [filterVerdict, setFilterVerdict] = useState('')
  const [detailSessionId, setDetailSessionId] = useState<string | null>(null)
  const [detailMessages, setDetailMessages] = useState<Array<{ role: string; content: string }>>([])
  const theme = useChartTheme()

  const fetchData = useCallback(async () => {
    setLoading(true)
    try {
      const [ov, tr, se] = await Promise.all([
        getTenantOverview(),
        getTenantTrends(activeRange),
        getTenantSessions({ page: sessionsPage, limit: 10, verdict: filterVerdict || undefined, search: search || undefined }),
      ])
      setOverview(ov)
      setTrends(tr)
      setSessions(se.sessions)
      setSessionsTotal(se.total)
      setSessionsTotalPages(se.totalPages)
    } catch (err) {
      console.error('Failed to fetch tenant analytics', err)
    } finally {
      setLoading(false)
    }
  }, [activeRange, sessionsPage, filterVerdict, search])

  useEffect(() => { fetchData() }, [fetchData])

  useEffect(() => { setSessionsPage(1) }, [filterVerdict, search])

  const totalSymptoms = overview
    ? overview.verdictBreakdown.self_care + overview.verdictBreakdown.consult + overview.verdictBreakdown.emergency
    : 0

  const handleSearch = () => {
    setSearch(searchInput)
  }

  const handleSessionDetail = async (sessionId: string) => {
    try {
      const { getTenantSessionDetail } = await import('@/lib/api')
      const detail = await getTenantSessionDetail(sessionId)
      setDetailSessionId(sessionId)
      setDetailMessages(detail.messages)
    } catch {
      console.error('Failed to load session detail')
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-semibold tracking-tight text-gray-900 dark:text-white">Analytics</h1>
          <p className="text-sm text-gray-500 dark:text-[#71717a] mt-1">
            Insights and trends from assessments across your organization.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={fetchData}
            className="flex items-center gap-2 px-3 py-2 border border-gray-200 dark:border-[#1e2028] rounded-lg text-sm font-medium text-gray-700 dark:text-[#a0a4ad] hover:bg-gray-50 dark:hover:bg-[#1a1d25] transition-colors"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">Refresh</span>
          </button>
          <div className="flex items-center bg-gray-100 dark:bg-[#1a1d25] rounded-lg p-1">
            {(['7d', '30d', '90d'] as TimeRange[]).map((r) => (
              <button
                key={r}
                onClick={() => setActiveRange(r)}
                className={cn(
                  'px-3 py-1.5 rounded-md text-xs font-medium transition-colors',
                  activeRange === r
                    ? 'bg-[#073B4C] text-white'
                    : 'text-gray-500 dark:text-[#6b7080] hover:text-gray-700 dark:hover:text-[#a0a4ad]'
                )}
              >
                {r === '7d' ? '7D' : r === '30d' ? '30D' : '90D'}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Sessions', value: overview?.totalSessions ?? 0, color: 'text-gray-900 dark:text-white' },
          { label: 'Active', value: overview?.activeSessions ?? 0, color: 'text-blue-600 dark:text-blue-400' },
          { label: 'Completed', value: overview?.completedSessions ?? 0, color: 'text-emerald-600 dark:text-emerald-400' },
          {
            label: 'Emergency',
            value: overview?.emergencySessions ?? 0,
            color: 'text-red-600 dark:text-red-400',
            sub: overview ? `${((overview.emergencySessions / (overview.totalSessions || 1)) * 100).toFixed(1)}%` : '',
          },
        ].map((kpi) => (
          <div key={kpi.label} className={cardStyle}>
            <p className="text-[10px] font-medium uppercase tracking-wider text-gray-400 dark:text-[#52525b]">{kpi.label}</p>
            <p className={cn('text-2xl font-semibold tracking-tight mt-1', kpi.color)}>
              {loading ? '—' : kpi.value.toLocaleString()}
              {kpi.sub && <span className="text-xs font-normal text-gray-400 dark:text-[#525666] ml-1.5">({kpi.sub})</span>}
            </p>
          </div>
        ))}
      </div>

      {/* Verdict Breakdown + Top Symptoms */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Verdict Breakdown */}
        <div className={cardStyle}>
          <h3 className={sectionTitle}>Verdict Breakdown</h3>
          <div className="mt-4 space-y-3">
            {(['self_care', 'consult', 'emergency'] as const).map((v) => {
              const count = overview?.verdictBreakdown[v] ?? 0
              const pct = totalSymptoms > 0 ? (count / totalSymptoms) * 100 : 0
              return (
                <div key={v}>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-sm text-gray-700 dark:text-[#d4d4d8]">{verdictLabels[v]}</span>
                    <span className="text-xs tabular-nums text-gray-500 dark:text-[#71717a]">
                      {count.toLocaleString()} <span className="text-gray-400 dark:text-[#525666]">({pct.toFixed(1)}%)</span>
                    </span>
                  </div>
                  <div className="h-1.5 w-full rounded-full bg-gray-100 dark:bg-[#1a1d25]">
                    <div
                      className={cn('h-full rounded-full', v === 'self_care' ? 'bg-emerald-500' : v === 'consult' ? 'bg-amber-500' : 'bg-red-500')}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              )
            })}
          </div>
          <p className="text-xs text-gray-400 dark:text-[#525666] mt-5 text-center">
            Total Assessments: <span className="font-semibold text-gray-600 dark:text-[#71717a]">{totalSymptoms.toLocaleString()}</span>
          </p>
        </div>

        {/* Top Symptoms */}
        <div className={cardStyle}>
          <h3 className={sectionTitle}>Top Symptoms</h3>
          <div className="space-y-3.5 mt-4">
            {loading ? (
              <div className="space-y-3.5 py-2">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <div className="h-3 bg-gray-100 dark:bg-[#1a1d25] rounded animate-pulse w-24" />
                      <div className="h-3 bg-gray-100 dark:bg-[#1a1d25] rounded animate-pulse w-8" />
                    </div>
                    <div className="h-1.5 bg-gray-100 dark:bg-[#1a1d25] rounded-full animate-pulse w-full" />
                  </div>
                ))}
              </div>
            ) : trends?.topSymptoms && trends.topSymptoms.length > 0 ? (
              trends.topSymptoms.map((s, i) => {
                const maxCount = trends.topSymptoms[0]?.count || 1
                return (
                  <div key={s.name}>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-sm text-gray-700 dark:text-[#d4d4d8]">
                        <span className="text-gray-400 dark:text-[#525666] text-xs mr-1.5">#{i + 1}</span>
                        {s.name}
                      </span>
                      <span className="text-xs tabular-nums text-gray-500 dark:text-[#71717a]">{s.count}</span>
                    </div>
                    <div className="h-1.5 w-full rounded-full bg-gray-100 dark:bg-[#1a1d25]">
                      <div
                        className="h-full rounded-full bg-[#00A8A8]"
                        style={{ width: `${(s.count / maxCount) * 100}%` }}
                      />
                    </div>
                  </div>
                )
              })
            ) : (
              <p className="text-xs text-gray-400 dark:text-[#525666] text-center py-6">No symptom data yet</p>
            )}
          </div>
        </div>
      </div>

      {/* Trends Chart */}
      <div className={cardStyle}>
        <div className="flex items-center justify-between mb-5">
          <div>
            <h3 className={sectionTitle}>Assessment Trends</h3>
            <p className="text-xs text-gray-500 dark:text-[#71717a] mt-0.5">
              {activeRange === '7d' ? 'Last 7 days' : activeRange === '90d' ? 'Last 90 days' : 'Last 30 days'}
            </p>
          </div>
          <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-[#71717a]">
            <span className="flex items-center gap-1.5"><span className="h-0.5 w-3 rounded-full bg-[#00A8A8]" /> Total</span>
            <span className="flex items-center gap-1.5"><span className="h-0.5 w-3 rounded-full bg-red-500" /> Emergency</span>
          </div>
        </div>
        <div className="h-56">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={trends?.daily ?? []}>
              <defs>
                <linearGradient id="totalGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#00A8A8" stopOpacity={0.15} />
                  <stop offset="100%" stopColor="#00A8A8" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="emergencyGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#EF4444" stopOpacity={0.15} />
                  <stop offset="100%" stopColor="#EF4444" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid {...theme.grid} vertical={false} />
              <XAxis dataKey="date" tick={theme.axis} axisLine={false} tickLine={false} />
              <YAxis tick={theme.axis} axisLine={false} tickLine={false} width={40} />
              <Tooltip content={<CustomTooltip />} cursor={{ stroke: theme.cursor, strokeWidth: 1 }} />
              <Area type="monotone" dataKey="total" stroke="#00A8A8" strokeWidth={2} fill="url(#totalGrad)" />
              <Area type="monotone" dataKey="emergency" stroke="#EF4444" strokeWidth={2} fill="url(#emergencyGrad)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Sessions Table */}
      <div className={cardStyle}>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-5">
          <h3 className={sectionTitle}>Recent Sessions</h3>
          <div className="flex items-center gap-2">
            <select
              value={filterVerdict}
              onChange={(e) => setFilterVerdict(e.target.value)}
              className="text-xs bg-gray-100 dark:bg-[#1a1d25] border-0 rounded-lg px-2.5 py-1.5 text-gray-700 dark:text-[#d4d4d8] focus:ring-0"
            >
              <option value="">All Verdicts</option>
              <option value="self_care">Self-Care</option>
              <option value="consult">Consult</option>
              <option value="emergency">Emergency</option>
            </select>
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400" />
              <input
                type="text"
                placeholder="Search..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                className="text-xs bg-gray-100 dark:bg-[#1a1d25] border-0 rounded-lg pl-8 pr-2.5 py-1.5 text-gray-700 dark:text-[#d4d4d8] placeholder:text-gray-400 focus:ring-0 w-40"
              />
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-gray-100 dark:border-[#1e2028]">
                <th className="pb-2 text-[10px] font-medium uppercase tracking-wider text-gray-400 dark:text-[#52525b]">Session</th>
                <th className="pb-2 text-[10px] font-medium uppercase tracking-wider text-gray-400 dark:text-[#52525b]">Verdict</th>
                <th className="pb-2 text-[10px] font-medium uppercase tracking-wider text-gray-400 dark:text-[#52525b]">Messages</th>
                <th className="pb-2 text-[10px] font-medium uppercase tracking-wider text-gray-400 dark:text-[#52525b]">Symptoms</th>
                <th className="pb-2 text-[10px] font-medium uppercase tracking-wider text-gray-400 dark:text-[#52525b]">Date</th>
                <th className="pb-2 text-[10px] font-medium uppercase tracking-wider text-gray-400 dark:text-[#52525b]"></th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                [...Array(5)].map((_, i) => (
                  <tr key={i} className="border-b border-gray-50 dark:border-[#1a1d25]">
                    <td className="py-3" colSpan={6}>
                      <div className="flex items-center gap-4">
                        <div className="h-3 bg-gray-100 dark:bg-[#1a1d25] rounded animate-pulse w-28" />
                        <div className="h-5 bg-gray-100 dark:bg-[#1a1d25] rounded-full animate-pulse w-14" />
                        <div className="h-3 bg-gray-100 dark:bg-[#1a1d25] rounded animate-pulse w-8" />
                        <div className="h-3 bg-gray-100 dark:bg-[#1a1d25] rounded animate-pulse w-20" />
                        <div className="h-3 bg-gray-100 dark:bg-[#1a1d25] rounded animate-pulse w-16 ml-auto" />
                      </div>
                    </td>
                  </tr>
                ))
              ) : sessions.length === 0 ? (
                <tr><td colSpan={6} className="text-center py-8 text-xs text-gray-400">No sessions found</td></tr>
              ) : (
                sessions.map((s) => (
                  <tr key={s.sessionId} className="border-b border-gray-50 dark:border-[#1a1d25] last:border-0">
                    <td className="py-3">
                      <p className="text-xs font-medium text-gray-900 dark:text-white truncate max-w-[140px]">
                        {s.firstMessage || s.sessionId.slice(0, 16)}
                      </p>
                      <p className="text-[10px] text-gray-400 dark:text-[#525666]">{s.sessionId.slice(0, 12)}...</p>
                    </td>
                    <td className="py-3">
                      {s.verdict ? (
                        <span className={cn('text-[10px] font-medium px-2 py-0.5 rounded-full', verdictColors[s.verdict])}>
                          {verdictLabels[s.verdict] || s.verdict}
                        </span>
                      ) : (
                        <span className="text-[10px] text-gray-400 dark:text-[#525666]">—</span>
                      )}
                    </td>
                    <td className="py-3 text-xs tabular-nums text-gray-600 dark:text-[#a1a1aa]">{s.messageCount}</td>
                    <td className="py-3">
                      {s.symptoms.length > 0 ? (
                        <div className="flex flex-wrap gap-1">
                          {s.symptoms.slice(0, 2).map((sym) => (
                            <span key={sym} className="text-[10px] bg-gray-100 dark:bg-[#1a1d25] text-gray-600 dark:text-[#a1a1aa] px-1.5 py-0.5 rounded">
                              {sym}
                            </span>
                          ))}
                          {s.symptoms.length > 2 && (
                            <span className="text-[10px] text-gray-400">+{s.symptoms.length - 2}</span>
                          )}
                        </div>
                      ) : (
                        <span className="text-[10px] text-gray-400 dark:text-[#525666]">—</span>
                      )}
                    </td>
                    <td className="py-3 text-[10px] text-gray-500 dark:text-[#71717a] tabular-nums whitespace-nowrap">
                      {new Date(s.createdAt).toLocaleDateString('en-NG', { month: 'short', day: 'numeric' })}
                    </td>
                    <td className="py-3">
                      <button
                        onClick={() => handleSessionDetail(s.sessionId)}
                        className="text-gray-400 hover:text-[#00A8A8] transition-colors"
                        title="View session"
                      >
                        <ExternalLink className="h-3.5 w-3.5" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {sessionsTotalPages > 1 && (
          <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100 dark:border-[#1e2028]">
            <p className="text-xs text-gray-500 dark:text-[#71717a]">
              Page {sessionsPage} of {sessionsTotalPages} ({sessionsTotal} total)
            </p>
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setSessionsPage((p) => Math.max(1, p - 1))}
                disabled={sessionsPage === 1}
                className="p-1 rounded text-gray-400 hover:text-gray-700 dark:hover:text-white disabled:opacity-30"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button
                onClick={() => setSessionsPage((p) => Math.min(sessionsTotalPages, p + 1))}
                disabled={sessionsPage === sessionsTotalPages}
                className="p-1 rounded text-gray-400 hover:text-gray-700 dark:hover:text-white disabled:opacity-30"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Session Detail Modal */}
      {detailSessionId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={() => setDetailSessionId(null)}>
          <div
            className="bg-white dark:bg-[#0f1117] rounded-xl border border-gray-200 dark:border-[#1e2028] max-w-lg w-full max-h-[80vh] overflow-hidden flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-4 border-b border-gray-100 dark:border-[#1e2028]">
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Session Detail</h3>
              <button onClick={() => setDetailSessionId(null)} className="text-gray-400 hover:text-gray-700 dark:hover:text-white text-xs">Close</button>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {detailMessages.map((m, i) => (
                <div key={i} className={cn('text-xs p-2.5 rounded-lg', m.role === 'user' ? 'bg-gray-100 dark:bg-[#1a1d25]' : 'bg-[#00A8A8]/10 dark:bg-[#00A8A8]/5')}>
                  <p className="text-[10px] font-medium uppercase tracking-wider text-gray-400 dark:text-[#52525b] mb-1">{m.role}</p>
                  <p className="text-gray-700 dark:text-[#d4d4d8] whitespace-pre-wrap">{m.content}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Disclaimer */}
      <div className="rounded-xl border border-gray-200 dark:border-[#1e2028] bg-gray-50 dark:bg-[#080a0e] p-4">
        <div className="flex items-start gap-2.5">
          <AlertCircle className="h-4 w-4 text-gray-400 dark:text-[#525666] mt-0.5 shrink-0" strokeWidth={1.5} />
          <p className="text-xs text-gray-500 dark:text-[#71717a] leading-relaxed">
            Analytics data reflects your organization's assessment sessions. All times are in your local timezone.
            Data refreshes in real time as new sessions are completed.
          </p>
        </div>
      </div>
    </div>
  )
}
