import { useEffect, useState } from 'react'
import { Coins, Zap, TrendingUp, TrendingDown, Calendar, RefreshCw } from 'lucide-react'
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
  Legend,
} from 'recharts'
import { ChartCard } from '@/components/ui/chart-card'
import { useChartTheme, CustomTooltip } from '@/components/ui/chart-theme'
import { adminApi } from './admin-api'
import NumberFlow from '@number-flow/react'

interface TokenDaily {
  date: string
  promptTokens: number
  completionTokens: number
  totalTokens: number
  costNgn: number
}

const TIME_RANGES = ['7d', '14d', '30d'] as const

export const AdminAnalytics = () => {
  const [daily, setDaily] = useState<TokenDaily[]>([])
  const [loading, setLoading] = useState(true)
  const [timeRange, setTimeRange] = useState<(typeof TIME_RANGES)[number]>('30d')
  const theme = useChartTheme()

  useEffect(() => {
    setLoading(true)
    adminApi.getTokenUsage(30)
      .then((data) => setDaily(data.daily || []))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  const totalTokens = daily.reduce((s, d) => s + d.totalTokens, 0)
  const totalCost = daily.reduce((s, d) => s + d.costNgn, 0)
  const avgDaily = daily.length ? Math.round(totalTokens / daily.length) : 0
  const totalPrompt = daily.reduce((s, d) => s + d.promptTokens, 0)
  const totalCompletion = daily.reduce((s, d) => s + d.completionTokens, 0)
  const promptPct = totalTokens > 0 ? Math.round((totalPrompt / totalTokens) * 100) : 0

  const tickFormatter = (v: string) => {
    const d = new Date(v)
    return `${d.getMonth() + 1}/${d.getDate()}`
  }

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
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
        <div className="h-80 bg-gray-100 dark:bg-[#1a1d25] rounded-xl" />
      </div>
    )
  }

  const kpis = [
    {
      label: 'Total Tokens',
      value: totalTokens,
      icon: Zap,
      color: '#8B5CF6',
      trend: '+14%',
      up: true,
      suffix: '',
    },
    {
      label: 'Avg Daily Tokens',
      value: avgDaily,
      icon: TrendingUp,
      color: '#00A8A8',
      trend: '+7%',
      up: true,
      suffix: '',
    },
    {
      label: 'Total Cost (NGN)',
      value: totalCost,
      icon: Coins,
      color: '#F59E0B',
      trend: '+12%',
      up: true,
      prefix: '₦',
    },
    {
      label: 'Prompt vs Completion',
      value: promptPct,
      icon: Calendar,
      color: '#073B4C',
      trend: `${100 - promptPct}% completion`,
      up: null,
      suffix: '% prompt',
    },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-[#e8eaed] tracking-tight">
            API & Token Analytics
          </h1>
          <p className="text-sm text-gray-500 dark:text-[#6b7080] mt-1">
            Token usage and cost over the last 30 days
          </p>
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
          <div className="flex items-center gap-1.5 text-xs text-gray-400 dark:text-[#525666] border border-gray-200 dark:border-[#1e2028] rounded-lg px-3 py-1.5">
            <RefreshCw className="w-3 h-3" />
            Live
          </div>
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
                <div
                  className="w-9 h-9 rounded-lg flex items-center justify-center"
                  style={{ backgroundColor: `${kpi.color}15` }}
                >
                  <Icon className="w-4 h-4" style={{ color: kpi.color }} />
                </div>
                {kpi.up !== null ? (
                  <span
                    className={`inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full ${
                      kpi.up
                        ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                        : 'bg-rose-500/10 text-rose-600 dark:text-rose-400'
                    }`}
                  >
                    {kpi.up ? (
                      <TrendingUp className="w-3 h-3" />
                    ) : (
                      <TrendingDown className="w-3 h-3" />
                    )}
                    {kpi.trend}
                  </span>
                ) : (
                  <span className="text-xs text-gray-400 dark:text-[#525666] font-medium">
                    {kpi.trend}
                  </span>
                )}
              </div>
              <p className="text-3xl font-semibold tracking-tight text-gray-900 dark:text-white tabular-nums">
                {kpi.prefix || ''}
                <NumberFlow value={kpi.value} />
                {kpi.suffix || ''}
              </p>
              <p className="text-xs font-medium text-gray-600 dark:text-[#a1a1aa] mt-1">{kpi.label}</p>
            </div>
          )
        })}
      </div>

      {/* Charts */}
      <div className="grid lg:grid-cols-2 gap-6">
        <ChartCard title="Daily Token Consumption" subtitle="Total tokens used per day">
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={daily}>
                <defs>
                  <linearGradient id="tokenGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={theme.areaStroke} stopOpacity={0.2} />
                    <stop offset="100%" stopColor={theme.areaStroke} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke={theme.grid.stroke} strokeDasharray={theme.grid.strokeDasharray} />
                <XAxis dataKey="date" tick={theme.axis} tickFormatter={tickFormatter} axisLine={false} tickLine={false} />
                <YAxis tick={theme.axis} axisLine={false} tickLine={false} width={40} />
                <Tooltip content={<CustomTooltip />} cursor={{ stroke: theme.cursor }} />
                <Area
                  type="monotone"
                  dataKey="totalTokens"
                  stroke={theme.areaStroke}
                  fill="url(#tokenGrad)"
                  strokeWidth={2.5}
                  dot={false}
                  activeDot={{ fill: theme.activeDotFill, stroke: theme.activeDotStroke, strokeWidth: 2, r: 4 }}
                  name="Total Tokens"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>

        <ChartCard title="Daily Cost (NGN)" subtitle="Platform spend in naira">
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={daily} barCategoryGap="20%">
                <CartesianGrid stroke={theme.grid.stroke} strokeDasharray={theme.grid.strokeDasharray} />
                <XAxis dataKey="date" tick={theme.axis} tickFormatter={tickFormatter} axisLine={false} tickLine={false} />
                <YAxis tick={theme.axis} axisLine={false} tickLine={false} width={40} />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: theme.cursor + '20' }} />
                <Bar dataKey="costNgn" fill={theme.bar} radius={[4, 4, 0, 0]} maxBarSize={24} name="Cost (₦)" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>
      </div>

      {/* Prompt vs Completion stacked chart */}
      <ChartCard title="Prompt vs Completion Tokens" subtitle="Token split by type over the period">
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={daily} barCategoryGap="20%" barGap={2}>
              <CartesianGrid stroke={theme.grid.stroke} strokeDasharray={theme.grid.strokeDasharray} />
              <XAxis dataKey="date" tick={theme.axis} tickFormatter={tickFormatter} axisLine={false} tickLine={false} />
              <YAxis tick={theme.axis} axisLine={false} tickLine={false} width={40} />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: theme.cursor + '20' }} />
              <Legend
                wrapperStyle={{ fontSize: '12px', color: 'var(--color-text-muted, #6b7080)', paddingTop: '12px' }}
                iconType="circle"
                iconSize={8}
              />
              <Bar dataKey="promptTokens" fill="#073B4C" radius={[4, 4, 0, 0]} maxBarSize={18} name="Prompt Tokens" stackId="a" />
              <Bar dataKey="completionTokens" fill="#00A8A8" radius={[0, 0, 0, 0]} maxBarSize={18} name="Completion Tokens" stackId="a" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* inline token split summary */}
        <div className="flex items-center gap-6 mt-4 pt-4 border-t border-gray-100 dark:border-[#1e2028]">
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-sm bg-[#073B4C]" />
            <span className="text-xs text-gray-500 dark:text-[#6b7080]">
              Prompt — <span className="font-semibold text-gray-800 dark:text-[#cdd0d5]">{totalPrompt.toLocaleString()}</span> tokens ({promptPct}%)
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-sm bg-[#00A8A8]" />
            <span className="text-xs text-gray-500 dark:text-[#6b7080]">
              Completion — <span className="font-semibold text-gray-800 dark:text-[#cdd0d5]">{totalCompletion.toLocaleString()}</span> tokens ({100 - promptPct}%)
            </span>
          </div>
        </div>
      </ChartCard>
    </div>
  )
}
