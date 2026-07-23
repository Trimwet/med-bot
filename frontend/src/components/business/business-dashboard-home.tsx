import { useState, useEffect, useCallback } from 'react'
import { Calendar, AlertTriangle, ClipboardList, MessageSquare, Activity, RefreshCw } from 'lucide-react'
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import {
  getTenantOverview,
  getTenantSessions,
  getTenantTrends,
  type TenantOverview,
  type TenantSessionEntry,
  type TenantTrendsResponse,
} from '@/lib/api'

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

export const BusinessDashboardHome = () => {
  const [overview, setOverview] = useState<TenantOverview | null>(null)
  const [recentSessions, setRecentSessions] = useState<TenantSessionEntry[]>([])
  const [trends, setTrends] = useState<TenantTrendsResponse | null>(null)
  const [loading, setLoading] = useState(true)

  const fetchData = useCallback(async () => {
    setLoading(true)
    try {
      const [ov, tr, se] = await Promise.all([
        getTenantOverview(),
        getTenantTrends('7d'),
        getTenantSessions({ page: 1, limit: 8 }),
      ])
      setOverview(ov)
      setTrends(tr)
      setRecentSessions(se.sessions)
    } catch (err) {
      console.error('Failed to fetch dashboard data', err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetchData() }, [fetchData])

  const totalAssessments = overview
    ? overview.verdictBreakdown.self_care + overview.verdictBreakdown.consult + overview.verdictBreakdown.emergency
    : 0

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-[#e8eaed]">Dashboard</h1>
          <p className="text-sm text-gray-500 dark:text-[#6b7080] mt-1">
            Welcome back! Here's what's happening with your assessments.
          </p>
        </div>
        <button
          onClick={fetchData}
          className="flex items-center gap-2 px-4 py-2.5 border border-gray-200 dark:border-[#2a2d35] rounded-lg text-sm font-medium text-gray-700 dark:text-[#a0a4ad] hover:bg-gray-50 dark:hover:bg-[#1a1d25] transition-colors"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh</span>
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Assessments */}
        <div className="bg-white dark:bg-[#0f1117] rounded-xl border border-gray-200 dark:border-[#1e2028] p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 bg-blue-50 dark:bg-blue-900/20 rounded-xl flex items-center justify-center">
              <ClipboardList className="w-5 h-5 text-blue-500 dark:text-blue-400" />
            </div>
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-[#e8eaed]">
            {loading ? '—' : totalAssessments.toLocaleString()}
          </p>
          <p className="text-sm font-medium text-gray-500 dark:text-[#6b7080] mt-1">Total Assessments</p>
        </div>

        {/* Active Sessions */}
        <div className="bg-white dark:bg-[#0f1117] rounded-xl border border-gray-200 dark:border-[#1e2028] p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl flex items-center justify-center">
              <Activity className="w-5 h-5 text-indigo-500 dark:text-indigo-400" />
            </div>
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-[#e8eaed]">
            {loading ? '—' : (overview?.activeSessions ?? 0).toLocaleString()}
          </p>
          <p className="text-sm font-medium text-gray-500 dark:text-[#6b7080] mt-1">Active Sessions</p>
        </div>

        {/* Consult / Doctor Referrals */}
        <div className="bg-white dark:bg-[#0f1117] rounded-xl border border-gray-200 dark:border-[#1e2028] p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 bg-amber-50 dark:bg-amber-900/20 rounded-xl flex items-center justify-center">
              <MessageSquare className="w-5 h-5 text-amber-500 dark:text-amber-400" />
            </div>
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-[#e8eaed]">
            {loading ? '—' : (overview?.verdictBreakdown.consult ?? 0).toLocaleString()}
          </p>
          <p className="text-sm font-medium text-gray-500 dark:text-[#6b7080] mt-1">Doctor Referrals</p>
        </div>

        {/* Emergency Cases */}
        <div className="bg-white dark:bg-[#0f1117] rounded-xl border border-gray-200 dark:border-[#1e2028] p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 bg-red-50 dark:bg-red-900/20 rounded-xl flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-red-500 dark:text-red-400" />
            </div>
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-[#e8eaed]">
            {loading ? '—' : (overview?.emergencySessions ?? 0).toLocaleString()}
          </p>
          <p className="text-sm font-medium text-gray-500 dark:text-[#6b7080] mt-1">Emergency Cases</p>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* 7-Day Trends */}
        <div className="bg-white dark:bg-[#0f1117] rounded-xl border border-gray-200 dark:border-[#1e2028] p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900 dark:text-[#e8eaed]">7-Day Trends</h3>
            <span className="text-xs text-gray-500 dark:text-[#6b7080] bg-gray-100 dark:bg-[#1a1d25] px-3 py-1 rounded-full">
              {loading ? 'Loading...' : 'Last 7 days'}
            </span>
          </div>
          <div className="h-56">
            {loading ? (
              <div className="h-full flex items-center justify-center text-gray-400 dark:text-[#525666] text-sm">
                Loading chart...
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={trends?.daily ?? []}>
                  <defs>
                    <linearGradient id="homeGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#00A8A8" stopOpacity={0.3} />
                      <stop offset="100%" stopColor="#00A8A8" stopOpacity={0.02} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
                  <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#9CA3AF' }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#9CA3AF' }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#fff',
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px',
                      fontSize: '12px',
                      boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)',
                    }}
                  />
                  <Area type="monotone" dataKey="total" stroke="#00A8A8" strokeWidth={2} fill="url(#homeGrad)" />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Verdict Breakdown */}
        <div className="bg-white dark:bg-[#0f1117] rounded-xl border border-gray-200 dark:border-[#1e2028] p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900 dark:text-[#e8eaed]">Verdict Breakdown</h3>
          </div>
          <div className="space-y-4">
            {(['self_care', 'consult', 'emergency'] as const).map((v) => {
              const count = overview?.verdictBreakdown[v] ?? 0
              const pct = totalAssessments > 0 ? (count / totalAssessments) * 100 : 0
              return (
                <div key={v}>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-sm text-gray-700 dark:text-[#d4d4d8]">{verdictLabels[v]}</span>
                    <span className="text-xs tabular-nums text-gray-500 dark:text-[#71717a]">
                      {loading ? '—' : count.toLocaleString()} <span className="text-gray-400 dark:text-[#525666]">({pct.toFixed(1)}%)</span>
                    </span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-gray-100 dark:bg-[#1a1d25]">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${v === 'self_care' ? 'bg-emerald-500' : v === 'consult' ? 'bg-amber-500' : 'bg-red-500'}`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              )
            })}
          </div>
          <p className="text-xs text-gray-400 dark:text-[#525666] mt-6 text-center">
            Total: <span className="font-semibold text-gray-600 dark:text-[#71717a]">{loading ? '—' : totalAssessments.toLocaleString()}</span> assessments
          </p>
        </div>
      </div>

      {/* Recent Sessions */}
      <div className="bg-white dark:bg-[#0f1117] rounded-xl border border-gray-200 dark:border-[#1e2028]">
        <div className="flex items-center justify-between p-5 border-b border-gray-100 dark:border-[#1e2028]">
          <h3 className="font-semibold text-gray-900 dark:text-[#e8eaed]">Recent Sessions</h3>
        </div>

        <div className="hidden sm:grid grid-cols-[1fr_0.8fr_0.6fr_1fr_0.8fr] gap-4 px-5 py-3 border-b border-gray-100 dark:border-[#1e2028] text-xs font-semibold text-gray-400 dark:text-[#525666] uppercase tracking-wider">
          <span>Session</span>
          <span>Verdict</span>
          <span>Messages</span>
          <span>Symptoms</span>
          <span>Date</span>
        </div>

        <div className="divide-y divide-gray-100 dark:divide-[#1e2028]">
          {loading ? (
            <div className="px-5 py-8 text-center text-sm text-gray-400 dark:text-[#525666]">Loading sessions...</div>
          ) : recentSessions.length === 0 ? (
            <div className="px-5 py-8 text-center text-sm text-gray-400 dark:text-[#525666]">
              No sessions yet. Chat data from your widget will appear here.
            </div>
          ) : (
            recentSessions.map((s) => (
              <div
                key={s.sessionId}
                className="grid grid-cols-1 sm:grid-cols-[1fr_0.8fr_0.6fr_1fr_0.8fr] gap-2 sm:gap-4 px-5 py-4 items-center hover:bg-gray-50 dark:hover:bg-[#1a1d25] transition-colors"
              >
                <p className="text-sm font-medium text-gray-700 dark:text-[#a0a4ad] truncate max-w-[180px]">
                  {s.firstMessage || s.sessionId.slice(0, 16)}
                </p>
                <span>
                  {s.verdict ? (
                    <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${verdictColors[s.verdict]}`}>
                      {verdictLabels[s.verdict] || s.verdict}
                    </span>
                  ) : (
                    <span className="text-[10px] text-gray-400 dark:text-[#525666]">—</span>
                  )}
                </span>
                <span className="text-sm tabular-nums text-gray-600 dark:text-[#a1a1aa]">{s.messageCount}</span>
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
                <span className="text-[10px] text-gray-500 dark:text-[#71717a] tabular-nums">
                  {new Date(s.createdAt).toLocaleDateString('en-NG', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
