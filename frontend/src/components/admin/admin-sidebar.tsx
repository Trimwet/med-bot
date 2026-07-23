import { NavLink, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard,
  Users,
  Building2,
  BarChart3,
  Handshake,
  Cog,
  LogOut,
  X,
  ChevronsLeft,
  ChevronsRight,
} from 'lucide-react'
import { clearAdminSecret } from './admin-api'

const navItems = [
  { to: '/admin/dashboard', label: 'Overview', icon: LayoutDashboard },
  { to: '/admin/dashboard/tenants', label: 'Tenants', icon: Building2 },
  { to: '/admin/dashboard/users', label: 'Users', icon: Users },
  { to: '/admin/dashboard/analytics', label: 'Analytics', icon: BarChart3 },
  { to: '/admin/dashboard/partners', label: 'Partners', icon: Handshake },
  { to: '/admin/dashboard/settings', label: 'Settings', icon: Cog },
]

interface AdminSidebarProps {
  isOpen: boolean
  onClose: () => void
  collapsed: boolean
  onCollapsedChange: (collapsed: boolean) => void
}

export const AdminSidebar = ({ isOpen, onClose, collapsed, onCollapsedChange }: AdminSidebarProps) => {
  const navigate = useNavigate()

  const handleLogout = () => {
    clearAdminSecret()
    navigate('/admin/login')
  }

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={onClose} />
      )}

      <aside
        className={`fixed left-0 top-0 z-50 h-screen bg-white dark:bg-[#0f1117] border-r border-gray-200 dark:border-[#1e2028] flex flex-col overflow-visible transition-all duration-300 lg:translate-x-0 ${
          collapsed ? 'w-[72px]' : 'w-64'
        } ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}
      >
        {/* Brand Header */}
        <div className={`h-16 flex items-center border-b border-gray-200 dark:border-[#1e2028] shrink-0 ${collapsed ? 'justify-center px-2' : 'justify-between px-5'}`}>
          {!collapsed && (
            <div className="flex items-center gap-2">
              <img src="/assets/Logoico.png" alt="MedBot" className="h-8 w-auto" />
              <div>
                <p className="font-bold text-gray-900 dark:text-[#e8eaed] text-sm">MedBot</p>
                <p className="text-[10px] text-gray-400 dark:text-[#525666]">Super Admin</p>
              </div>
            </div>
          )}
          {collapsed && (
            <img src="/assets/Logoico.png" alt="MedBot" className="h-8 w-auto" />
          )}
          <button
            onClick={onClose}
            className="lg:hidden w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 dark:text-[#525666] hover:text-gray-600 dark:hover:text-[#a0a4ad] hover:bg-gray-100 dark:hover:bg-[#1a1d25] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Navigation */}
        <nav className={`shrink-0 space-y-1 mt-3 ${collapsed ? 'px-2' : 'px-3'}`}>
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/admin/dashboard'}
              onClick={onClose}
              title={collapsed ? item.label : undefined}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-lg text-sm font-medium transition-colors ${
                  collapsed ? 'justify-center w-10 h-10 mx-auto' : 'px-3 py-2.5'
                } ${
                  isActive
                    ? 'bg-[#073B4C] text-white'
                    : 'text-gray-600 dark:text-[#6b7080] hover:bg-gray-100 dark:hover:bg-[#1a1d25]'
                }`
              }
            >
              <item.icon className="w-4 h-4 shrink-0" />
              {!collapsed && item.label}
            </NavLink>
          ))}
        </nav>

        {/* Bottom */}
        <div className={`shrink-0 mt-auto border-t border-gray-100 dark:border-[#1e2028] ${collapsed ? 'px-2 py-3' : 'px-4 py-3'} space-y-0.5`}>
          <button
            onClick={handleLogout}
            title={collapsed ? 'Logout' : undefined}
            className={`flex items-center gap-3 rounded-lg text-sm font-medium text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors w-full ${
              collapsed ? 'justify-center w-10 h-10 mx-auto' : 'px-3 py-2.5'
            }`}
          >
            <LogOut className="w-[18px] h-[18px] shrink-0" />
            {!collapsed && 'Logout'}
          </button>
        </div>

        {/* Collapse toggle */}
        <button
          onClick={() => onCollapsedChange(!collapsed)}
          className="hidden lg:flex absolute bottom-3 right-0 translate-x-1/2 w-6 h-6 items-center justify-center rounded-full border border-gray-200 dark:border-[#2a2d35] bg-white dark:bg-[#0f1117] text-gray-400 dark:text-[#525666] hover:text-gray-600 dark:hover:text-[#a0a4ad] hover:bg-gray-100 dark:hover:bg-[#1a1d25] transition-colors z-10 shadow-sm"
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? <ChevronsRight className="w-3 h-3" /> : <ChevronsLeft className="w-3 h-3" />}
        </button>
      </aside>
    </>
  )
}
