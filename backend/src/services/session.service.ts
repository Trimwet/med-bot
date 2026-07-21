import { getDb, COLLECTIONS } from "@/db/client";
import type { SessionDocument, SessionMessage } from "@/db/schema";
import { ObjectId } from "mongodb";

export interface SessionListEntry {
  sessionId: string;
  activeNodeId?: string;
  verdict?: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  messageCount: number;
  firstMessage?: string;
  summary?: string;
}

export async function listUserSessions(
  userId: string,
  options: { status?: string; limit?: number; offset?: number } = {}
): Promise<{ sessions: SessionListEntry[]; total: number }> {
  const db = await getDb();
  const collection = db.collection<SessionDocument>(COLLECTIONS.sessions);
  const { status, limit = 50, offset = 0 } = options;

  const query: Record<string, unknown> = { userId };
  if (status) query.status = status;

  const [docs, total] = await Promise.all([
    collection
      .find(query)
      .sort({ updatedAt: -1 })
      .skip(offset)
      .limit(limit)
      .toArray(),
    collection.countDocuments(query),
  ]);

  return {
    sessions: docs.map((d) => ({
      sessionId: d.sessionId,
      activeNodeId: d.activeNodeId,
      verdict: d.verdict,
      status: d.status,
      createdAt: d.createdAt,
      updatedAt: d.updatedAt,
      messageCount: d.messages?.length ?? 0,
      firstMessage: d.messages?.find((m) => m.role === "user")?.content,
      summary: d.summary,
    })),
    total,
  };
}

export async function deleteSession(sessionId: string, userId: string): Promise<void> {
  const db = await getDb();
  const collection = db.collection<SessionDocument>(COLLECTIONS.sessions);
  const result = await collection.deleteOne({ sessionId, userId });
  if (result.deletedCount === 0) {
    throw new Error("Session not found or already deleted");
  }
}

/** Fetch an existing session without creating one as a side effect. */
export async function getSession(sessionId: string, userId: string): Promise<SessionDocument | null> {
  const db = await getDb();
  return db.collection<SessionDocument>(COLLECTIONS.sessions).findOne({ sessionId, userId });
}

export async function getOrCreateSession(
  sessionId: string,
  userId: string,
  tenantId?: string,
): Promise<SessionDocument> {
  const db = await getDb();
  const collection = db.collection<SessionDocument>(COLLECTIONS.sessions);

  const existing = await collection.findOne({ sessionId, userId });
  if (existing) return existing;

  const now = new Date().toISOString();
  const fresh: SessionDocument = {
    sessionId,
    userId,
    tenantId,
    channel: "web",
    status: "in_progress",
    userProfile: {},
    state: {},
    messages: [],
    createdAt: now,
    updatedAt: now,
  };

  await collection.insertOne(fresh);
  return fresh;
}

export async function appendMessage(
  sessionId: string,
  userId: string,
  message: SessionMessage
): Promise<void> {
  const db = await getDb();
  const collection = db.collection<SessionDocument>(COLLECTIONS.sessions);

  await collection.updateOne(
    { sessionId, userId },
    {
      $push: { messages: message },
      $set: { updatedAt: new Date().toISOString() },
    },
    { upsert: false }
  );
}

export async function updateSessionState(
  sessionId: string,
  userId: string,
  state: Partial<SessionDocument["state"]>
): Promise<void> {
  const db = await getDb();
  const collection = db.collection<SessionDocument>(COLLECTIONS.sessions);

  const setFields: Record<string, unknown> = {
    updatedAt: new Date().toISOString(),
  };
  for (const [key, value] of Object.entries(state)) {
    setFields[`state.${key}`] = value;
  }
  await collection.updateOne({ sessionId, userId }, { $set: setFields });
}

export async function updateSessionGraphState(
  sessionId: string,
  userId: string,
  updates: {
    activeNodeId?: string;
    lastFiringScore?: number;
    protocolVersion?: string;
    verdict?: string;
    status?: string;
    extractedAnswers?: SessionDocument["extractedAnswers"];
  }
): Promise<void> {
  const db = await getDb();
  const collection = db.collection<SessionDocument>(COLLECTIONS.sessions);

  const setFields: Record<string, unknown> = {
    updatedAt: new Date().toISOString(),
  };
  if (updates.activeNodeId !== undefined) setFields.activeNodeId = updates.activeNodeId;
  if (updates.lastFiringScore !== undefined) setFields.lastFiringScore = updates.lastFiringScore;
  if (updates.protocolVersion !== undefined) setFields.protocolVersion = updates.protocolVersion;
  if (updates.verdict !== undefined) setFields.verdict = updates.verdict;
  if (updates.status !== undefined) setFields.status = updates.status;
  if (updates.extractedAnswers !== undefined) setFields.extractedAnswers = updates.extractedAnswers;

  await collection.updateOne({ sessionId, userId }, { $set: setFields });
}
