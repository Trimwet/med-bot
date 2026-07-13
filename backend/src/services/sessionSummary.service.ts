import { getDb, COLLECTIONS } from "@/db/client";
import type { SessionSummaryDocument, SessionDocument } from "@/db/schema";
import { embedText } from "@/services/embeddings.service";
import { logger } from "@/lib/logger";

function cosineSimilarity(a: number[], b: number[]): number {
  let dot = 0, magA = 0, magB = 0;
  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i];
    magA += a[i] * a[i];
    magB += b[i] * b[i];
  }
  const denom = Math.sqrt(magA) * Math.sqrt(magB);
  return denom === 0 ? 0 : dot / denom;
}

export async function saveSessionSummary(
  sessionId: string,
  userId: string,
  tenantId: string | undefined,
  session: SessionDocument,
): Promise<void> {
  // Build a concise summary from the session
  const verdict = session.verdict ?? "unknown";
  const messageCount = session.messages?.length ?? 0;
  const firstMsg = session.messages?.find((m) => m.role === "user")?.content ?? "";
  const lastAssistant = [...(session.messages ?? [])].reverse().find((m) => m.role === "assistant")?.content ?? "";

  const summaryText = [
    `Verdict: ${verdict}`,
    `Complaint: ${firstMsg.slice(0, 200)}`,
    `Outcome: ${lastAssistant.slice(0, 200)}`,
    `Node: ${session.activeNodeId ?? "none"}`,
  ].join(" | ");

  let embedding: number[] = [];
  try {
    embedding = await embedText(summaryText);
  } catch {
    logger.warn("embedding unavailable for session summary, saving without it");
  }

  const db = await getDb();
  await db.collection<SessionSummaryDocument>(COLLECTIONS.sessionSummaries).insertOne({
    sessionId,
    patientId: userId,
    tenantId,
    summaryText,
    embedding,
    createdAt: new Date().toISOString(),
  });

  logger.info("session summary saved", { sessionId, userId, verdict });
}

export async function findRelevantHistory(
  userId: string,
  currentMessage: string,
  limit = 3,
): Promise<{ summaryText: string; score: number }[]> {
  const db = await getDb();
  const summaries = await db
    .collection<SessionSummaryDocument>(COLLECTIONS.sessionSummaries)
    .find({ patientId: userId })
    .sort({ createdAt: -1 })
    .limit(20)
    .toArray();

  if (summaries.length === 0) return [];

  let queryEmbedding: number[] = [];
  try {
    queryEmbedding = await embedText(currentMessage);
  } catch {
    return summaries.slice(0, limit).map((s) => ({ summaryText: s.summaryText, score: 0 }));
  }

  const scored = summaries
    .map((s) => ({
      summaryText: s.summaryText,
      score: s.embedding.length > 0 ? cosineSimilarity(queryEmbedding, s.embedding) : 0,
    }))
    .filter((s) => s.score > 0.5)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);

  return scored;
}
