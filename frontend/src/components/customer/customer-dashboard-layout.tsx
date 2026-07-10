import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import { CustomerSidebar } from '@/components/customer/customer-sidebar'
import { CustomerNavbar } from '@/components/customer/customer-navbar'
import { CustomerFooter } from '@/components/customer/customer-footer'

export const CustomerDashboardLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <div className="flex flex-1">
        <CustomerSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <div className="flex-1 lg:ml-64">
          <CustomerNavbar onMenuClick={() => setSidebarOpen(true)} />
          <main className="p-4 sm:p-6">
            <Outlet />
          </main>
        </div>
      </div>
      <div className="lg:ml-64">
        <CustomerFooter />
      </div>
    </div>
  )
}
