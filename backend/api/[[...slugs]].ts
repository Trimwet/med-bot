// Vercel Edge Function adapter for the Elysia app.
// Elysia's `.fetch` handler is a standard Request -> Response function,
// which is exactly what Vercel's Edge Runtime expects.

import { app } from "@/app";

export const config = { runtime: "edge" };

export default app.fetch;
