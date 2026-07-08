// Local dev entry point: bun run src/index.ts

import { app } from "@/app";
import { env } from "@/config/env";
import { logger } from "@/lib/logger";

app.listen(env.port, () => {
  logger.info(`MedBot backend listening on port ${env.port}`);
});
