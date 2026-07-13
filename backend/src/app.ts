import express from "express";
import cors from "cors";
import { healthRoute } from "@/routes/health.route";
import { sessionRoute } from "@/routes/session.route";
import { chatRoute } from "@/routes/chat.route";
import { authRoute } from "@/routes/auth.route";
import { userRoute } from "@/routes/user.route";
import { consentRoute } from "@/routes/consent.route";
import { adminRoute } from "@/routes/admin.route";
import { tenantRoute } from "@/routes/tenant.route";
import { analyticsRoute } from "@/routes/analytics.route";
import { toErrorResponse } from "@/lib/errors";
import { logger } from "@/lib/logger";
import { env } from "@/config/env";

export const app = express();


const allowedOrigins = new Set([env.clientUrl, "http://localhost:5173"]);
app.use(cors({ origin: (origin, callback) => callback(null, !origin || allowedOrigins.has(origin)) }));
app.use(express.json({ limit: "32kb" }));

app.use(healthRoute);
app.use(sessionRoute);
app.use(chatRoute);
app.use(authRoute);
app.use(userRoute);
app.use(consentRoute);
app.use(adminRoute);

app.use((err: unknown, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  const { status, body } = toErrorResponse(err);
  logger.error("request error", { message: (err as Error).message });
  res.status(status).json(body);
});

export type App = typeof app;
