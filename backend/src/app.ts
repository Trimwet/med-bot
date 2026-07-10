import express from "express";
import cors from "cors";
import { healthRoute } from "@/routes/health.route";
import { sessionRoute } from "@/routes/session.route";
import { chatRoute } from "@/routes/chat.route";
import { authRoute } from "@/routes/auth.route";
import { userRoute } from "@/routes/user.route";
import { toErrorResponse } from "@/lib/errors";
import { logger } from "@/lib/logger";

export const app = express();


app.use(cors());
app.use(express.json());

app.use(healthRoute);
app.use(sessionRoute);
app.use(chatRoute);
app.use(authRoute);
app.use(userRoute);

app.use((err: unknown, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  const { status, body } = toErrorResponse(err);
  logger.error("request error", { message: (err as Error).message });
  res.status(status).json(body);
});

export type App = typeof app;
