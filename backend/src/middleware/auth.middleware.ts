// Trusted-agent bypass auth middleware (pattern reused from TADA VTU's
// x-core-secret approach). Requests must present the shared secret in
// the x-core-secret header or a valid bearer JWT.

import { Elysia } from "elysia";
import { env } from "@/config/env";
import { UnauthorizedError } from "@/lib/errors";
import { getUserById, verifyJwtToken } from "@/services/auth.service";

export const authMiddleware = new Elysia().derive(async ({ headers }) => {
  const provided = headers["x-core-secret"];
  if (provided && provided === env.coreSecret) {
    return {};
  }

  const authorization = headers.authorization;
  if (authorization?.startsWith("Bearer ")) {
    const token = authorization.slice(7).trim();
    try {
      const userId = verifyJwtToken(token);
      const user = await getUserById(userId);
      if (!user) {
        throw new UnauthorizedError("Invalid or expired token");
      }
      return {
        user: {
          id: user._id?.toString() ?? userId,
          email: user.email,
          name: user.name,
          isVerified: user.isVerified,
        },
      };
    } catch {
      throw new UnauthorizedError("Invalid or expired token");
    }
  }

  throw new UnauthorizedError("Missing or invalid x-core-secret header or bearer token");
});
