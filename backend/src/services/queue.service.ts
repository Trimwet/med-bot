import { Queue, Worker } from "bullmq";
import { env } from "@/config/env";
import { logger } from "@/lib/logger";

let followupQueue: Queue | null = null;
let followupWorker: Worker | null = null;

function getConnection() {
  if (!env.redisUrl) return null;
  // BullMQ accepts Redis connection string directly
  return { url: env.redisUrl };
}

export function getFollowupQueue(): Queue | null {
  if (followupQueue) return followupQueue;
  const connection = getConnection();
  if (!connection) return null;
  followupQueue = new Queue("followup", { connection });
  return followupQueue;
}

export function startFollowupWorker(
  processor: (job: { sessionId: string; userId: string; messageTemplate: string }) => Promise<void>,
): void {
  const connection = getConnection();
  if (!connection) {
    logger.info("Redis not configured, followup worker disabled");
    return;
  }
  if (followupWorker) return;

  followupWorker = new Worker(
    "followup",
    async (job) => {
      const { sessionId, userId, messageTemplate } = job.data;
      await processor({ sessionId, userId, messageTemplate });
    },
    { connection },
  );

  followupWorker.on("completed", (job) => {
    logger.info("followup job completed", { jobId: job.id, sessionId: job.data.sessionId });
  });

  followupWorker.on("failed", (job, err) => {
    logger.error("followup job failed", { jobId: job?.id, error: err.message });
  });

  logger.info("BullMQ followup worker started");
}

export async function stopWorker(): Promise<void> {
  if (followupWorker) {
    await followupWorker.close();
    followupWorker = null;
  }
  if (followupQueue) {
    await followupQueue.close();
    followupQueue = null;
  }
}
