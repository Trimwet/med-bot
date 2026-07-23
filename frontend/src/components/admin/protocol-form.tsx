import { useState, useEffect } from 'react'
import { Plus, Trash2, AlertCircle } from 'lucide-react'
import {
  listCategories,
  getProtocol,
  createProtocol,
  updateProtocol,
  type AdminApiError,
} from '@/lib/adminApi'

interface Props {
  nodeId: string | null
  onSaved: (nodeId: string) => void
  onCancel: () => void
  showToast: (type: 'success' | 'error', message: string) => void
}

interface EdgeEntry {
  toNodeId: string
  label: string
}

export const ProtocolForm = ({ nodeId, onSaved, onCancel, showToast }: Props) => {
  const [categories, setCategories] = useState<string[]>([])
  const [loadingMeta, setLoadingMeta] = useState(true)
  const [loadingEdit, setLoadingEdit] = useState(!!nodeId)
  const [submitting, setSubmitting] = useState(false)
  const [errors, setErrors] = useState<string[]>([])

  const [form, setForm] = useState({
    nodeId: '',
    protocolId: '',
    protocolVersion: '1.0',
    category: 'general',
    subcategory: '',
    title: '',
    content: '',
    activationThreshold: 0.7,
    updatedBy: 'medbot-admin',
  })

  const [triageQuestions, setTriageQuestions] = useState<string[]>([''])
  const [redFlags, setRedFlags] = useState<string[]>([''])
  const [severityScale, setSeverityScale] = useState<Record<string, string>>({
    '1-3': '',
    '4-6': '',
    '7-10': '',
  })
  const [edges, setEdges] = useState<EdgeEntry[]>([{ toNodeId: '', label: '' }])

  useEffect(() => {
    listCategories()
      .then(({ categories }) => setCategories(categories))
      .catch(() => {})
      .finally(() => setLoadingMeta(false))
  }, [])

  useEffect(() => {
    if (!nodeId) return
    setLoadingEdit(true)
    getProtocol(nodeId)
      .then(({ node }) => {
        setForm({
          nodeId: node.nodeId,
          protocolId: node.protocolId,
          protocolVersion: node.protocolVersion || '1.0',
          category: node.category,
          subcategory: node.subcategory || '',
          title: node.title,
          content: node.content,
          activationThreshold: node.activationThreshold ?? 0.7,
          updatedBy: node.updatedBy || 'medbot-admin',
        })
        setTriageQuestions(
          node.metadata.triageQuestions && node.metadata.triageQuestions.length > 0
            ? node.metadata.triageQuestions
            : ['']
        )
        setRedFlags(
          node.metadata.redFlags && node.metadata.redFlags.length > 0
            ? node.metadata.redFlags
            : ['']
        )
        setSeverityScale({
          '1-3': node.metadata.severityScale?.['1-3'] ?? '',
          '4-6': node.metadata.severityScale?.['4-6'] ?? '',
          '7-10': node.metadata.severityScale?.['7-10'] ?? '',
        })
        setEdges(
          node.edges && node.edges.length > 0
            ? node.edges.map((e) => ({ toNodeId: e.toNodeId, label: e.label }))
            : [{ toNodeId: '', label: '' }]
        )
      })
      .catch(() => showToast('error', 'Failed to load protocol for editing'))
      .finally(() => setLoadingEdit(false))
  }, [nodeId, showToast])

  const updateForm = (key: string, value: string | number) =>
    setForm((prev) => ({ ...prev, [key]: value }))

  const updateList = (
    setter: React.Dispatch<React.SetStateAction<string[]>>,
    index: number,
    value: string
  ) =>
    setter((prev) => {
      const next = [...prev]
      next[index] = value
      return next
    })

  const addListItem = (setter: React.Dispatch<React.SetStateAction<string[]>>) =>
    setter((prev) => [...prev, ''])

  const removeListItem = (setter: React.Dispatch<React.SetStateAction<string[]>>, index: number) =>
    setter((prev) => prev.filter((_, i) => i !== index))

  const updateEdge = (index: number, field: keyof EdgeEntry, value: string) =>
    setEdges((prev) => {
      const next = [...prev]
      next[index] = { ...next[index], [field]: value }
      return next
    })

  const addEdge = () => setEdges((prev) => [...prev, { toNodeId: '', label: '' }])

  const removeEdge = (index: number) =>
    setEdges((prev) => prev.filter((_, i) => i !== index))

  const validate = (): string[] => {
    const errs: string[] = []
    if (!form.nodeId.trim()) errs.push('nodeId is required')
    else if (!/^[a-z0-9_]+\.[a-z0-9_]+$/i.test(form.nodeId.trim()))
      errs.push('nodeId must look like "protocol_id.step_name"')
    if (!form.protocolId.trim()) errs.push('protocolId is required')
    if (!form.title.trim()) errs.push('title is required')
    if (!form.content.trim()) errs.push('content is required')
    if (form.activationThreshold < 0 || form.activationThreshold > 1)
      errs.push('activationThreshold must be between 0 and 1')
    if (!categories.includes(form.category))
      errs.push(`category must be one of: ${categories.join(', ')}`)
    for (const [i, e] of edges.entries()) {
      if ((e.toNodeId || e.label) && (!e.toNodeId || !e.label))
        errs.push(`edge ${i + 1}: both toNodeId and label are required`)
    }
    return errs
  }

  const handleSubmit = async () => {
    const errs = validate()
    setErrors(errs)
    if (errs.length > 0) return

    setSubmitting(true)
    try {
      const input = {
        nodeId: form.nodeId.trim(),
        protocolId: form.protocolId.trim(),
        protocolVersion: form.protocolVersion || '1.0',
        category: form.category,
        subcategory: form.subcategory.trim() || undefined,
        title: form.title.trim(),
        content: form.content.trim(),
        activationThreshold: form.activationThreshold,
        triageQuestions: triageQuestions.filter(Boolean),
        redFlags: redFlags.filter(Boolean),
        severityScale: Object.fromEntries(
          Object.entries(severityScale).filter(([, v]) => v)
        ),
        edges: edges.filter((e) => e.toNodeId && e.label),
        updatedBy: form.updatedBy.trim() || 'medbot-admin',
      }

      if (nodeId) {
        await updateProtocol(nodeId, input)
      } else {
        await createProtocol(input)
      }
      onSaved(input.nodeId)
    } catch (err) {
      const e = err as AdminApiError
      setErrors([e.message || 'Failed to save protocol'])
    } finally {
      setSubmitting(false)
    }
  }

  if (loadingMeta || loadingEdit) {
    return (
      <div className="space-y-6 max-w-3xl animate-pulse">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="space-y-2">
              <div className="h-4 bg-gray-100 dark:bg-[#1a1d25] rounded w-24" />
              <div className="h-10 bg-gray-100 dark:bg-[#1a1d25] rounded-lg w-full" />
            </div>
          ))}
        </div>
        <div className="space-y-2">
          <div className="h-4 bg-gray-100 dark:bg-[#1a1d25] rounded w-20" />
          <div className="h-24 bg-gray-100 dark:bg-[#1a1d25] rounded-lg w-full" />
        </div>
        <div className="space-y-2">
          <div className="h-4 bg-gray-100 dark:bg-[#1a1d25] rounded w-28" />
          <div className="h-32 bg-gray-100 dark:bg-[#1a1d25] rounded-lg w-full" />
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6 max-w-3xl">
      {/* Validation errors */}
      {errors.length > 0 && (
        <div className="flex items-start gap-2 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl">
          <AlertCircle className="w-4 h-4 text-red-500 mt-0.5 shrink-0" />
          <ul className="text-sm text-red-600 dark:text-red-400 space-y-0.5">
            {errors.map((e, i) => (
              <li key={i}>{e}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Basic fields */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-[#a0a4ad] mb-1">nodeId *</label>
          <input
            type="text"
            value={form.nodeId}
            onChange={(e) => updateForm('nodeId', e.target.value)}
            placeholder="e.g. malaria.step_1"
            disabled={!!nodeId}
            className="w-full px-3 py-2.5 bg-gray-50 dark:bg-[#1a1d25] border border-gray-200 dark:border-[#2a2d35] rounded-lg text-sm text-gray-900 dark:text-[#e8eaed] placeholder-gray-400 dark:placeholder-[#525666] focus:outline-none focus:ring-2 focus:ring-[#073B4C]/30 disabled:opacity-50 transition-colors"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-[#a0a4ad] mb-1">protocolId *</label>
          <input
            type="text"
            value={form.protocolId}
            onChange={(e) => updateForm('protocolId', e.target.value)}
            placeholder="e.g. malaria"
            className="w-full px-3 py-2.5 bg-gray-50 dark:bg-[#1a1d25] border border-gray-200 dark:border-[#2a2d35] rounded-lg text-sm text-gray-900 dark:text-[#e8eaed] placeholder-gray-400 dark:placeholder-[#525666] focus:outline-none focus:ring-2 focus:ring-[#073B4C]/30 transition-colors"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-[#a0a4ad] mb-1">protocolVersion</label>
          <input
            type="text"
            value={form.protocolVersion}
            onChange={(e) => updateForm('protocolVersion', e.target.value)}
            placeholder="1.0"
            className="w-full px-3 py-2.5 bg-gray-50 dark:bg-[#1a1d25] border border-gray-200 dark:border-[#2a2d35] rounded-lg text-sm text-gray-900 dark:text-[#e8eaed] placeholder-gray-400 dark:placeholder-[#525666] focus:outline-none focus:ring-2 focus:ring-[#073B4C]/30 transition-colors"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-[#a0a4ad] mb-1">category *</label>
          <select
            value={form.category}
            onChange={(e) => updateForm('category', e.target.value)}
            className="w-full px-3 py-2.5 bg-gray-50 dark:bg-[#1a1d25] border border-gray-200 dark:border-[#2a2d35] rounded-lg text-sm text-gray-900 dark:text-[#e8eaed] focus:outline-none focus:ring-2 focus:ring-[#073B4C]/30 transition-colors"
          >
            {categories.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-[#a0a4ad] mb-1">subcategory</label>
          <input
            type="text"
            value={form.subcategory}
            onChange={(e) => updateForm('subcategory', e.target.value)}
            placeholder="e.g. fever"
            className="w-full px-3 py-2.5 bg-gray-50 dark:bg-[#1a1d25] border border-gray-200 dark:border-[#2a2d35] rounded-lg text-sm text-gray-900 dark:text-[#e8eaed] placeholder-gray-400 dark:placeholder-[#525666] focus:outline-none focus:ring-2 focus:ring-[#073B4C]/30 transition-colors"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-[#a0a4ad] mb-1">activationThreshold (0–1)</label>
          <input
            type="number"
            step="0.01"
            min="0"
            max="1"
            value={form.activationThreshold}
            onChange={(e) => updateForm('activationThreshold', parseFloat(e.target.value) || 0)}
            className="w-full px-3 py-2.5 bg-gray-50 dark:bg-[#1a1d25] border border-gray-200 dark:border-[#2a2d35] rounded-lg text-sm text-gray-900 dark:text-[#e8eaed] placeholder-gray-400 dark:placeholder-[#525666] focus:outline-none focus:ring-2 focus:ring-[#073B4C]/30 transition-colors"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-[#a0a4ad] mb-1">updatedBy *</label>
          <input
            type="text"
            value={form.updatedBy}
            onChange={(e) => updateForm('updatedBy', e.target.value)}
            placeholder="Dr. Name (role)"
            className="w-full px-3 py-2.5 bg-gray-50 dark:bg-[#1a1d25] border border-gray-200 dark:border-[#2a2d35] rounded-lg text-sm text-gray-900 dark:text-[#e8eaed] placeholder-gray-400 dark:placeholder-[#525666] focus:outline-none focus:ring-2 focus:ring-[#073B4C]/30 transition-colors"
          />
        </div>
      </div>

      {/* title */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-[#a0a4ad] mb-1">title *</label>
        <input
          type="text"
          value={form.title}
          onChange={(e) => updateForm('title', e.target.value)}
          placeholder="Fever — Initial Assessment"
          className="w-full px-3 py-2.5 bg-gray-50 dark:bg-[#1a1d25] border border-gray-200 dark:border-[#2a2d35] rounded-lg text-sm text-gray-900 dark:text-[#e8eaed] placeholder-gray-400 dark:placeholder-[#525666] focus:outline-none focus:ring-2 focus:ring-[#073B4C]/30 transition-colors"
        />
      </div>

      {/* content */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-[#a0a4ad] mb-1">content *</label>
        <textarea
          rows={8}
          value={form.content}
          onChange={(e) => updateForm('content', e.target.value)}
          placeholder="Assessment protocol content in markdown..."
          className="w-full px-3 py-2.5 bg-gray-50 dark:bg-[#1a1d25] border border-gray-200 dark:border-[#2a2d35] rounded-lg text-sm text-gray-900 dark:text-[#e8eaed] placeholder-gray-400 dark:placeholder-[#525666] focus:outline-none focus:ring-2 focus:ring-[#073B4C]/30 font-mono transition-colors"
        />
      </div>

      {/* triageQuestions */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-[#a0a4ad] mb-1">Triage Questions</label>
        <div className="space-y-2">
          {triageQuestions.map((q, i) => (
            <div key={i} className="flex items-center gap-2">
              <input
                type="text"
                value={q}
                onChange={(e) => updateList(setTriageQuestions, i, e.target.value)}
                placeholder={`Question ${i + 1}`}
                className="flex-1 px-3 py-2 bg-gray-50 dark:bg-[#1a1d25] border border-gray-200 dark:border-[#2a2d35] rounded-lg text-sm text-gray-900 dark:text-[#e8eaed] placeholder-gray-400 dark:placeholder-[#525666] focus:outline-none focus:ring-2 focus:ring-[#073B4C]/30 transition-colors"
              />
              {triageQuestions.length > 1 && (
                <button onClick={() => removeListItem(setTriageQuestions, i)} className="p-1.5 text-gray-400 dark:text-[#525666] hover:text-red-500 transition-colors">
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
          ))}
        </div>
        <button onClick={() => addListItem(setTriageQuestions)} className="mt-2 flex items-center gap-1 text-xs font-medium text-[#073B4C] dark:text-teal-400 hover:underline">
          <Plus className="w-3 h-3" /> Add Question
        </button>
      </div>

      {/* redFlags */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-[#a0a4ad] mb-1">Red Flags</label>
        <div className="space-y-2">
          {redFlags.map((f, i) => (
            <div key={i} className="flex items-center gap-2">
              <input
                type="text"
                value={f}
                onChange={(e) => updateList(setRedFlags, i, e.target.value)}
                placeholder={`Red flag ${i + 1}`}
                className="flex-1 px-3 py-2 bg-gray-50 dark:bg-[#1a1d25] border border-gray-200 dark:border-[#2a2d35] rounded-lg text-sm text-gray-900 dark:text-[#e8eaed] placeholder-gray-400 dark:placeholder-[#525666] focus:outline-none focus:ring-2 focus:ring-[#073B4C]/30 transition-colors"
              />
              {redFlags.length > 1 && (
                <button onClick={() => removeListItem(setRedFlags, i)} className="p-1.5 text-gray-400 dark:text-[#525666] hover:text-red-500 transition-colors">
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
          ))}
        </div>
        <button onClick={() => addListItem(setRedFlags)} className="mt-2 flex items-center gap-1 text-xs font-medium text-[#073B4C] dark:text-teal-400 hover:underline">
          <Plus className="w-3 h-3" /> Add Red Flag
        </button>
      </div>

      {/* severityScale */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-[#a0a4ad] mb-1">Severity Scale</label>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {Object.entries(severityScale).map(([range, desc]) => (
            <div key={range}>
              <label className="block text-xs text-gray-500 dark:text-[#525666] mb-0.5">{range}</label>
              <input
                type="text"
                value={desc}
                onChange={(e) => setSeverityScale((prev) => ({ ...prev, [range]: e.target.value }))}
                placeholder="Description"
                className="w-full px-3 py-2 bg-gray-50 dark:bg-[#1a1d25] border border-gray-200 dark:border-[#2a2d35] rounded-lg text-sm text-gray-900 dark:text-[#e8eaed] placeholder-gray-400 dark:placeholder-[#525666] focus:outline-none focus:ring-2 focus:ring-[#073B4C]/30 transition-colors"
              />
            </div>
          ))}
        </div>
      </div>

      {/* edges */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-[#a0a4ad] mb-1">Edges</label>
        <div className="space-y-2">
          {edges.map((e, i) => (
            <div key={i} className="flex items-center gap-2">
              <input
                type="text"
                value={e.toNodeId}
                onChange={(e_) => updateEdge(i, 'toNodeId', e_.target.value)}
                placeholder="toNodeId (e.g. fever.step_2_severe)"
                className="flex-1 px-3 py-2 bg-gray-50 dark:bg-[#1a1d25] border border-gray-200 dark:border-[#2a2d35] rounded-lg text-sm text-gray-900 dark:text-[#e8eaed] placeholder-gray-400 dark:placeholder-[#525666] focus:outline-none focus:ring-2 focus:ring-[#073B4C]/30 transition-colors"
              />
              <input
                type="text"
                value={e.label}
                onChange={(e_) => updateEdge(i, 'label', e_.target.value)}
                placeholder="label"
                className="flex-[0.8] px-3 py-2 bg-gray-50 dark:bg-[#1a1d25] border border-gray-200 dark:border-[#2a2d35] rounded-lg text-sm text-gray-900 dark:text-[#e8eaed] placeholder-gray-400 dark:placeholder-[#525666] focus:outline-none focus:ring-2 focus:ring-[#073B4C]/30 transition-colors"
              />
              {edges.length > 1 && (
                <button onClick={() => removeEdge(i)} className="p-1.5 text-gray-400 dark:text-[#525666] hover:text-red-500 transition-colors">
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
          ))}
        </div>
        <button onClick={addEdge} className="mt-2 flex items-center gap-1 text-xs font-medium text-[#073B4C] dark:text-teal-400 hover:underline">
          <Plus className="w-3 h-3" /> Add Edge
        </button>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100 dark:border-[#1e2028]">
        <button
          onClick={onCancel}
          className="px-4 py-2 border border-gray-200 dark:border-[#2a2d35] rounded-lg text-sm font-medium text-gray-600 dark:text-[#6b7080] hover:bg-gray-50 dark:hover:bg-[#1a1d25] transition-colors"
        >
          Cancel
        </button>
        <button
          onClick={handleSubmit}
          disabled={submitting}
          className="px-6 py-2 bg-[#073B4C] text-white rounded-lg text-sm font-semibold hover:bg-[#0A202A] dark:hover:bg-[#00D4D4]/20 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {submitting ? 'Saving...' : nodeId ? 'Update Protocol' : 'Create Protocol'}
        </button>
      </div>
    </div>
  )
}
