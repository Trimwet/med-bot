import { useState, useEffect } from 'react'
import { Calendar, Download, AlertTriangle, ClipboardList, UserCog, MoreVertical, RefreshCw, TrendingUp, TrendingDown } from 'lucide-react'

export const BusinessDashboardHome = () => {
  const [dateRange, setDateRange] = useState('May 1 - May 26, 2026')
  const [kpiData, setKpiData] = useState<any[]>([])
  const [recentActivity, setRecentActivity] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // TODO: Fetch KPI data from API
    // Example: fetch('/api/dashboard/kpi').then(res => res.json()).then(setKpiData)
    setLoading(false)
  }, [])

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
          <div className="flex items-center gap-2 px-4 py-2.5 border border-gray-200 dark:border-[#2a2d35] rounded-lg text-sm font-medium text-gray-700 dark:text-[#a0a4ad] hover:bg-gray-50 dark:hover:bg-[#1a1d25] transition-colors cursor-pointer">
            <Calendar className="w-4 h-4" />
            <span>{dateRange}</span>
            <span className="text-xs">▾</span>
          </div>
          <button className="flex items-center gap-2 px-4 py-2.5 bg-[#073B4C] text-white rounded-lg text-sm font-semibold hover:bg-[#0A202A] transition-colors">
            <Download className="w-4 h-4" />
            <span>Export Data</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Total Assessments */}
        <div className="bg-white dark:bg-[#0f1117] rounded-xl border border-gray-200 dark:border-[#1e2028] p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 bg-gray-100 dark:bg-[#1a1d25] rounded-xl flex items-center justify-center">
              <ClipboardList className="w-5 h-5 text-gray-500 dark:text-[#6b7080]" />
            </div>
            <span className="flex items-center gap-1 text-xs font-semibold text-green-600 bg-green-50 dark:bg-green-900/20 px-2 py-0.5 rounded-full">
              <TrendingUp className="w-3 h-3" />
              +12%
            </span>
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-[#e8eaed]">2,456</p>
          <p className="text-sm font-medium text-gray-500 dark:text-[#6b7080] mt-1">Total Assessments</p>
          <p className="text-xs text-gray-400 dark:text-[#525666] mt-0.5">vs. 2,192 last week</p>
        </div>

        {/* Emergency Cases */}
        <div className="bg-white dark:bg-[#0f1117] rounded-xl border border-gray-200 dark:border-[#1e2028] p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 bg-gray-100 dark:bg-[#1a1d25] rounded-xl flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-gray-500 dark:text-[#6b7080]" />
            </div>
            <span className="flex items-center gap-1 text-xs font-semibold text-red-500 bg-red-50 dark:bg-red-900/20 px-2 py-0.5 rounded-full">
              <TrendingDown className="w-3 h-3" />
              -8%
            </span>
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-[#e8eaed]">156</p>
          <p className="text-sm font-medium text-gray-500 dark:text-[#6b7080] mt-1">Emergency Cases</p>
          <p className="text-xs text-gray-400 dark:text-[#525666] mt-0.5">Requiring immediate attention</p>
        </div>

        {/* Doctor Referrals */}
        <div className="bg-white dark:bg-[#0f1117] rounded-xl border border-gray-200 dark:border-[#1e2028] p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 bg-gray-100 dark:bg-[#1a1d25] rounded-xl flex items-center justify-center">
              <UserCog className="w-5 h-5 text-gray-500 dark:text-[#6b7080]" />
            </div>
            <span className="flex items-center gap-1 text-xs font-semibold text-green-600 bg-green-50 dark:bg-green-900/20 px-2 py-0.5 rounded-full">
              <TrendingUp className="w-3 h-3" />
              +15%
            </span>
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-[#e8eaed]">312</p>
          <p className="text-sm font-medium text-gray-500 dark:text-[#6b7080] mt-1">Doctor Referrals</p>
          <p className="text-xs text-gray-400 dark:text-[#525666] mt-0.5">Pending specialist review</p>
        </div>
      </div>

      {/* Charts Row - Placeholder for API data */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-white dark:bg-[#0f1117] rounded-xl border border-gray-200 dark:border-[#1e2028] p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900 dark:text-[#e8eaed]">Daily Assessments</h3>
            <span className="text-xs text-gray-500 dark:text-[#6b7080] bg-gray-100 dark:bg-[#1a1d25] px-3 py-1 rounded-full">This Week</span>
          </div>
          <div className="h-44 flex items-center justify-center text-gray-400 dark:text-[#525666] text-sm">
            {/* TODO: Fetch daily assessments chart data from API */}
            Chart data loading...
          </div>
        </div>

        <div className="bg-white dark:bg-[#0f1117] rounded-xl border border-gray-200 dark:border-[#1e2028] p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900 dark:text-[#e8eaed]">Weekly Trends</h3>
            <span className="text-xs text-gray-500 dark:text-[#6b7080] bg-gray-100 dark:bg-[#1a1d25] px-3 py-1 rounded-full">Last 8 Weeks ▾</span>
          </div>
          <div className="h-44 flex items-center justify-center text-gray-400 dark:text-[#525666] text-sm">
            {/* TODO: Fetch weekly trends chart data from API */}
            Chart data loading...
          </div>
        </div>
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

        {/* Table Body - TODO: Fetch from API */}
        <div className="divide-y divide-gray-100 dark:divide-[#1e2028]">
          {recentActivity.length === 0 ? (
            <div className="px-5 py-8 text-center text-sm text-gray-400 dark:text-[#525666]">
              No recent activity to display
            </div>
          ) : (
            recentActivity.map((item: any, i: number) => (
              <div
                key={i}
                className="grid grid-cols-1 sm:grid-cols-[1fr_1fr_1.5fr_0.8fr_auto] gap-2 sm:gap-4 px-5 py-4 items-center hover:bg-gray-50 dark:hover:bg-[#1a1d25] transition-colors"
              >
                <span className="text-sm text-gray-500 dark:text-[#6b7080]">{item.time}</span>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-gray-700 dark:text-[#a0a4ad]">{item.activity}</span>
                </div>
                <span className="text-sm text-gray-600 dark:text-[#6b7080]">{item.details}</span>
                <span className="text-sm text-gray-500 dark:text-[#6b7080]">{item.by}</span>
                <button className="p-1 text-gray-400 dark:text-[#525666] hover:text-gray-600 self-start sm:self-center">
                  <MoreVertical className="w-4 h-4" />
                </button>
              </div>
            ))
          )}
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
