import { Search, Bell, HelpCircle, Menu } from 'lucide-react'

interface BusinessNavbarProps {
  onMenuClick: () => void
}

export const BusinessNavbar = ({ onMenuClick }: BusinessNavbarProps) => {
  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 sm:px-6 sticky top-0 z-10">
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 text-gray-500 hover:bg-gray-100 rounded-lg"
        >
          <Menu className="w-5 h-5" />
        </button>
        <div className="flex-1 max-w-xl">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search assessments or patient ID..."
              className="w-full pl-10 pr-4 py-2.5 bg-gray-100 rounded-lg text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#073B4C]/30"
            />
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3 sm:gap-4">
        <button className="relative p-2 text-gray-500 hover:text-gray-700 transition-colors">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>
        <button className="p-2 text-gray-500 hover:text-gray-700 transition-colors hidden sm:block">
          <HelpCircle className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 sm:gap-3">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-medium text-gray-700">Admin User</p>
            <p className="text-[10px] text-gray-400">System Administrator</p>
          </div>
          <div className="w-8 h-8 sm:w-9 sm:h-9 bg-[#073B4C] rounded-full flex items-center justify-center text-white text-xs sm:text-sm font-bold">
            AU
          </div>
        </div>
      </div>
    </header>
  )
}
