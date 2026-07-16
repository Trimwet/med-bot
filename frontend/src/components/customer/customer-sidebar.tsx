import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import {
  LayoutDashboard,
  ClipboardList,
  FileText,

  Settings,
  HelpCircle,
  Plus,
  X,
  ChevronLeft,
  ChevronRight,
  Search,
  Calendar,
} from 'lucide-react'

const navItems = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/dashboard/assessment-history', label: 'Assessment History', icon: ClipboardList },
  { to: '/dashboard/health-reports', label: 'Health Reports', icon: FileText },
  { to: '/dashboard/settings', label: 'Settings', icon: Settings },
]

const assessmentHistory = [
  {
    date: 'Today',
    items: [
      { id: 1, title: 'Abdominal Pain Assessment', time: '10:30 AM', status: 'completed' },
      { id: 2, title: 'Headache Evaluation', time: '9:15 AM', status: 'completed' },
    ],
  },
  {
    date: 'Yesterday',
    items: [
      { id: 3, title: 'Follow-up: Medication Review', time: '3:45 PM', status: 'completed' },
      { id: 4, title: 'Annual Check-in Prep', time: '11:00 AM', status: 'completed' },
    ],
  },
  {
    date: 'Dec 18',
    items: [
      { id: 5, title: 'Skin Rash Analysis', time: '2:20 PM', status: 'completed' },
    ],
  },
]

interface CustomerSidebarProps {
  isOpen: boolean
  onClose: () => void
}

