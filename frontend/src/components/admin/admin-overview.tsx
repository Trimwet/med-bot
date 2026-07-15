import { useEffect, useState } from 'react'
import {
  Activity,
  Users,
  FileText,
  AlertTriangle,
  Clock,
  CheckCircle,
  BookOpen,
  Shield,
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
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts'
import { ChartCard } from '@/components/ui/chart-card'
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

export const AdminOverview = () => {
  const [stats, setStats] = useState<Stats | null>(null)
  const [dailySessions, setDailySessions] = useState<DailyData[]>([])
  const [dailyUsers, setDailyUsers] = useState<DailyData[]>([])
  const [loading, setLoading] = useState(true)
  const theme = useChartTheme()

  useEffect(() => {
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-32 bg-gray-100 dark:bg-[#1a1d25] rounded-xl" />
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
    {
      label: 'Total Sessions',
      value: stats?.totalSessions ?? 0,
      icon: Activity,
      color: '#073B4C',
    },
    {
      label: 'Active Now',
      value: stats?.activeSessions ?? 0,
      icon: Clock,
      color: '#00A8A8',
    },
    {
      label: 'Total Users',
      value: stats?.totalUsers ?? 0,
      icon: Users,
      color: '#6366F1',
    },
    {
      label: 'Emergency Cases',
      value: stats?.emergencySessions ?? 0,
      icon: AlertTriangle,
      color: '#EF4444',
    },
  ]

  const verdictData = stats?.verdictBreakdown
    ? Object.entries(stats.verdictBreakdown).map(([name, value]) => ({ name, value }))
    : []

  const PIE_COLORS = ['#22C55E', '#F59E0B', '#EF4444']

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-gray-900 dark:text-[#e8eaed]">Admin Overview</h1>
        <p className="text-sm text-gray-500 dark:text-[#6b7080] mt-0.5">Platform-wide metrics and activity</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((kpi) => {
          const Icon = kpi.icon
          return (
            <div
              key={kpi.label}
              className="bg-white dark:bg-[#0f1117] border border-gray-200 dark:border-[#1e2028] rounded-xl p-5 transition-colors"
            >
              <div className="flex items-center justify-between mb-4">
                <div
                  className="w-9 h-9 rounded-lg flex items-center justify-center"
                  style={{ backgroundColor: `${kpi.color}15` }}
                >
                  <Icon className="w-4 h-4" style={{ color: kpi.color }} />
                </div>
              </div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white tabular-nums">
                <NumberFlow value={kpi.value} />
              </p>
              <p className="text-sm text-gray-500 dark:text-[#6b7080] mt-1">{kpi.label}</p>
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
              className="bg-white dark:bg-[#0f1117] border border-gray-200 dark:border-[#1e2028] rounded-xl p-4 flex items-center gap-4 transition-colors"
            >
              <div
                className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0"
                style={{ backgroundColor: `${item.color}15` }}
              >
                <Icon className="w-4 h-4" style={{ color: item.color }} />
              </div>
              <div>
                <p className="text-lg font-bold text-gray-900 dark:text-white tabular-nums">
                  <NumberFlow value={item.value} />
                </p>
                <p className="text-xs text-gray-500 dark:text-[#6b7080]">{item.label}</p>
              </div>
            </div>
          )
        })}
      </div>

      {/* Charts */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Session Growth */}
        <ChartCard title="Session Growth (30 days)">
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={dailySessions}>
                <defs>
                  <linearGradient id="sessionGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={theme.areaStroke} stopOpacity={0.2} />
                    <stop offset="100%" stopColor={theme.areaStroke} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke={theme.grid.stroke} strokeDasharray={theme.grid.strokeDasharray} />
                <XAxis
                  dataKey="date"
                  tick={theme.axis}
                  tickFormatter={(v) => {
                    const d = new Date(v)
                    return `${d.getMonth() + 1}/${d.getDate()}`
                  }}
                />
                <YAxis tick={theme.axis} allowDecimals={false} />
                <Tooltip content={<CustomTooltip />} cursor={{ stroke: theme.cursor }} />
                <Area
                  type="monotone"
                  dataKey="count"
                  stroke={theme.areaStroke}
                  fill="url(#sessionGrad)"
                  strokeWidth={2}
                  dot={false}
                  activeDot={{ fill: theme.activeDotFill, stroke: theme.activeDotStroke, strokeWidth: 2, r: 4 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>

        {/* User Growth */}
        <ChartCard title="User Growth (30 days)">
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dailyUsers}>
                <CartesianGrid stroke={theme.grid.stroke} strokeDasharray={theme.grid.strokeDasharray} />
                <XAxis
                  dataKey="date"
                  tick={theme.axis}
                  tickFormatter={(v) => {
                    const d = new Date(v)
                    return `${d.getMonth() + 1}/${d.getDate()}`
                  }}
                />
                <YAxis tick={theme.axis} allowDecimals={false} />
                <Tooltip content={<CustomTooltip />} cursor={{ stroke: theme.cursor }} />
                <Bar dataKey="count" fill={theme.bar} radius={[4, 4, 0, 0]} maxBarSize={20} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>

        {/* Verdict distribution */}
        <ChartCard title="Verdict Distribution">
          <div className="h-72 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={verdictData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {verdictData.map((_, i) => (
                    <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend
                  formatter={(value) => (
                    <span className="text-sm text-gray-600 dark:text-[#a0a4ad]">{value}</span>
                  )}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>

        {/* Recent Sessions */}
        <ChartCard title="Recent Sessions">
          <div className="space-y-2">
            {stats?.recentSessions?.slice(0, 8).map((s) => (
              <div
                key={s.sessionId}
                className="flex items-center justify-between py-2 px-3 rounded-lg hover:bg-gray-50 dark:hover:bg-[#1a1d25] transition-colors"
              >
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-gray-900 dark:text-[#e8eaed] truncate">
                    {s.sessionId.slice(0, 12)}...
                  </p>
                  <p className="text-xs text-gray-400 dark:text-[#525666]">
                    {new Date(s.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                      s.verdict === 'emergency'
                        ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                        : s.verdict === 'consult'
                        ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
                        : 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                    }`}
                  >
                    {s.verdict || 'pending'}
                  </span>
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full ${
                      s.status === 'active' || s.status === 'in_progress'
                        ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                        : 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400'
                    }`}
                  >
                    {s.status}
                  </span>
                </div>
              </div>
            ))}
            {(!stats?.recentSessions || stats.recentSessions.length === 0) && (
              <p className="text-sm text-gray-400 dark:text-[#525666] text-center py-8">No recent sessions</p>
            )}
          </div>
        </ChartCard>
      </div>
    </div>
  )
}
