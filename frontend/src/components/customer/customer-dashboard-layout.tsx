import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import {
  Plus,
  Search,
  BookOpen,
  Cog,
  UserCircle,
  Home,
  ClipboardList,
  FileBarChart,
  ChevronsLeft,
  ChevronsRight,
  Menu,
  X,
} from 'lucide-react'

const NAV_ITEMS = [
  { icon: Home, label: 'Chat', href: '/dashboard', active: true },
  { icon: ClipboardList, label: 'Assessments', href: '#' },
  { icon: FileBarChart, label: 'Reports', href: '#' },
]

const CONVERSATIONS = [
  'Weekend trip planning',
  'Recipe ideas for the week',
  'Book recommendations',
  'Home workout plan',
]

export const CustomerDashboardLayout = () => {
  const [collapsed, setCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [selectedChat, setSelectedChat] = useState<string | null>(null)

  return (
    <div className="h-screen flex bg-gray-50 overflow-hidden">
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
          flex flex-col border-r border-gray-200 bg-white
          transition-all duration-200 ease-in-out shrink-0
          w-[260px] ${collapsed ? 'md:w-[68px]' : 'md:w-[260px]'}
          ${mobileOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0
        `}
      >
        {/* Header */}
        <div className="flex items-center gap-3 px-4 h-14 border-b border-gray-100 shrink-0">
          <img src="/assets/Logo.jpeg" alt="MedBot" className="w-8 h-8 rounded-lg shrink-0" />
          {!collapsed && (
            <span className="text-sm font-semibold text-gray-900 truncate flex-1">MedBot</span>
          )}
          <button
            onClick={() => setMobileOpen(false)}
            className="md:hidden w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors shrink-0"
            aria-label="Close sidebar"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Actions */}
        <div className="px-3 py-3 space-y-1 shrink-0">
          <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-gray-600 hover:bg-gray-100 transition-colors">
            <Plus className="w-4 h-4 shrink-0" />
            {!collapsed && <span>New chat</span>}
          </button>
          <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-gray-600 hover:bg-gray-100 transition-colors">
            <Search className="w-4 h-4 shrink-0" />
            {!collapsed && <span>Search</span>}
          </button>
          <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-gray-600 hover:bg-gray-100 transition-colors">
            <BookOpen className="w-4 h-4 shrink-0" />
            {!collapsed && <span>History</span>}
          </button>
        </div>

        <div className="border-t border-gray-100 mx-3" />

        {/* Navigation */}
        <div className="px-3 py-3 space-y-1 shrink-0">
          {NAV_ITEMS.map((item) => (
            <a
              key={item.label}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              className={`
                flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors
                ${item.active
                  ? 'bg-[#073B4C]/5 text-[#073B4C] font-medium'
                  : 'text-gray-600 hover:bg-gray-100'
                }
              `}
            >
              <item.icon className="w-4 h-4 shrink-0" />
              {!collapsed && <span>{item.label}</span>}
            </a>
          ))}
        </div>

        <div className="border-t border-gray-100 mx-3" />

        {/* Conversations */}
        {!collapsed && (
          <div className="flex-1 overflow-y-auto px-3 py-3">
            <p className="px-3 text-[11px] font-medium text-gray-400 uppercase tracking-wider mb-2">
              Recent
            </p>
            <div className="space-y-0.5">
              {CONVERSATIONS.map((chat) => (
                <button
                  key={chat}
                  onClick={() => {
                    setSelectedChat(chat)
                    setMobileOpen(false)
                  }}
                  className={`
                    w-full text-left px-3 py-2 rounded-lg text-sm truncate transition-colors
                    ${selectedChat === chat
                      ? 'bg-gray-100 text-gray-900 font-medium'
                      : 'text-gray-500 hover:bg-gray-50 hover:text-gray-700'
                    }
                  `}
                >
                  {chat}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="border-t border-gray-100 px-3 py-3 space-y-1 shrink-0">
          <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-gray-600 hover:bg-gray-100 transition-colors">
            <Cog className="w-4 h-4 shrink-0" />
            {!collapsed && <span>Settings</span>}
          </button>
          <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-gray-600 hover:bg-gray-100 transition-colors">
            <UserCircle className="w-4 h-4 shrink-0" />
            {!collapsed && <span>Profile</span>}
          </button>
        </div>

        {/* Collapse Toggle (desktop only) */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="hidden md:flex absolute bottom-4 -right-3 w-6 h-6 bg-white border border-gray-200 rounded-full items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-50 transition-colors z-10"
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
        <div className="md:hidden h-14 flex items-center gap-3 px-4 border-b border-gray-200 bg-white shrink-0">
          <button
            onClick={() => setMobileOpen(true)}
            className="w-9 h-9 flex items-center justify-center rounded-lg text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition-colors shrink-0"
            aria-label="Open sidebar"
          >
            <Menu className="w-5 h-5" />
          </button>
          <img src="/assets/Logo.jpeg" alt="MedBot" className="w-7 h-7 rounded-md shrink-0" />
          <span className="text-sm font-semibold text-gray-900 truncate">MedBot</span>
        </div>

        <div className="flex-1 min-h-0 flex flex-col">
          <Outlet />
        </div>
      </main>
    </div>
  )
}
