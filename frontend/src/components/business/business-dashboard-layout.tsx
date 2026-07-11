import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import { DarkModeProvider } from '@/components/business/dark-mode-context'
import { BusinessSidebar } from '@/components/business/business-sidebar'
import { BusinessNavbar } from '@/components/business/business-navbar'
import { BusinessFooter } from '@/components/business/business-footer'

export const BusinessDashboardLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <DarkModeProvider>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col transition-colors">
        <div className="flex flex-1">
          <BusinessSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
          <div className="flex-1 lg:ml-64 transition-all duration-300">
            <BusinessNavbar onMenuClick={() => setSidebarOpen(true)} />
            <main className="p-4 sm:p-6">
              <Outlet />
            </main>
          </div>
        </div>
        <div className="lg:ml-64 transition-all duration-300">
          <BusinessFooter />
        </div>
      </div>
    </DarkModeProvider>
  )
}
