import { useEffect, useState } from 'react'
import { Mail, Calendar, CheckCircle, XCircle } from 'lucide-react'
import { adminApi } from './admin-api'

interface UserData {
  _id: string
  name?: string
  email: string
  isVerified: boolean
  tenantId?: string
  createdAt?: string
  updatedAt?: string
}

export const AdminUsers = () => {
  const [users, setUsers] = useState<UserData[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    adminApi.getUsers()
      .then((data) => setUsers(data.users || []))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="space-y-4 animate-pulse">
        <div className="h-10 w-48 bg-gray-100 dark:bg-[#1a1d25] rounded-lg" />
        <div className="h-64 bg-gray-100 dark:bg-[#1a1d25] rounded-xl" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-gray-900 dark:text-[#e8eaed]">Users</h1>
        <p className="text-sm text-gray-500 dark:text-[#6b7080] mt-0.5">{users.length} registered users</p>
      </div>

      <div className="bg-white dark:bg-[#0f1117] rounded-xl border border-gray-200 dark:border-[#1e2028] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 dark:border-[#1e2028] bg-gray-50 dark:bg-[#1a1d25]">
                <th className="text-left px-5 py-3 font-semibold text-gray-700 dark:text-[#a0a4ad]">Name</th>
                <th className="text-left px-5 py-3 font-semibold text-gray-700 dark:text-[#a0a4ad]">Email</th>
                <th className="text-center px-5 py-3 font-semibold text-gray-700 dark:text-[#a0a4ad]">Verified</th>
                <th className="text-left px-5 py-3 font-semibold text-gray-700 dark:text-[#a0a4ad]">Tenant ID</th>
                <th className="text-right px-5 py-3 font-semibold text-gray-700 dark:text-[#a0a4ad]">Joined</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-[#1e2028]">
              {users.map((u) => (
                <tr key={u._id} className="hover:bg-gray-50 dark:hover:bg-[#1a1d25] transition-colors">
                  <td className="px-5 py-4">
                    <span className="font-medium text-gray-900 dark:text-[#e8eaed]">
                      {u.name || 'Unnamed'}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2 text-gray-600 dark:text-[#a0a4ad]">
                      <Mail className="w-3.5 h-3.5" />
                      <span>{u.email}</span>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-center">
                    {u.isVerified ? (
                      <CheckCircle className="w-4 h-4 text-green-500 mx-auto" />
                    ) : (
                      <XCircle className="w-4 h-4 text-gray-300 dark:text-[#525666] mx-auto" />
                    )}
                  </td>
                  <td className="px-5 py-4 text-gray-500 dark:text-[#6b7080] font-mono text-xs">
                    {u.tenantId ? `${u.tenantId.slice(0, 16)}...` : '-'}
                  </td>
                  <td className="px-5 py-4 text-right text-gray-400 dark:text-[#525666] tabular-nums">
                    {u.createdAt ? new Date(u.createdAt).toLocaleDateString() : '-'}
                  </td>
                </tr>
              ))}
              {users.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-5 py-12 text-center text-sm text-gray-400 dark:text-[#525666]">
                    No users found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
