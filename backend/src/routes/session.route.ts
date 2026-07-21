import { Router } from "express";
import { authMiddleware } from "@/middleware/auth.middleware";
import { getSession } from "@/services/session.service";

export const sessionRoute = Router();

sessionRoute.get("/session/:sessionId", authMiddleware, async (req, res, next) => {
  try {
    const userId = (req as any).user?.id;
    if (!userId) throw new Error("Authenticated user is required");
    const session = await getSession(req.params.sessionId, userId);
    if (!session) {
      res.status(404).json({ error: "NOT_FOUND", message: "Session not found" });
      return;
    }
    res.json(session);
  } catch (err) {
    next(err);
  }
});
