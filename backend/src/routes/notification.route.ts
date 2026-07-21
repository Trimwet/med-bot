import { Router } from "express";
import { AppError } from "@/lib/errors";
import { authMiddleware } from "@/middleware/auth.middleware";
import { savePushSubscription, removePushSubscription } from "@/services/push.service";
import { getNotificationPrefs, updateNotificationPrefs } from "@/services/notification.service";

export const notificationRoute = Router();

notificationRoute.post("/api/notifications/push/subscribe", authMiddleware, async (req, res, next) => {
  try {
    const userId = (req as any).user?.id;
    if (!userId) throw new AppError("Unauthorized", 401, "UNAUTHORIZED");
    const { endpoint, keys } = req.body;
    if (!endpoint || !keys) throw new AppError("Invalid subscription", 400, "INVALID_INPUT");
    await savePushSubscription(userId, { endpoint, keys });
    res.json({ message: "Push subscription saved" });
  } catch (err) {
    next(err);
  }
});

notificationRoute.post("/api/notifications/push/unsubscribe", authMiddleware, async (req, res, next) => {
  try {
    const { endpoint } = req.body;
    if (!endpoint) throw new AppError("Endpoint required", 400, "INVALID_INPUT");
    await removePushSubscription(endpoint);
    res.json({ message: "Push subscription removed" });
  } catch (err) {
    next(err);
  }
});

notificationRoute.get("/api/notifications/preferences", authMiddleware, async (req, res, next) => {
  try {
    const userId = (req as any).user?.id;
    if (!userId) throw new AppError("Unauthorized", 401, "UNAUTHORIZED");
    const prefs = await getNotificationPrefs(userId);
    res.json({ preferences: prefs });
  } catch (err) {
    next(err);
  }
});

notificationRoute.put("/api/notifications/preferences", authMiddleware, async (req, res, next) => {
  try {
    const userId = (req as any).user?.id;
    if (!userId) throw new AppError("Unauthorized", 401, "UNAUTHORIZED");
    await updateNotificationPrefs(userId, req.body);
    res.json({ message: "Preferences updated" });
  } catch (err) {
    next(err);
  }
});
