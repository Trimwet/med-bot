import { Menu, Shield, Phone, Bell, PanelRightClose, PanelRightOpen } from 'lucide-react'

interface DashboardHeaderProps {
  onMenuClick: () => void
  contextPanelOpen: boolean
  onToggleContextPanel: () => void
}

export const DashboardHeader = ({ onMenuClick, contextPanelOpen, onToggleContextPanel }: DashboardHeaderProps) => {
  return (
    <header className="h-14 bg-white/80 backdrop-blur-xl border-b border-line flex items-center justify-between px-4 shrink-0 z-10">
      {/* Left: Menu + Session Title */}
      <div className="flex items-center gap-3 min-w-0">
        <button
          onClick={onMenuClick}
          className="lg:hidden w-9 h-9 flex items-center justify-center rounded-lg text-muted hover:text-ink hover:bg-ink/5 transition-colors shrink-0"
          aria-label="Open sidebar"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 min-w-0">
          <div className="w-8 h-8 rounded-full bg-teal/10 flex items-center justify-center shrink-0">
            <img src="/assets/Logo.jpeg" alt="" className="w-5 h-5 rounded" />
          </div>
          <div className="min-w-0">
            <h1 className="text-sm font-semibold text-ink truncate">New Assessment</h1>
            <p className="text-[11px] text-muted/60 truncate">MedBot AI Assistant</p>
          </div>
        </div>
      </div>

      {/* Center: Trust Badge */}
      <div className="hidden md:flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 border border-amber-200/60 rounded-full">
        <Shield className="w-3.5 h-3.5 text-amber-600" />
        <span className="text-[11px] font-medium text-amber-700">Not Medical Advice</span>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-1.5">
        <button
          className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-navy/5 border border-navy/10 rounded-xl text-xs font-medium text-navy hover:bg-navy/10 transition-colors"
          aria-label="Consult a human doctor"
        >
          <Phone className="w-3.5 h-3.5" />
          <span className="hidden lg:inline">Consult Doctor</span>
        </button>

        <button
          className="relative w-9 h-9 flex items-center justify-center rounded-lg text-muted hover:text-ink hover:bg-ink/5 transition-colors"
          aria-label="Notifications"
        >
          <Bell className="w-[18px] h-[18px]" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
        </button>

        <div className="w-px h-6 bg-line mx-0.5 hidden sm:block" />

        <button
          onClick={onToggleContextPanel}
          className="w-9 h-9 flex items-center justify-center rounded-lg text-muted hover:text-ink hover:bg-ink/5 transition-colors"
          aria-label={contextPanelOpen ? 'Close health panel' : 'Open health panel'}
        >
          {contextPanelOpen ? (
            <PanelRightClose className="w-[18px] h-[18px]" />
          ) : (
            <PanelRightOpen className="w-[18px] h-[18px]" />
          )}
        </button>

        <div className="w-8 h-8 rounded-full bg-navy flex items-center justify-center text-white text-xs font-bold">
          JD
        </div>
      </div>
    </header>
  )
}
