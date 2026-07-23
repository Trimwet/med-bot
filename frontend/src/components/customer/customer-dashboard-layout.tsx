import { useState, useEffect, Suspense } from 'react'
import { Outlet, Link, useLocation, useNavigate, useSearchParams } from 'react-router-dom'
import {
  Plus,
  Search,
  Cog,
  UserCircle,
  Home,
  ClipboardList,
  FileBarChart,
  Library,
  LogOut,
  ChevronsLeft,
  ChevronsRight,
  Menu,
  X,
  ArrowLeft,
  Play,
} from 'lucide-react'
import { listSessions, getAuthUser, type SessionEntry } from '@/lib/api'

const NAV_ITEMS = [
  { icon: Home, label: 'Chat', href: '/dashboard' },
  { icon: ClipboardList, label: 'Chat Assessments', href: '/dashboard/assessment-history' },
  { icon: FileBarChart, label: 'Reports', href: '/dashboard/health-reports' },
  { icon: Library, label: 'Health Library', href: '/dashboard/health-library' },
  { icon: Play, label: 'Try Demo', href: '/demo' },
]

function formatRecentTime(value: string): string {
  const timestamp = new Date(value).getTime()
  if (Number.isNaN(timestamp)) return ''
  const difference = Date.now() - timestamp
  if (difference < 60_000) return 'Just now'
  if (difference < 3_600_000) return `${Math.floor(difference / 60_000)}m ago`
  if (difference < 86_400_000) return `${Math.floor(difference / 3_600_000)}h ago`
  const date = new Date(value)
  return new Intl.DateTimeFormat(undefined, { month: 'short', day: 'numeric' }).format(date)
}

function getGreeting(name: string): string {
  const hour = new Date().getHours()
  let period: string
  if (hour < 12) period = 'Good morning'
  else if (hour < 17) period = 'Good afternoon'
  else period = 'Good evening'
  return name ? `${period}, ${name}` : period
}

