import { Search, Bell, HelpCircle, Menu, Sun, Moon, User } from 'lucide-react'
import { useDarkMode } from '@/components/business/dark-mode-context'

interface BusinessNavbarProps {
  onMenuClick: () => void
}

export const BusinessNavbar = ({ onMenuClick }: BusinessNavbarProps) => {
  const { dark, toggle } = useDarkMode()

  return (
    <header className="h-16 bg-white dark:bg-[#0f1117] border-b border-gray-200 dark:border-[#1e2028] flex items-center gap-3 px-4 sm:px-6 sticky top-0 z-10 transition-colors">
      <button
        onClick={onMenuClick}
        className="lg:hidden p-2 text-gray-500 dark:text-[#6b7080] hover:bg-gray-100 dark:hover:bg-[#1a1d25] rounded-lg shrink-0"
      >
        <Menu className="w-5 h-5" />
      </button>

      <div className="flex-1">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-[#525666]" />
          <input
            type="text"
            placeholder="Search assessments or patient ID..."
            className="w-full pl-10 pr-4 py-2.5 bg-gray-100 dark:bg-[#1a1d25] rounded-lg text-sm text-gray-700 dark:text-[#cdd0d5] placeholder-gray-400 dark:placeholder-[#525666] focus:outline-none focus:ring-2 focus:ring-[#073B4C]/30 transition-colors"
          />
        </div>
      </div>

      <div className="flex items-center gap-3 sm:gap-4 shrink-0">
        <button
          onClick={toggle}
          className="p-2 text-gray-500 dark:text-[#6b7080] hover:text-gray-700 dark:hover:text-[#cdd0d5] hover:bg-gray-100 dark:hover:bg-[#1a1d25] rounded-lg transition-colors"
          aria-label="Toggle dark mode"
        >
          {dark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </button>
        <button className="relative p-2 text-gray-500 dark:text-[#6b7080] hover:text-gray-700 dark:hover:text-[#cdd0d5] transition-colors">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>
        <button className="p-2 text-gray-500 dark:text-[#6b7080] hover:text-gray-700 dark:hover:text-[#cdd0d5] transition-colors hidden sm:block">
          <HelpCircle className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 sm:gap-3">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-medium text-gray-700 dark:text-[#cdd0d5]">Admin User</p>
            <p className="text-[10px] text-gray-400 dark:text-[#525666]">System Administrator</p>
          </div>
          <div className="w-8 h-8 sm:w-9 sm:h-9 bg-[#073B4C] rounded-full flex items-center justify-center text-white">
            <User className="w-4 h-4 sm:w-5 sm:h-5" />
          </div>
        </div>
      </div>
    </header>
  )
}
