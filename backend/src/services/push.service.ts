import { getDb, COLLECTIONS } from "@/db/client";
import { logger } from "@/lib/logger";

interface PushSubscription {
  userId: string;
  endpoint: string;
  keys: { p256dh: string; auth: string };
  createdAt: string;
}

export async function savePushSubscription(
  userId: string,
  subscription: { endpoint: string; keys: { p256dh: string; auth: string } }
): Promise<void> {
  const db = await getDb();
  await db.collection<PushSubscription>(COLLECTIONS.pushSubscriptions).updateOne(
    { userId, endpoint: subscription.endpoint },
    { $set: { userId, ...subscription, createdAt: new Date().toISOString() } },
    { upsert: true }
  );
}

export async function removePushSubscription(endpoint: string): Promise<void> {
  const db = await getDb();
  await db.collection<PushSubscription>(COLLECTIONS.pushSubscriptions).deleteOne({ endpoint });
}

export async function sendPushToUser(
  userId: string,
  title: string,
  body: string,
  url?: string
): Promise<void> {
  const db = await getDb();
  const subscriptions = await db
    .collection<PushSubscription>(COLLECTIONS.pushSubscriptions)
    .find({ userId })
    .toArray();

  if (subscriptions.length === 0) return;

  const payload = JSON.stringify({ title, body, url });

  for (const sub of subscriptions) {
    try {
      const res = await fetch(sub.endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/octet-stream",
          TTL: "60",
        },
        body: payload,
      });

      if (res.status === 410 || res.status === 404) {
        await removePushSubscription(sub.endpoint);
      }
    } catch (err) {
      logger.warn("Push send failed", { userId, error: (err as Error).message });
    }
  }
}