export const CustomerDashboardLayout = ({ demo = false }: { demo?: boolean }) => {
  const [collapsed, setCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [recentSessions, setRecentSessions] = useState<SessionEntry[]>([])
  const [userName, setUserName] = useState('')
  const [initialLoading, setInitialLoading] = useState(!demo)
  const location = useLocation()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const activeSessionId = searchParams.get('session')
  const basePath = demo ? '/demo' : '/dashboard'
  const navItems = demo
    ? [
        { icon: Home, label: 'Chat', href: '/demo' },
        { icon: ClipboardList, label: 'Chat Assessments', href: '/demo/assessment-history' },
        { icon: Library, label: 'Health Library', href: '/demo/health-library' },
      ]
    : NAV_ITEMS

  const isExpanded = !collapsed || mobileOpen

  useEffect(() => {
    if (demo) return
    getAuthUser()
      .then((res) => setUserName(res.user.name || ''))
      .catch(() => {})
      .finally(() => setInitialLoading(false))
  }, [demo])

  useEffect(() => {
    if (demo) return
    let cancelled = false
    const refresh = () => {
      listSessions({ limit: 20 })
        .then(({ sessions }) => { if (!cancelled) setRecentSessions(sessions) })
        .catch(() => { if (!cancelled) setRecentSessions([]) })
    }
    refresh()
    window.addEventListener('recent-sessions-updated', refresh)
    return () => {
      cancelled = true
      window.removeEventListener('recent-sessions-updated', refresh)
    }
  }, [location.pathname, demo])

  // Keep backend alive — ping every 4 min to prevent Render cold start
  useEffect(() => {
    const API_URL = import.meta.env.VITE_API_URL || ''
    const ping = () => fetch(`${API_URL}/api/health`).catch(() => {})
    ping()
    const interval = setInterval(ping, 4 * 60 * 1000)
    return () => clearInterval(interval)
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('token')
    setMobileOpen(false)
    navigate('/login')
  }

  if (initialLoading) {
    return (
      <div className="h-dvh flex items-center justify-center bg-gray-50 dark:bg-[#0a0c10]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-2 border-gray-200 dark:border-gray-700 border-t-[#073B4C] rounded-full animate-spin" />
          <p className="text-sm text-gray-400 dark:text-gray-500">Loading MedBot...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="h-dvh flex bg-gray-50 dark:bg-[#0a0c10] overflow-hidden">
      {/* Mobile backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/30 z-40 md:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Side Nav */}
      <aside
        className={`
          fixed md:static inset-y-0 left-0 z-50 md:z-30 md:relative
          flex flex-col border-r border-gray-200 dark:border-gray-800 bg-white dark:bg-[#0f1117]
          transition-all duration-200 ease-in-out shrink-0
          w-[260px] ${collapsed ? 'md:w-[68px]' : 'md:w-[260px]'}
          ${mobileOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0
        `}
      >
        {/* Header */}
        <div className="flex items-center gap-3 px-4 h-14 border-b border-gray-100 dark:border-gray-800 shrink-0">
          <img src="/assets/Logo.jpeg" alt="MedBot" className="w-8 h-8 rounded-lg shrink-0" />
          {isExpanded && (
            <span className="text-sm font-semibold text-gray-900 dark:text-gray-100 truncate flex-1">MedBot</span>
          )}
          <button
            onClick={() => setMobileOpen(false)}
            className="md:hidden w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors shrink-0"
            aria-label="Close sidebar"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Actions */}
        <div className="px-3 py-3 space-y-1 shrink-0">
          <button
            onClick={() => {
              window.dispatchEvent(new Event('start-new-chat'))
              navigate(basePath)
              setMobileOpen(false)
            }}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            <Plus className="w-4 h-4 shrink-0" />
            {isExpanded && <span>New chat</span>}
          </button>
          {!demo && <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
            <Search className="w-4 h-4 shrink-0" />
            {isExpanded && <span>Search</span>}
          </button>}
        </div>

        <div className="border-t border-gray-100 dark:border-gray-800 mx-3" />

        {/* Navigation */}
        <div className="px-3 py-3 space-y-1 shrink-0">
          {navItems.map((item) => {
            const isActive = location.pathname === item.href
            return (
              <Link
                key={item.label}
                to={item.href}
                onClick={() => setMobileOpen(false)}
                className={`
                  flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors
                  ${isActive
                    ? 'bg-[#073B4C]/5 dark:bg-teal/10 text-[#073B4C] dark:text-teal font-medium'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
                  }
                `}
              >
                <item.icon className="w-4 h-4 shrink-0" />
                {isExpanded && <span>{item.label}</span>}
              </Link>
            )
          })}
        </div>

        <div className="border-t border-gray-100 dark:border-gray-800 mx-3" />

        {/* Conversations */}
        {!demo && isExpanded && (
          <div className="flex-1 overflow-y-auto px-3 py-3 [scrollbar-width:thin] [scrollbar-color:#d1d5db_transparent] [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-gray-300 [&::-webkit-scrollbar-thumb]:rounded-full">
            <p className="px-3 text-[11px] font-medium text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-2">
              Recent
            </p>
            <div className="space-y-0.5">
              {recentSessions.length === 0 && (
                <p className="px-3 py-2 text-xs text-gray-400 dark:text-gray-500">No recent chats</p>
              )}
              {recentSessions.map((session) => (
                <button
                  key={session.sessionId}
                  onClick={() => {
                    navigate(`/dashboard?session=${session.sessionId}`)
                    setMobileOpen(false)
                  }}
                  className={`
                    w-full text-left px-3 py-2 rounded-lg transition-colors
                    ${activeSessionId === session.sessionId
                      ? 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 font-medium'
                      : 'text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800/50 hover:text-gray-700 dark:hover:text-gray-300'
                    }
                  `}
                >
                  <span className="block text-sm truncate">{session.summary || session.firstMessage || 'New assessment'}</span>
                  <span className="block mt-0.5 text-[11px] text-gray-400 dark:text-gray-500">{formatRecentTime(session.updatedAt)}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="border-t border-gray-100 dark:border-gray-800 px-3 py-3 space-y-1 shrink-0">
          {!demo && <Link
            to="/dashboard/settings"
            onClick={() => setMobileOpen(false)}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            <Cog className="w-4 h-4 shrink-0" />
            {isExpanded && <span>Settings</span>}
          </Link>}
          {!demo && <button
            onClick={() => {
              navigate('/dashboard/settings')
              setMobileOpen(false)
            }}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            <UserCircle className="w-4 h-4 shrink-0" />
            {isExpanded && <span>Profile</span>}
          </button>}

          {demo ? <div className="space-y-1">
            <Link to="/" onClick={() => setMobileOpen(false)} className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"><ArrowLeft className="w-4 h-4 shrink-0" />{isExpanded && <span>Back to landing page</span>}</Link>
            <Link to="/login" onClick={() => setMobileOpen(false)} className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"><LogOut className="w-4 h-4 shrink-0" />{isExpanded && <span>Log in</span>}</Link>
            <Link to="/signup" onClick={() => setMobileOpen(false)} className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-[#073B4C] dark:text-teal hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"><UserCircle className="w-4 h-4 shrink-0" />{isExpanded && <span>Sign up</span>}</Link>
          </div> : <>
          <div className="border-t border-gray-100 dark:border-gray-800 my-1" />

          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
          >
            <LogOut className="w-4 h-4 shrink-0" />
            {isExpanded && <span>Log out</span>}
          </button>
          </>}
        </div>

        {/* Collapse Toggle (desktop only) */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="hidden md:flex absolute bottom-4 -right-3 w-6 h-6 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-full items-center justify-center text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors z-10"
        >
          {collapsed ? (
            <ChevronsRight className="w-3.5 h-3.5" />
          ) : (
            <ChevronsLeft className="w-3.5 h-3.5" />
          )}
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 relative z-10">
        {/* Mobile top bar */}
        <div className="md:hidden h-14 flex items-center gap-3 px-4 border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-[#0f1117] shrink-0">
          <button
            onClick={() => { setCollapsed(false); setMobileOpen(true) }}
            className="w-9 h-9 flex items-center justify-center rounded-lg text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors shrink-0"
            aria-label="Open sidebar"
          >
            <Menu className="w-5 h-5" />
          </button>
          <img src="/assets/Logo.jpeg" alt="MedBot" className="w-7 h-7 rounded-md shrink-0" />
          <span className="text-sm font-semibold text-gray-900 dark:text-gray-100 truncate">MedBot</span>
        </div>

        <div className="flex-1 min-h-0 flex flex-col">
          <Suspense fallback={
            <div className="flex items-center justify-center h-full py-20">
              <div className="flex flex-col items-center gap-3">
                <div className="w-8 h-8 border-2 border-gray-200 dark:border-gray-700 border-t-[#073B4C] rounded-full animate-spin" />
                <p className="text-xs text-gray-400 dark:text-gray-500">Loading...</p>
              </div>
            </div>
          }>
            <Outlet />
          </Suspense>
        </div>
      </main>
    </div>
  )
}
