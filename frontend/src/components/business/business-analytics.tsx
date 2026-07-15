import { useState } from 'react'
import { AlertCircle } from 'lucide-react'
import { DateDropdown } from '@/components/ui/date-dropdown'
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
import { TrendBadge } from '@/components/business/kpi-cards'

type TimeRange = 'Daily' | 'Weekly' | 'Monthly' | 'Yearly'

const monthlyGrowth = [
  { month: 'Jan', value: 800 },
  { month: 'Feb', value: 1100 },
  { month: 'Mar', value: 1400 },
  { month: 'Apr', value: 1700 },
  { month: 'May', value: 2000 },
  { month: 'Jun', value: 2200 },
  { month: 'Jul', value: 2500 },
  { month: 'Aug', value: 2800 },
  { month: 'Sep', value: 3000 },
  { month: 'Oct', value: 3200 },
  { month: 'Nov', value: 3400 },
  { month: 'Dec', value: 3600 },
]

const topSymptoms = [
  { name: 'Headache', count: 1245, percent: 25.8 },
  { name: 'Fever', count: 1032, percent: 21.3 },
  { name: 'Cough', count: 876, percent: 18.1 },
  { name: 'Body Pain', count: 654, percent: 13.6 },
  { name: 'Sore Throat', count: 543, percent: 11.3 },
]

const ageGroups = [
  { label: '18-30', percent: 28.7, color: '#073B4C' },
  { label: '31-45', percent: 27.1, color: '#00A8A8' },
  { label: '46-60', percent: 18.6, color: '#4C8C5B' },
  { label: '0-17', percent: 15.2, color: '#F59E0B' },
  { label: '60+', percent: 10.4, color: '#9CA3AF' },
]

const cardStyle = cn(
  'rounded-xl p-6',
  'bg-white border border-gray-200',
  'dark:bg-[#0f1117] dark:border-[#1e2028]',
)

const sectionTitle = 'text-sm font-semibold tracking-tight text-gray-900 dark:text-white'

