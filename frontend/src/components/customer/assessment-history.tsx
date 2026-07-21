import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Calendar, ChevronRight, FileText, Loader2, MessageSquare, Plus, RefreshCw } from 'lucide-react'
import { ApiError, listSessions, type SessionEntry } from '@/lib/api'

type Filter = 'All' | 'Ongoing' | 'Completed'

const FILTERS: Filter[] = ['All', 'Ongoing', 'Completed']

function formatDate(value: string) {
  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? 'Unknown date' : new Intl.DateTimeFormat(undefined, { dateStyle: 'medium', timeStyle: 'short' }).format(date)
}

function verdictLabel(verdict?: string) {
  if (verdict === 'emergency') return 'Emergency care'
  if (verdict === 'consult') return 'Consult a clinician'
  if (verdict === 'self_care') return 'Self-care'
  return null
}

export const AssessmentHistory = () => {
  const navigate = useNavigate()
  const [filter, setFilter] = useState<Filter>('All')
  const [sessions, setSessions] = useState<SessionEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const load = () => {
    setLoading(true)
    setError(null)
    listSessions({ limit: 100 })
      .then(({ sessions }) => setSessions(sessions))
      .catch((err) => {
        if (err instanceof ApiError && err.status === 401) navigate('/login', { replace: true })
        else setError('Your assessments could not be loaded. Please try again.')
      })
      .finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [])

  const filtered = useMemo(() => sessions.filter((session) => {
    if (filter === 'Ongoing') return session.status === 'in_progress'
    if (filter === 'Completed') return session.status === 'closed' || Boolean(session.verdict)
    return true
  }), [filter, sessions])

  return <div className="flex flex-col h-full bg-white dark:bg-[#0a0c10]">
    <div className="h-14 flex items-center justify-between px-3 sm:px-6 border-b border-gray-100 dark:border-gray-800 shrink-0">
      <div className="flex items-center gap-2"><h1 className="text-sm font-semibold text-gray-900 dark:text-gray-100">Chat Assessments</h1><span className="text-xs text-gray-400">({filtered.length})</span></div>
      <button onClick={() => navigate('/dashboard')} className="flex items-center gap-1.5 px-3 py-1.5 bg-[#073B4C] text-white rounded-lg text-xs font-medium"><Plus className="w-3.5 h-3.5" />Start New</button>
    </div>
    <div className="px-3 sm:px-6 py-3 border-b border-gray-100 dark:border-gray-800 space-y-2.5">
      <p className="text-xs text-gray-500 dark:text-gray-400">Your saved MedBot conversations. A report is available only after MedBot has recorded a triage outcome.</p>
      <div className="flex items-center justify-between gap-2"><div className="flex gap-1.5 overflow-x-auto">{FILTERS.map((item) => <button key={item} onClick={() => setFilter(item)} className={`px-3 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap ${filter === item ? 'bg-[#073B4C] text-white' : 'text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800'}`}>{item}</button>)}</div><button onClick={load} aria-label="Refresh assessments" className="p-2 text-gray-400 hover:text-[#073B4C]"><RefreshCw className="w-4 h-4" /></button></div>
    </div>
    <div className="flex-1 min-h-0 overflow-y-auto">
      {loading ? <div className="h-full grid place-items-center"><Loader2 className="w-5 h-5 animate-spin text-[#073B4C]" /></div> : error ? <div className="p-6 text-center"><p className="text-sm text-gray-600 dark:text-gray-300">{error}</p><button onClick={load} className="mt-3 text-sm text-[#073B4C] font-medium">Try again</button></div> : filtered.length === 0 ? <div className="h-full grid place-items-center text-center p-6"><div><FileText className="w-6 h-6 text-gray-400 mx-auto mb-2" /><p className="text-sm font-medium text-gray-900 dark:text-gray-100">No assessments found</p><p className="text-xs text-gray-500 mt-1">Start a conversation to create an assessment.</p></div></div> : <div className="divide-y divide-gray-100 dark:divide-gray-800">{filtered.map((session) => {
        const outcome = verdictLabel(session.verdict)
        const completed = session.status === 'closed' || Boolean(session.verdict)
        return <button key={session.sessionId} onClick={() => navigate(completed && session.verdict ? `/dashboard/health-reports?session=${session.sessionId}` : `/dashboard?session=${session.sessionId}`)} className="w-full text-left px-3 sm:px-6 py-4 hover:bg-gray-50 dark:hover:bg-gray-800/50">
          <div className="flex items-start justify-between gap-3"><div className="min-w-0"><div className="flex gap-2 items-center"><p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">{session.summary || session.firstMessage || 'Assessment started'}</p>{outcome && <span className="shrink-0 text-[10px] px-2 py-0.5 rounded-full bg-[#073B4C]/5 dark:bg-teal/10 text-[#073B4C] dark:text-teal">{outcome}</span>}</div><p className="mt-1 flex items-center gap-1 text-[11px] text-gray-400"><Calendar className="w-3 h-3" />{formatDate(session.updatedAt)} · {session.messageCount} messages</p></div><ChevronRight className="w-4 h-4 text-gray-300 shrink-0" /></div>
        </button>
      })}</div>}
    </div>
  </div>
}
