import { getDb, COLLECTIONS } from "@/db/client";
import type { SessionDocument, SessionMessage } from "@/db/schema";

export async function getOrCreateSession(
  sessionId: string,
  userId: string,
): Promise<SessionDocument> {
  const db = await getDb();
  const collection = db.collection<SessionDocument>(COLLECTIONS.sessions);

  const existing = await collection.findOne({ sessionId, userId });
  if (existing) return existing;

  const now = new Date().toISOString();
  const fresh: SessionDocument = {
    sessionId,
    userId,
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
