import { AlertTriangle, X } from 'lucide-react'

interface LogoutConfirmModalProps {
  open: boolean
  onCancel: () => void
  onConfirm: () => void
}

export const LogoutConfirmModal = ({ open, onCancel, onConfirm }: LogoutConfirmModalProps) => {
  if (!open) return null
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onCancel} />
      <div className="relative bg-white dark:bg-[#1a1d25] rounded-2xl shadow-2xl w-full max-w-sm p-6">
        <button
          onClick={onCancel}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center shrink-0">
            <AlertTriangle className="w-5 h-5 text-red-500" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-[#e8eaed]">Confirm Logout</h3>
        </div>
        <p className="text-sm text-gray-500 dark:text-[#6b7080] mb-6">
          Are you sure you want to log out? You will need to sign in again to access your dashboard.
        </p>
        <div className="flex items-center gap-3 justify-end">
          <button
            onClick={onCancel}
            className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-[#a0a4ad] bg-gray-100 dark:bg-[#22252d] hover:bg-gray-200 dark:hover:bg-[#2a2d35] rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 text-sm font-medium text-white bg-red-500 hover:bg-red-600 rounded-lg transition-colors"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  )
}
