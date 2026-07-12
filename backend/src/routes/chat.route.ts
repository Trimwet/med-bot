import { Router } from "express";
import { authMiddleware } from "@/middleware/auth.middleware";
import { logger } from "@/lib/logger";
import { getOrCreateSession, appendMessage, updateSessionState } from "@/services/session.service";
import OpenAI from "openai";
import { env } from "@/config/env";

const MAX_MESSAGE_LENGTH = 4_000;
const EMERGENCY_PATTERNS = [
  /chest pain/i,
  /difficulty breathing|can't breathe|cannot breathe|shortness of breath/i,
  /suicid(?:e|al)|kill myself|harm myself/i,
  /unconscious|passed out|fainted/i,
  /stroke|face droop|slurred speech/i,
  /severe bleeding|coughing blood|vomiting blood/i,
];
const EMERGENCY_REPLY =
  "Your symptoms may need urgent attention. Please call 112 in Nigeria now or go to the nearest emergency department. Do not rely on this chat for emergency care.";

const llm = new OpenAI({ apiKey: env.openaiApiKey });

export const chatRoute = Router();

chatRoute.post("/chat", authMiddleware, async (req, res, next) => {
  const { sessionId, message } = req.body;

  if (!sessionId || typeof sessionId !== "string") {
    res.status(400).json({ error: "VALIDATION_ERROR", message: "sessionId is required" });
    return;
  }
  if (!message || typeof message !== "string" || message.trim().length === 0) {
    res.status(400).json({ error: "VALIDATION_ERROR", message: "message is required and must be non-empty" });
    return;
  }
  if (message.length > MAX_MESSAGE_LENGTH) {
    res.status(400).json({ error: "VALIDATION_ERROR", message: `message must be ${MAX_MESSAGE_LENGTH} characters or fewer` });
    return;
  }

  try {
    logger.info("chat turn received", { sessionId });

    const userId = (req as any).user?.id;
    if (!userId) {
      res.status(401).json({ error: "UNAUTHORIZED", message: "A user token is required for chat" });
      return;
    }
    const session = await getOrCreateSession(sessionId, userId);

    const userMsg = { role: "user" as const, content: message, timestamp: new Date().toISOString() };
    await appendMessage(sessionId, userId, userMsg);

    if (EMERGENCY_PATTERNS.some((pattern) => pattern.test(message))) {
      await appendMessage(sessionId, userId, { role: "assistant", content: EMERGENCY_REPLY, timestamp: new Date().toISOString() });
      res.json({ reply: EMERGENCY_REPLY, saved: true, urgency: "emergency" });
      return;
    }

    const recentHistory = session.messages.slice(-12);

    const completion = await llm.chat.completions.create({
      model: env.llmModel,
      temperature: 0.2,
      messages: [
        {
          role: "system",
          content:
            "You are Eve, a cautious AI health-information assistant for Nigeria. Do not diagnose, prescribe, or claim certainty. Ask focused follow-up questions when information is insufficient. If symptoms could be urgent, tell the user to call 112 or seek emergency care immediately. Never downplay chest pain, breathing difficulty, stroke signs, severe bleeding, loss of consciousness, or self-harm. End with a brief statement that this is not a substitute for professional medical care.",
        },
        ...recentHistory.map((m) => ({ role: m.role, content: m.content })),
        { role: "user", content: message },
      ],
    });

    const reply = completion.choices[0]?.message?.content ?? "I'm sorry, I couldn't process that.";

    await appendMessage(sessionId, userId, {
      role: "assistant",
      content: reply,
      timestamp: new Date().toISOString(),
    });

    res.json({ reply, saved: true });
  } catch (err) {
    const fallbackReply =
      "I’m sorry, I’m having trouble reaching my medical guidance service right now. Your message has still been saved for follow-up.";

    try {
      const userId = (req as any).user?.id;
      if (userId) await appendMessage(sessionId, userId, {
        role: "assistant",
        content: fallbackReply,
        timestamp: new Date().toISOString(),
      });
    } catch (persistErr) {
      logger.warn("failed to persist fallback assistant reply", {
        sessionId,
        error: (persistErr as Error).message,
      });
    }

    logger.warn("chat completion failed, returning fallback reply", {
      sessionId,
      error: (err as Error).message,
    });

    res.json({ reply: fallbackReply, saved: true, warning: "llm_unavailable" });
  }
});
