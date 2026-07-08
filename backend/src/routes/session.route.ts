// Session route — fetch session state/history.

import { Elysia, t } from "elysia";
import { authMiddleware } from "@/middleware/auth.middleware";
import { getOrCreateSession } from "@/services/session.service";

export const sessionRoute = new Elysia()
  .use(authMiddleware)
  .get(
    "/session/:sessionId",
    async ({ params }) => {
      const session = await getOrCreateSession(params.sessionId);
      return session;
    },
    {
      params: t.Object({ sessionId: t.String() }),
    }
  );
