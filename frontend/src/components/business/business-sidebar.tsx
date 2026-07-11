import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import {
  LayoutDashboard,
  ClipboardList,
  Users,
  UserCog,
  FileBarChart,
  CreditCard,
  Settings,
  HeadphonesIcon,
  LogOut,
  X,
  ChevronsLeft,
  ChevronsRight,
} from 'lucide-react'

const navItems = [
  { to: '/business/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/business/dashboard/assessments', label: 'Assessments', icon: ClipboardList },
  { to: '/business/dashboard/patient-insights', label: 'Patients Insights', icon: Users },
  { to: '/business/dashboard/doctors', label: 'Doctors', icon: UserCog },
  { to: '/business/dashboard/reports', label: 'Reports', icon: FileBarChart },
  { to: '/business/dashboard/subscriptions', label: 'Subscriptions', icon: CreditCard },
  { to: '/business/dashboard/settings', label: 'Settings', icon: Settings },
]

interface BusinessSidebarProps {
  isOpen: boolean
  onClose: () => void
}

export const BusinessSidebar = ({ isOpen, onClose }: BusinessSidebarProps) => {
  const [collapsed, setCollapsed] = useState(false)

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed left-0 top-0 z-50 h-screen bg-white border-r border-gray-200 flex flex-col overflow-y-auto transition-all duration-300 lg:translate-x-0 ${
          collapsed ? 'w-[72px]' : 'w-64'
        } ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}
      >
        {/* Brand Header */}
        <div className={`h-16 flex items-center border-b border-gray-200 shrink-0 ${collapsed ? 'justify-center px-2' : 'justify-between px-5'}`}>
          {!collapsed && (
            <div className="flex items-center gap-2">
              <img src="/assets/Logoico.png" alt="MedBot" className="h-8 w-auto" />
              <div>
                <p className="font-bold text-gray-900 text-sm">MedBot</p>
                <p className="text-[10px] text-gray-400">AI Health Admin</p>
              </div>
            </div>
          )}
          {collapsed && (
            <img src="/assets/Logoico.png" alt="MedBot" className="h-8 w-auto" />
          )}
          <button
            onClick={onClose}
            className="lg:hidden w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Main Navigation */}
        <nav className={`shrink-0 space-y-1 mt-3 ${collapsed ? 'px-2' : 'px-3'}`}>
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/business/dashboard'}
              onClick={onClose}
              title={collapsed ? item.label : undefined}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-lg text-sm font-medium transition-colors ${
                  collapsed ? 'justify-center w-10 h-10 mx-auto' : 'px-3 py-2.5'
                } ${
                  isActive
                    ? 'bg-[#073B4C] text-white'
                    : 'text-gray-600 hover:bg-gray-100'
                }`
              }
            >
              <item.icon className="w-5 h-5 shrink-0" />
              {!collapsed && item.label}
            </NavLink>
          ))}
        </nav>

        {/* Collapse Toggle Divider */}
        <div className="shrink-0 mt-auto">
          <div className={`flex items-center justify-center py-3 gap-3 ${collapsed ? 'px-2' : ''}`}>
            <div className="w-px h-6 bg-gray-200" />
            <button
              onClick={() => setCollapsed(!collapsed)}
              className="hidden lg:flex w-8 h-8 items-center justify-center rounded-full border border-gray-200 text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors shrink-0"
              aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            >
              {collapsed ? <ChevronsRight className="w-4 h-4" /> : <ChevronsLeft className="w-4 h-4" />}
            </button>
            <div className="w-px h-6 bg-gray-200" />
          </div>
        </div>

        {/* Bottom Section */}
        <div className={`shrink-0 ${collapsed ? 'px-2 pb-3' : 'px-4 pb-4'} space-y-1`}>
          <NavLink
            to="/business/support"
            onClick={onClose}
            title={collapsed ? 'Support Portal' : undefined}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-lg text-sm font-medium transition-colors ${
                collapsed ? 'justify-center w-10 h-10 mx-auto' : 'px-3 py-2.5'
              } ${
                isActive
                  ? 'bg-[#073B4C] text-white'
                  : 'text-gray-600 hover:bg-gray-100'
              }`
            }
          >
            <HeadphonesIcon className="w-5 h-5 shrink-0" />
            {!collapsed && 'Support Portal'}
          </NavLink>
          <button
            onClick={onClose}
            title={collapsed ? 'Logout' : undefined}
            className={`flex items-center gap-3 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-100 transition-colors w-full ${
              collapsed ? 'justify-center w-10 h-10 mx-auto' : 'px-3 py-2.5'
            }`}
          >
            <LogOut className="w-5 h-5 shrink-0" />
            {!collapsed && 'Logout'}
          </button>
        </div>
      </aside>
    </>
  )
}
