import { Calendar, Download, Printer, ClipboardList, AlertTriangle, UserCog, Users, AlertCircle } from 'lucide-react'

const weeklyStats = [
  { label: 'Total Assessments', value: '1,245', change: '+12%', icon: ClipboardList, iconColor: 'text-blue-500' },
  { label: 'Emergency Cases', value: '78', change: '-8%', icon: AlertTriangle, iconColor: 'text-red-500' },
  { label: 'Doctor Referrals', value: '156', change: '+15%', icon: UserCog, iconColor: 'text-purple-500' },
  { label: 'Active Users', value: '892', change: '+5%', icon: Users, iconColor: 'text-green-500' },
]

const monthlyStats = [
  { label: 'Total Assessments', value: '4,827', change: '+18%' },
  { label: 'Emergency Cases', value: '312', change: '+15%' },
  { label: 'Doctor Referrals', value: '648', change: '+12%' },
  { label: 'Active Users', value: '2,456', change: '+14%' },
]

const yearlyStats = [
  { label: 'Total Assessments', value: '14,256', change: '+42%' },
  { label: 'Emergency Cases', value: '1,024', change: '+19%' },
  { label: 'Doctor Referrals', value: '1,856', change: '+16%' },
  { label: 'Active Users', value: '6,892', change: '+26%' },
]

const weeklySymptoms = [
  { name: 'Headache', count: 320, percent: 25.7, color: 'bg-[#073B4C]' },
  { name: 'Fever', count: 280, percent: 22.5, color: 'bg-teal-500' },
  { name: 'Cough', count: 240, percent: 19.3, color: 'bg-[#073B4C]' },
]

const yearlySymptoms = [
  { name: 'Headache', count: 3100, percent: 21.7, color: 'bg-[#073B4C]' },
  { name: 'Fever', count: 2800, percent: 19.6, color: 'bg-teal-500' },
  { name: 'Cough', count: 2192, percent: 15.4, color: 'bg-[#073B4C]' },
  { name: 'Body Pain', count: 1700, percent: 11.9, color: 'bg-teal-500' },
  { name: 'Sore Throat', count: 1250, percent: 8.8, color: 'bg-gray-300' },
]

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
        <button className="flex items-center gap-2 px-3 py-2 border border-gray-200 dark:border-[#1e2028] rounded-lg text-xs text-gray-600 dark:text-[#6b7080] hover:bg-gray-50 dark:hover:bg-[#1a1d25]">
          <Calendar className="w-3.5 h-3.5" />
          May 1 - May 31, 2026 ▾
        </button>
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
              <span className="text-[10px] text-green-600 font-semibold">{stat.change}</span>
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
              <span className="text-[10px] text-green-600 font-semibold">{stat.change}</span>
            </div>
          ))}
        </div>

        <div className="pt-4 border-t border-gray-100 dark:border-[#1e2028]">
          <h4 className="text-sm font-semibold text-gray-700 dark:text-[#a0a4ad] mb-2">Insights & Trends</h4>
          <div className="space-y-2">
            <div className="bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-400 p-3 rounded-r-lg">
              <p className="text-sm font-medium text-gray-700 dark:text-[#a0a4ad]">Highest growth in 6 months</p>
              <p className="text-xs text-gray-500 dark:text-[#6b7080]">The 18% increase in assessments is the highest recorded growth since November 2025.</p>
            </div>
            <div className="bg-green-50 dark:bg-green-900/20 border-l-4 border-green-400 p-3 rounded-r-lg">
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
              <span className="text-[10px] text-green-600 font-semibold">{stat.change}</span>
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
