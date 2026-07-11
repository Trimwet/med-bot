import { useState } from 'react'
import {
  Calendar,
  Download,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  UserPlus,
  ClipboardList,
  UserCog,
  MoreVertical,
  RefreshCw,
} from 'lucide-react'

const stats = [
  {
    label: 'Total Assessments',
    value: '2,456',
    subtitle: 'vs. 2,192 last week',
    change: '+12%',
    trend: 'up' as const,
    icon: ClipboardList,
    iconBg: 'bg-blue-50',
    iconColor: 'text-blue-500',
  },
  {
    label: 'Emergency Cases',
    value: '156',
    subtitle: 'Requiring immediate attention',
    change: '-8%',
    trend: 'down' as const,
    icon: AlertTriangle,
    iconBg: 'bg-red-50',
    iconColor: 'text-red-500',
  },
  {
    label: 'Doctor Referrals',
    value: '312',
    subtitle: 'Pending specialist review',
    change: '+15%',
    trend: 'up' as const,
    icon: UserCog,
    iconBg: 'bg-purple-50',
    iconColor: 'text-purple-500',
  },
]

const recentActivity = [
  {
    time: 'May 20, 2026 10:30 AM',
    activity: 'New Assessment',
    activityIcon: ClipboardList,
    activityColor: 'text-blue-500',
    details: 'Fever, headache, body pain',
    by: 'User #1256',
  },
  {
    time: 'May 20, 2026 09:15 AM',
    activity: 'Emergency Case',
    activityIcon: AlertTriangle,
    activityColor: 'text-red-500',
    details: 'High fever, difficulty breathing',
    by: 'User #1248',
  },
  {
    time: 'May 20, 2026 08:45 AM',
    activity: 'Doctor Referral',
    activityIcon: UserCog,
    activityColor: 'text-purple-500',
    details: 'Referred to Dr. Ahmed Ibrahim',
    by: 'User #1251',
  },
  {
    time: 'May 19, 2026 07:20 PM',
    activity: 'New User Registered',
    activityIcon: UserPlus,
    activityColor: 'text-green-500',
    details: 'Aisha Bello',
    by: 'System',
  },
]

const weeklyData = [30, 45, 35, 50, 40, 55, 60]
const barData = [40, 65, 50, 70, 55, 80, 65]
const days = ['M', 'T', 'W', 'T', 'F', 'S', 'S']
const weeks = ['Wk 1', 'Wk 3', 'Wk 5', 'Wk 8']

