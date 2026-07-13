// Gate for internal/clinical admin endpoints (protocol authoring dashboard).
//
// There's no per-user "doctor" role in the schema yet — UserDocument only
// tracks isVerified. Rather than fake a role system, this reuses the same
// x-core-secret pattern already used for server-to-server calls elsewhere
// in the codebase (see auth.middleware.ts). In practice: the admin
// dashboard is deployed separately (or behind its own login) and is
// configured with this secret, the same way an internal tool would be.
//
// TODO(next iteration): once there are multiple clinicians with individual
// logins, replace this with a real `role: "admin" | "clinician" | "patient"`
// field on UserDocument and a per-user check instead of a shared secret.

import type { Request, Response, NextFunction } from "express";
import { env } from "@/config/env";
import { UnauthorizedError } from "@/lib/errors";

export function adminMiddleware(req: Request, _res: Response, next: NextFunction) {
  const provided = req.headers["x-core-secret"];
  if (provided && provided === env.coreSecret) {
    return next();
  }
  next(new UnauthorizedError("Admin access requires a valid x-core-secret header"));
}
