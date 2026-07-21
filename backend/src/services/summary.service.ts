import { env } from "@/config/env";
import { logger } from "@/lib/logger";
import { getDb, COLLECTIONS } from "@/db/client";
import type { SessionDocument } from "@/db/schema";

/**
 * Generate a short, patient-friendly chat summary using Groq.
 * Called once when a triage session reaches a verdict.
 */
export async function generateSessionSummary(
  sessionId: string,
  userId: string,
  messages: { role: string; content: string }[]
): Promise<void> {
  if (!env.groqApiKey) {
    logger.warn("GROQ_API_KEY not set, skipping summary generation");
    return;
  }

  const userMessages = messages
    .filter((m) => m.role === "user")
    .map((m) => m.content)
    .join("\n");

  if (!userMessages.trim()) return;

  try {
    const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${env.groqApiKey}`,
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: [
          {
            role: "system",
            content: `You are a medical triage summarizer. Given a patient's chat messages, write a concise 1-sentence summary (max 60 words) of their chief complaint and key symptoms. Use plain language. Do not include diagnosis, medication advice, or verdict. Example: "Patient reported persistent headaches and mild fever for 3 days, worse in the mornings."`,
          },
          {
            role: "user",
            content: `Patient messages:\n${userMessages}`,
          },
        ],
        temperature: 0.3,
        max_tokens: 80,
      }),
    });

    if (!res.ok) {
      logger.warn("Groq summary request failed", { status: res.status });
      return;
    }

    const data = await res.json() as any;
    const summary = data.choices?.[0]?.message?.content?.trim();
    if (!summary) return;

    const db = await getDb();
    await db
      .collection<SessionDocument>(COLLECTIONS.sessions)
      .updateOne({ sessionId, userId }, { $set: { summary } });

    logger.info("Session summary generated", { sessionId });
  } catch (err) {
    logger.warn("Summary generation failed", { sessionId, error: (err as Error).message });
  }
}
