import { useState } from 'react'
import { Plus, Pencil, Trash2, Info, ChevronLeft, ChevronRight } from 'lucide-react'

const initialStaff = [
  { id: 1, name: 'John Doe', initials: 'JD', role: 'Admin', email: 'john.doe@medbot.com', status: 'ACTIVE' as const },
  { id: 2, name: 'Jane Smith', initials: 'JS', role: 'Doctor', email: 'jane.smith@medbot.com', status: 'ACTIVE' as const },
  { id: 3, name: 'Michael Brown', initials: 'MB', role: 'Nurse', email: 'michael.brown@medbot.com', status: 'ACTIVE' as const },
  { id: 4, name: 'Sarah Johnson', initials: 'SJ', role: 'Support Staff', email: 'sarah.johnson@medbot.com', status: 'ACTIVE' as const },
  { id: 5, name: 'David Wilson', initials: 'DW', role: 'Data Analyst', email: 'david.wilson@medbot.com', status: 'INACTIVE' as const },
  { id: 6, name: 'Emily Davis', initials: 'ED', role: 'Receptionist', email: 'emily.davis@medbot.com', status: 'ACTIVE' as const },
]

const roles = ['Admin', 'Doctor', 'Nurse', 'Support Staff', 'Data Analyst', 'Receptionist']

const roleColors: Record<string, string> = {
  Admin: 'bg-[#073B4C] text-white',
  Doctor: 'bg-[#00A8A8] text-white',
  Nurse: 'bg-[#073B4C]/70 text-white',
  'Support Staff': 'bg-[#00D4D4] text-[#073B4C]',
  'Data Analyst': 'bg-[#073B4C]/50 text-white',
  Receptionist: 'bg-[#00A8A8]/70 text-white',
}

