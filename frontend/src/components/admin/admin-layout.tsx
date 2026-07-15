import { useState } from 'react'
import { Outlet, Navigate } from 'react-router-dom'
import { AdminSidebar } from './admin-sidebar'
import { AdminNavbar } from './admin-navbar'
import { isAdminAuthenticated } from './admin-api'

export const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [collapsed, setCollapsed] = useState(false)

  if (!isAdminAuthenticated()) {
    return <Navigate to="/admin/login" replace />
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#080a0e] flex flex-col transition-colors">
      <div className="flex flex-1">
        <AdminSidebar
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          collapsed={collapsed}
          onCollapsedChange={setCollapsed}
        />
        <div className={`flex-1 transition-all duration-300 ${collapsed ? 'lg:ml-[72px]' : 'lg:ml-64'}`}>
          <AdminNavbar onMenuClick={() => setSidebarOpen(true)} />
          <main className="p-4 sm:p-6">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  )
}
