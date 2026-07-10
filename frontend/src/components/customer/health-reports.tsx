import { useState } from 'react'
import { Search, Filter, Download, Share2, AlertTriangle, Clock, FileText } from 'lucide-react'

type Urgency = 'Low' | 'Moderate' | 'High'

interface HealthReport {
  id: string
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

const reports: HealthReport[] = [
  {
    id: '1',
    reportId: '#MC84291',
    date: 'May 14, 2025',
    time: '10:45 AM',
    symptoms: 'Headache, mild fever, body pain, sore throat.',
    urgency: 'Low',
    symptomList: ['Headache', 'Mild fever', 'Body pain', 'Sore throat'],
    triageOutcome: 'Based on your reported symptoms, your condition appears to be mild. Self-care at home is currently appropriate, and there are no immediate indicators of severe escalation.',
    adviceItems: [
      { icon: '🛏️', text: 'Rest well and get enough sleep' },
      { icon: '💧', text: 'Drink plenty of fluids' },
      { icon: '♨️', text: 'Take warm steam inhalation' },
      { icon: '💨', text: 'Use a humidifier' },
      { icon: '📊', text: 'Monitor your symptoms regularly' },
    ],
    warning: 'Seek immediate medical attention if you experience: High fever (above 102°F), difficulty breathing, chest pain, severe headache, or confusion. If symptoms worsen rapidly, call emergency services.',
  },
  {
    id: '2',
    reportId: '#MC73920',
    date: 'May 10, 2025',
    time: '08:30 PM',
    symptoms: 'Cough, fatigue, runny nose, congestion.',
    urgency: 'Moderate',
    symptomList: ['Cough', 'Fatigue', 'Runny nose', 'Congestion'],
    triageOutcome: 'Your symptoms suggest a moderate respiratory infection. Monitor closely and consider consulting a healthcare provider if symptoms persist beyond 5-7 days.',
    adviceItems: [
      { icon: '💊', text: 'Take over-the-counter cold medications as needed' },
      { icon: '💧', text: 'Stay well hydrated' },
      { icon: '🛏️', text: 'Get adequate rest' },
      { icon: '🫁', text: 'Use saline nasal spray for congestion' },
    ],
    warning: 'Seek immediate medical attention if you experience: High fever, difficulty breathing, or symptoms worsening after initial improvement.',
  },
  {
    id: '3',
    reportId: '#MC65218',
    date: 'May 5, 2025',
    time: '09:15 AM',
    symptoms: 'Chest pain, shortness of breath, dizziness.',
    urgency: 'High',
    symptomList: ['Chest pain', 'Shortness of breath', 'Dizziness'],
    triageOutcome: 'Your combination of symptoms requires urgent medical evaluation. Please seek immediate professional medical care.',
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
    reportId: '#MC58102',
    date: 'Apr 28, 2025',
    time: '11:20 AM',
    symptoms: 'Stomach ache, nausea, loss of appetite.',
    urgency: 'Low',
    symptomList: ['Stomach ache', 'Nausea', 'Loss of appetite'],
    triageOutcome: 'Your symptoms suggest a mild gastrointestinal issue, likely viral gastritis. Home care should be sufficient.',
    adviceItems: [
      { icon: '🥣', text: 'Eat bland foods (BRAT diet)' },
      { icon: '💧', text: 'Stay hydrated with small sips of water' },
      { icon: '🚫', text: 'Avoid spicy, fatty, or acidic foods' },
      { icon: '🛏️', text: 'Rest and avoid strenuous activity' },
    ],
    warning: 'Seek medical attention if you experience: Blood in stool, severe abdominal pain, persistent vomiting, or signs of dehydration.',
  },
]

const urgencyConfig: Record<Urgency, { color: string; bg: string; border: string }> = {
  Low: { color: 'text-teal-600', bg: 'bg-teal-50', border: 'border-teal-200' },
  Moderate: { color: 'text-orange-500', bg: 'bg-orange-50', border: 'border-orange-200' },
  High: { color: 'text-red-500', bg: 'bg-red-50', border: 'border-red-200' },
}

const urgencyDot: Record<Urgency, string> = {
  Low: 'bg-teal-500',
  Moderate: 'bg-orange-500',
  High: 'bg-red-500',
}

export const HealthReports = () => {
  const [selectedId, setSelectedId] = useState('1')
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)

  const filtered = reports.filter(
    (r) =>
      r.symptoms.toLowerCase().includes(search.toLowerCase()) ||
      r.date.toLowerCase().includes(search.toLowerCase())
  )

