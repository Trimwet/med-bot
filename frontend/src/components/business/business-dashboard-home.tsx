import {
  Calendar,
  Download,
  AlertTriangle,
  UserPlus,
  ClipboardList,
  UserCog,
  MoreVertical,
  RefreshCw,
} from 'lucide-react'
import { DateDropdown } from '@/components/ui/date-dropdown'
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
import { KpiCards } from '@/components/business/kpi-cards'

const stats: any[] = []
const recentActivity: any[] = []
const weeklyData: number[] = []
const barData: number[] = []
const days: string[] = []
const weeks: string[] = []

export const BusinessDashboardHome = () => {
  const theme = useChartTheme()

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-[#e8eaed]">Dashboard</h1>
          <p className="text-sm text-gray-500 dark:text-[#6b7080] mt-1">
            Welcome back, Admin! Here's what's happening today.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <DateDropdown />
          <button className="flex items-center gap-2 px-4 py-2.5 bg-[#073B4C] text-white rounded-lg text-sm font-semibold hover:bg-[#0A202A] transition-colors">
            <Download className="w-4 h-4" />
            <span className="hidden sm:inline">Export Data</span>
            <span className="sm:hidden">Export</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <KpiCards cards={stats} />

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Daily Assessments */}
        <ChartCard title="Daily Assessments" action={
          <span className="text-xs text-gray-500 dark:text-[#6b7080] bg-gray-100 dark:bg-[#1a1d25] px-3 py-1 rounded-full">This Week</span>
        }>
          <div className="h-44">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData} barCategoryGap="20%" barGap={4}>
                <CartesianGrid {...theme.grid} vertical={false} />
                <XAxis dataKey="day" tick={theme.axis} axisLine={false} tickLine={false} />
                <YAxis tick={theme.axis} axisLine={false} tickLine={false} width={30} />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: theme.cursor }} />
                <Bar
                  dataKey="value"
                  fill={theme.bar}
                  radius={[4, 4, 0, 0]}
                  maxBarSize={36}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>

        {/* Weekly Trends */}
        <ChartCard title="Weekly Trends" action={
          <span className="text-xs text-gray-500 dark:text-[#6b7080] bg-gray-100 dark:bg-[#1a1d25] px-3 py-1 rounded-full">Last 8 Weeks ▾</span>
        }>
          <div className="h-44">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={weeklyData}>
                <defs>
                  <linearGradient id="trendGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={theme.gradientTop} stopOpacity={0.15} />
                    <stop offset="100%" stopColor={theme.gradientTop} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid {...theme.grid} vertical={false} />
                <XAxis dataKey="label" tick={theme.axis} axisLine={false} tickLine={false} />
                <YAxis tick={theme.axis} axisLine={false} tickLine={false} width={30} />
                <Tooltip content={<CustomTooltip />} cursor={false} />
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke={theme.areaStroke}
                  strokeWidth={2.5}
                  fill="url(#trendGradient)"
                  dot={{ fill: theme.dotFill, stroke: theme.dotStroke, strokeWidth: 2, r: 4 }}
                  activeDot={{ fill: theme.activeDotFill, stroke: theme.activeDotStroke, strokeWidth: 2, r: 5 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>
      </div>

      {/* Recent Activity */}
      <div className="bg-white dark:bg-[#0f1117] rounded-xl border border-gray-200 dark:border-[#1e2028]">
        <div className="flex items-center justify-between p-5 border-b border-gray-100 dark:border-[#1e2028]">
          <h3 className="font-semibold text-gray-900 dark:text-[#e8eaed]">Recent Activity</h3>
          <button className="text-sm font-semibold text-[#073B4C] hover:underline">
            View All Activity
          </button>
        </div>

        {/* Table Header */}
        <div className="hidden sm:grid grid-cols-[1fr_1fr_1.5fr_0.8fr_auto] gap-4 px-5 py-3 border-b border-gray-100 dark:border-[#1e2028] text-xs font-semibold text-gray-400 dark:text-[#525666] uppercase tracking-wider">
          <span>Time</span>
          <span>Activity</span>
          <span>Details</span>
          <span>By</span>
          <span></span>
        </div>

        {/* Table Body */}
        <div className="divide-y divide-gray-100 dark:divide-[#1e2028]">
          {recentActivity.map((item, i) => (
            <div
              key={i}
              className="grid grid-cols-1 sm:grid-cols-[1fr_1fr_1.5fr_0.8fr_auto] gap-2 sm:gap-4 px-5 py-4 items-center hover:bg-gray-50 dark:hover:bg-[#1a1d25] transition-colors"
            >
              <span className="text-sm text-gray-500 dark:text-[#6b7080]">{item.time}</span>
              <div className="flex items-center gap-2">
                <item.activityIcon className={`w-4 h-4 ${item.activityColor}`} />
                <span className="text-sm font-medium text-gray-700 dark:text-[#a0a4ad]">{item.activity}</span>
              </div>
              <span className="text-sm text-gray-600 dark:text-[#6b7080]">{item.details}</span>
              <span className="text-sm text-gray-500 dark:text-[#6b7080]">{item.by}</span>
              <button className="p-1 text-gray-400 dark:text-[#525666] hover:text-gray-600 self-start sm:self-center">
                <MoreVertical className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-center gap-2 px-5 py-3 border-t border-gray-100 dark:border-[#1e2028] text-xs text-gray-400 dark:text-[#525666]">
          <RefreshCw className="w-3 h-3" />
          Dashboard data is updated in real-time. Last sync: 1 min ago.
        </div>
      </div>
    </div>
  )
}