export const BusinessDashboardHome = () => {
  const [dateRange] = useState('May 14 - May 20, 2026')

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-sm text-gray-500 mt-1">
            Welcome back, Admin! Here's what's happening today.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2.5 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
            <Calendar className="w-4 h-4" />
            <span className="hidden sm:inline">{dateRange}</span>
            <span className="sm:hidden">May 14 - 20</span>
            ▾
          </button>
          <button className="flex items-center gap-2 px-4 py-2.5 bg-[#073B4C] text-white rounded-lg text-sm font-semibold hover:bg-[#0A202A] transition-colors">
            <Download className="w-4 h-4" />
            <span className="hidden sm:inline">Export Data</span>
            <span className="sm:hidden">Export</span>
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="bg-white rounded-xl border border-gray-200 p-5"
          >
            <div className="flex items-center justify-between mb-3">
              <div className={`w-10 h-10 ${stat.iconBg} rounded-xl flex items-center justify-center`}>
                <stat.icon className={`w-5 h-5 ${stat.iconColor}`} />
              </div>
              <div className={`flex items-center gap-1 text-xs font-semibold ${
                stat.trend === 'up' ? 'text-green-600' : 'text-red-500'
              }`}>
                {stat.trend === 'up' ? (
                  <TrendingUp className="w-3.5 h-3.5" />
                ) : (
                  <TrendingDown className="w-3.5 h-3.5" />
                )}
                {stat.change}
              </div>
            </div>
            <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
            <p className="text-xs text-gray-500 mt-1">{stat.subtitle}</p>
          </div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Daily Assessments */}
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-semibold text-gray-900">Daily Assessments</h3>
            <span className="text-xs text-gray-500 bg-gray-100 px-3 py-1 rounded-full">This Week</span>
          </div>
          <div className="flex items-end justify-between gap-2 h-40">
            {barData.map((h, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-2">
                <div
                  className="w-full bg-[#073B4C] rounded-t-md transition-all"
                  style={{ height: `${h}%` }}
                />
                <span className="text-xs text-gray-400">{days[i]}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Weekly Trends */}
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-semibold text-gray-900">Weekly Trends</h3>
            <span className="text-xs text-gray-500 bg-gray-100 px-3 py-1 rounded-full">Last 8 Weeks ▾</span>
          </div>
          <div className="relative h-40">
            <svg className="w-full h-full" viewBox="0 0 300 120" preserveAspectRatio="none">
              <defs>
                <linearGradient id="gradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#073B4C" stopOpacity="0.15" />
                  <stop offset="100%" stopColor="#073B4C" stopOpacity="0" />
                </linearGradient>
              </defs>
              <path
                d={`M0,${120 - weeklyData[0] * 1.8} ${weeklyData.map((v, i) => `L${(i / (weeklyData.length - 1)) * 300},${120 - v * 1.8}`).join(' ')} L300,120 L0,120 Z`}
                fill="url(#gradient)"
              />
              <polyline
                points={weeklyData.map((v, i) => `${(i / (weeklyData.length - 1)) * 300},${120 - v * 1.8}`).join(' ')}
                fill="none"
                stroke="#073B4C"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              {weeklyData.map((v, i) => (
                <circle
                  key={i}
                  cx={(i / (weeklyData.length - 1)) * 300}
                  cy={120 - v * 1.8}
                  r="4"
                  fill="white"
                  stroke="#073B4C"
                  strokeWidth="2"
                />
              ))}
            </svg>
          </div>
          <div className="flex justify-between mt-2">
            {weeks.map((w) => (
              <span key={w} className="text-xs text-gray-400">{w}</span>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-xl border border-gray-200">
        <div className="flex items-center justify-between p-5 border-b border-gray-100">
          <h3 className="font-semibold text-gray-900">Recent Activity</h3>
          <button className="text-sm font-semibold text-[#073B4C] hover:underline">
            View All Activity
          </button>
        </div>

        {/* Table Header */}
        <div className="hidden sm:grid grid-cols-[1fr_1fr_1.5fr_0.8fr_auto] gap-4 px-5 py-3 border-b border-gray-100 text-xs font-semibold text-gray-400 uppercase tracking-wider">
          <span>Time</span>
          <span>Activity</span>
          <span>Details</span>
          <span>By</span>
          <span></span>
        </div>

        {/* Table Body */}
        <div className="divide-y divide-gray-100">
          {recentActivity.map((item, i) => (
            <div
              key={i}
              className="grid grid-cols-1 sm:grid-cols-[1fr_1fr_1.5fr_0.8fr_auto] gap-2 sm:gap-4 px-5 py-4 items-center hover:bg-gray-50 transition-colors"
            >
              <span className="text-sm text-gray-500">{item.time}</span>
              <div className="flex items-center gap-2">
                <item.activityIcon className={`w-4 h-4 ${item.activityColor}`} />
                <span className="text-sm font-medium text-gray-700">{item.activity}</span>
              </div>
              <span className="text-sm text-gray-600">{item.details}</span>
              <span className="text-sm text-gray-500">{item.by}</span>
              <button className="p-1 text-gray-400 hover:text-gray-600 self-start sm:self-center">
                <MoreVertical className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-center gap-2 px-5 py-3 border-t border-gray-100 text-xs text-gray-400">
          <RefreshCw className="w-3 h-3" />
          Dashboard data is updated in real-time. Last sync: 1 min ago.
        </div>
      </div>
    </div>
  )
}