export const BusinessAnalytics = () => {
  const [activeRange, setActiveRange] = useState<TimeRange>('Monthly')
  const ranges: TimeRange[] = ['Daily', 'Weekly', 'Monthly', 'Yearly']
  const theme = useChartTheme()

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-semibold tracking-tight text-gray-900 dark:text-white">Analytics</h1>
          <p className="text-sm text-gray-500 dark:text-[#71717a] mt-1">
            Insights and trends from assessments and users.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center bg-gray-100 dark:bg-[#1a1d25] rounded-lg p-1">
            {ranges.map((r) => (
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
                {r}
              </button>
            ))}
          </div>
          <DateDropdown />
        </div>
      </div>

      {/* Top Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Top Symptoms */}
        <div className={cardStyle}>
          <div className="flex items-center justify-between mb-5">
            <h3 className={sectionTitle}>Top Symptoms</h3>
            <span className="text-xs text-gray-400 dark:text-[#525666]">May 2026</span>
          </div>
          <div className="space-y-3.5">
            {topSymptoms.map((s) => (
              <div key={s.name}>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-sm text-gray-700 dark:text-[#d4d4d8]">{s.name}</span>
                  <span className="text-xs tabular-nums text-gray-500 dark:text-[#71717a]">
                    {s.count.toLocaleString()} <span className="text-gray-400 dark:text-[#525666]">({s.percent}%)</span>
                  </span>
                </div>
                <div className="h-1.5 w-full rounded-full bg-gray-100 dark:bg-[#1a1d25]">
                  <div
                    className="h-full rounded-full bg-gray-900 dark:bg-[#3f3f46]"
                    style={{ width: `${s.percent * 3}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
          <p className="text-xs text-gray-400 dark:text-[#525666] mt-5 text-center">
            Total Symptoms Recorded: <span className="font-semibold text-gray-600 dark:text-[#71717a]">4,827</span>
          </p>
        </div>

        {/* Age Groups */}
        <div className={cardStyle}>
          <h3 className={sectionTitle}>Age Groups</h3>
          <div className="flex items-center justify-center my-6">
            <div className="relative w-40 h-40">
              <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                {ageGroups.reduce((acc, g, i) => {
                  const dashArray = g.percent * 2.51327
                  const dashOffset = -acc.offset * 2.51327
                  acc.elements.push(
                    <circle
                      key={i}
                      cx="50"
                      cy="50"
                      r="40"
                      fill="none"
                      stroke={g.color}
                      strokeWidth="12"
                      strokeDasharray={`${dashArray} ${251.327 - dashArray}`}
                      strokeDashoffset={dashOffset}
                    />
                  )
                  acc.offset += g.percent
                  return acc
                }, { elements: [] as React.ReactElement[], offset: 0 }).elements}
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-2xl font-semibold tracking-tight text-gray-900 dark:text-white">2,456</span>
                <span className="text-[10px] font-medium uppercase tracking-wider text-gray-400 dark:text-[#52525b]">Users</span>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-x-4 gap-y-2">
            {ageGroups.map((g) => (
              <div key={g.label} className="flex items-center gap-2.5">
                <span className="h-2 w-2 rounded-full" style={{ backgroundColor: g.color }} />
                <span className="text-xs text-gray-600 dark:text-[#a1a1aa]">
                  {g.label} <span className="text-gray-400 dark:text-[#52525b]">({g.percent}%)</span>
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Middle Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Gender Distribution */}
        <div className={cardStyle}>
          <h3 className={sectionTitle}>Gender Distribution</h3>
          <div className="flex items-center gap-6 mt-5">
            <div className="relative w-32 h-32">
              <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                <circle cx="50" cy="50" r="40" fill="none" stroke="#073B4C" strokeWidth="14" strokeDasharray="151.75 251.327" />
                <circle cx="50" cy="50" r="40" fill="none" stroke="#00A8A8" strokeWidth="14" strokeDasharray="118.92 251.327" strokeDashoffset="-151.75" />
              </svg>
            </div>
            <div className="space-y-3">
              <div className="flex items-center gap-2.5">
                <span className="h-2.5 w-2.5 rounded-sm bg-[#073B4C]" />
                <span className="text-sm text-gray-700 dark:text-[#d4d4d8]">Male</span>
                <span className="text-xs text-gray-400 dark:text-[#52525b]">52.6% · 1,291</span>
              </div>
              <div className="flex items-center gap-2.5">
                <span className="h-2.5 w-2.5 rounded-sm bg-[#00A8A8]" />
                <span className="text-sm text-gray-700 dark:text-[#d4d4d8]">Female</span>
                <span className="text-xs text-gray-400 dark:text-[#52525b]">47.4% · 1,165</span>
              </div>
            </div>
          </div>
          <p className="text-xs text-gray-400 dark:text-[#525666] mt-5 text-center">
            Total Users: <span className="font-semibold text-gray-600 dark:text-[#71717a]">2,456</span>
          </p>
        </div>

        {/* Emergency Cases */}
        <div className={cardStyle}>
          <h3 className={sectionTitle}>Emergency Cases</h3>
          <div className="flex items-center justify-center my-6">
            <div className="relative w-36 h-36">
              <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                <circle cx="50" cy="50" r="40" fill="none" stroke="#1a1d25" strokeWidth="10" />
                <circle cx="50" cy="50" r="40" fill="none" stroke="#EF4444" strokeWidth="10" strokeDasharray="15.79 251.327" />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-2xl font-semibold tracking-tight text-red-500">6.3%</span>
                <span className="text-[10px] font-medium uppercase tracking-wider text-gray-400 dark:text-[#52525b]">Emergency</span>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 text-center">
            <div>
              <p className="text-[10px] font-medium uppercase tracking-wider text-gray-400 dark:text-[#52525b]">Emergencies</p>
              <p className="text-lg font-semibold tracking-tight text-red-500 mt-1">156</p>
            </div>
            <div>
              <p className="text-[10px] font-medium uppercase tracking-wider text-gray-400 dark:text-[#52525b]">Total Assessments</p>
              <p className="text-lg font-semibold tracking-tight text-gray-900 dark:text-white mt-1">2,456</p>
            </div>
          </div>
        </div>
      </div>

      {/* Monthly Growth — Recharts */}
      <div className={cardStyle}>
        <div className="flex items-center justify-between mb-5">
          <div>
            <h3 className={sectionTitle}>Monthly Growth</h3>
            <p className="text-xs text-gray-500 dark:text-[#71717a] mt-0.5">Overall Assessment Trends (2026)</p>
          </div>
          <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-[#71717a]">
            <span className="h-0.5 w-3 rounded-full bg-[#073B4C]" />
            Assessments
          </div>
        </div>
        <div className="h-56">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={monthlyGrowth}>
              <defs>
                <linearGradient id="growthGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={theme.gradientTop} stopOpacity={0.15} />
                  <stop offset="100%" stopColor={theme.gradientTop} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid {...theme.grid} vertical={false} />
              <XAxis dataKey="month" tick={theme.axis} axisLine={false} tickLine={false} />
              <YAxis tick={theme.axis} axisLine={false} tickLine={false} width={40} />
              <Tooltip content={<CustomTooltip />} cursor={{ stroke: theme.cursor, strokeWidth: 1 }} />
              <Area
                type="monotone"
                dataKey="value"
                stroke={theme.areaStroke}
                strokeWidth={2}
                fill="url(#growthGradient)"
                dot={{ fill: theme.dotFill, stroke: theme.dotStroke, strokeWidth: 2, r: 3 }}
                activeDot={{ fill: theme.activeDotFill, stroke: theme.activeDotStroke, strokeWidth: 2, r: 5 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Disclaimer */}
      <div className="rounded-xl border border-gray-200 dark:border-[#1e2028] bg-gray-50 dark:bg-[#080a0e] p-4">
        <div className="flex items-start gap-2.5">
          <AlertCircle className="h-4 w-4 text-gray-400 dark:text-[#525666] mt-0.5 shrink-0" strokeWidth={1.5} />
          <p className="text-xs text-gray-500 dark:text-[#71717a] leading-relaxed">
            Analytics data is updated based on the selected time period. All times are in your local timezone.
            Data refresh happens every 15 minutes.
          </p>
        </div>
      </div>
    </div>
  )
}
