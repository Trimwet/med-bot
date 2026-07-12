import { Router } from "express";
import { authMiddleware } from "@/middleware/auth.middleware";
import { hasConsented, grantConsent, revokeConsent } from "@/services/consent.service";

export const consentRoute = Router();

consentRoute.get("/consent", authMiddleware, async (req, res, next) => {
  try {
    const userId = (req as any).user?.id;
    if (!userId) {
      res.status(401).json({ error: "UNAUTHORIZED", message: "Authentication required" });
      return;
    }
    const consented = await hasConsented(userId);
    res.json({ consented, consentGivenAt: consented ? "present" : null });
  } catch (err) {
    next(err);
  }
});

consentRoute.post("/consent", authMiddleware, async (req, res, next) => {
  try {
    const userId = (req as any).user?.id;
    if (!userId) {
      res.status(401).json({ error: "UNAUTHORIZED", message: "Authentication required" });
      return;
    }
    await grantConsent(userId);
    res.json({ consented: true, message: "Consent recorded successfully" });
  } catch (err) {
    next(err);
  }
});

consentRoute.delete("/consent", authMiddleware, async (req, res, next) => {
  try {
    const userId = (req as any).user?.id;
    if (!userId) {
      res.status(401).json({ error: "UNAUTHORIZED", message: "Authentication required" });
      return;
    }
    await revokeConsent(userId);
    res.json({ consented: false, message: "Consent revoked. All health data processing has been stopped." });
  } catch (err) {
    next(err);
  }
});
