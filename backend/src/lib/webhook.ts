import { env } from "@/config/env";
import { logger } from "@/lib/logger";

interface WebhookPayload {
  error: string;
  message: string;
  context?: Record<string, unknown>;
  timestamp: string;
  environment: string;
}

export async function sendErrorWebhook(error: unknown, context?: Record<string, unknown>): Promise<void> {
  if (!env.errorWebhookUrl) return;

  const payload: WebhookPayload = {
    error: (error as Error)?.name || "UnknownError",
    message: (error as Error)?.message || "An unknown error occurred",
    context,
    timestamp: new Date().toISOString(),
    environment: env.nodeEnv,
  };

  try {
    const response = await fetch(env.errorWebhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(5000),
    });

    if (!response.ok) {
      logger.warn("error webhook returned non-200", { status: response.status });
    }
  } catch (err) {
    logger.warn("failed to send error webhook", { error: (err as Error).message });
  }
}
