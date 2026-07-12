import { app } from "@/app";
import { env } from "@/config/env";
import { logger } from "@/lib/logger";
import { ensureIndexes } from "@/db/client";

async function main() {
  await ensureIndexes();
  app.listen(env.port, () => {
    logger.info(`MedBot backend listening on port ${env.port}`);
  });
}

main().catch((err) => {
  logger.error("failed to start server", { error: (err as Error).message });
  process.exit(1);
});
