import { useState, Suspense } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'
import { DarkModeProvider } from '@/components/business/dark-mode-context'
import { BusinessSidebar } from '@/components/business/business-sidebar'
import { BusinessNavbar } from '@/components/business/business-navbar'
import { LogoutConfirmModal } from '@/components/ui/logout-confirm-modal'

export const BusinessDashboardLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [collapsed, setCollapsed] = useState(false)
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false)
  const navigate = useNavigate()

  const handleLogout = () => {
    localStorage.removeItem('token')
    navigate('/')
  }

  return (
    <DarkModeProvider>
      <div className="min-h-screen bg-gray-50 dark:bg-[#080a0e] flex flex-col transition-colors">
        <div className="flex flex-1">
          <BusinessSidebar
            isOpen={sidebarOpen}
            onClose={() => setSidebarOpen(false)}
            collapsed={collapsed}
            onCollapsedChange={setCollapsed}
            onLogout={() => setShowLogoutConfirm(true)}
          />
          <div className={`flex-1 transition-all duration-300 ${collapsed ? 'lg:ml-[72px]' : 'lg:ml-64'}`}>
            <BusinessNavbar onMenuClick={() => setSidebarOpen(true)} />
            <main className="p-4 sm:p-6">
              <Suspense fallback={
                <div className="flex items-center justify-center py-20">
                  <div className="flex flex-col items-center gap-3">
                    <div className="w-8 h-8 border-2 border-gray-200 dark:border-gray-700 border-t-[#073B4C] rounded-full animate-spin" />
                    <p className="text-xs text-gray-400 dark:text-gray-500">Loading...</p>
                  </div>
                </div>
              }>
                <Outlet />
              </Suspense>
            </main>
          </div>
        </div>
      </div>
      <LogoutConfirmModal open={showLogoutConfirm} onCancel={() => setShowLogoutConfirm(false)} onConfirm={handleLogout} />
    </DarkModeProvider>
  )
}
