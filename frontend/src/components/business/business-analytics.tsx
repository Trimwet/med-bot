import React, { useState } from 'react'
import { Calendar, AlertCircle } from 'lucide-react'

type TimeRange = 'Daily' | 'Weekly' | 'Monthly' | 'Yearly'

const topSymptoms = [
  { name: 'Headache', count: 1245, percent: 25.8, color: 'bg-[#073B4C]' },
  { name: 'Fever', count: 1032, percent: 21.3, color: 'bg-teal-500' },
  { name: 'Cough', count: 876, percent: 18.1, color: 'bg-[#073B4C]' },
  { name: 'Body Pain', count: 654, percent: 13.6, color: 'bg-teal-500' },
  { name: 'Sore Throat', count: 543, percent: 11.3, color: 'bg-gray-300' },
]

const ageGroups = [
  { label: '18-30', percent: 28.7, color: '#073B4C' },
  { label: '31-45', percent: 27.1, color: '#00A8A8' },
  { label: '46-60', percent: 18.6, color: '#4C8C5B' },
  { label: '0-17', percent: 15.2, color: '#F59E0B' },
  { label: '60+', percent: 10.4, color: '#9CA3AF' },
]

const monthlyGrowth = [800, 1100, 1400, 1700, 2000, 2200, 2500, 2800, 3000, 3200, 3400, 3600]
const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

