import { useEffect, useState } from 'react'
import {
  Activity,
  Users,
  AlertTriangle,
  Clock,
  CheckCircle,
  BookOpen,
  Shield,
  Download,
  TrendingUp,
  TrendingDown,
  RefreshCw,
  MoreVertical,
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
} from 'recharts'
import { useChartTheme, CustomTooltip } from '@/components/ui/chart-theme'
import { adminApi } from './admin-api'
import NumberFlow from '@number-flow/react'

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
  const theme = useChartTheme()

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

  if (loading) {
    return (
      <div className="animate-pulse space-y-6">
        <div className="flex items-center justify-between">
          <div className="h-8 w-48 bg-gray-100 dark:bg-[#1a1d25] rounded-lg" />
          <div className="h-9 w-32 bg-gray-100 dark:bg-[#1a1d25] rounded-lg" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-28 bg-gray-100 dark:bg-[#1a1d25] rounded-xl" />
          ))}
        </div>
        <div className="grid lg:grid-cols-2 gap-6">
          <div className="h-80 bg-gray-100 dark:bg-[#1a1d25] rounded-xl" />
          <div className="h-80 bg-gray-100 dark:bg-[#1a1d25] rounded-xl" />
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
    <div className="space-y-6">
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
          <button className="flex items-center gap-2 px-3 py-1.5 border border-gray-200 dark:border-[#1e2028] rounded-lg text-sm font-medium text-gray-700 dark:text-[#a0a4ad] hover:bg-gray-50 dark:hover:bg-[#1a1d25] transition-colors">
            <Download className="w-4 h-4" />
            <span className="hidden sm:inline">Export</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((kpi) => {
          const Icon = kpi.icon
          return (
            <div
              key={kpi.label}
              className="group bg-white dark:bg-[#0f1117] border border-gray-200 dark:border-[#1e2028] rounded-xl p-5 transition-all hover:dark:border-white/[0.1]"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${kpi.color}15` }}>
                  <Icon className="w-4 h-4" style={{ color: kpi.color }} />
                </div>
                <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full ${
                  kpi.up ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' : 'bg-rose-500/10 text-rose-600 dark:text-rose-400'
                }`}>
                  {kpi.up ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                  {kpi.trend}
                </span>
              </div>
              <p className="text-3xl font-semibold tracking-tight text-gray-900 dark:text-white tabular-nums">
                <NumberFlow value={kpi.value} />
              </p>
              <p className="text-sm font-medium text-gray-600 dark:text-[#a1a1aa] mt-1">{kpi.label}</p>
            </div>
          )
        })}
      </div>

      {/* Secondary KPI row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: 'Completed Sessions', value: stats?.completedSessions ?? 0, icon: CheckCircle, color: '#22C55E' },
          { label: 'Protocol Nodes', value: stats?.totalProtocols ?? 0, icon: BookOpen, color: '#8B5CF6' },
          { label: 'Clinical Rules', value: stats?.totalRules ?? 0, icon: Shield, color: '#F59E0B' },
        ].map((item) => {
          const Icon = item.icon
          return (
            <div
              key={item.label}
              className="bg-white dark:bg-[#0f1117] border border-gray-200 dark:border-[#1e2028] rounded-xl p-4 flex items-center gap-4 transition-all hover:dark:border-white/[0.1]"
            >
              <div className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0" style={{ backgroundColor: `${item.color}15` }}>
                <Icon className="w-4 h-4" style={{ color: item.color }} />
              </div>
              <div>
                <p className="text-xl font-bold text-gray-900 dark:text-[#e8eaed] tabular-nums tracking-tight">
                  <NumberFlow value={item.value} />
                </p>
                <p className="text-xs text-gray-500 dark:text-[#6b7080]">{item.label}</p>
              </div>
            </div>
          )
        })}
      </div>

      {/* Charts Row */}
      <div className="grid lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-[#0f1117] rounded-xl border border-gray-200 dark:border-[#1e2028] p-5">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-[#e8eaed]">Session Growth</h3>
              <p className="text-xs text-gray-400 dark:text-[#525666] mt-0.5">Daily volume over last 30 days</p>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-gray-400 dark:text-[#525666]">
              <RefreshCw className="w-3 h-3" />
              Live
            </div>
          </div>
          <div className="h-44">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={dailySessions}>
                <defs>
                  <linearGradient id="adminSessionGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={theme.areaStroke} stopOpacity={0.15} />
                    <stop offset="100%" stopColor={theme.areaStroke} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke={theme.grid.stroke} strokeDasharray={theme.grid.strokeDasharray} />
                <XAxis dataKey="date" tick={theme.axis} tickFormatter={(v) => { const d = new Date(v); return `${d.getMonth() + 1}/${d.getDate()}` }} />
                <YAxis tick={theme.axis} allowDecimals={false} />
                <Tooltip content={<CustomTooltip />} cursor={{ stroke: theme.cursor }} />
                <Area type="monotone" dataKey="count" stroke={theme.areaStroke} fill="url(#adminSessionGrad)" strokeWidth={2.5} dot={false} activeDot={{ fill: theme.activeDotFill, stroke: theme.activeDotStroke, strokeWidth: 2, r: 4 }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white dark:bg-[#0f1117] rounded-xl border border-gray-200 dark:border-[#1e2028] p-5">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-[#e8eaed]">User Growth</h3>
              <p className="text-xs text-gray-400 dark:text-[#525666] mt-0.5">New registrations per day</p>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-gray-400 dark:text-[#525666]">
              <RefreshCw className="w-3 h-3" />
              Live
            </div>
          </div>
          <div className="h-44">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dailyUsers} barCategoryGap="20%" barGap={4}>
                <CartesianGrid stroke={theme.grid.stroke} strokeDasharray={theme.grid.strokeDasharray} />
                <XAxis dataKey="date" tick={theme.axis} tickFormatter={(v) => { const d = new Date(v); return `${d.getMonth() + 1}/${d.getDate()}` }} />
                <YAxis tick={theme.axis} allowDecimals={false} />
                <Tooltip content={<CustomTooltip />} cursor={{ stroke: theme.cursor }} />
                <Bar dataKey="count" fill={theme.bar} radius={[4, 4, 0, 0]} maxBarSize={36} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Bottom Row */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Verdict Breakdown */}
        <div className="bg-white dark:bg-[#0f1117] rounded-xl border border-gray-200 dark:border-[#1e2028] p-5">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-[#e8eaed]">Verdict Breakdown</h3>
              <p className="text-xs text-gray-400 dark:text-[#525666] mt-0.5">{totalVerdicts} total decisions</p>
            </div>
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

        {/* Recent Sessions */}
        <div className="bg-white dark:bg-[#0f1117] rounded-xl border border-gray-200 dark:border-[#1e2028] overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 dark:border-[#1e2028]">
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-[#e8eaed]">Recent Sessions</h3>
              <p className="text-xs text-gray-400 dark:text-[#525666] mt-0.5">Latest triage activity</p>
            </div>
            <button className="text-xs font-medium text-[#073B4C] dark:text-[#00A8A8] hover:underline">View all</button>
          </div>

          <div className="hidden sm:grid grid-cols-[1fr_auto_auto] gap-4 px-5 py-2.5 border-b border-gray-100 dark:border-[#1e2028] text-[10px] font-semibold text-gray-400 dark:text-[#525666] uppercase tracking-wider">
            <span>Session ID</span>
            <span className="text-right">Verdict</span>
            <span></span>
          </div>

          <div className="divide-y divide-gray-100 dark:divide-[#1e2028]">
            {stats?.recentSessions?.slice(0, 6).map((s) => (
              <div key={s.sessionId} className="grid grid-cols-1 sm:grid-cols-[1fr_auto_auto] gap-2 sm:gap-4 px-5 py-3.5 items-center hover:bg-gray-50 dark:hover:bg-[#1a1d25] transition-colors group">
                <div className="min-w-0">
                  <p className="text-sm font-medium text-gray-900 dark:text-[#e8eaed] font-mono truncate">{s.sessionId.slice(0, 16)}…</p>
                  <p className="text-xs text-gray-400 dark:text-[#525666] mt-0.5">
                    {new Date(s.createdAt).toLocaleDateString('en-NG', { day: '2-digit', month: 'short' })}
                    {' · '}
                    {new Date(s.createdAt).toLocaleTimeString('en-NG', { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
                <span className={`text-[10px] px-2.5 py-1 rounded-full font-medium whitespace-nowrap ${VERDICT_BADGE[s.verdict] || 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400'}`}>
                  {VERDICT_LABELS[s.verdict] || s.verdict || 'pending'}
                </span>
                <button className="p-1 text-gray-300 dark:text-[#525666] hover:text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity">
                  <MoreVertical className="w-4 h-4" />
                </button>
              </div>
            ))}
            {(!stats?.recentSessions || stats.recentSessions.length === 0) && (
              <div className="px-5 py-12 text-center">
                <Clock className="w-8 h-8 text-gray-200 dark:text-[#2a2d35] mx-auto mb-2" />
                <p className="text-sm text-gray-400 dark:text-[#525666]">No sessions recorded yet</p>
              </div>
            )}
          </div>

          <div className="flex items-center justify-center gap-1.5 px-5 py-3 border-t border-gray-100 dark:border-[#1e2028] text-xs text-gray-400 dark:text-[#525666]">
            <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
            Live — auto-refreshing
          </div>
        </div>
      </div>
    </div>
  )
}
