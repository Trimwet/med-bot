import { useState, useEffect, Suspense } from 'react'
import { Outlet, Navigate } from 'react-router-dom'
import { AdminSidebar } from './admin-sidebar'
import { AdminNavbar } from './admin-navbar'
import { isAdminAuthenticated } from './admin-api'

export const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [collapsed, setCollapsed] = useState(false)
  const [initialLoading, setInitialLoading] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => setInitialLoading(false), 300)
    return () => clearTimeout(timer)
  }, [])

  if (!isAdminAuthenticated()) {
    return <Navigate to="/admin/login" replace />
  }

  if (initialLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-[#080a0e] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-2 border-gray-200 dark:border-gray-700 border-t-[#073B4C] rounded-full animate-spin" />
          <p className="text-sm text-gray-400 dark:text-gray-500">Loading Admin Panel...</p>
        </div>
      </div>
    )
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
  )
}
