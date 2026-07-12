import { useState, useEffect } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import {
  Search,
  Download,
  Share2,
  AlertTriangle,
  Clock,
  FileText,
  ChevronLeft,
  ChevronRight,
  Stethoscope,
} from 'lucide-react'

type Urgency = 'Low' | 'Moderate' | 'High'

interface HealthReport {
  id: string
  assessmentId: string
  reportId: string
  date: string
  time: string
  symptoms: string
  urgency: Urgency
  symptomList: string[]
  triageOutcome: string
  adviceItems: { icon: string; text: string }[]
  warning: string
}

const REPORTS: HealthReport[] = [
  {
    id: '1',
    assessmentId: 'a2',
    reportId: '#MC84291',
    date: 'May 14, 2025',
    time: '10:45 AM',
    symptoms: 'Headache, mild fever, body pain, sore throat',
    urgency: 'Low',
    symptomList: ['Headache', 'Mild fever', 'Body pain', 'Sore throat'],
    triageOutcome:
      'Based on your reported symptoms, your condition appears to be mild. Self-care at home is currently appropriate, and there are no immediate indicators of severe escalation.',
    adviceItems: [
      { icon: '🛏️', text: 'Rest well and get enough sleep' },
      { icon: '💧', text: 'Drink plenty of fluids' },
      { icon: '♨️', text: 'Take warm steam inhalation' },
      { icon: '📊', text: 'Monitor your symptoms regularly' },
    ],
    warning:
      'High fever (above 102°F), difficulty breathing, chest pain, severe headache, or confusion. If symptoms worsen rapidly, call emergency services.',
  },
  {
    id: '2',
    assessmentId: 'a3',
    reportId: '#MC73920',
    date: 'May 10, 2025',
    time: '8:30 PM',
    symptoms: 'Cough, fatigue, runny nose, congestion',
    urgency: 'Moderate',
    symptomList: ['Cough', 'Fatigue', 'Runny nose', 'Congestion'],
    triageOutcome:
      'Your symptoms suggest a moderate respiratory infection. Monitor closely and consider consulting a healthcare provider if symptoms persist beyond 5-7 days.',
    adviceItems: [
      { icon: '💊', text: 'Take over-the-counter cold medications as needed' },
      { icon: '💧', text: 'Stay well hydrated' },
      { icon: '🛏️', text: 'Get adequate rest' },
      { icon: '🫁', text: 'Use saline nasal spray for congestion' },
    ],
    warning: 'High fever, difficulty breathing, or symptoms worsening after initial improvement.',
  },
  {
    id: '3',
    assessmentId: 'a4',
    reportId: '#MC65218',
    date: 'May 5, 2025',
    time: '9:15 AM',
    symptoms: 'Chest pain, shortness of breath, dizziness',
    urgency: 'High',
    symptomList: ['Chest pain', 'Shortness of breath', 'Dizziness'],
    triageOutcome:
      'Your combination of symptoms requires urgent medical evaluation. Please seek immediate professional medical care.',
    adviceItems: [
      { icon: '🏥', text: 'Visit the nearest emergency room immediately' },
      { icon: '📞', text: 'Call emergency services if symptoms intensify' },
      { icon: '🪑', text: 'Sit upright and try to remain calm' },
      { icon: '🚫', text: 'Do not drive yourself to the hospital' },
    ],
    warning: 'These symptoms may indicate a serious cardiac or pulmonary condition. Do not delay seeking medical attention.',
  },
  {
    id: '4',
    assessmentId: 'a5',
    reportId: '#MC58102',
    date: 'Apr 28, 2025',
    time: '11:20 AM',
    symptoms: 'Stomach ache, nausea, loss of appetite',
    urgency: 'Low',
    symptomList: ['Stomach ache', 'Nausea', 'Loss of appetite'],
    triageOutcome:
      'Your symptoms suggest a mild gastrointestinal issue, likely viral gastritis. Home care should be sufficient.',
    adviceItems: [
      { icon: '🥣', text: 'Eat bland foods (BRAT diet)' },
      { icon: '💧', text: 'Stay hydrated with small sips of water' },
      { icon: '🚫', text: 'Avoid spicy, fatty, or acidic foods' },
      { icon: '🛏️', text: 'Rest and avoid strenuous activity' },
    ],
    warning: 'Blood in stool, severe abdominal pain, persistent vomiting, or signs of dehydration.',
  },
]