  const selected = reports.find((r) => r.id === selectedId) || reports[0]
  const style = urgencyConfig[selected.urgency]

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Health Reports</h1>
          <p className="text-sm text-gray-500 mt-1">
            View and manage your health assessment reports and clinical documents.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative flex-1 sm:flex-none">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search reports..."
              className="w-full sm:w-auto pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#073B4C]/30"
            />
          </div>
          <button className="flex items-center gap-2 px-4 py-2.5 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
            <Filter className="w-4 h-4" />
            Filters
          </button>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Left Panel - Report List */}
        <div className="w-full lg:w-72 lg:flex-shrink-0 space-y-3 overflow-x-auto lg:overflow-x-visible">
          <div className="flex lg:flex-col gap-3 min-w-max lg:min-w-0">
            {filtered.map((report) => {
              const u = urgencyConfig[report.urgency]
              const isActive = report.id === selectedId
              return (
                <button
                  key={report.id}
                  onClick={() => setSelectedId(report.id)}
                  className={`w-full text-left p-4 rounded-xl border transition-all min-w-[200px] lg:min-w-0 ${
                    isActive
                      ? `${u.bg} ${u.border} shadow-sm`
                      : 'bg-white border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <p className="font-bold text-gray-900 text-sm">{report.date}</p>
                    <span className={`text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-full ${u.bg} ${u.color}`}>
                      {report.urgency} Urgency
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 mb-1.5">{report.time}</p>
                  <p className="text-xs text-gray-600 leading-relaxed">{report.symptoms}</p>
                </button>
              )
            })}
          </div>

          {/* Pagination */}
          <div className="flex items-center gap-1 pt-2">
            {[1, 2, 3].map((p) => (
              <button
                key={p}
                onClick={() => setPage(p)}
                className={`w-8 h-8 rounded-lg text-sm font-medium transition-colors ${
                  page === p
                    ? 'bg-[#073B4C] text-white'
                    : 'text-gray-500 hover:bg-gray-100'
                }`}
              >
                {p}
              </button>
            ))}
            <button className="w-8 h-8 rounded-lg text-gray-400 hover:bg-gray-100 transition-colors">
              ›
            </button>
          </div>
        </div>

        {/* Right Panel - Report Detail */}
        <div className="flex-1 bg-white rounded-xl border border-gray-200 p-4 sm:p-6">
          {/* Report Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-6">
            <div>
              <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-1">
                <span className="font-bold text-gray-900">{selected.date}</span>
                <span className="text-sm text-gray-500">Report ID: {selected.reportId}</span>
                <span className={`flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full ${style.bg} ${style.color}`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${urgencyDot[selected.urgency]}`}></span>
                  {selected.urgency} Urgency
                </span>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-gray-500">
                <Clock className="w-3.5 h-3.5" />
                {selected.time}
              </div>
            </div>
            <button className="p-2 text-gray-400 hover:text-gray-600 self-start">⋮</button>
          </div>

          {/* Symptoms */}
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center">
                <FileText className="w-3.5 h-3.5 text-gray-500" />
              </div>
              <h3 className="font-semibold text-gray-900">Symptoms</h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {selected.symptomList.map((s) => (
                <div key={s} className="flex items-center gap-2 text-sm text-gray-700">
                  <span className="text-gray-400">•</span>
                  {s}
                </div>
              ))}
            </div>
          </div>

          {/* Triage Outcome */}
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-3">
              <div className={`w-6 h-6 rounded-full flex items-center justify-center ${style.bg}`}>
                <span className={`w-2 h-2 rounded-full ${urgencyDot[selected.urgency]}`}></span>
              </div>
              <h3 className="font-semibold text-gray-900">Triage Outcome</h3>
            </div>
            <p className={`text-sm font-medium mb-2 ${style.color}`}>
              • {selected.urgency} Urgency
            </p>
            <p className="text-sm text-gray-600 leading-relaxed">
              {selected.triageOutcome}
            </p>
          </div>

          {/* Advice */}
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center">
                <span className="text-xs">⚕️</span>
              </div>
              <h3 className="font-semibold text-gray-900">Advice</h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {selected.adviceItems.map((item) => (
                <div
                  key={item.text}
                  className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-100"
                >
                  <span className="text-lg flex-shrink-0">{item.icon}</span>
                  <span className="text-sm text-gray-700">{item.text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Warning */}
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
            <div className="flex items-start gap-2">
              <AlertTriangle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-700 leading-relaxed">
                <span className="font-semibold">Seek immediate medical attention if you experience: </span>
                {selected.warning}
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3">
            <button className="flex-1 flex items-center justify-center gap-2 px-5 py-3 border border-gray-300 rounded-lg text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors">
              <Download className="w-4 h-4" />
              Download Report (PDF)
            </button>
            <button className="flex-1 flex items-center justify-center gap-2 px-5 py-3 bg-[#073B4C] text-white rounded-lg text-sm font-semibold hover:bg-[#0A202A] transition-colors">
              <Share2 className="w-4 h-4" />
              Share with Doctor
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
