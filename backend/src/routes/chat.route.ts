// Chat route — main entry point patients talk to Eve through.

import { Elysia, t } from "elysia";
import { authMiddleware } from "@/middleware/auth.middleware";
import { runEveTurn } from "@/agent/eve";
import { logger } from "@/lib/logger";

export const chatRoute = new Elysia()
  .use(authMiddleware)
  .post(
    "/chat",
    async ({ body }) => {
      const { sessionId, message } = body;
      logger.info("chat turn received", { sessionId });
      const result = await runEveTurn(sessionId, message);
      return result;
    },
    {
      body: t.Object({
        sessionId: t.String(),
        message: t.String({ minLength: 1 }),
      }),
    }
  );
