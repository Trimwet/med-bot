import { useState, useEffect } from 'react'
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
} from 'lucide-react'
import { getRecentSessions, type RecentSession } from '@/lib/recent-sessions'

const NAV_ITEMS = [
  { icon: Home, label: 'Chat', href: '/dashboard' },
  { icon: ClipboardList, label: 'Chat Assessments', href: '/dashboard/assessment-history' },
  { icon: FileBarChart, label: 'Reports', href: '/dashboard/health-reports' },
  { icon: Library, label: 'Health Library', href: '/dashboard/health-library' },
]

export const CustomerDashboardLayout = ({ demo = false }: { demo?: boolean }) => {
  const [collapsed, setCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [recentSessions, setRecentSessions] = useState<RecentSession[]>([])
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
    setRecentSessions(getRecentSessions())
    const refresh = () => setRecentSessions(getRecentSessions())
    window.addEventListener('recent-sessions-updated', refresh)
    return () => window.removeEventListener('recent-sessions-updated', refresh)
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
          fixed md:static inset-y-0 left-0 z-50 md:z-auto md:relative
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
          <div className="flex-1 overflow-y-auto px-3 py-3">
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
                    w-full text-left px-3 py-2 rounded-lg text-sm truncate transition-colors
                    ${activeSessionId === session.sessionId
                      ? 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 font-medium'
                      : 'text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800/50 hover:text-gray-700 dark:hover:text-gray-300'
                    }
                  `}
                >
                  {session.firstMessage || 'New chat'}
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
      <main className="flex-1 flex flex-col min-w-0">
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
          <Outlet />
        </div>
      </main>
    </div>
  )
}
