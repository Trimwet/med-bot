// Trusted-agent bypass auth middleware (pattern reused from TADA VTU's
// x-core-secret approach). Requests must present the shared secret in
// the x-core-secret header.

import { Elysia } from "elysia";
import { env } from "@/config/env";
import { UnauthorizedError } from "@/lib/errors";

export const authMiddleware = new Elysia().derive(({ headers }) => {
  const provided = headers["x-core-secret"];
  if (!provided || provided !== env.coreSecret) {
    throw new UnauthorizedError("Missing or invalid x-core-secret header");
  }
  return {};
});
