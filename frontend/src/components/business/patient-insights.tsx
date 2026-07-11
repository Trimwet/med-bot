import React from 'react'
import { Calendar, Users, ClipboardList, AlertTriangle, FileText, TrendingUp, Download } from 'lucide-react'

const stats = [
  { label: 'Total Patients', value: '2,456', change: '+12%', trend: 'up' as const, icon: Users, iconBg: 'bg-blue-50', iconColor: 'text-blue-500', subtitle: '168 new patients' },
  { label: 'Total Assessments', value: '3,912', change: '+18%', trend: 'up' as const, icon: ClipboardList, iconBg: 'bg-green-50', iconColor: 'text-green-500', subtitle: '1,209 completed' },
  { label: 'High Risk Cases', value: '156', change: '+7%', trend: 'up' as const, icon: AlertTriangle, iconBg: 'bg-red-50', iconColor: 'text-red-500', subtitle: 'CRITICAL ATTENTION REQUIRED' },
  { label: 'Reports Generated', value: '248', change: '+9%', trend: 'up' as const, icon: FileText, iconBg: 'bg-purple-50', iconColor: 'text-purple-500', subtitle: '168 generated' },
]

const topSymptoms = [
  { name: 'Headache', count: 1245, percent: 31.8, color: 'bg-[#073B4C]' },
  { name: 'Fever', count: 1032, percent: 26.4, color: 'bg-teal-500' },
  { name: 'Cough', count: 876, percent: 22.4, color: 'bg-[#073B4C]' },
  { name: 'Body Pain', count: 654, percent: 16.7, color: 'bg-teal-500' },
  { name: 'Sore Throat', count: 543, percent: 13.9, color: 'bg-gray-300' },
]

const riskCategories = [
  { label: 'Low', percent: 62.4, color: '#00A8A8' },
  { label: 'Medi', percent: 27.3, color: '#F59E0B' },
  { label: 'High', percent: 7.1, color: '#EF4444' },
  { label: 'Crit', percent: 3.2, color: '#DC2626' },
]

export const PatientInsights = () => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100">Patient Insights</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Understand patient health patterns and risk factors across the clinical network.
          </p>
        </div>
        <button className="flex items-center gap-2 px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg text-xs text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700">
          <Calendar className="w-3.5 h-3.5" />
          May 14 - May 20, 2026 ▾
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5">
            <div className="flex items-center justify-between mb-3">
              <div className={`w-10 h-10 ${stat.iconBg} rounded-xl flex items-center justify-center`}>
                <stat.icon className={`w-5 h-5 ${stat.iconColor}`} />
              </div>
              <div className="flex items-center gap-1 text-xs font-semibold text-green-600">
                <TrendingUp className="w-3.5 h-3.5" />
                {stat.change}
              </div>
            </div>
            <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{stat.value}</p>
            <p className="text-[10px] text-gray-400 dark:text-gray-500 mt-1 uppercase">{stat.subtitle}</p>
          </div>
        ))}
      </div>

      {/* Middle Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Top Symptoms */}
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900 dark:text-gray-100">Top Symptoms</h3>
            <button className="text-sm font-semibold text-[#073B4C] hover:underline">View All</button>
          </div>
          <div className="space-y-3">
            {topSymptoms.map((s) => (
              <div key={s.name}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm text-gray-700 dark:text-gray-300">{s.name}</span>
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    {s.count.toLocaleString()} ({s.percent}%)
                  </span>
                </div>
                <div className="w-full h-2 bg-gray-100 dark:bg-gray-700 rounded-full">
                  <div className={`h-2 rounded-full ${s.color}`} style={{ width: `${s.percent * 3}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Risk Categories */}
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5">
          <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-4">Risk Categories</h3>
          <div className="flex items-center justify-center mb-4">
            <div className="relative w-40 h-40">
              <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                {riskCategories.reduce((acc, g, i) => {
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
                <span className="text-2xl font-bold text-gray-900 dark:text-gray-100">3.9k</span>
                <span className="text-xs text-gray-400 dark:text-gray-500">TOTAL</span>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {riskCategories.map((g) => (
              <div key={g.label} className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: g.color }}></span>
                <span className="text-xs text-gray-600 dark:text-gray-400">
                  {g.label}: {g.percent}%
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Download Reports */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-gray-100">Download Reports</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Export patient insights data for clinical analysis and regulatory reporting.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <button className="flex items-center gap-3 px-4 py-3 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
              <div className="w-8 h-8 bg-red-50 rounded-lg flex items-center justify-center">
                <FileText className="w-4 h-4 text-red-500" />
              </div>
              <div className="text-left">
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Download PDF Report</p>
                <p className="text-[10px] text-gray-400 dark:text-gray-500">Q4 2025 Assessment Data, 4.2MB</p>
              </div>
            </button>
            <button className="flex items-center gap-3 px-4 py-3 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
              <div className="w-8 h-8 bg-green-50 rounded-lg flex items-center justify-center">
                <Download className="w-4 h-4 text-green-500" />
              </div>
              <div className="text-left">
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Download Excel Report</p>
                <p className="text-[10px] text-gray-400 dark:text-gray-500">Raw data & metrics spreadsheet</p>
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Disclaimer */}
      <div className="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl p-4">
        <div className="flex items-start gap-2">
          <span className="text-gray-400 dark:text-gray-500 mt-0.5">ℹ️</span>
          <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
            Data is based on completed assessments during the selected time period. Generated real-time.
          </p>
        </div>
      </div>
    </div>
  )
}