const URGENCY_STYLES: Record<Urgency, { dot: string; text: string; badge: string }> = {
  Low: { dot: 'bg-green-500', text: 'text-green-700', badge: 'bg-green-50 text-green-700' },
  Moderate: { dot: 'bg-yellow-500', text: 'text-yellow-700', badge: 'bg-yellow-50 text-yellow-700' },
  High: { dot: 'bg-red-500', text: 'text-red-700', badge: 'bg-red-50 text-red-700' },
}

const findByAssessmentId = (assessmentId: string | null) =>
  assessmentId ? REPORTS.find((r) => r.assessmentId === assessmentId) : undefined

export const HealthReports = () => {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const [search, setSearch] = useState('')
  const [selectedId, setSelectedId] = useState(() => findByAssessmentId(searchParams.get('id'))?.id ?? '1')
  const [mobileView, setMobileView] = useState<'list' | 'detail'>(searchParams.get('id') ? 'detail' : 'list')

  // Respect deep links from Assessments (?id=<assessmentId>)
  useEffect(() => {
    const linked = findByAssessmentId(searchParams.get('id'))
    if (linked) {
      setSelectedId(linked.id)
      setMobileView('detail')
    }
  }, [searchParams])

  const filtered = REPORTS.filter(
    (r) =>
      r.symptoms.toLowerCase().includes(search.toLowerCase()) ||
      r.date.toLowerCase().includes(search.toLowerCase())
  )
  const selected = REPORTS.find((r) => r.id === selectedId) || REPORTS[0]
  const style = URGENCY_STYLES[selected.urgency]

  const selectReport = (id: string) => {
    setSelectedId(id)
    setMobileView('detail')
  }

  const list = (
    <div className="flex-1 min-h-0 overflow-y-auto">
      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-full py-12">
          <div className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center mb-3">
            <FileText className="w-5 h-5 text-gray-400" />
          </div>
          <p className="text-sm font-medium text-gray-900 mb-1">No reports found</p>
          <p className="text-xs text-gray-500">Try a different search term</p>
        </div>
      ) : (
        <div className="divide-y divide-gray-100">
          {filtered.map((report) => {
            const s = URGENCY_STYLES[report.urgency]
            const isActive = report.id === selectedId
            return (
              <button
                key={report.id}
                onClick={() => selectReport(report.id)}
                className={`w-full text-left px-3 sm:px-6 py-4 transition-colors ${
                  isActive ? 'bg-[#073B4C]/5' : 'hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-sm font-medium text-gray-900 truncate">{report.date}</h3>
                  <span className={`px-2 py-0.5 text-[10px] font-medium rounded-full shrink-0 flex items-center gap-1 ${s.badge}`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />
                    {report.urgency}
                  </span>
                </div>
                <p className="text-xs text-gray-500 line-clamp-1 mb-1.5">{report.symptoms}</p>
                <div className="flex items-center gap-3 text-[11px] text-gray-400">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {report.time}
                  </span>
                  <span className="text-gray-300">{report.reportId}</span>
                </div>
              </button>
            )
          })}
        </div>
      )}
    </div>
  )

  const detail = (
    <div className="flex-1 min-h-0 overflow-y-auto px-3 sm:px-6 py-5">
      <div className="max-w-2xl mx-auto">
        {/* Report header */}
        <div className="flex items-start justify-between gap-3 mb-1">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <span className="text-sm font-semibold text-gray-900">{selected.date}</span>
              <span className={`flex items-center gap-1.5 text-[11px] font-medium px-2 py-0.5 rounded-full ${style.badge}`}>
                <span className={`w-1.5 h-1.5 rounded-full ${style.dot}`} />
                {selected.urgency} Urgency
              </span>
            </div>
            <div className="flex items-center gap-3 text-xs text-gray-400">
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {selected.time}
              </span>
              <span>{selected.reportId}</span>
            </div>
          </div>
        </div>

        {/* Backlink to source assessment */}
        <button
          onClick={() => navigate('/dashboard/assessment-history')}
          className="flex items-center gap-1 text-xs text-gray-400 hover:text-[#073B4C] transition-colors mb-6"
        >
          Generated from your assessment on {selected.date}
          <ChevronRight className="w-3 h-3" />
        </button>

        {/* Symptoms */}
        <div className="mb-6">
          <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-2">Symptoms</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1.5">
            {selected.symptomList.map((s) => (
              <div key={s} className="flex items-center gap-2 text-sm text-gray-700">
                <span className="w-1 h-1 rounded-full bg-gray-300 shrink-0" />
                {s}
              </div>
            ))}
          </div>
        </div>

        {/* Triage outcome */}
        <div className="mb-6">
          <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-2">Triage Outcome</p>
          <p className="text-sm text-gray-600 leading-relaxed">{selected.triageOutcome}</p>
        </div>

        {/* Advice */}
        <div className="mb-6">
          <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-2">Advice</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {selected.adviceItems.map((item) => (
              <div key={item.text} className="flex items-center gap-2.5 px-3 py-2.5 bg-gray-50 rounded-lg">
                <span className="text-base shrink-0">{item.icon}</span>
                <span className="text-xs text-gray-700 leading-snug">{item.text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Warning */}
        <div className="flex items-start gap-2.5 p-3.5 bg-red-50 rounded-xl mb-6">
          <AlertTriangle className="w-4 h-4 text-red-500 mt-0.5 shrink-0" />
          <p className="text-xs text-red-700 leading-relaxed">
            <span className="font-medium">Seek immediate medical attention if you experience: </span>
            {selected.warning}
          </p>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-2">
          <button className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
            <Download className="w-4 h-4" />
            Download PDF
          </button>
          <button className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-[#073B4C] text-white rounded-lg text-sm font-medium hover:bg-[#0A202A] transition-colors">
            <Share2 className="w-4 h-4" />
            Share with Doctor
          </button>
        </div>
      </div>
    </div>
  )

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Header */}
      <div className="h-14 flex items-center justify-between px-3 sm:px-6 border-b border-gray-100 shrink-0">
        <div className="flex items-center gap-2 min-w-0">
          {mobileView === 'detail' && (
            <button
              onClick={() => setMobileView('list')}
              className="lg:hidden w-8 h-8 flex items-center justify-center rounded-lg text-gray-500 hover:bg-gray-100 transition-colors shrink-0 -ml-1"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
          )}
          <h1 className="text-sm font-semibold text-gray-900 truncate">Reports</h1>
          <span className="text-xs text-gray-400 hidden sm:inline">({filtered.length})</span>
        </div>
      </div>

      {/* Intro + Search */}
      <div className={`px-3 sm:px-6 py-3 border-b border-gray-100 shrink-0 space-y-2.5 ${mobileView === 'detail' ? 'hidden lg:block' : ''}`}>
        <p className="text-xs text-gray-500 hidden lg:block">
          Finished write-ups from your completed assessments — symptoms, guidance, and warning signs
          you can download or share with a doctor.
        </p>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search reports..."
            className="w-full pl-10 pr-4 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#073B4C]/20 focus:border-[#073B4C] transition-colors"
          />
        </div>
      </div>

      {/* Body: list + detail */}
      <div className="flex-1 min-h-0 flex overflow-hidden">
        <div className={`w-full lg:w-80 lg:shrink-0 lg:border-r lg:border-gray-100 flex-col ${mobileView === 'list' ? 'flex' : 'hidden lg:flex'}`}>
          {list}
        </div>
        <div className={`flex-1 min-w-0 flex-col ${mobileView === 'detail' ? 'flex' : 'hidden lg:flex'}`}>
          {selected ? (
            detail
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-center px-6">
              <div className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center mb-3">
                <Stethoscope className="w-5 h-5 text-gray-400" />
              </div>
              <p className="text-sm font-medium text-gray-900 mb-1">Select a report</p>
              <p className="text-xs text-gray-500">Choose a report from the list to view its details</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