export const BusinessAnalytics = () => {
  const [activeRange, setActiveRange] = useState<TimeRange>('Monthly')
  const ranges: TimeRange[] = ['Daily', 'Weekly', 'Monthly', 'Yearly']

  const maxGrowth = Math.max(...monthlyGrowth)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-[#e8eaed]">Analytics</h1>
          <p className="text-sm text-gray-500 dark:text-[#6b7080] mt-1">
            Insights and trends from assessments and users.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center bg-gray-100 dark:bg-[#1a1d25] rounded-lg p-1">
            {ranges.map((r) => (
              <button
                key={r}
                onClick={() => setActiveRange(r)}
                className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                  activeRange === r
                    ? 'bg-[#073B4C] text-white'
                    : 'text-gray-500 dark:text-[#6b7080] hover:text-gray-700 dark:hover:text-[#a0a4ad]'
                }`}
              >
                {r}
              </button>
            ))}
          </div>
          <button className="flex items-center gap-2 px-3 py-2 border border-gray-200 dark:border-[#1e2028] rounded-lg text-xs text-gray-600 dark:text-[#6b7080] hover:bg-gray-50 dark:hover:bg-[#1a1d25]">
            <Calendar className="w-3.5 h-3.5" />
            May 1 - May 31, 2026 ▾
          </button>
        </div>
      </div>

      {/* Top Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Top Symptoms */}
        <div className="bg-white dark:bg-[#0f1117] rounded-xl border border-gray-200 dark:border-[#1e2028] p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900 dark:text-[#e8eaed]">Top Symptoms</h3>
            <span className="text-xs text-gray-400 dark:text-[#525666]">May 2026</span>
          </div>
          <div className="space-y-3">
            {topSymptoms.map((s) => (
              <div key={s.name}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm text-gray-700 dark:text-[#a0a4ad]">{s.name}</span>
                  <span className="text-sm text-gray-500 dark:text-[#6b7080]">
                    {s.count.toLocaleString()} ({s.percent}%)
                  </span>
                </div>
                <div className="w-full h-2 bg-gray-100 dark:bg-[#1a1d25] rounded-full">
                  <div
                    className={`h-2 rounded-full ${s.color}`}
                    style={{ width: `${s.percent * 3}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
          <p className="text-xs text-gray-400 dark:text-[#525666] mt-4 text-center">
            Total Symptoms Recorded: <span className="font-semibold text-gray-600 dark:text-[#6b7080]">4,827</span>
          </p>
        </div>

        {/* Age Groups */}
        <div className="bg-white dark:bg-[#0f1117] rounded-xl border border-gray-200 dark:border-[#1e2028] p-5">
          <h3 className="font-semibold text-gray-900 dark:text-[#e8eaed] mb-4">Age Groups</h3>
          <div className="flex items-center justify-center mb-4">
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
                <span className="text-2xl font-bold text-gray-900 dark:text-[#e8eaed]">2,456</span>
                <span className="text-xs text-gray-400 dark:text-[#525666]">Users</span>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {ageGroups.map((g) => (
              <div key={g.label} className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: g.color }}></span>
                <span className="text-xs text-gray-600 dark:text-[#6b7080]">
                  {g.label} ({g.percent}%)
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Middle Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Gender Distribution */}
        <div className="bg-white dark:bg-[#0f1117] rounded-xl border border-gray-200 dark:border-[#1e2028] p-5">
          <h3 className="font-semibold text-gray-900 dark:text-[#e8eaed] mb-4">Gender Distribution</h3>
          <div className="flex items-center gap-6">
            <div className="relative w-32 h-32">
              <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                <circle cx="50" cy="50" r="40" fill="none" stroke="#073B4C" strokeWidth="14" strokeDasharray="151.75 251.327" />
                <circle cx="50" cy="50" r="40" fill="none" stroke="#00A8A8" strokeWidth="14" strokeDasharray="118.92 251.327" strokeDashoffset="-151.75" />
              </svg>
            </div>
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-sm bg-[#073B4C]"></span>
                <span className="text-sm text-gray-700 dark:text-[#a0a4ad]">Male (52.6%)</span>
                <span className="text-xs text-gray-400 dark:text-[#525666]">1,291 users</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-sm bg-teal-400"></span>
                <span className="text-sm text-gray-700 dark:text-[#a0a4ad]">Female (47.4%)</span>
                <span className="text-xs text-gray-400 dark:text-[#525666]">1,165 users</span>
              </div>
            </div>
          </div>
          <p className="text-xs text-gray-400 dark:text-[#525666] mt-4 text-center">
            Total Users: <span className="font-semibold text-gray-600 dark:text-[#6b7080]">2,456</span>
          </p>
        </div>

        {/* Emergency Cases Percentage */}
        <div className="bg-white dark:bg-[#0f1117] rounded-xl border border-gray-200 dark:border-[#1e2028] p-5">
          <h3 className="font-semibold text-gray-900 dark:text-[#e8eaed] mb-4">Emergency Cases Percentage</h3>
          <div className="flex items-center justify-center mb-4">
            <div className="relative w-36 h-36">
              <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                <circle cx="50" cy="50" r="40" fill="none" stroke="#FEE2E2" strokeWidth="10" />
                <circle cx="50" cy="50" r="40" fill="none" stroke="#EF4444" strokeWidth="10" strokeDasharray="15.79 251.327" />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-2xl font-bold text-red-500">6.3%</span>
                <span className="text-xs text-gray-400 dark:text-[#525666]">Emergency</span>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 text-center">
            <div>
              <p className="text-xs text-gray-400 dark:text-[#525666] uppercase">Total Emergencies</p>
              <p className="text-lg font-bold text-red-500">156</p>
            </div>
            <div>
              <p className="text-xs text-gray-400 dark:text-[#525666] uppercase">Total Assessments</p>
              <p className="text-lg font-bold text-gray-900 dark:text-[#e8eaed]">2,456</p>
            </div>
          </div>
        </div>
      </div>

      {/* Monthly Growth */}
      <div className="bg-white dark:bg-[#0f1117] rounded-xl border border-gray-200 dark:border-[#1e2028] p-5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-[#e8eaed]">Monthly Growth</h3>
            <p className="text-xs text-gray-500 dark:text-[#6b7080]">Overall Assessment Trends (2026)</p>
          </div>
          <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-[#6b7080]">
            <span className="w-3 h-0.5 bg-[#073B4C] rounded-full"></span>
            Assessments
          </div>
        </div>
        <div className="relative h-48">
          <svg className="w-full h-full" viewBox="0 0 600 180" preserveAspectRatio="none">
            <defs>
              <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#00A8A8" stopOpacity="0.2" />
                <stop offset="100%" stopColor="#00A8A8" stopOpacity="0" />
              </linearGradient>
            </defs>
            <path
              d={`M0,${180 - (monthlyGrowth[0] / maxGrowth) * 160} ${monthlyGrowth.map((v, i) => `L${(i / (monthlyGrowth.length - 1)) * 600},${180 - (v / maxGrowth) * 160}`).join(' ')} L600,180 L0,180 Z`}
              fill="url(#areaGrad)"
            />
            <polyline
              points={monthlyGrowth.map((v, i) => `${(i / (monthlyGrowth.length - 1)) * 600},${180 - (v / maxGrowth) * 160}`).join(' ')}
              fill="none"
              stroke="#00A8A8"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
        <div className="flex justify-between mt-2 px-2">
          {months.map((m) => (
            <span key={m} className="text-[10px] text-gray-400 dark:text-[#525666]">{m}</span>
          ))}
        </div>
      </div>

      {/* Disclaimer */}
      <div className="bg-gray-50 dark:bg-[#080a0e] border border-gray-200 dark:border-[#1e2028] rounded-xl p-4">
        <div className="flex items-start gap-2">
          <AlertCircle className="w-4 h-4 text-gray-400 dark:text-[#525666] mt-0.5 flex-shrink-0" />
          <p className="text-xs text-gray-500 dark:text-[#6b7080] leading-relaxed">
            Analytics data is updated based on the selected time period. All times are in your local timezone.
            Data refresh happens every 15 minutes.
          </p>
        </div>
      </div>
    </div>
  )
}
