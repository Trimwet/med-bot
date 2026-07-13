const API_URL = (import.meta.env.VITE_API_URL as string | undefined) ?? ''

let _secret: string | null = null

export function setAdminSecret(secret: string) {
  _secret = secret
}

export function getAdminSecret(): string | null {
  return _secret
}

export function clearAdminSecret() {
  _secret = null
}

export class AdminApiError extends Error {
  status: number
  code?: string

  constructor(message: string, status: number, code?: string) {
    super(message)
    this.status = status
    this.code = code
  }
}

async function adminRequest<T>(path: string, options: RequestInit = {}): Promise<T> {
  if (!_secret) throw new AdminApiError('Admin secret not set', 401)
  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      'x-core-secret': _secret,
      ...(options.headers || {}),
    },
  })
  if (res.status === 204) return undefined as T
  const data = await res.json().catch(() => ({}))
  if (!res.ok) {
    throw new AdminApiError(data.message || 'Admin request failed', res.status, data.code)
  }
  return data as T
}

export interface ProtocolNodeSummary {
  nodeId: string
  protocolId: string
  category: string
  title: string
  edgeCount: number
  hasEmbedding: boolean
  updatedAt: string
  updatedBy: string
}

export interface KnowledgeDocument {
  _id?: string
  nodeId: string
  protocolId: string
  protocolVersion: string
  category: string
  subcategory?: string
  title: string
  content: string
  embedding: number[]
  activationThreshold: number
  edges: { toNodeId: string; label: string; triggerEmbedding?: number[] }[]
  metadata: {
    triageQuestions?: string[]
    severityScale?: Record<string, string>
    redFlags?: string[]
    sourceFile: string
  }
  updatedAt: string
  updatedBy: string
}

export interface ProtocolNodeInput {
  nodeId: string
  protocolId: string
  protocolVersion?: string
  category: string
  subcategory?: string
  title: string
  content: string
  activationThreshold?: number
  triageQuestions?: string[]
  severityScale?: Record<string, string>
  redFlags?: string[]
  edges?: { toNodeId: string; label: string }[]
  updatedBy: string
}

export function listCategories() {
  return adminRequest<{ categories: string[] }>('/api/admin/protocol-categories')
}

export function listProtocols() {
  return adminRequest<{ nodes: ProtocolNodeSummary[] }>('/api/admin/protocols')
}

export function getProtocol(nodeId: string) {
  return adminRequest<{ node: KnowledgeDocument }>(`/api/admin/protocols/${encodeURIComponent(nodeId)}`)
}

export function createProtocol(input: ProtocolNodeInput) {
  return adminRequest<{ node: KnowledgeDocument }>('/api/admin/protocols', {
    method: 'POST',
    body: JSON.stringify(input),
  })
}

export function updateProtocol(nodeId: string, input: ProtocolNodeInput) {
  return adminRequest<{ node: KnowledgeDocument }>(`/api/admin/protocols/${encodeURIComponent(nodeId)}`, {
    method: 'PUT',
    body: JSON.stringify(input),
  })
}

export function deleteProtocol(nodeId: string) {
  return adminRequest<void>(`/api/admin/protocols/${encodeURIComponent(nodeId)}`, {
    method: 'DELETE',
  })
}
