// Session service — reads/writes sessions_collection in MongoDB.

import { getDb, COLLECTIONS } from "@/db/client";
import type { SessionDocument, SessionMessage } from "@/db/schema";

export async function getOrCreateSession(
  sessionId: string
): Promise<SessionDocument> {
  const db = await getDb();
  const collection = db.collection<SessionDocument>(COLLECTIONS.sessions);

  const existing = await collection.findOne({ sessionId });
  if (existing) return existing;

  const now = new Date().toISOString();
  const fresh: SessionDocument = {
    sessionId,
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
  message: SessionMessage
): Promise<void> {
  const db = await getDb();
  const collection = db.collection<SessionDocument>(COLLECTIONS.sessions);

  await collection.updateOne(
    { sessionId },
    {
      $push: { messages: message },
      $set: { updatedAt: new Date().toISOString() },
    }
  );
}

export async function updateSessionState(
  sessionId: string,
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

  await collection.updateOne({ sessionId }, { $set: setFields });
}
