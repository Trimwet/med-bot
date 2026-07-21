import { useState } from 'react'
import { Users, ClipboardList, AlertTriangle, FileText, Download } from 'lucide-react'
import { cn } from '@/lib/utils'
import { TrendBadge } from '@/components/business/kpi-cards'
import { DateDropdown } from '@/components/ui/date-dropdown'

const stats: any[] = []

const topSymptoms: any[] = []

const riskCategories: any[] = []

const cardStyle = cn(
  'rounded-xl p-6',
  'bg-white border border-gray-200',
  'dark:bg-[#0f1117] dark:border-[#1e2028]',
)

const sectionTitle = 'text-sm font-semibold tracking-tight text-gray-900 dark:text-white'

export const PatientInsights = () => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-semibold tracking-tight text-gray-900 dark:text-white">Patient Insights</h1>
          <p className="text-sm text-gray-500 dark:text-[#71717a] mt-1">
            Understand patient health patterns and risk factors across the clinical network.
          </p>
        </div>
        <DateDropdown />
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <div key={stat.label} className={cardStyle}>
              <div className="flex items-center justify-between mb-5">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gray-100 dark:bg-[#1a1d25]">
                  <Icon className="h-4 w-4 text-gray-400 dark:text-[#6b7280]" strokeWidth={1.5} />
                </div>
                <TrendBadge change={stat.change} trend={stat.trend} />
              </div>
              <p className="text-3xl font-semibold tracking-tight text-gray-900 dark:text-white tabular-nums">
                {stat.value}
              </p>
              <p className="mt-1.5 text-sm font-medium text-gray-600 dark:text-[#a1a1aa]">
                {stat.label}
              </p>
              <p className="mt-1 text-xs text-gray-400 dark:text-[#52525b]">
                {stat.subtitle}
              </p>
            </div>
          )
        })}
      </div>

      {/* Middle Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Top Symptoms */}
        <div className={cardStyle}>
          <div className="flex items-center justify-between mb-5">
            <h3 className={sectionTitle}>Top Symptoms</h3>
            <button className="text-xs font-medium text-gray-500 dark:text-[#71717a] hover:text-gray-700 dark:hover:text-[#a1a1aa] transition-colors">
              View All
            </button>
          </div>
          <div className="space-y-3.5">
            {topSymptoms.map((s) => (
              <div key={s.name}>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-sm text-gray-700 dark:text-[#d4d4d8]">{s.name}</span>
                  <span className="text-xs tabular-nums text-gray-500 dark:text-[#71717a]">
                    {s.count.toLocaleString()} <span className="text-gray-400 dark:text-[#52525b]">({s.percent}%)</span>
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
        </div>

        {/* Risk Categories */}
        <div className={cardStyle}>
          <h3 className={sectionTitle}>Risk Categories</h3>
          <div className="flex items-center justify-center my-6">
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
                <span className="text-2xl font-semibold tracking-tight text-gray-900 dark:text-white">0</span>
                <span className="text-[10px] font-medium uppercase tracking-wider text-gray-400 dark:text-[#52525b]">Total</span>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-x-4 gap-y-2">
            {riskCategories.map((g) => (
              <div key={g.label} className="flex items-center gap-2.5">
                <span className="h-2 w-2 rounded-full" style={{ backgroundColor: g.color }} />
                <span className="text-xs text-gray-600 dark:text-[#a1a1aa]">
                  {g.label} <span className="text-gray-400 dark:text-[#52525b]">{g.percent}%</span>
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Download Reports */}
      <div className={cardStyle}>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h3 className={sectionTitle}>Download Reports</h3>
            <p className="text-sm text-gray-500 dark:text-[#71717a] mt-1">
              Export patient insights data for clinical analysis and regulatory reporting.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <button className="inline-flex items-center gap-3 rounded-lg border border-gray-200 dark:border-white/[0.06] bg-white dark:bg-[#111111] px-4 py-3 transition-colors hover:border-gray-300 dark:hover:border-white/[0.12]">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gray-100 dark:bg-white/[0.04]">
                <FileText className="h-4 w-4 text-gray-500 dark:text-[#71717a]" strokeWidth={1.5} />
              </div>
              <div className="text-left">
                <p className="text-sm font-medium text-gray-700 dark:text-[#d4d4d8]">PDF Report</p>
                <p className="text-[11px] text-gray-400 dark:text-[#52525b]">Q4 2025, 4.2MB</p>
              </div>
            </button>
            <button className="inline-flex items-center gap-3 rounded-lg border border-gray-200 dark:border-white/[0.06] bg-white dark:bg-[#111111] px-4 py-3 transition-colors hover:border-gray-300 dark:hover:border-white/[0.12]">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gray-100 dark:bg-white/[0.04]">
                <Download className="h-4 w-4 text-gray-500 dark:text-[#71717a]" strokeWidth={1.5} />
              </div>
              <div className="text-left">
                <p className="text-sm font-medium text-gray-700 dark:text-[#d4d4d8]">Excel Report</p>
                <p className="text-[11px] text-gray-400 dark:text-[#52525b]">Raw data & metrics</p>
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Disclaimer */}
      <div className="rounded-xl border border-gray-200 dark:border-white/[0.06] bg-gray-50 dark:bg-white/[0.02] p-4">
        <p className="text-xs text-gray-500 dark:text-[#71717a] leading-relaxed">
          Data is based on completed assessments during the selected time period. Generated real-time.
        </p>
      </div>
    </div>
  )
}
