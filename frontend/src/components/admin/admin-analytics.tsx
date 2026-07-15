import { useEffect, useState } from 'react'
import { Coins, Zap, TrendingUp, Calendar } from 'lucide-react'
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

export const AdminAnalytics = () => {
  const [daily, setDaily] = useState<TokenDaily[]>([])
  const [loading, setLoading] = useState(true)
  const theme = useChartTheme()

  useEffect(() => {
    adminApi.getTokenUsage(30)
      .then((data) => setDaily(data.daily || []))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  const totalTokens = daily.reduce((s, d) => s + d.totalTokens, 0)
  const totalCost = daily.reduce((s, d) => s + d.costNgn, 0)
  const avgDaily = daily.length ? Math.round(totalTokens / daily.length) : 0

  if (loading) {
    return (
      <div className="space-y-4 animate-pulse">
        <div className="h-10 w-48 bg-gray-100 dark:bg-[#1a1d25] rounded-lg" />
        <div className="grid grid-cols-3 gap-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-24 bg-gray-100 dark:bg-[#1a1d25] rounded-xl" />
          ))}
        </div>
        <div className="h-80 bg-gray-100 dark:bg-[#1a1d25] rounded-xl" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-gray-900 dark:text-[#e8eaed]">API & Token Analytics</h1>
        <p className="text-sm text-gray-500 dark:text-[#6b7080] mt-0.5">Token usage and cost over the last 30 days</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: 'Total Tokens', value: totalTokens, icon: Zap, color: '#8B5CF6' },
          { label: 'Avg Daily Tokens', value: avgDaily, icon: TrendingUp, color: '#00A8A8' },
          { label: 'Total Cost (NGN)', value: totalCost, icon: Coins, color: '#F59E0B', prefix: '₦' },
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
              <p className="text-2xl font-bold text-gray-900 dark:text-white tabular-nums">
                {item.prefix || ''}<NumberFlow value={item.value} />
              </p>
              <p className="text-sm text-gray-500 dark:text-[#6b7080] mt-1">{item.label}</p>
            </div>
          )
        })}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <ChartCard title="Daily Token Consumption">
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={daily}>
                <defs>
                  <linearGradient id="tokenGrad" x1="0" y1="0" x2="0" y2="1">
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
                <YAxis tick={theme.axis} />
                <Tooltip content={<CustomTooltip />} cursor={{ stroke: theme.cursor }} />
                <Area
                  type="monotone"
                  dataKey="totalTokens"
                  stroke={theme.areaStroke}
                  fill="url(#tokenGrad)"
                  strokeWidth={2}
                  dot={false}
                  name="Total Tokens"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>

        <ChartCard title="Daily Cost (NGN)">
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={daily}>
                <CartesianGrid stroke={theme.grid.stroke} strokeDasharray={theme.grid.strokeDasharray} />
                <XAxis
                  dataKey="date"
                  tick={theme.axis}
                  tickFormatter={(v) => {
                    const d = new Date(v)
                    return `${d.getMonth() + 1}/${d.getDate()}`
                  }}
                />
                <YAxis tick={theme.axis} />
                <Tooltip content={<CustomTooltip />} cursor={{ stroke: theme.cursor }} />
                <Bar dataKey="costNgn" fill={theme.bar} radius={[4, 4, 0, 0]} maxBarSize={20} name="Cost (NGN)" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>

        <ChartCard title="Prompt vs Completion Tokens" className="lg:col-span-2">
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={daily}>
                <CartesianGrid stroke={theme.grid.stroke} strokeDasharray={theme.grid.strokeDasharray} />
                <XAxis
                  dataKey="date"
                  tick={theme.axis}
                  tickFormatter={(v) => {
                    const d = new Date(v)
                    return `${d.getMonth() + 1}/${d.getDate()}`
                  }}
                />
                <YAxis tick={theme.axis} />
                <Tooltip content={<CustomTooltip />} cursor={{ stroke: theme.cursor }} />
                <Bar dataKey="promptTokens" fill="#073B4C" radius={[4, 4, 0, 0]} maxBarSize={16} name="Prompt Tokens" />
                <Bar dataKey="completionTokens" fill="#00A8A8" radius={[4, 4, 0, 0]} maxBarSize={16} name="Completion Tokens" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>
      </div>
    </div>
  )
}
