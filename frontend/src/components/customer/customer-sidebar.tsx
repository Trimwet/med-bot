import { NavLink } from 'react-router-dom'
import {
  LayoutDashboard,
  ClipboardList,
  FileText,
  BookOpen,
  MapPin,
  CreditCard,
  Settings,
  HelpCircle,
  Plus,
  X,
} from 'lucide-react'

const navItems = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/dashboard/assessment-history', label: 'Assessment History', icon: ClipboardList },
  { to: '/dashboard/health-reports', label: 'Health Reports', icon: FileText },
  { to: '/dashboard/health-library', label: 'Health Library', icon: BookOpen },
  { to: '/dashboard/find-nearby-care', label: 'Find Nearby Care', icon: MapPin },
  { to: '/dashboard/subscription', label: 'Subscription', icon: CreditCard },
]

interface CustomerSidebarProps {
  isOpen: boolean
  onClose: () => void
}

export const CustomerSidebar = ({ isOpen, onClose }: CustomerSidebarProps) => {
  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed left-0 top-0 z-50 h-screen w-64 bg-white border-r border-gray-200 flex flex-col overflow-y-auto transition-transform duration-300 lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <img src="/assets/Logoico.png" alt="MedBot" className="h-8 w-auto" />
              <span className="font-extrabold text-xl text-[#073B4C]">MedBot</span>
            </div>
            <button
              onClick={onClose}
              className="lg:hidden p-1 rounded-lg text-gray-500 hover:bg-gray-100"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="px-4 mb-4">
          <button className="w-full flex items-center justify-center gap-2 bg-[#073B4C] text-white py-2.5 rounded-lg font-medium hover:bg-[#0A202A] transition-colors">
            <Plus className="w-4 h-4" />
            New Assessment
          </button>
        </div>

        <nav className="px-3 space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/dashboard'}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-[#073B4C] text-white'
                    : 'text-gray-600 hover:bg-gray-100'
                }`
              }
            >
              <item.icon className="w-5 h-5" />
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="mt-auto p-4 space-y-3">
          <div className="bg-[#073B4C] rounded-xl p-4 text-white">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-yellow-400 text-lg">★</span>
              <span className="font-semibold text-sm">Upgrade to Premium</span>
            </div>
            <p className="text-xs text-gray-300 mb-3">
              Unlock advanced features and priority support.
            </p>
            <button className="w-full bg-white text-[#073B4C] py-2 rounded-lg text-sm font-semibold hover:bg-gray-100 transition-colors">
              Upgrade Now
            </button>
          </div>

          <nav className="space-y-1">
            <NavLink
              to="/dashboard/settings"
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-[#073B4C] text-white'
                    : 'text-gray-600 hover:bg-gray-100'
                }`
              }
            >
              <Settings className="w-5 h-5" />
              Settings
            </NavLink>
            <NavLink
              to="/dashboard/help"
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-[#073B4C] text-white'
                    : 'text-gray-600 hover:bg-gray-100'
                }`
              }
            >
              <HelpCircle className="w-5 h-5" />
              Help Center
            </NavLink>
          </nav>
        </div>
      </aside>
    </>
  )
}
