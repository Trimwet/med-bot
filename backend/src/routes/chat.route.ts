import { Router } from "express";
import { authMiddleware } from "@/middleware/auth.middleware";
import { logger } from "@/lib/logger";
import { getOrCreateSession, appendMessage, updateSessionState } from "@/services/session.service";
import OpenAI from "openai";
import { env } from "@/config/env";

const llm = new OpenAI({ apiKey: env.openaiApiKey });

export const chatRoute = Router();

chatRoute.post("/chat", authMiddleware, async (req, res, next) => {
  try {
    const { sessionId, message } = req.body;

    if (!sessionId || typeof sessionId !== "string") {
      res.status(400).json({ error: "VALIDATION_ERROR", message: "sessionId is required" });
      return;
    }
    if (!message || typeof message !== "string" || message.trim().length === 0) {
      res.status(400).json({ error: "VALIDATION_ERROR", message: "message is required and must be non-empty" });
      return;
    }

    logger.info("chat turn received", { sessionId });

    const session = await getOrCreateSession(sessionId);

    const userMsg = { role: "user" as const, content: message, timestamp: new Date().toISOString() };
    await appendMessage(sessionId, userMsg);

    const recentHistory = session.messages.slice(-12);

    const completion = await llm.chat.completions.create({
      model: env.llmModel,
      temperature: 0.2,
      messages: [
        {
          role: "system",
          content:
            "You are Eve, an AI medical triage assistant. Follow clinical protocols. Be concise and clear. Always state that this is not a substitute for professional medical advice. For emergencies, advise calling 112.",
        },
        ...recentHistory.map((m) => ({ role: m.role, content: m.content })),
        { role: "user", content: message },
      ],
    });

    const reply = completion.choices[0]?.message?.content ?? "I'm sorry, I couldn't process that.";

    await appendMessage(sessionId, {
      role: "assistant",
      content: reply,
      timestamp: new Date().toISOString(),
    });

    res.json({ reply });
  } catch (err) {
    next(err);
  }
});
