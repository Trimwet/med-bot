import { Download, Printer, ClipboardList, AlertTriangle, UserCog, Users, AlertCircle } from 'lucide-react'
import { DateDropdown } from '@/components/ui/date-dropdown'

const weeklyStats: any[] = []
const monthlyStats: any[] = []
const yearlyStats: any[] = []
const weeklySymptoms: any[] = []
const yearlySymptoms: any[] = []

export const BusinessReports = () => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-[#e8eaed]">Reports</h1>
          <p className="text-sm text-gray-500 dark:text-[#6b7080] mt-1">
            Generate and download reports for analysis and record keeping.
          </p>
        </div>
        <DateDropdown />
      </div>

      {/* Weekly Report */}
      <div className="bg-white dark:bg-[#0f1117] rounded-xl border border-gray-200 dark:border-[#1e2028] p-5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-[#e8eaed]">Weekly Report</h3>
            <p className="text-xs text-gray-400 dark:text-[#525666]">May 25 - May 31, 2026</p>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-[#073B4C] text-white rounded-lg text-sm font-semibold hover:bg-[#0A202A] transition-colors">
            <Download className="w-4 h-4" />
            <span className="hidden sm:inline">Download Report</span>
            <span className="sm:hidden">Download</span>
          </button>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
          {weeklyStats.map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="flex items-center justify-center gap-1 mb-1">
                <stat.icon className={`w-4 h-4 ${stat.iconColor}`} />
                <span className="text-[10px] text-gray-400 dark:text-[#525666] uppercase">{stat.label}</span>
              </div>
              <p className="text-xl font-bold text-gray-900 dark:text-[#e8eaed]">{stat.value}</p>
              <span className="text-[10px] text-[#00A8A8] font-semibold">{stat.change}</span>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 pt-4 border-t border-gray-100 dark:border-[#1e2028]">
          <div>
            <h4 className="text-sm font-semibold text-gray-700 dark:text-[#a0a4ad] mb-2 flex items-center gap-2">
              <span>📋</span> Weekly Summary
            </h4>
            <ul className="text-sm text-gray-600 dark:text-[#6b7080] space-y-1 list-disc list-inside">
              <li>Total assessments increased by 12% compared to last week, primarily driven by routine mental health screenings.</li>
              <li>Emergency cases increased by 8% following seasonal allergy spikes in the North sector.</li>
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-gray-700 dark:text-[#a0a4ad] mb-2">Top Symptoms Reported</h4>
            <div className="space-y-2">
              {weeklySymptoms.map((s) => (
                <div key={s.name}>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600 dark:text-[#6b7080]">{s.name}</span>
                    <span className="text-gray-500 dark:text-[#6b7080]">{s.count} ({s.percent}%)</span>
                  </div>
                  <div className="w-full h-1.5 bg-gray-100 dark:bg-[#1a1d25] rounded-full mt-1">
                    <div className={`h-1.5 rounded-full ${s.color}`} style={{ width: `${s.percent * 3}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Monthly Report */}
      <div className="bg-white dark:bg-[#0f1117] rounded-xl border border-gray-200 dark:border-[#1e2028] p-5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-[#e8eaed]">Monthly Report</h3>
            <p className="text-xs text-gray-400 dark:text-[#525666]">May 1 - May 31, 2026</p>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-[#073B4C] text-white rounded-lg text-sm font-semibold hover:bg-[#0A202A] transition-colors">
            <Download className="w-4 h-4" />
            <span className="hidden sm:inline">Download Report</span>
            <span className="sm:hidden">Download</span>
          </button>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
          {monthlyStats.map((stat) => (
            <div key={stat.label} className="text-center">
              <p className="text-[10px] text-gray-400 dark:text-[#525666] uppercase mb-1">{stat.label}</p>
              <p className="text-xl font-bold text-gray-900 dark:text-[#e8eaed]">{stat.value}</p>
              <span className="text-[10px] text-[#00A8A8] font-semibold">{stat.change}</span>
            </div>
          ))}
        </div>

        <div className="pt-4 border-t border-gray-100 dark:border-[#1e2028]">
          <h4 className="text-sm font-semibold text-gray-700 dark:text-[#a0a4ad] mb-2">Insights & Trends</h4>
          <div className="space-y-2">
            <div className="bg-[#073B4C]/5 dark:bg-[#00A8A8]/10 border-l-4 border-[#073B4C] dark:border-[#00A8A8] p-3 rounded-r-lg">
              <p className="text-sm font-medium text-gray-700 dark:text-[#a0a4ad]">Highest growth in 6 months</p>
              <p className="text-xs text-gray-500 dark:text-[#6b7080]">The 18% increase in assessments is the highest recorded growth since November 2025.</p>
            </div>
            <div className="bg-[#00D4D4]/5 dark:bg-[#00D4D4]/10 border-l-4 border-[#00A8A8] dark:border-[#00D4D4] p-3 rounded-r-lg">
              <p className="text-sm font-medium text-gray-700 dark:text-[#a0a4ad]">Efficiency Peak</p>
              <p className="text-xs text-gray-500 dark:text-[#6b7080]">Referral processing time dropped by 24% this month due to new AI sorting algorithms.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Yearly Report */}
      <div className="bg-white dark:bg-[#0f1117] rounded-xl border border-gray-200 dark:border-[#1e2028] p-5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-[#e8eaed]">Yearly Report</h3>
            <p className="text-xs text-gray-400 dark:text-[#525666]">Apr 1 - Jun 30, 2026</p>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 dark:border-[#2a2d35] text-gray-700 dark:text-[#a0a4ad] rounded-lg text-sm font-semibold hover:bg-gray-50 dark:hover:bg-[#1a1d25] transition-colors">
            <Printer className="w-4 h-4" />
            <span className="hidden sm:inline">Print Report</span>
            <span className="sm:hidden">Print</span>
          </button>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
          {yearlyStats.map((stat) => (
            <div key={stat.label} className="text-center">
              <p className="text-[10px] text-gray-400 dark:text-[#525666] uppercase mb-1">{stat.label}</p>
              <p className="text-xl font-bold text-gray-900 dark:text-[#e8eaed]">{stat.value}</p>
              <span className="text-[10px] text-[#00A8A8] font-semibold">{stat.change}</span>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 pt-4 border-t border-gray-100 dark:border-[#1e2028]">
          <div>
            <h4 className="text-sm font-semibold text-gray-700 dark:text-[#a0a4ad] mb-2">Quarterly Summary</h4>
            <ul className="text-sm text-gray-600 dark:text-[#6b7080] space-y-1 list-disc list-inside">
              <li>Total assessments increased by 22% compared to last quarter</li>
              <li>Emergency cases increased by 18%</li>
              <li>Doctor referrals increased by 16%</li>
              <li>Active users increased by 20%</li>
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-gray-700 dark:text-[#a0a4ad] mb-2">Quarterly Top Symptoms</h4>
            <div className="space-y-2">
              {yearlySymptoms.map((s) => (
                <div key={s.name}>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600 dark:text-[#6b7080]">{s.name}</span>
                    <span className="text-gray-500 dark:text-[#6b7080]">{s.count.toLocaleString()} ({s.percent}%)</span>
                  </div>
                  <div className="w-full h-1.5 bg-gray-100 dark:bg-[#1a1d25] rounded-full mt-1">
                    <div className={`h-1.5 rounded-full ${s.color}`} style={{ width: `${s.percent * 3.5}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Disclaimer */}
      <div className="bg-gray-50 dark:bg-[#080a0e] border border-gray-200 dark:border-[#1e2028] rounded-xl p-4">
        <div className="flex items-start gap-2">
          <AlertCircle className="w-4 h-4 text-gray-400 dark:text-[#525666] mt-0.5 flex-shrink-0" />
          <p className="text-xs text-gray-500 dark:text-[#6b7080] leading-relaxed">
            Reports are generated based on completed assessments and verified clinical data. All reports can be
            downloaded as PDF or Excel files for external record keeping.
          </p>
        </div>
      </div>
    </div>
  )
}