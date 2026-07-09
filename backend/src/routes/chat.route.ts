import { Router } from "express";
import { authMiddleware } from "@/middleware/auth.middleware";
import { runEveTurn } from "@/agent/eve";
import { logger } from "@/lib/logger";

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
    const result = await runEveTurn(sessionId, message);
    res.json(result);
  } catch (err) {
    next(err);
  }
});
