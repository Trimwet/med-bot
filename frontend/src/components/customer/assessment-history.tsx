import { useState } from 'react'
import { Filter, Plus, FileText, ChevronRight, AlertCircle } from 'lucide-react'

type Urgency = 'Low' | 'Moderate' | 'High'

interface Assessment {
  id: string
  date: string
  time: string
  symptoms: string
  urgency: Urgency
}

const assessments: Assessment[] = [
  {
    id: '#MB84291',
    date: 'May 14, 2025',
    time: '10:15 AM',
    symptoms: 'Headache, mild fever, body pain, sore throat',
    urgency: 'Low',
  },
  {
    id: '#MB73920',
    date: 'May 10, 2025',
    time: '08:30 PM',
    symptoms: 'Cough, fatigue, runny nose',
    urgency: 'Moderate',
  },
  {
    id: '#MB65218',
    date: 'May 5, 2025',
    time: '09:15 AM',
    symptoms: 'Chest pain, shortness of breath, dizziness',
    urgency: 'High',
  },
  {
    id: '#MB58102',
    date: 'Apr 28, 2025',
    time: '11:20 AM',
    symptoms: 'Stomach ache, nausea, loss of appetite',
    urgency: 'Low',
  },
]

const urgencyStyles: Record<Urgency, { dot: string; text: string; bg: string; border: string }> = {
  Low: { dot: 'bg-green-500', text: 'text-green-600', bg: 'bg-white', border: 'border-gray-200' },
  Moderate: { dot: 'bg-yellow-500', text: 'text-yellow-600', bg: 'bg-white', border: 'border-gray-200' },
  High: { dot: 'bg-red-500', text: 'text-red-600', bg: 'bg-red-50', border: 'border-red-200' },
}

const filters = ['All', 'Low', 'Moderate', 'High'] as const

export const AssessmentHistory = () => {
  const [activeFilter, setActiveFilter] = useState<'All' | Urgency>('All')
  const [sortOrder, setSortOrder] = useState<'Newest First' | 'Oldest First'>('Newest First')

  const filtered = activeFilter === 'All'
    ? assessments
    : assessments.filter((a) => a.urgency === activeFilter)

  const sorted = sortOrder === 'Newest First' ? filtered : [...filtered].reverse()

  return (
    <div className="max-w-4xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Assessment History</h1>
          <p className="text-sm text-gray-500 mt-1">
            View and manage your past clinical health assessments.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
            <Filter className="w-4 h-4" />
            Filters
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-[#073B4C] text-white rounded-lg text-sm font-semibold hover:bg-[#0A202A] transition-colors">
            <Plus className="w-4 h-4" />
            Start New
          </button>
        </div>
      </div>

      {/* Filters & Sort */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          {filters.map((f) => (
            <button
              key={f}
              onClick={() => setActiveFilter(f)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                activeFilter === f
                  ? 'bg-[#073B4C] text-white'
                  : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
              }`}
            >
              {f !== 'All' && (
                <span className={`w-2 h-2 rounded-full ${
                  f === 'Low' ? 'bg-green-500' : f === 'Moderate' ? 'bg-yellow-500' : 'bg-red-500'
                }`}></span>
              )}
              {f === 'All' ? 'All' : `${f} Urgency`}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2 text-sm text-gray-500">
          <span>SORT BY:</span>
          <button
            onClick={() => setSortOrder(sortOrder === 'Newest First' ? 'Oldest First' : 'Newest First')}
            className="font-semibold text-gray-700 hover:text-[#073B4C] transition-colors"
          >
            {sortOrder} ▾
          </button>
        </div>
      </div>

      {/* Assessment List */}
      <div className="space-y-3">
        {sorted.map((assessment) => {
          const style = urgencyStyles[assessment.urgency]
          return (
            <div
              key={assessment.id}
              className={`flex flex-col sm:flex-row sm:items-center sm:justify-between p-4 sm:p-5 rounded-xl border ${style.bg} ${style.border} transition-colors hover:shadow-sm gap-3 sm:gap-0`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-8">
                {/* Date */}
                <div className="min-w-0 sm:min-w-[120px]">
                  <p className="font-bold text-gray-900 text-sm">{assessment.date}</p>
                  <p className="text-xs text-gray-500">{assessment.time}</p>
                  <p className="text-xs text-gray-400 mt-0.5">ID: {assessment.id}</p>
                </div>

                {/* Symptoms */}
                <div className="min-w-0 sm:min-w-[180px]">
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">
                    Symptoms
                  </p>
                  <p className="text-sm text-gray-700">{assessment.symptoms}</p>
                </div>

                {/* Result */}
                <div className="min-w-0 sm:min-w-[120px]">
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">
                    Result
                  </p>
                  <div className="flex items-center gap-1.5">
                    <span className={`w-2 h-2 rounded-full ${style.dot}`}></span>
                    <span className={`text-sm font-semibold ${style.text}`}>
                      {assessment.urgency} Urgency
                    </span>
                  </div>
                </div>
              </div>

              {/* View Report */}
              <button className="flex items-center justify-center gap-2 px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors sm:flex-shrink-0">
                <FileText className="w-4 h-4" />
                View Report
                <ChevronRight className="w-4 h-4 text-gray-400" />
              </button>
            </div>
          )
        })}
      </div>

      {/* Empty State */}
      <div className="flex flex-col items-center justify-center py-16 text-gray-400">
        <AlertCircle className="w-10 h-10 mb-3" />
        <p className="text-sm">No more assessments to load</p>
      </div>

      {/* Footer */}
      <div className="border-t border-gray-200 mt-8 pt-6 text-center">
        <div className="flex items-center justify-center gap-1 text-xs text-gray-400 mb-2">
          <AlertCircle className="w-3.5 h-3.5" />
          MedBot provides health information, not medical advice or diagnosis.
        </div>
        <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 text-xs text-gray-400">
          <a href="#" className="hover:text-gray-600">Privacy Policy</a>
          <a href="#" className="hover:text-gray-600">Terms of Service</a>
          <a href="#" className="hover:text-gray-600">HIPAA Compliance</a>
          <a href="#" className="hover:text-gray-600">Support</a>
        </div>
        <p className="text-xs text-gray-400 mt-2">© 2024 MedBot Clinical Systems. All rights reserved.</p>
      </div>
    </div>
  )
}
