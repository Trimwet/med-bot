import { useEffect, useState, useRef } from 'react'
import {
  Activity,
  Users,
  AlertTriangle,
  Clock,
  TrendingUp,
  TrendingDown,
  Download,
  FileSpreadsheet,
  Image,
  ChevronDown,
} from 'lucide-react'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
  Brush,
} from 'recharts'
import { useChartTheme, CustomTooltip } from '@/components/ui/chart-theme'
import { adminApi } from './admin-api'
import NumberFlow from '@number-flow/react'
import * as XLSX from 'xlsx'
import { toPng } from 'html-to-image'

interface Stats {
  totalSessions: number
  activeSessions: number
  completedSessions: number
  emergencySessions: number
  totalUsers: number
  totalProtocols: number
  totalRules: number
  verdictBreakdown: Record<string, number>
  recentSessions: Array<{ sessionId: string; userId: string; verdict: string; status: string; createdAt: string }>
}

interface DailyData {
  date: string
  count: number
}

const TIME_RANGES = ['7d', '30d', '90d'] as const

const DAYS_MAP: Record<string, number> = { '7d': 7, '30d': 30, '90d': 90 }

function filterByDays(data: DailyData[], days: number): DailyData[] {
  if (days >= 90) return data
  const cutoff = new Date()
  cutoff.setDate(cutoff.getDate() - days)
  return data.filter((d) => new Date(d.date) >= cutoff)
}

const VERDICT_COLORS: Record<string, string> = {
  self_care: '#22C55E',
  consult: '#F59E0B',
  emergency: '#EF4444',
}

const VERDICT_LABELS: Record<string, string> = {
  self_care: 'Self Care',
  consult: 'Consult',
  emergency: 'Emergency',
}

const VERDICT_BADGE: Record<string, string> = {
  emergency: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
  consult: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
  self_care: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
}

