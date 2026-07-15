import { Menu } from 'lucide-react'
import { isAdminAuthenticated, clearAdminSecret, getAdminSecret } from './admin-api'
import { useNavigate } from 'react-router-dom'

interface AdminNavbarProps {
  onMenuClick: () => void
}

export const AdminNavbar = ({ onMenuClick }: AdminNavbarProps) => {
  const navigate = useNavigate()
  const authed = isAdminAuthenticated()

  return (
    <header className="h-16 bg-white dark:bg-[#0f1117] border-b border-gray-200 dark:border-[#1e2028] flex items-center gap-3 px-4 sm:px-6 sticky top-0 z-10 transition-colors">
      <button
        onClick={onMenuClick}
        className="lg:hidden p-2 text-gray-500 dark:text-[#6b7080] hover:bg-gray-100 dark:hover:bg-[#1a1d25] rounded-lg shrink-0"
      >
        <Menu className="w-5 h-5" />
      </button>

      <div className="flex-1" />

      <div className="flex items-center gap-3 shrink-0">
        {authed && (
          <>
            <div className="text-right hidden sm:block">
              <p className="text-sm font-medium text-gray-700 dark:text-[#cdd0d5]">Super Admin</p>
              <p className="text-[10px] text-gray-400 dark:text-[#525666]">Full Access</p>
            </div>
            <div className="w-8 h-8 sm:w-9 sm:h-9 bg-[#073B4C] rounded-full flex items-center justify-center text-white text-xs sm:text-sm font-bold">
              SA
            </div>
          </>
        )}
      </div>
    </header>
  )
}