export const StaffManagement = () => {
  const [staff] = useState(initialStaff)
  const [currentPage, setCurrentPage] = useState(1)
  const [showModal, setShowModal] = useState(false)
  const [newStaff, setNewStaff] = useState({ name: '', role: 'Doctor', email: '' })
  const itemsPerPage = 5

  const totalPages = Math.ceil(staff.length / itemsPerPage)
  const paginatedStaff = staff.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

  const handleAdd = () => {
    if (newStaff.name && newStaff.email) {
      setShowModal(false)
      setNewStaff({ name: '', role: 'Doctor', email: '' })
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-[#e8eaed]">Staff Management</h1>
          <p className="text-sm text-gray-500 dark:text-[#6b7080] mt-1">
            Manage and oversee all healthcare staff members in the portal.
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-[#073B4C] text-white rounded-lg text-sm font-semibold hover:bg-[#0A202A] dark:hover:bg-[#00D4D4]/20 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Staff
        </button>
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-[#0f1117] rounded-xl border border-gray-200 dark:border-[#1e2028] overflow-hidden">
        {/* Table Header */}
        <div className="hidden sm:grid grid-cols-[1.5fr_1fr_1.5fr_1fr_0.8fr] gap-4 px-6 py-4 border-b border-gray-100 dark:border-[#1e2028] text-xs font-semibold text-gray-400 dark:text-[#525666] uppercase tracking-wider">
          <span>Name</span>
          <span>Role</span>
          <span>Email</span>
          <span>Status</span>
          <span className="text-right">Actions</span>
        </div>

        {/* Table Body */}
        <div className="divide-y divide-gray-100 dark:divide-[#1e2028]">
          {paginatedStaff.map((member) => (
            <div
              key={member.id}
              className="grid grid-cols-1 sm:grid-cols-[1.5fr_1fr_1.5fr_1fr_0.8fr] gap-2 sm:gap-4 px-6 py-4 items-center hover:bg-gray-50 dark:hover:bg-[#1a1d25]/50 transition-colors"
            >
              {/* Name */}
              <div className="flex items-center gap-3">
                <div className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold ${roleColors[member.role] || 'bg-gray-300 text-gray-700'}`}>
                  {member.initials}
                </div>
                <span className="text-sm font-medium text-gray-900 dark:text-[#e8eaed]">{member.name}</span>
              </div>

              {/* Role */}
              <span className="text-sm text-gray-600 dark:text-[#6b7080]">{member.role}</span>

              {/* Email */}
              <span className="text-sm text-gray-500 dark:text-[#6b7080]">{member.email}</span>

              {/* Status */}
              <span
                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider w-fit ${
                  member.status === 'ACTIVE'
                    ? 'bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-400'
                    : 'bg-gray-100 text-gray-500 dark:bg-[#1a1d25] dark:text-[#6b7080]'
                }`}
              >
                {member.status}
              </span>

              {/* Actions */}
              <div className="flex items-center justify-end gap-2">
                <button className="p-2 text-gray-400 dark:text-[#525666] hover:text-[#073B4C] dark:hover:text-teal-400 hover:bg-gray-100 dark:hover:bg-[#1a1d25] rounded-lg transition-colors">
                  <Pencil className="w-4 h-4" />
                </button>
                <button className="p-2 text-gray-400 dark:text-[#525666] hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100 dark:border-[#1e2028]">
          <p className="text-sm text-gray-500 dark:text-[#6b7080]">
            Showing 1 to {Math.min(currentPage * itemsPerPage, staff.length)} of {staff.length} staff members
          </p>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 dark:border-[#2a2d35] text-gray-400 dark:text-[#525666] hover:bg-gray-50 dark:hover:bg-[#1a1d25] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`w-8 h-8 flex items-center justify-center rounded-lg text-sm font-medium transition-colors ${
                  currentPage === page
                    ? 'bg-[#073B4C] text-white'
                    : 'text-gray-600 dark:text-[#6b7080] hover:bg-gray-100 dark:hover:bg-[#1a1d25]'
                }`}
              >
                {page}
              </button>
            ))}
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 dark:border-[#2a2d35] text-gray-400 dark:text-[#525666] hover:bg-gray-50 dark:hover:bg-[#1a1d25] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Info */}
      <div className="bg-gray-50 dark:bg-[#0f1117] border border-gray-200 dark:border-[#1e2028] rounded-xl p-4">
        <div className="flex items-start gap-2">
          <Info className="w-4 h-4 text-gray-400 dark:text-[#525666] mt-0.5 flex-shrink-0" />
          <p className="text-xs text-gray-500 dark:text-[#6b7080] leading-relaxed">
            You can add, edit, or remove staff members. Changes will be reflected immediately across the portal dashboard and role-based access control systems.
          </p>
        </div>
      </div>

      {/* Add Staff Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/50" onClick={() => setShowModal(false)} />
          <div className="relative bg-white dark:bg-[#0f1117] rounded-xl border border-gray-200 dark:border-[#1e2028] p-6 w-full max-w-md shadow-xl">
            <h2 className="text-lg font-bold text-gray-900 dark:text-[#e8eaed] mb-4">Add Staff Member</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-[#a0a4ad] mb-1">Full Name</label>
                <input
                  type="text"
                  value={newStaff.name}
                  onChange={(e) => setNewStaff({ ...newStaff, name: e.target.value })}
                  placeholder="Enter full name"
                  className="w-full px-3 py-2.5 bg-gray-50 dark:bg-[#1a1d25] border border-gray-200 dark:border-[#2a2d35] rounded-lg text-sm text-gray-900 dark:text-[#e8eaed] placeholder-gray-400 dark:placeholder-[#525666] focus:outline-none focus:ring-2 focus:ring-[#073B4C]/30 transition-colors"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-[#a0a4ad] mb-1">Role</label>
                <select
                  value={newStaff.role}
                  onChange={(e) => setNewStaff({ ...newStaff, role: e.target.value })}
                  className="w-full px-3 py-2.5 bg-gray-50 dark:bg-[#1a1d25] border border-gray-200 dark:border-[#2a2d35] rounded-lg text-sm text-gray-900 dark:text-[#e8eaed] focus:outline-none focus:ring-2 focus:ring-[#073B4C]/30 transition-colors"
                >
                  {roles.map((r) => (
                    <option key={r} value={r}>{r}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-[#a0a4ad] mb-1">Email</label>
                <input
                  type="email"
                  value={newStaff.email}
                  onChange={(e) => setNewStaff({ ...newStaff, email: e.target.value })}
                  placeholder="Enter email address"
                  className="w-full px-3 py-2.5 bg-gray-50 dark:bg-[#1a1d25] border border-gray-200 dark:border-[#2a2d35] rounded-lg text-sm text-gray-900 dark:text-[#e8eaed] placeholder-gray-400 dark:placeholder-[#525666] focus:outline-none focus:ring-2 focus:ring-[#073B4C]/30 transition-colors"
                />
              </div>
            </div>
            <div className="flex items-center justify-end gap-3 mt-6">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 border border-gray-200 dark:border-[#2a2d35] rounded-lg text-sm font-medium text-gray-600 dark:text-[#6b7080] hover:bg-gray-50 dark:hover:bg-[#1a1d25] transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleAdd}
                className="px-4 py-2 bg-[#073B4C] text-white rounded-lg text-sm font-semibold hover:bg-[#0A202A] transition-colors"
              >
                Add Staff
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
