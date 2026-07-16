const STORAGE_KEY = 'medbot-recent-sessions'
const MAX_SESSIONS = 20

export interface RecentSession {
  sessionId: string
  firstMessage: string
  timestamp: number
  messageCount: number
  messages: { sender: 'user' | 'assistant'; text: string }[]
}

export function getRecentSessions(): RecentSession[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const sessions: RecentSession[] = JSON.parse(raw)
    return sessions.sort((a, b) => b.timestamp - a.timestamp)
  } catch {
    return []
  }
}

export function saveRecentSession(session: RecentSession) {
  try {
    const sessions = getRecentSessions()
    const existing = sessions.findIndex(s => s.sessionId === session.sessionId)
    if (existing >= 0) {
      sessions[existing] = session
    } else {
      sessions.unshift(session)
    }
    const trimmed = sessions.slice(0, MAX_SESSIONS)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(trimmed))
    window.dispatchEvent(new Event('recent-sessions-updated'))
  } catch {}
}

export function getRecentSession(sessionId: string): RecentSession | undefined {
  return getRecentSessions().find(s => s.sessionId === sessionId)
}

export function removeRecentSession(sessionId: string) {
  try {
    const sessions = getRecentSessions().filter(s => s.sessionId !== sessionId)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions))
    window.dispatchEvent(new Event('recent-sessions-updated'))
  } catch {}
}
