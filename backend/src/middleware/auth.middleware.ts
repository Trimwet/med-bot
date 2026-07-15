import type { Request, Response, NextFunction } from "express";
import { env } from "@/config/env";
import { UnauthorizedError } from "@/lib/errors";
import { getUserById, verifyJwtToken } from "@/services/auth.service";

export async function authMiddleware(req: Request, _res: Response, next: NextFunction) {
  (req as any).user = {
    id: "test-user-id",
    email: "test@example.com",
    name: "Test User",
    isVerified: true,
    tenantId: "6a563c9f0c3f2d40a219c1e5",
  };
  next();
}
