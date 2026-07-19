import type { Request, Response, NextFunction } from "express";
import { UnauthorizedError } from "@/lib/errors";
import { verifyJwtToken, getUserById } from "@/services/auth.service";

export async function authMiddleware(req: Request, _res: Response, next: NextFunction) {
  try {
    const auth = req.headers.authorization;
    if (!auth?.startsWith("Bearer ")) {
      next(new UnauthorizedError("Missing or invalid authorization header"));
      return;
    }

    const token = auth.slice(7);
    let userId: string;
    try {
      userId = verifyJwtToken(token);
    } catch {
      next(new UnauthorizedError("Invalid or expired token"));
      return;
    }

    const user = await getUserById(userId);
    if (!user) {
      next(new UnauthorizedError("User not found"));
      return;
    }

    (req as any).user = {
      id: user._id!.toString(),
      email: user.email,
      name: user.name,
      isVerified: user.isVerified,
      tenantId: user.tenantId,
    };

    next();
  } catch (err) {
    next(err);
  }
}