export const CustomerSidebar = ({ isOpen, onClose }: CustomerSidebarProps) => {
  const [collapsed, setCollapsed] = useState(false)
  const [historySearch, setHistorySearch] = useState('')
  const [searchExpanded, setSearchExpanded] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  const filteredHistory = assessmentHistory
    .map((group) => ({
      ...group,
      items: group.items.filter((item) =>
        item.title.toLowerCase().includes(historySearch.toLowerCase())
      ),
    }))
    .filter((group) => group.items.length > 0)

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-ink/20 backdrop-blur-sm z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed lg:static inset-y-0 left-0 z-50 h-full lg:h-screen shrink-0 bg-white border-r border-line flex flex-col transition-all duration-300 ease-in-out ${
          collapsed ? 'w-[72px]' : 'w-64'
        } ${isOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}
      >
        {/* Brand Header */}
        <div className={`h-16 flex items-center border-b border-line shrink-0 ${collapsed ? 'justify-center px-2' : 'justify-between px-5'}`}>
          {!collapsed && (
            <a href="/" className="flex items-center gap-2.5">
              <img src="/assets/Logo.jpeg" alt="" className="h-8 w-auto rounded-md" />
              <span className="font-display font-extrabold text-lg tracking-tight text-navy">
                MedBot
              </span>
            </a>
          )}
          {collapsed && (
            <img src="/assets/Logo.jpeg" alt="MedBot" className="h-8 w-auto rounded-md" />
          )}
          <div className="flex items-center gap-1">
            <button
              onClick={() => setCollapsed(!collapsed)}
              className="hidden lg:flex w-8 h-8 items-center justify-center rounded-lg text-muted hover:text-ink hover:bg-ink/5 transition-colors"
              aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            >
              {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
            </button>
            <button
              onClick={onClose}
              className="lg:hidden w-8 h-8 flex items-center justify-center rounded-lg text-muted hover:text-ink hover:bg-ink/5 transition-colors"
              aria-label="Close sidebar"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* New Assessment Button */}
        <div className={`shrink-0 ${collapsed ? 'px-2 py-3' : 'px-4 py-3'}`}>
          <button
            className={`flex items-center justify-center gap-2 bg-navy text-white rounded-xl text-sm font-semibold hover:bg-navy-deep transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-navy ${
              collapsed ? 'w-10 h-10' : 'w-full py-2.5'
            }`}
            aria-label="New Assessment"
          >
            <Plus className="w-4 h-4" />
            {!collapsed && 'New Assessment'}
          </button>
        </div>

        {/* Main Navigation */}
        <nav className={`shrink-0 space-y-0.5 ${collapsed ? 'px-2' : 'px-3'}`} aria-label="Dashboard navigation">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/dashboard'}
              onClick={onClose}
              title={collapsed ? item.label : undefined}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-xl text-sm font-medium transition-colors duration-150 ${
                  collapsed ? 'justify-center w-10 h-10 mx-auto' : 'px-3 py-2.5'
                } ${
                  isActive
                    ? 'bg-navy text-white border-r-2 border-navy'
                    : 'text-muted hover:text-ink hover:bg-ink/5'
                }`
              }
            >
              <item.icon className="w-[18px] h-[18px] shrink-0" />
              {!collapsed && item.label}
            </NavLink>
          ))}
        </nav>

        {/* Quick Actions - Search */}
        <div className={`shrink-0 mt-3 ${collapsed ? 'px-2' : 'px-3'}`}>
          <div className={`border-t border-line ${collapsed ? 'pt-2' : 'pt-3 pb-1'}`}>
            {!collapsed && !searchExpanded && (
              <button
                onClick={() => setSearchExpanded(true)}
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-muted hover:text-ink hover:bg-ink/5 transition-colors duration-150 w-full"
              >
                <Search className="w-[18px] h-[18px] shrink-0" />
                Search
              </button>
            )}

            {!collapsed && searchExpanded && (
              <div className="flex items-center gap-2 px-3 py-2 bg-ink/5 rounded-xl transition-all duration-300">
                <Search className="w-[18px] h-[18px] shrink-0 text-muted" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onBlur={() => {
                    if (!searchQuery) setSearchExpanded(false)
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Escape') {
                      setSearchQuery('')
                      setSearchExpanded(false)
                    }
                  }}
                  placeholder="Search assessments..."
                  className="flex-1 bg-transparent text-sm text-ink placeholder-muted/60 outline-none"
                  autoFocus
                />
                {searchQuery && (
                  <button
                    onClick={() => {
                      setSearchQuery('')
                      setSearchExpanded(false)
                    }}
                    className="text-muted hover:text-ink transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            )}

            {collapsed && (
              <button
                onClick={() => {
                  setCollapsed(false)
                  setTimeout(() => setSearchExpanded(true), 100)
                }}
                title="Search"
                className="flex items-center justify-center w-10 h-10 mx-auto rounded-xl text-muted hover:text-ink hover:bg-ink/5 transition-colors duration-150"
              >
                <Search className="w-[18px] h-[18px]" />
              </button>
            )}
          </div>
        </div>

        {/* Assessment History (only when expanded) */}
        {!collapsed && (
          <div className="flex-1 min-h-0 flex flex-col mt-3 border-t border-line">
            <div className="px-4 pt-3 pb-2">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-xs font-semibold text-muted uppercase tracking-wider">Recent Assessments</h3>
              </div>
              <div className="relative">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted" />
                <input
                  type="text"
                  value={historySearch}
                  onChange={(e) => setHistorySearch(e.target.value)}
                  placeholder="Search..."
                  className="w-full pl-8 pr-3 py-1.5 bg-paper-soft rounded-lg text-xs text-ink placeholder-muted/60 border border-line focus:outline-none focus:ring-1 focus:ring-teal/30 transition-all"
                />
              </div>
            </div>
            <div className="flex-1 overflow-y-auto px-3 pb-3 space-y-3">
              {filteredHistory.map((group) => (
                <div key={group.date}>
                  <div className="flex items-center gap-1.5 px-1 mb-1.5">
                    <Calendar className="w-3 h-3 text-muted/50" />
                    <span className="text-[11px] font-medium text-muted/60">{group.date}</span>
                  </div>
                  <div className="space-y-0.5">
                    {group.items.map((item) => (
                      <button
                        key={item.id}
                        className="w-full text-left px-2.5 py-2 rounded-lg text-xs text-muted hover:text-ink hover:bg-ink/5 transition-colors group"
                      >
                        <div className="font-medium text-ink/80 group-hover:text-ink truncate">{item.title}</div>
                        <div className="text-muted/50 mt-0.5">{item.time}</div>
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Bottom Section */}
        <div className={`shrink-0 ${collapsed ? 'px-2 pb-3' : 'p-4 pb-4'}`}>
          {!collapsed ? (
            <>
              {/* Help Link */}
              <NavLink
                to="/dashboard/help"
                onClick={onClose}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors duration-150 ${
                    isActive
                      ? 'bg-navy text-white'
                      : 'text-muted hover:text-ink hover:bg-ink/5'
                  }`
                }
              >
                <HelpCircle className="w-[18px] h-[18px]" />
                Help Center
              </NavLink>
            </>
          ) : (
            <div className="space-y-1">
              <NavLink
                to="/dashboard/help"
                onClick={onClose}
                title="Help Center"
                className={({ isActive }) =>
                  `flex items-center justify-center w-10 h-10 mx-auto rounded-xl text-sm font-medium transition-colors duration-150 ${
                    isActive
                      ? 'bg-navy text-white'
                      : 'text-muted hover:text-ink hover:bg-ink/5'
                  }`
                }
              >
                <HelpCircle className="w-[18px] h-[18px]" />
              </NavLink>
            </div>
          )}
        </div>
      </aside>
    </>
  )
}
