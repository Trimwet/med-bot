// Health check route — no auth required, used by Vercel/uptime monitors.

import { Elysia } from "elysia";

export const healthRoute = new Elysia().get("/health", () => ({
  status: "ok",
  timestamp: new Date().toISOString(),
}));
