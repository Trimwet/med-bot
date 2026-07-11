import { Search, Bell, Menu } from 'lucide-react'

interface CustomerNavbarProps {
  onMenuClick: () => void
}

export const CustomerNavbar = ({ onMenuClick }: CustomerNavbarProps) => {
  return (
    <header className="h-16 bg-white/80 backdrop-blur-xl border-b border-line flex items-center justify-between px-4 sm:px-6 sticky top-0 z-10">
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          className="lg:hidden w-10 h-10 flex items-center justify-center rounded-lg text-muted hover:text-ink hover:bg-ink/5 transition-colors"
          aria-label="Open sidebar"
        >
          <Menu className="w-5 h-5" />
        </button>
        <div className="flex-1 max-w-xl hidden sm:block">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
            <input
              type="text"
              placeholder="Search medical records or resources..."
              className="w-full pl-10 pr-4 py-2.5 bg-paper-soft rounded-xl text-sm text-ink placeholder-muted/60 border border-line focus:outline-none focus:ring-2 focus:ring-teal/20 focus:border-teal/40 transition-all"
            />
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button
          className="relative w-10 h-10 flex items-center justify-center rounded-xl text-muted hover:text-ink hover:bg-ink/5 transition-colors"
          aria-label="Notifications"
        >
          <Bell className="w-5 h-5" />
          <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full" />
        </button>

        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-full bg-navy flex items-center justify-center text-white text-xs font-bold">
            JD
          </div>
          <span className="text-sm font-medium text-ink hidden sm:block">Dr. John Doe</span>
        </div>
      </div>
    </header>
  )
}
