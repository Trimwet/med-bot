import { Router } from "express";
import { AppError } from "@/lib/errors";
import { authMiddleware } from "@/middleware/auth.middleware";
import { getUserProfile, updateUserProfile } from "@/services/user.service";
import { exportUserData } from "@/services/user.service";

export const userRoute = Router();

userRoute.get("/api/users/me/profile", authMiddleware, async (req, res, next) => {
  try {
    const userId = (req as any).user?.id;
    if (!userId) {
      throw new AppError("Unauthorized", 401, "UNAUTHORIZED");
    }
    const profile = await getUserProfile(userId);
    res.json({ profile });
  } catch (err) {
    next(err);
  }
});

userRoute.put("/api/users/me/profile", authMiddleware, async (req, res, next) => {
  try {
    const userId = (req as any).user?.id;
    if (!userId) {
      throw new AppError("Unauthorized", 401, "UNAUTHORIZED");
    }
    const profile = await updateUserProfile(userId, req.body);
    res.json({ message: "Profile updated successfully", profile });
  } catch (err) {
    next(err);
  }
});

userRoute.get("/api/users/me/export", authMiddleware, async (req, res, next) => {
  try {
    const userId = (req as any).user?.id;
    if (!userId) {
      throw new AppError("Unauthorized", 401, "UNAUTHORIZED");
    }
    const data = await exportUserData(userId);
    res.setHeader("Content-Type", "application/json");
    res.setHeader("Content-Disposition", "attachment; filename=\"medbot-data.json\"");
    res.json(data);
  } catch (err) {
    next(err);
  }
});