import { useState, useEffect, useCallback } from 'react'
import { Shield, Plus, Pencil, Trash2, RefreshCw, AlertCircle, CheckCircle, X } from 'lucide-react'
import {
  setAdminSecret,
  getAdminSecret,
  clearAdminSecret,
  listProtocols,
  deleteProtocol,
  type ProtocolNodeSummary,
  type AdminApiError,
} from '@/lib/adminApi'
import { ProtocolForm } from './protocol-form'

type View = 'prompt' | 'list' | 'create' | 'edit'

export const ProtocolAdmin = () => {
  const [secret, setSecret] = useState(getAdminSecret() ?? '')
  const [view, setView] = useState<View>(getAdminSecret() ? 'list' : 'prompt')
  const [nodes, setNodes] = useState<ProtocolNodeSummary[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null)
  const [editNodeId, setEditNodeId] = useState<string | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<ProtocolNodeSummary | null>(null)
  const [deleting, setDeleting] = useState(false)

  const showToast = useCallback((type: 'success' | 'error', message: string) => {
    setToast({ type, message })
    setTimeout(() => setToast(null), 4000)
  }, [])

  const fetchNodes = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const { nodes } = await listProtocols()
      setNodes(nodes)
    } catch (err) {
      const e = err as AdminApiError
      if (e.status === 401) {
        clearAdminSecret()
        setView('prompt')
        setSecret('')
      } else {
        setError(e.message || 'Failed to load protocols')
      }
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    if (view === 'list') fetchNodes()
  }, [view, fetchNodes])

  const handleUnlock = () => {
    setAdminSecret(secret.trim())
    setView('list')
  }

  const handleCreated = (nodeId: string) => {
    showToast('success', `Protocol "${nodeId}" created`)
    setView('list')
  }

  const handleUpdated = (nodeId: string) => {
    showToast('success', `Protocol "${nodeId}" updated`)
    setView('list')
  }

  const handleDelete = async () => {
    if (!deleteTarget) return
    setDeleting(true)
    try {
      await deleteProtocol(deleteTarget.nodeId)
      setNodes((prev) => prev.filter((n) => n.nodeId !== deleteTarget.nodeId))
      showToast('success', `Protocol "${deleteTarget.nodeId}" deleted`)
      setDeleteTarget(null)
    } catch (err) {
      const e = err as AdminApiError
      showToast('error', e.message || 'Failed to delete')
    } finally {
      setDeleting(false)
    }
  }

  const handleLock = () => {
    clearAdminSecret()
    setSecret('')
    setView('prompt')
    setNodes([])
  }

  if (view === 'prompt') {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-full max-w-sm bg-white dark:bg-[#0f1117] rounded-xl border border-gray-200 dark:border-[#1e2028] p-8 shadow-sm">
          <div className="flex flex-col items-center text-center mb-6">
            <div className="w-12 h-12 rounded-xl bg-[#073B4C]/10 dark:bg-[#073B4C]/20 flex items-center justify-center mb-4">
              <Shield className="w-6 h-6 text-[#073B4C] dark:text-teal-400" />
            </div>
            <h2 className="text-lg font-bold text-gray-900 dark:text-[#e8eaed]">Admin Access</h2>
            <p className="text-sm text-gray-500 dark:text-[#6b7080] mt-1">
              Enter the core secret to manage protocols
            </p>
          </div>
          <div className="space-y-4">
            <input
              type="password"
              value={secret}
              onChange={(e) => setSecret(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleUnlock()}
              placeholder="x-core-secret"
              className="w-full px-3 py-2.5 bg-gray-50 dark:bg-[#1a1d25] border border-gray-200 dark:border-[#2a2d35] rounded-lg text-sm text-gray-900 dark:text-[#e8eaed] placeholder-gray-400 dark:placeholder-[#525666] focus:outline-none focus:ring-2 focus:ring-[#073B4C]/30 transition-colors"
            />
            <button
              onClick={handleUnlock}
              disabled={!secret.trim()}
              className="w-full py-2.5 bg-[#073B4C] text-white rounded-lg text-sm font-semibold hover:bg-[#0A202A] dark:hover:bg-[#00D4D4]/20 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Unlock
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Toast */}
      {toast && (
        <div
          className={`fixed top-4 right-4 z-[100] flex items-center gap-2 px-4 py-3 rounded-lg shadow-lg text-sm font-medium transition-all ${
            toast.type === 'success'
              ? 'bg-teal-50 dark:bg-teal-900/30 text-teal-700 dark:text-teal-400 border border-teal-200 dark:border-teal-800'
              : 'bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-800'
          }`}
        >
          {toast.type === 'success' ? <CheckCircle className="w-4 h-4 shrink-0" /> : <AlertCircle className="w-4 h-4 shrink-0" />}
          {toast.message}
          <button onClick={() => setToast(null)} className="ml-2 hover:opacity-70">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-[#e8eaed]">Protocol Authoring</h1>
            <p className="text-sm text-gray-500 dark:text-[#6b7080] mt-1">
              Create and manage MedBot clinical protocol nodes
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={fetchNodes}
            className="flex items-center gap-2 px-3 py-2 border border-gray-200 dark:border-[#2a2d35] rounded-lg text-sm text-gray-600 dark:text-[#6b7080] hover:bg-gray-50 dark:hover:bg-[#1a1d25] transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            Refresh
          </button>
          <button
            onClick={() => { setEditNodeId(null); setView('create') }}
            className="flex items-center gap-2 px-4 py-2 bg-[#073B4C] text-white rounded-lg text-sm font-semibold hover:bg-[#0A202A] dark:hover:bg-[#00D4D4]/20 transition-colors"
          >
            <Plus className="w-4 h-4" />
            New Protocol
          </button>
          <button
            onClick={handleLock}
            className="flex items-center gap-2 px-3 py-2 border border-gray-200 dark:border-[#2a2d35] rounded-lg text-sm text-gray-500 dark:text-[#525666] hover:bg-gray-50 dark:hover:bg-[#1a1d25] transition-colors"
            title="Lock (clear secret)"
          >
            <Shield className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="flex items-start gap-2 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl">
          <AlertCircle className="w-4 h-4 text-red-500 mt-0.5 shrink-0" />
          <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
        </div>
      )}

      {/* ── List view ── */}
      {view === 'list' && (
        <div className="bg-white dark:bg-[#0f1117] rounded-xl border border-gray-200 dark:border-[#1e2028] overflow-hidden">
          <div className="hidden lg:grid grid-cols-[1fr_1fr_1fr_1.5fr_0.6fr_0.7fr_1fr_1fr_0.5fr] gap-3 px-6 py-4 border-b border-gray-100 dark:border-[#1e2028] text-xs font-semibold text-gray-400 dark:text-[#525666] uppercase tracking-wider">
            <span>Node ID</span>
            <span>Protocol</span>
            <span>Category</span>
            <span>Title</span>
            <span className="text-center">Edges</span>
            <span className="text-center">Embedding</span>
            <span>Updated</span>
            <span>By</span>
            <span className="text-right">Actions</span>
          </div>
          <div className="divide-y divide-gray-100 dark:divide-[#1e2028]">
            {loading ? (
              <div className="px-6 py-12 text-center text-sm text-gray-400 dark:text-[#525666]">Loading...</div>
            ) : nodes.length === 0 ? (
              <div className="px-6 py-12 text-center text-sm text-gray-400 dark:text-[#525666]">
                No protocol nodes yet. Click "New Protocol" to create one.
              </div>
            ) : (
              nodes.map((n) => (
                <div
                  key={n.nodeId}
                  className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-[1fr_1fr_1fr_1.5fr_0.6fr_0.7fr_1fr_1fr_0.5fr] gap-2 lg:gap-3 px-6 py-4 items-center hover:bg-gray-50 dark:hover:bg-[#1a1d25]/50 transition-colors"
                >
                  <span className="text-sm font-mono font-medium text-gray-900 dark:text-[#e8eaed]">{n.nodeId}</span>
                  <span className="text-sm text-gray-600 dark:text-[#6b7080]">{n.protocolId}</span>
                  <span className="text-xs px-2 py-1 rounded-full bg-gray-100 dark:bg-[#1a1d25] text-gray-600 dark:text-[#a0a4ad] font-medium w-fit">
                    {n.category}
                  </span>
                  <span className="text-sm text-gray-700 dark:text-[#cdd0d5] truncate">{n.title}</span>
                  <span className="text-sm text-gray-600 dark:text-[#6b7080] text-center">{n.edgeCount}</span>
                  <span className="flex justify-center">
                    {n.hasEmbedding ? (
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-400">
                        yes
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400">
                        no
                      </span>
                    )}
                  </span>
                  <span className="text-sm text-gray-500 dark:text-[#6b7080]">
                    {new Date(n.updatedAt).toLocaleDateString()}
                  </span>
                  <span className="text-sm text-gray-500 dark:text-[#6b7080] truncate">{n.updatedBy}</span>
                  <div className="flex items-center justify-end gap-1">
                    <button
                      onClick={() => { setEditNodeId(n.nodeId); setView('edit') }}
                      className="p-2 text-gray-400 dark:text-[#525666] hover:text-[#073B4C] dark:hover:text-teal-400 hover:bg-gray-100 dark:hover:bg-[#1a1d25] rounded-lg transition-colors"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setDeleteTarget(n)}
                      className="p-2 text-gray-400 dark:text-[#525666] hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* ── Create / Edit Form (replaces table) ── */}
      {(view === 'create' || view === 'edit') && (
        <div className="bg-white dark:bg-[#0f1117] rounded-xl border border-gray-200 dark:border-[#1e2028] p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-gray-900 dark:text-[#e8eaed]">
              {view === 'create' ? 'New Protocol Node' : `Edit: ${editNodeId}`}
            </h2>
            <button
              onClick={() => setView('list')}
              className="text-sm text-gray-500 dark:text-[#6b7080] hover:text-gray-700 dark:hover:text-[#cdd0d5] transition-colors"
            >
              &larr; Back to list
            </button>
          </div>
          <ProtocolForm
            nodeId={editNodeId}
            onSaved={view === 'create' ? handleCreated : handleUpdated}
            onCancel={() => setView('list')}
            showToast={showToast}
          />
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/50" onClick={() => setDeleteTarget(null)} />
          <div className="relative bg-white dark:bg-[#0f1117] rounded-xl border border-gray-200 dark:border-[#1e2028] p-6 w-full max-w-md shadow-xl">
            <h2 className="text-lg font-bold text-gray-900 dark:text-[#e8eaed] mb-2">Delete Protocol</h2>
            <p className="text-sm text-gray-500 dark:text-[#6b7080] mb-1">
              Are you sure you want to delete this protocol node?
            </p>
            <p className="text-sm font-mono font-medium text-gray-900 dark:text-[#e8eaed] mb-4">
              {deleteTarget.nodeId}
            </p>
            <div className="flex items-center justify-end gap-3">
              <button
                onClick={() => setDeleteTarget(null)}
                className="px-4 py-2 border border-gray-200 dark:border-[#2a2d35] rounded-lg text-sm font-medium text-gray-600 dark:text-[#6b7080] hover:bg-gray-50 dark:hover:bg-[#1a1d25] transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-semibold hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {deleting ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
