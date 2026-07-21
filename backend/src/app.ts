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
import { tenantAnalyticsRoute } from "@/routes/tenant-analytics.route";
import { notificationRoute } from "@/routes/notification.route";
import voiceRoute from "@/routes/voice.route";
import { demoRoute } from "@/routes/demo.route";
import { toErrorResponse } from "@/lib/errors";
import { sendErrorWebhook } from "@/lib/webhook";
import { logger } from "@/lib/logger";
import { env } from "@/config/env";

export const app = express();


const allowedOrigins = new Set([env.clientUrl, "http://localhost:5173"]);
function isAllowedOrigin(origin: string): boolean {
  if (allowedOrigins.has(origin)) return true;
  // Allow any Vercel preview/branch deployment for this project during testing.
  if (/^https:\/\/[a-z0-9-]+\.vercel\.app$/.test(origin)) return true;
  return false;
}
app.use(cors({ origin: (origin, callback) => callback(null, !origin || isAllowedOrigin(origin)) }));
app.use(express.json({ limit: "32kb" }));

app.use(healthRoute);
app.use(sessionRoute);
app.use(chatRoute);
app.use(authRoute);
app.use(userRoute);
app.use(consentRoute);
app.use(adminRoute);
app.use(tenantRoute);
app.use(analyticsRoute);
app.use(tenantAnalyticsRoute);
app.use(notificationRoute);
app.use(demoRoute);
app.use("/api/voice", voiceRoute);

app.use((err: unknown, req: express.Request, res: express.Response, _next: express.NextFunction) => {
  const { status, body } = toErrorResponse(err);
  logger.error("request error", { message: (err as Error).message, path: req.path });

  // Fire error webhook for server-side failures (5xx)
  if (status >= 500) {
    sendErrorWebhook(err, { path: req.path, method: req.method });
  }

  res.status(status).json(body);
});

export type App = typeof app;
