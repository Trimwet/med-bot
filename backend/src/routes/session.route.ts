import { Router } from "express";
import { authMiddleware } from "@/middleware/auth.middleware";
import { getOrCreateSession } from "@/services/session.service";

export const sessionRoute = Router();

sessionRoute.get("/session/:sessionId", authMiddleware, async (req, res, next) => {
  try {
    const session = await getOrCreateSession(req.params.sessionId);
    res.json(session);
  } catch (err) {
    next(err);
  }
});
