import { useState } from 'react'
import { Menu, Search, Bell, Sun, Moon } from 'lucide-react'
import { isAdminAuthenticated } from './admin-api'

interface AdminNavbarProps {
  onMenuClick: () => void
}

export const AdminNavbar = ({ onMenuClick }: AdminNavbarProps) => {
  const authed = isAdminAuthenticated()
  const [dark, setDark] = useState(() =>
    document.documentElement.classList.contains('dark')
  )

  const toggleDark = () => {
    const next = !dark
    setDark(next)
    if (next) {
      document.documentElement.classList.add('dark')
      localStorage.setItem('medbot-theme', 'dark')
    } else {
      document.documentElement.classList.remove('dark')
      localStorage.setItem('medbot-theme', 'light')
    }
  }

  return (
    <header className="h-16 bg-white dark:bg-[#0f1117] border-b border-gray-200 dark:border-[#1e2028] flex items-center gap-3 px-4 sm:px-6 sticky top-0 z-10 transition-colors">
      <button
        onClick={onMenuClick}
        className="lg:hidden p-2 text-gray-500 dark:text-[#6b7080] hover:bg-gray-100 dark:hover:bg-[#1a1d25] rounded-lg shrink-0"
      >
        <Menu className="w-5 h-5" />
      </button>

      {/* Search */}
      <div className="flex-1">
        <div className="relative max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-[#525666]" />
          <input
            type="text"
            placeholder="Search tenants, users..."
            className="w-full pl-9 pr-4 py-2 bg-gray-100 dark:bg-[#1a1d25] rounded-lg text-sm text-gray-700 dark:text-[#cdd0d5] placeholder-gray-400 dark:placeholder-[#525666] focus:outline-none focus:ring-2 focus:ring-[#073B4C]/30 transition-colors"
          />
        </div>
      </div>

      <div className="flex items-center gap-1 sm:gap-1.5 shrink-0">
        {/* Dark mode toggle */}
        <button
          onClick={toggleDark}
          className="p-2 text-gray-500 dark:text-[#6b7080] hover:text-gray-700 dark:hover:text-[#cdd0d5] hover:bg-gray-100 dark:hover:bg-[#1a1d25] rounded-lg transition-colors"
          aria-label="Toggle dark mode"
        >
          {dark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </button>

        {/* Notifications */}
        <button className="relative p-2 text-gray-500 dark:text-[#6b7080] hover:text-gray-700 dark:hover:text-[#cdd0d5] hover:bg-gray-100 dark:hover:bg-[#1a1d25] rounded-lg transition-colors">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-red-500 rounded-full" />
        </button>

        {authed && (
          <>
            <div className="w-px h-6 bg-gray-200 dark:bg-[#1e2028] mx-1" />
            <div className="flex items-center gap-2 sm:gap-2.5">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-medium text-gray-700 dark:text-[#cdd0d5]">Super Admin</p>
                <p className="text-[10px] text-gray-400 dark:text-[#525666]">Full Access</p>
              </div>
              <div className="w-8 h-8 sm:w-9 sm:h-9 bg-[#073B4C] rounded-full flex items-center justify-center text-white text-xs sm:text-sm font-bold shrink-0">
                SA
              </div>
            </div>
          </>
        )}
      </div>
    </header>
  )
}
