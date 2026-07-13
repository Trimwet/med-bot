import { app } from "@/app";
import { env } from "@/config/env";
import { logger } from "@/lib/logger";
import { ensureIndexes } from "@/db/client";
import { startFollowupWorker } from "@/services/queue.service";
import { sendFollowupEmail } from "../agents/triage/tools/scheduleFollowup";

async function main() {
  await ensureIndexes();

  // Start BullMQ worker if Redis is configured
  startFollowupWorker(async (job) => {
    await sendFollowupEmail(job.userId, job.messageTemplate);
  });

  app.listen(env.port, () => {
    logger.info(`MedBot backend listening on port ${env.port}`);
  });
}

main().catch((err) => {
  logger.error("failed to start server", { error: (err as Error).message });
  process.exit(1);
});
