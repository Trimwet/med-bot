import { useEffect, useState } from 'react'
import { Mail, CheckCircle, XCircle, Search, UserCheck, UserX, Users, Trash2, AlertTriangle, X } from 'lucide-react'
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

type Filter = 'all' | 'verified' | 'unverified'

const initials = (name?: string, email?: string) => {
  if (name?.trim()) {
    const parts = name.trim().split(' ')
    return parts.length > 1
      ? `${parts[0][0]}${parts[1][0]}`.toUpperCase()
      : parts[0].slice(0, 2).toUpperCase()
  }
  return (email || '??').slice(0, 2).toUpperCase()
}

export const AdminUsers = () => {
  const [users, setUsers] = useState<UserData[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState<Filter>('all')
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [confirmDelete, setConfirmDelete] = useState<{ id: string; name: string } | null>(null)

  useEffect(() => {
    adminApi.getUsers()
      .then((data) => setUsers(data.users || []))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  const filtered = users.filter((u) => {
    const matchSearch =
      !search ||
      (u.name || '').toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase())
    const matchFilter =
      filter === 'all' ||
      (filter === 'verified' && u.isVerified) ||
      (filter === 'unverified' && !u.isVerified)
    return matchSearch && matchFilter
  })

  const handleDelete = async () => {
    if (!confirmDelete) return
    const { id, name } = confirmDelete
    setDeletingId(id)
    setConfirmDelete(null)
    try {
      await adminApi.deleteUser(id)
      setUsers((prev) => prev.filter((u) => u._id !== id))
    } catch (err) {
      console.error('Failed to delete user:', err)
    } finally {
      setDeletingId(null)
    }
  }

  const verifiedCount = users.filter((u) => u.isVerified).length
  const unverifiedCount = users.length - verifiedCount

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-8 w-36 bg-gray-100 dark:bg-[#1a1d25] rounded-lg" />
        <div className="grid grid-cols-3 gap-4">
          {[...Array(3)].map((_, i) => <div key={i} className="h-24 bg-gray-100 dark:bg-[#1a1d25] rounded-xl" />)}
        </div>
        <div className="h-64 bg-gray-100 dark:bg-[#1a1d25] rounded-xl" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-[#e8eaed]">Users</h1>
          <p className="text-sm text-gray-500 dark:text-[#6b7080] mt-1">{users.length} registered accounts</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: 'Total Users', value: users.length, icon: Users, color: '#073B4C' },
          { label: 'Verified', value: verifiedCount, icon: UserCheck, color: '#22C55E' },
          { label: 'Pending Verification', value: unverifiedCount, icon: UserX, color: '#F59E0B' },
        ].map((item) => {
          const Icon = item.icon
          return (
            <div key={item.label} className="bg-white dark:bg-[#0f1117] border border-gray-200 dark:border-[#1e2028] rounded-xl p-5 flex items-center gap-4 transition-colors">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0" style={{ backgroundColor: `${item.color}15` }}>
                <Icon className="w-4 h-4" style={{ color: item.color }} />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900 dark:text-[#e8eaed] tabular-nums tracking-tight">{item.value}</p>
                <p className="text-xs text-gray-500 dark:text-[#6b7080]">{item.label}</p>
              </div>
            </div>
          )
        })}
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-[#525666]" />
          <input
            type="text"
            placeholder="Search by name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-white dark:bg-[#0f1117] border border-gray-200 dark:border-[#1e2028] rounded-lg text-sm text-gray-900 dark:text-[#cdd0d5] placeholder-gray-400 dark:placeholder-[#525666] focus:outline-none focus:ring-2 focus:ring-[#073B4C]/30 transition-colors"
          />
        </div>
        <div className="flex items-center gap-1.5 bg-gray-100 dark:bg-[#1a1d25] rounded-lg p-1">
          {(['all', 'verified', 'unverified'] as Filter[]).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors capitalize ${
                filter === f
                  ? 'bg-[#073B4C] text-white shadow-sm'
                  : 'text-gray-500 dark:text-[#6b7080] hover:text-gray-700 dark:hover:text-gray-300'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-[#0f1117] rounded-xl border border-gray-200 dark:border-[#1e2028] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 dark:border-[#1e2028] bg-gray-50 dark:bg-[#1a1d25]">
                <th className="text-left px-5 py-3 font-semibold text-gray-500 dark:text-[#6b7080] text-xs uppercase tracking-wide">User</th>
                <th className="text-center px-5 py-3 font-semibold text-gray-500 dark:text-[#6b7080] text-xs uppercase tracking-wide">Status</th>
                <th className="text-left px-5 py-3 font-semibold text-gray-500 dark:text-[#6b7080] text-xs uppercase tracking-wide hidden md:table-cell">Tenant</th>
                <th className="text-right px-5 py-3 font-semibold text-gray-500 dark:text-[#6b7080] text-xs uppercase tracking-wide">Joined</th>
                <th className="px-3 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-[#1e2028]">
              {filtered.map((u) => (
                <tr key={u._id} className="hover:bg-gray-50 dark:hover:bg-[#1a1d25] transition-colors group">
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-[#073B4C]/10 flex items-center justify-center shrink-0">
                        <span className="text-xs font-semibold text-[#073B4C]">{initials(u.name, u.email)}</span>
                      </div>
                      <div className="min-w-0">
                        <p className="font-medium text-gray-900 dark:text-[#e8eaed] truncate">{u.name || 'Unnamed User'}</p>
                        <p className="text-xs text-gray-400 dark:text-[#525666] flex items-center gap-1 truncate">
                          <Mail className="w-3 h-3 shrink-0" />
                          {u.email}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3.5 text-center">
                    {u.isVerified ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
                        <CheckCircle className="w-3 h-3" />
                        Verified
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400">
                        <XCircle className="w-3 h-3" />
                        Pending
                      </span>
                    )}
                  </td>
                  <td className="px-5 py-3.5 hidden md:table-cell">
                    {u.tenantId ? (
                      <code className="text-xs font-mono text-gray-400 dark:text-[#525666] bg-gray-50 dark:bg-[#1a1d25] px-2 py-0.5 rounded">
                        {u.tenantId.slice(0, 14)}…
                      </code>
                    ) : (
                      <span className="text-xs text-gray-300 dark:text-[#2a2d35]">—</span>
                    )}
                  </td>
                  <td className="px-5 py-3.5 text-right text-xs text-gray-400 dark:text-[#525666] tabular-nums">
                    {u.createdAt
                      ? (() => {
                          const d = new Date(u.createdAt)
                          return (
                            <span className="inline-flex flex-col items-end gap-0.5">
                              <span>{d.toLocaleDateString('en-NG', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
                              <span className="text-[10px] text-gray-300 dark:text-[#2a2d35]">{d.toLocaleTimeString('en-NG', { hour: '2-digit', minute: '2-digit' })}</span>
                            </span>
                          )
                        })()
                      : '-'}
                  </td>
                  <td className="px-3 py-3.5">
                    <button
                      onClick={() => setConfirmDelete({ id: u._id, name: u.name || u.email })}
                      disabled={deletingId === u._id}
                      className="p-1.5 text-gray-300 dark:text-[#525666] hover:text-red-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors opacity-0 group-hover:opacity-100 disabled:opacity-50"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-5 py-16 text-center">
                    <Users className="w-8 h-8 text-gray-200 dark:text-[#2a2d35] mx-auto mb-3" />
                    <p className="text-sm font-medium text-gray-400 dark:text-[#525666]">
                      {search ? `No users matching "${search}"` : 'No users found'}
                    </p>
                    {search && (
                      <button onClick={() => setSearch('')} className="mt-2 text-xs text-[#073B4C] dark:text-[#00A8A8] hover:underline">
                        Clear search
                      </button>
                    )}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        {filtered.length > 0 && (
          <div className="px-5 py-3 border-t border-gray-100 dark:border-[#1e2028]">
            <p className="text-xs text-gray-400 dark:text-[#525666]">Showing {filtered.length} of {users.length} users</p>
          </div>
        )}
      </div>
      {/* Delete Confirmation Modal */}
      {confirmDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setConfirmDelete(null)} />
          <div className="relative bg-white dark:bg-[#1a1d25] rounded-2xl shadow-2xl w-full max-w-sm p-6">
            <button
              onClick={() => setConfirmDelete(null)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center shrink-0">
                <AlertTriangle className="w-5 h-5 text-red-500" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-[#e8eaed]">Delete User</h3>
            </div>
            <p className="text-sm text-gray-500 dark:text-[#6b7080] mb-6">
              Are you sure you want to delete <span className="font-medium text-gray-900 dark:text-[#e8eaed]">{confirmDelete.name}</span>? This action cannot be undone.
            </p>
            <div className="flex items-center gap-3 justify-end">
              <button
                onClick={() => setConfirmDelete(null)}
                className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-[#a0a4ad] bg-gray-100 dark:bg-[#22252d] hover:bg-gray-200 dark:hover:bg-[#2a2d35] rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 text-sm font-medium text-white bg-red-500 hover:bg-red-600 rounded-lg transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
