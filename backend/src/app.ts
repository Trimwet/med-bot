// Main Elysia app assembly, exported for both local `bun run` and the
// Vercel edge adapter.

import { Elysia } from "elysia";
import { healthRoute } from "@/routes/health.route";
import { sessionRoute } from "@/routes/session.route";
import { chatRoute } from "@/routes/chat.route";
import { toErrorResponse } from "@/lib/errors";
import { logger } from "@/lib/logger";

export const app = new Elysia()
  .onError(({ error, set }) => {
    const { status, body } = toErrorResponse(error);
    set.status = status;
    logger.error("request error", { message: (error as Error).message });
    return body;
  })
  .use(healthRoute)
  .use(sessionRoute)
  .use(chatRoute);

export type App = typeof app;
