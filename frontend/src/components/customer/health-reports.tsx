import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { AlertTriangle, Calendar, ChevronLeft, ChevronRight, ClipboardList, Loader2, Search, Share2 } from 'lucide-react'
import { ApiError, getSession, listSessions, type SessionDetail, type SessionEntry } from '@/lib/api'

function label(verdict: string) {
  return verdict === 'emergency' ? 'Emergency care' : verdict === 'consult' ? 'Consult a clinician' : 'Self-care'
}
function formatDate(value: string) {
  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? 'Unknown date' : new Intl.DateTimeFormat(undefined, { dateStyle: 'medium', timeStyle: 'short' }).format(date)
}

export const HealthReports = () => {
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const [search, setSearch] = useState('')
  const [reports, setReports] = useState<SessionEntry[]>([])
  const [selectedId, setSelectedId] = useState<string | null>(params.get('session'))
  const [detail, setDetail] = useState<SessionDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [detailLoading, setDetailLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    listSessions({ limit: 100 }).then(({ sessions }) => {
      const completed = sessions.filter((session) => Boolean(session.verdict))
      setReports(completed)
      setSelectedId((current) => current && completed.some((item) => item.sessionId === current) ? current : completed[0]?.sessionId ?? null)
    }).catch((err) => {
      if (err instanceof ApiError && err.status === 401) navigate('/login', { replace: true })
      else setError('Reports could not be loaded. Please try again.')
    }).finally(() => setLoading(false))
  }, [navigate])

  useEffect(() => {
    if (!selectedId) { setDetail(null); return }
    setDetailLoading(true)
    getSession(selectedId).then(setDetail).catch(() => setDetail(null)).finally(() => setDetailLoading(false))
  }, [selectedId])

  const filtered = useMemo(() => reports.filter((report) => `${report.firstMessage || ''} ${report.verdict || ''} ${report.updatedAt}`.toLowerCase().includes(search.toLowerCase())), [reports, search])
  const selected = reports.find((report) => report.sessionId === selectedId)
  const transcript = detail?.messages.filter((message) => message.role !== 'system') ?? []
  const share = async () => {
    if (!selected || !detail) return
    const text = [`MedBot triage record`, `Outcome: ${label(selected.verdict || 'self_care')}`, `Date: ${formatDate(selected.updatedAt)}`, '', ...transcript.map((message) => `${message.role === 'user' ? 'You' : 'MedBot'}: ${message.content.replace(/^\[[^\]]+\]\s*/, '')}`)].join('\n')
    try { await navigator.clipboard.writeText(text) } catch {}
  }

  return <div className="flex flex-col h-full bg-white dark:bg-[#0a0c10]">
    <div className="h-14 flex items-center px-3 sm:px-6 border-b border-gray-100 dark:border-gray-800"><h1 className="text-sm font-semibold text-gray-900 dark:text-gray-100">Reports</h1><span className="ml-2 text-xs text-gray-400">({filtered.length})</span></div>
    <div className="px-3 sm:px-6 py-3 border-b border-gray-100 dark:border-gray-800"><p className="text-xs text-gray-500 dark:text-gray-400 mb-2.5">Only triage outcomes that MedBot has actually recorded appear here. This is a conversation record, not a diagnosis or medical certificate.</p><div className="relative"><Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search reports..." className="w-full pl-10 pr-3 py-2 text-sm rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700" /></div></div>
    {loading ? <div className="flex-1 grid place-items-center"><Loader2 className="w-5 h-5 animate-spin text-[#073B4C]" /></div> : error ? <div className="flex-1 grid place-items-center text-sm text-gray-500">{error}</div> : <div className="flex-1 min-h-0 flex overflow-hidden">
      <div className="w-full lg:w-80 lg:shrink-0 border-r border-gray-100 dark:border-gray-800 overflow-y-auto">{filtered.length === 0 ? <div className="p-8 text-center flex flex-col items-center"><img src="/assets/report-empty.svg" alt="" className="w-48 h-auto mb-4 opacity-80" /><p className="text-sm font-medium text-gray-700 dark:text-gray-200">No reports yet</p><p className="text-xs text-gray-400 dark:text-gray-500 mt-1 max-w-[220px]">Complete a triage assessment and your report will appear here.</p></div> : filtered.map((report) => <button key={report.sessionId} onClick={() => setSelectedId(report.sessionId)} className={`w-full text-left p-4 border-b border-gray-100 dark:border-gray-800 ${report.sessionId === selectedId ? 'bg-[#073B4C]/5 dark:bg-teal/10' : 'hover:bg-gray-50 dark:hover:bg-gray-800/50'}`}><p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">{report.firstMessage || 'Triage assessment'}</p><p className="mt-1 text-[11px] text-gray-400">{formatDate(report.updatedAt)}</p><span className="inline-block mt-2 text-[10px] px-2 py-0.5 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300">{label(report.verdict!)}</span></button>)}</div>
      <div className="hidden lg:flex flex-1 min-w-0 overflow-y-auto p-5 sm:p-6">{!selected ? <div className="m-auto text-center text-sm text-gray-500">Select a report to view its recorded conversation.</div> : detailLoading ? <Loader2 className="m-auto w-5 h-5 animate-spin text-[#073B4C]" /> : <div className="max-w-2xl w-full mx-auto"><div className="flex justify-between gap-4"><div><h2 className="text-base font-semibold text-gray-900 dark:text-gray-100">{label(selected.verdict!)}</h2><p className="text-xs text-gray-400 mt-1"><Calendar className="inline w-3 h-3 mr-1" />{formatDate(selected.updatedAt)}</p></div><button onClick={share} className="flex items-center gap-1.5 text-xs text-[#073B4C] font-medium"><Share2 className="w-4 h-4" />Copy for clinician</button></div><div className="mt-6 p-3 rounded-xl bg-amber-50 dark:bg-amber-950/20 text-xs text-amber-800 dark:text-amber-300"><AlertTriangle className="inline w-4 h-4 mr-1.5" />This record does not replace professional medical assessment. Seek urgent care if symptoms worsen or new warning signs occur.</div><div className="mt-6 space-y-4">{transcript.map((message, index) => <div key={index} className={`p-3 rounded-xl text-sm leading-relaxed ${message.role === 'user' ? 'bg-[#073B4C] text-white ml-8' : 'bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-200 mr-8'}`}><p className="text-[10px] opacity-70 mb-1">{message.role === 'user' ? 'You' : 'MedBot'} · {formatDate(message.timestamp)}</p>{message.content.replace(/^\[[^\]]+\]\s*/, '')}</div>)}</div></div>}</div>
    </div>}
  </div>
}