export const AdminOverview = () => {
  const [stats, setStats] = useState<Stats | null>(null)
  const [dailySessions, setDailySessions] = useState<DailyData[]>([])
  const [dailyUsers, setDailyUsers] = useState<DailyData[]>([])
  const [loading, setLoading] = useState(true)
  const [timeRange, setTimeRange] = useState<(typeof TIME_RANGES)[number]>('30d')
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const overviewRef = useRef<HTMLDivElement>(null)
  const theme = useChartTheme()

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  useEffect(() => {
    setLoading(true)
    Promise.all([
      adminApi.getStats(),
      adminApi.getDailyAnalytics(),
    ]).then(([statsData, dailyData]) => {
      setStats(statsData)
      setDailySessions(dailyData.sessionGrowth || [])
      setDailyUsers(dailyData.userGrowth || [])
    }).catch(console.error).finally(() => setLoading(false))
  }, [])

  const days = DAYS_MAP[timeRange]
  const filteredSessions = filterByDays(dailySessions, days)
  const filteredUsers = filterByDays(dailyUsers, days)

  const handleExportExcel = () => {
    setDropdownOpen(false)
    const wb = XLSX.utils.book_new()

    const kpiData = [
      ['Metric', 'Value'],
      ['Total Sessions', stats?.totalSessions ?? 0],
      ['Active Sessions', stats?.activeSessions ?? 0],
      ['Completed Sessions', stats?.completedSessions ?? 0],
      ['Emergency Sessions', stats?.emergencySessions ?? 0],
      ['Total Users', stats?.totalUsers ?? 0],
      ['Total Protocols', stats?.totalProtocols ?? 0],
      ['Total Rules', stats?.totalRules ?? 0],
    ]
    const kpiSheet = XLSX.utils.aoa_to_sheet(kpiData)
    XLSX.utils.book_append_sheet(wb, kpiSheet, 'KPI Summary')

    const verdictData = [
      ['Verdict', 'Count'],
      ...Object.entries(stats?.verdictBreakdown ?? {}).map(([verdict, count]) => [verdict, count]),
    ]
    const verdictSheet = XLSX.utils.aoa_to_sheet(verdictData)
    XLSX.utils.book_append_sheet(wb, verdictSheet, 'Verdict Breakdown')

    const sessionData = [
      ['Date', 'Sessions'],
      ...filteredSessions.map((d) => [d.date, d.count]),
    ]
    const sessionSheet = XLSX.utils.aoa_to_sheet(sessionData)
    XLSX.utils.book_append_sheet(wb, sessionSheet, `Sessions (${timeRange})`)

    const userData = [
      ['Date', 'Users'],
      ...filteredUsers.map((d) => [d.date, d.count]),
    ]
    const userSheet = XLSX.utils.aoa_to_sheet(userData)
    XLSX.utils.book_append_sheet(wb, userSheet, `Users (${timeRange})`)

    const recentData = [
      ['Session ID', 'Verdict', 'Status', 'Created At'],
      ...(stats?.recentSessions ?? []).map((s) => [s.sessionId, s.verdict, s.status, s.createdAt]),
    ]
    const recentSheet = XLSX.utils.aoa_to_sheet(recentData)
    XLSX.utils.book_append_sheet(wb, recentSheet, 'Recent Sessions')

    XLSX.writeFile(wb, `medbot-overview-${timeRange}-${new Date().toISOString().slice(0, 10)}.xlsx`)
  }

  const handleExportImage = async () => {
    setDropdownOpen(false)
    if (!overviewRef.current) return
    try {
      const dataUrl = await toPng(overviewRef.current, {
        backgroundColor: '#ffffff',
        pixelRatio: 2,
      })
      const link = document.createElement('a')
      link.href = dataUrl
      link.download = `medbot-overview-${timeRange}-${new Date().toISOString().slice(0, 10)}.png`
      link.click()
    } catch (err) {
      console.error('Failed to export image:', err)
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="h-8 w-48 bg-gray-100 dark:bg-[#1a1d25] rounded-lg animate-pulse" />
          <div className="h-9 w-40 bg-gray-100 dark:bg-[#1a1d25] rounded-lg animate-pulse" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-28 bg-gray-100 dark:bg-[#1a1d25] rounded-xl animate-pulse" />
          ))}
        </div>
        <div className="grid lg:grid-cols-2 gap-6">
          <div className="h-80 bg-gray-100 dark:bg-[#1a1d25] rounded-xl animate-pulse" />
          <div className="h-80 bg-gray-100 dark:bg-[#1a1d25] rounded-xl animate-pulse" />
        </div>
      </div>
    )
  }

  const kpis = [
    { label: 'Total Sessions', value: stats?.totalSessions ?? 0, icon: Activity, color: '#073B4C', trend: '+12%', up: true },
    { label: 'Active Now', value: stats?.activeSessions ?? 0, icon: Clock, color: '#00A8A8', trend: '+5%', up: true },
    { label: 'Total Users', value: stats?.totalUsers ?? 0, icon: Users, color: '#6366F1', trend: '+8%', up: true },
    { label: 'Emergency Cases', value: stats?.emergencySessions ?? 0, icon: AlertTriangle, color: '#EF4444', trend: '-3%', up: false },
  ]

  const verdictEntries = stats?.verdictBreakdown ? Object.entries(stats.verdictBreakdown) : []
  const maxVerdict = Math.max(...verdictEntries.map(([, v]) => v), 1)
  const totalVerdicts = verdictEntries.reduce((s, [, v]) => s + v, 0)

  return (
    <div className="space-y-6" ref={overviewRef}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-[#e8eaed] tracking-tight">Overview</h1>
          <p className="text-sm text-gray-500 dark:text-[#6b7080] mt-1">Platform-wide metrics and live activity</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center bg-gray-100 dark:bg-[#1a1d25] rounded-lg p-1">
            {TIME_RANGES.map((range) => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                  timeRange === range
                    ? 'bg-[#073B4C] text-white shadow-sm'
                    : 'text-gray-500 dark:text-[#6b7080] hover:text-gray-700 dark:hover:text-gray-300'
                }`}
              >
                {range}
              </button>
            ))}
          </div>
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center gap-2 px-3 py-1.5 border border-gray-200 dark:border-[#1e2028] rounded-lg text-sm font-medium text-gray-700 dark:text-[#a0a4ad] hover:bg-gray-50 dark:hover:bg-[#1a1d25] transition-colors"
            >
              <Download className="w-4 h-4" />
              <span className="hidden sm:inline">Export</span>
              <ChevronDown className={`w-3.5 h-3.5 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
            </button>
            {dropdownOpen && (
              <div className="absolute right-0 top-full mt-1 w-48 bg-white dark:bg-[#1a1d25] border border-gray-200 dark:border-[#1e2028] rounded-xl shadow-lg py-1 z-50">
                <button
                  onClick={handleExportExcel}
                  className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-gray-700 dark:text-[#a0a4ad] hover:bg-gray-50 dark:hover:bg-[#22252d] transition-colors"
                >
                  <FileSpreadsheet className="w-4 h-4 text-emerald-500" />
                  Export as Excel
                </button>
                <button
                  onClick={handleExportImage}
                  className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-gray-700 dark:text-[#a0a4ad] hover:bg-gray-50 dark:hover:bg-[#22252d] transition-colors"
                >
                  <Image className="w-4 h-4 text-blue-500" />
                  Download as Image
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Section Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((kpi) => {
          const Icon = kpi.icon
          return (
            <div
              key={kpi.label}
              className="group bg-white dark:bg-[#0f1117] border border-gray-200 dark:border-[#1e2028] rounded-xl p-5 transition-all hover:dark:border-white/[0.1]"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-medium text-gray-500 dark:text-[#6b7080]">{kpi.label}</span>
                <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${kpi.color}15` }}>
                  <Icon className="w-4 h-4" style={{ color: kpi.color }} />
                </div>
              </div>
              <div className="flex items-end justify-between">
                <p className="text-3xl font-semibold tracking-tight text-gray-900 dark:text-white tabular-nums">
                  <NumberFlow value={kpi.value} />
                </p>
                <span className={`inline-flex items-center gap-0.5 text-xs font-semibold ${
                  kpi.up ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'
                }`}>
                  {kpi.up ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                  {kpi.trend}
                </span>
              </div>
            </div>
          )
        })}
      </div>

      {/* Charts */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Session Growth */}
        <div className="bg-white dark:bg-[#0f1117] rounded-xl border border-gray-200 dark:border-[#1e2028] p-5">
          <div className="mb-4">
            <h3 className="font-semibold text-gray-900 dark:text-[#e8eaed]">Session Growth</h3>
            <p className="text-xs text-gray-400 dark:text-[#525666] mt-0.5">Drag the brush below to zoom into a time range</p>
          </div>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={filteredSessions} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
                <defs>
                  <linearGradient id="adminSessionGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={theme.areaStroke} stopOpacity={0.25} />
                    <stop offset="100%" stopColor={theme.areaStroke} stopOpacity={0.02} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke={theme.grid.stroke} strokeDasharray={theme.grid.strokeDasharray} vertical={false} />
                <XAxis dataKey="date" tick={theme.axis} tickFormatter={(v) => { const d = new Date(v); return `${d.getMonth() + 1}/${d.getDate()}` }} axisLine={false} tickLine={false} />
                <YAxis tick={theme.axis} allowDecimals={false} axisLine={false} tickLine={false} width={30} />
                <Tooltip content={<CustomTooltip />} cursor={{ stroke: theme.cursor }} />
                <Area type="monotone" dataKey="count" stroke={theme.areaStroke} fill="url(#adminSessionGrad)" strokeWidth={2} dot={false} activeDot={{ fill: theme.activeDotFill, stroke: theme.activeDotStroke, strokeWidth: 2, r: 4 }} />
                <Brush
                  dataKey="date"
                  height={24}
                  stroke={theme.areaStroke}
                  fill="#f9fafb"
                  travellerWidth={8}
                  tickFormatter={(v) => { const d = new Date(v); return `${d.getMonth() + 1}/${d.getDate()}` }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* User Growth */}
        <div className="bg-white dark:bg-[#0f1117] rounded-xl border border-gray-200 dark:border-[#1e2028] p-5">
          <div className="mb-4">
            <h3 className="font-semibold text-gray-900 dark:text-[#e8eaed]">User Growth</h3>
            <p className="text-xs text-gray-400 dark:text-[#525666] mt-0.5">New registrations per day</p>
          </div>
          <div className="h-52">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={filteredUsers} barCategoryGap="20%" barGap={4}>
                <CartesianGrid stroke={theme.grid.stroke} strokeDasharray={theme.grid.strokeDasharray} vertical={false} />
                <XAxis dataKey="date" tick={theme.axis} tickFormatter={(v) => { const d = new Date(v); return `${d.getMonth() + 1}/${d.getDate()}` }} axisLine={false} tickLine={false} />
                <YAxis tick={theme.axis} allowDecimals={false} axisLine={false} tickLine={false} width={30} />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: theme.cursor }} />
                <Bar dataKey="count" fill={theme.bar} radius={[4, 4, 0, 0]} maxBarSize={36} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Bottom Row */}
      <div className="grid lg:grid-cols-5 gap-6">
        {/* Verdict Breakdown */}
        <div className="lg:col-span-2 bg-white dark:bg-[#0f1117] rounded-xl border border-gray-200 dark:border-[#1e2028] p-5">
          <div className="mb-5">
            <h3 className="font-semibold text-gray-900 dark:text-[#e8eaed]">Verdict Breakdown</h3>
            <p className="text-xs text-gray-400 dark:text-[#525666] mt-0.5">{totalVerdicts} total decisions</p>
          </div>
          <div className="space-y-4">
            {verdictEntries.map(([verdict, count]) => {
              const pct = totalVerdicts > 0 ? Math.round((count / totalVerdicts) * 100) : 0
              const barPct = Math.round((count / maxVerdict) * 100)
              const color = VERDICT_COLORS[verdict] || '#6366F1'
              return (
                <div key={verdict}>
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: color }} />
                      <span className="text-sm font-medium text-gray-700 dark:text-[#a0a4ad]">{VERDICT_LABELS[verdict] || verdict}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-400 dark:text-[#525666]">{pct}%</span>
                      <span className="text-sm font-semibold text-gray-900 dark:text-[#e8eaed] tabular-nums w-8 text-right">{count}</span>
                    </div>
                  </div>
                  <div className="w-full h-1.5 bg-gray-100 dark:bg-[#1a1d25] rounded-full overflow-hidden">
                    <div className="h-full rounded-full transition-all duration-500" style={{ width: `${barPct}%`, backgroundColor: color }} />
                  </div>
                </div>
              )
            })}
            {verdictEntries.length === 0 && (
              <div className="py-8 text-center">
                <Activity className="w-8 h-8 text-gray-200 dark:text-[#2a2d35] mx-auto mb-2" />
                <p className="text-sm text-gray-400 dark:text-[#525666]">No verdict data yet</p>
              </div>
            )}
          </div>
        </div>

        {/* Recent Sessions Table */}
        <div className="lg:col-span-3 bg-white dark:bg-[#0f1117] rounded-xl border border-gray-200 dark:border-[#1e2028] overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100 dark:border-[#1e2028]">
            <h3 className="font-semibold text-gray-900 dark:text-[#e8eaed]">Recent Sessions</h3>
            <p className="text-xs text-gray-400 dark:text-[#525666] mt-0.5">Latest triage activity across all tenants</p>
          </div>

          {/* Table — desktop */}
          <div className="overflow-x-auto hidden md:block">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 dark:border-[#1e2028]">
                  <th className="text-left px-5 py-3 text-[10px] font-semibold text-gray-400 dark:text-[#525666] uppercase tracking-wider">Session</th>
                  <th className="text-left px-5 py-3 text-[10px] font-semibold text-gray-400 dark:text-[#525666] uppercase tracking-wider">Verdict</th>
                  <th className="text-left px-5 py-3 text-[10px] font-semibold text-gray-400 dark:text-[#525666] uppercase tracking-wider">Status</th>
                  <th className="text-right px-5 py-3 text-[10px] font-semibold text-gray-400 dark:text-[#525666] uppercase tracking-wider">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-[#1e2028]">
                {stats?.recentSessions?.slice(0, 8).map((s) => (
                  <tr key={s.sessionId} className="hover:bg-gray-50 dark:hover:bg-[#1a1d25] transition-colors">
                    <td className="px-5 py-3">
                      <p className="font-mono text-xs text-gray-900 dark:text-[#e8eaed] truncate max-w-[160px]">{s.sessionId.slice(0, 12)}...</p>
                    </td>
                    <td className="px-5 py-3">
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${VERDICT_BADGE[s.verdict] || 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400'}`}>
                        {VERDICT_LABELS[s.verdict] || s.verdict || 'pending'}
                      </span>
                    </td>
                    <td className="px-5 py-3">
                      <span className="text-xs text-gray-500 dark:text-[#6b7080] capitalize">{s.status}</span>
                    </td>
                    <td className="px-5 py-3 text-right">
                      <span className="text-xs text-gray-400 dark:text-[#525666]">
                        {new Date(s.createdAt).toLocaleDateString('en-NG', { month: 'short', day: 'numeric' })}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Cards — mobile */}
          <div className="md:hidden divide-y divide-gray-100 dark:divide-[#1e2028]">
            {stats?.recentSessions?.slice(0, 8).map((s) => (
              <div key={s.sessionId} className="px-4 py-3 flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <p className="font-mono text-xs text-gray-900 dark:text-[#e8eaed] truncate">{s.sessionId.slice(0, 12)}...</p>
                  <span className="text-[10px] text-gray-400 dark:text-[#525666] capitalize">{s.status}</span>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${VERDICT_BADGE[s.verdict] || 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400'}`}>
                    {VERDICT_LABELS[s.verdict] || s.verdict || 'pending'}
                  </span>
                  <span className="text-[10px] text-gray-400 dark:text-[#525666] tabular-nums">
                    {new Date(s.createdAt).toLocaleDateString('en-NG', { month: 'short', day: 'numeric' })}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {(!stats?.recentSessions || stats.recentSessions.length === 0) && (
            <div className="px-5 py-12 text-center">
              <Clock className="w-8 h-8 text-gray-200 dark:text-[#2a2d35] mx-auto mb-2" />
              <p className="text-sm text-gray-400 dark:text-[#525666]">No sessions recorded yet</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
