import { MongoClient, type Db } from "mongodb";
import { env } from "@/config/env";
import { logger } from "@/lib/logger";
import dns from "dns";

// Use Google DNS for SRV record resolution (Atlas free tier doesn't use
// all DNS providers, and some Windows networks block SRV lookups).
dns.setServers(["8.8.8.8", "8.8.4.4"]);

let client: MongoClient | null = null;
let db: Db | null = null;

export async function getDb(): Promise<Db> {
  if (db) return db;
  client = new MongoClient(env.mongodbUri, {
    tls: true,
    serverSelectionTimeoutMS: 30000,
    family: 4,
  });
  await client.connect();
  db = client.db(env.mongodbDbName);
  return db;
}

export async function ensureIndexes(): Promise<void> {
  const database = await getDb();
  await migrateLegacyTenants(database);

  await Promise.all([
    database.collection("knowledge_collection").createIndex({ nodeId: 1 }, { unique: true }),
    database.collection("knowledge_collection").createIndex({ protocolId: 1 }),
    database.collection("clinical_rules").createIndex({ nodeId: 1 }, { unique: true }),
    database.collection("sessions_collection").createIndex({ userId: 1, sessionId: 1 }),
    database.collection("users_collection").createIndex({ email: 1 }, { sparse: true }),
    database.collection("tenants").createIndex({ name: 1 }, { unique: true }),
    database.collection("tenants").createIndex({ slug: 1 }, { unique: true, sparse: true }),
    database.collection("sessions_collection").createIndex({ tenantId: 1, sessionId: 1 }),
    database.collection("tenants").createIndex({ tier: 1 }),
    database.collection("token_ledger").createIndex({ tenantId: 1, timestamp: -1 }),
    database.collection("token_ledger").createIndex({ tenantId: 1, sessionId: 1 }),
    database.collection("patients").createIndex({ retainUntil: 1 }, { expireAfterSeconds: 0 }),
    database.collection("followup_jobs").createIndex({ dedupeKey: 1 }, { unique: true }),
    database.collection("demo_sessions").createIndex({ demoId: 1 }, { unique: true }),
    database.collection("demo_sessions").createIndex({ expiresAt: 1 }, { expireAfterSeconds: 0 }),
  ]);

  logger.info("mongodb indexes ensured");
}

/** Keep pre-B2B2C tenant records usable after the entitlement fields were introduced. */
async function migrateLegacyTenants(database: Db): Promise<void> {
  const tenants = await database.collection("tenants").find({
    $or: [{ entitlements: { $exists: false } }, { slug: { $exists: false } }, { status: { $exists: false } }],
  }).toArray();
  await Promise.all(tenants.map((tenant) => {
    const suffix = tenant._id.toString().slice(-6);
    const base = String(tenant.name || "organization").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "organization";
    return database.collection("tenants").updateOne(
      { _id: tenant._id },
      {
        $set: {
          slug: tenant.slug || `${base}-${suffix}`,
          status: tenant.status || "active",
          plan: tenant.plan || "starter",
          entitlements: tenant.entitlements || { monthlyAssessmentLimit: 500, assessmentsUsed: 0, overagePriceNgn: 200, enabledChannels: ["web", "embed"], apiEnabled: false },
          webhookConfig: tenant.webhookConfig || { events: [] },
        },
      },
    );
  }));
}

export const COLLECTIONS = {
  sessions: "sessions_collection",
  knowledge: "knowledge_collection",
  clinicalRules: "clinical_rules",
  tenants: "tenants",
  patients: "patients",
  sessionSummaries: "session_summaries",
  tokenLedger: "token_ledger",
  followupJobs: "followup_jobs",
  users: "users_collection",
  apiKeys: "api_keys",
  demoSessions: "demo_sessions",
  pushSubscriptions: "push_subscriptions",
  notificationPrefs: "notification_preferences",
} as const;

export async function closeDb() {
  if (client) {
    await client.close();
    client = null;
    db = null;
  }
}
