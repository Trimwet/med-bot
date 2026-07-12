import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Plus,
  FileText,
  MessageSquare,
  ChevronRight,
  Calendar,
  Clock,
  AlertCircle,
} from 'lucide-react'

type Urgency = 'Low' | 'Moderate' | 'High'
type Status = 'ongoing' | 'completed'

interface Assessment {
  id: string
  reportId: string | null
  date: string
  time: string
  symptoms: string
  urgency: Urgency | null
  status: Status
}

const ASSESSMENTS: Assessment[] = [
  {
    id: 'a1',
    reportId: null,
    date: 'Jul 12, 2026',
    time: '2:05 PM',
    symptoms: 'Sharp pain in lower back after lifting',
    urgency: null,
    status: 'ongoing',
  },
  {
    id: 'a2',
    reportId: '#MC84291',
    date: 'May 14, 2025',
    time: '10:45 AM',
    symptoms: 'Headache, mild fever, body pain, sore throat',
    urgency: 'Low',
    status: 'completed',
  },
  {
    id: 'a3',
    reportId: '#MC73920',
    date: 'May 10, 2025',
    time: '8:30 PM',
    symptoms: 'Cough, fatigue, runny nose, congestion',
    urgency: 'Moderate',
    status: 'completed',
  },
  {
    id: 'a4',
    reportId: '#MC65218',
    date: 'May 5, 2025',
    time: '9:15 AM',
    symptoms: 'Chest pain, shortness of breath, dizziness',
    urgency: 'High',
    status: 'completed',
  },
  {
    id: 'a5',
    reportId: '#MC58102',
    date: 'Apr 28, 2025',
    time: '11:20 AM',
    symptoms: 'Stomach ache, nausea, loss of appetite',
    urgency: 'Low',
    status: 'completed',
  },
]

const URGENCY_STYLES: Record<Urgency, { dot: string; badge: string }> = {
  Low: { dot: 'bg-green-500', badge: 'bg-green-50 text-green-700' },
  Moderate: { dot: 'bg-yellow-500', badge: 'bg-yellow-50 text-yellow-700' },
  High: { dot: 'bg-red-500', badge: 'bg-red-50 text-red-700' },
}

const FILTERS = ['All', 'Ongoing', 'Completed'] as const

export const AssessmentHistory = () => {
  const navigate = useNavigate()
  const [filter, setFilter] = useState<(typeof FILTERS)[number]>('All')

  const filtered = ASSESSMENTS.filter((a) => {
    if (filter === 'All') return true
    if (filter === 'Ongoing') return a.status === 'ongoing'
    return a.status === 'completed'
  })

  const openAssessment = (a: Assessment) => {
    if (a.status === 'ongoing') {
      navigate('/dashboard')
    } else if (a.reportId) {
      navigate(`/dashboard/health-reports?id=${a.id}`)
    }
  }

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Header */}
      <div className="h-14 flex items-center justify-between px-3 sm:px-6 border-b border-gray-100 shrink-0">
        <div className="flex items-center gap-2">
          <h1 className="text-sm font-semibold text-gray-900">Chat Assessments</h1>
          <span className="text-xs text-gray-400">({filtered.length})</span>
        </div>
        <button
          onClick={() => navigate('/dashboard')}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-[#073B4C] text-white rounded-lg text-xs font-medium hover:bg-[#0A202A] transition-colors"
        >
          <Plus className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Start New</span>
        </button>
      </div>

      {/* Intro line + Filters */}
      <div className="px-3 sm:px-6 py-3 border-b border-gray-100 shrink-0 space-y-2.5">
        <p className="text-xs text-gray-500">
          Every chat you've had with MedBot, including ones still in progress. Once a session
          finishes, its full write-up appears in{' '}
          <button
            onClick={() => navigate('/dashboard/health-reports')}
            className="text-[#073B4C] font-medium hover:underline"
          >
            Reports
          </button>
          .
        </p>
        <div className="flex gap-1.5 overflow-x-auto">
          {FILTERS.map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap transition-colors ${
                filter === f ? 'bg-[#073B4C] text-white' : 'text-gray-500 hover:bg-gray-100'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* List */}
      <div className="flex-1 min-h-0 overflow-y-auto">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full py-12">
            <div className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center mb-3">
              <FileText className="w-5 h-5 text-gray-400" />
            </div>
            <p className="text-sm font-medium text-gray-900 mb-1">No assessments found</p>
            <p className="text-xs text-gray-500">Try a different filter or start a new assessment</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {filtered.map((assessment) => {
              const style = assessment.urgency ? URGENCY_STYLES[assessment.urgency] : null
              return (
                <div
                  key={assessment.id}
                  onClick={() => openAssessment(assessment)}
                  className="group px-3 sm:px-6 py-4 hover:bg-gray-50 transition-colors cursor-pointer"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-sm font-medium text-gray-900 truncate">
                          {assessment.symptoms}
                        </h3>
                        {assessment.status === 'ongoing' ? (
                          <span className="px-2 py-0.5 text-[10px] font-medium rounded-full shrink-0 flex items-center gap-1 bg-blue-50 text-blue-700">
                            <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
                            Ongoing
                          </span>
                        ) : (
                          style && (
                            <span className={`px-2 py-0.5 text-[10px] font-medium rounded-full shrink-0 flex items-center gap-1 ${style.badge}`}>
                              <span className={`w-1.5 h-1.5 rounded-full ${style.dot}`} />
                              {assessment.urgency}
                            </span>
                          )
                        )}
                      </div>
                      <div className="flex items-center gap-3 text-[11px] text-gray-400">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {assessment.date}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {assessment.time}
                        </span>
                        {assessment.reportId && <span className="text-gray-300">{assessment.reportId}</span>}
                      </div>
                    </div>

                    <div className="flex items-center gap-1 shrink-0">
                      {assessment.status === 'ongoing' ? (
                        <button className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-[#073B4C] border border-[#073B4C]/30 rounded-lg hover:bg-[#073B4C]/5 transition-colors opacity-0 group-hover:opacity-100">
                          <MessageSquare className="w-3.5 h-3.5" />
                          Continue
                        </button>
                      ) : (
                        <button className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-gray-600 border border-gray-200 rounded-lg hover:bg-white hover:border-gray-300 transition-colors opacity-0 group-hover:opacity-100">
                          <FileText className="w-3.5 h-3.5" />
                          View Report
                        </button>
                      )}
                      <ChevronRight className="w-4 h-4 text-gray-300 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {filtered.length > 0 && (
          <div className="flex items-center justify-center gap-1.5 py-6 text-xs text-gray-400">
            <AlertCircle className="w-3.5 h-3.5" />
            No more assessments to load
          </div>
        )}
      </div>
    </div>
  )
}
