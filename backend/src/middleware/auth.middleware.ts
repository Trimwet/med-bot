import type { Request, Response, NextFunction } from "express";
import { env } from "@/config/env";
import { UnauthorizedError } from "@/lib/errors";
import { getUserById, verifyJwtToken } from "@/services/auth.service";

export async function authMiddleware(req: Request, _res: Response, next: NextFunction) {
  try {
    const provided = req.headers["x-core-secret"];
    if (provided && provided === env.coreSecret) {
      return next();
    }

    const authorization = req.headers.authorization;
    if (authorization?.startsWith("Bearer ")) {
      const token = authorization.slice(7).trim();
      const userId = verifyJwtToken(token);
      const user = await getUserById(userId);
      if (!user) {
        throw new UnauthorizedError("Invalid or expired token");
      }
      (req as any).user = {
        id: user._id?.toString() ?? userId,
        email: user.email,
        name: user.name,
        isVerified: user.isVerified,
        tenantId: user.tenantId,
      };
      return next();
    }

    throw new UnauthorizedError("Missing or invalid x-core-secret header or bearer token");
  } catch (err) {
    next(err);
  }
}
