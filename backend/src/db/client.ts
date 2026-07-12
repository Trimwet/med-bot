import { MongoClient, type Db } from "mongodb";
import { env } from "@/config/env";
import { logger } from "@/lib/logger";

let client: MongoClient | null = null;
let db: Db | null = null;

export async function getDb(): Promise<Db> {
  if (db) return db;
  client = new MongoClient(env.mongodbUri);
  await client.connect();
  db = client.db(env.mongodbDbName);
  return db;
}

export async function ensureIndexes(): Promise<void> {
  const database = await getDb();

  await Promise.all([
    database.collection("knowledge_collection").createIndex({ nodeId: 1 }, { unique: true }),
    database.collection("knowledge_collection").createIndex({ protocolId: 1 }),
    database.collection("clinical_rules").createIndex({ nodeId: 1 }, { unique: true }),
    database.collection("sessions_collection").createIndex({ userId: 1, sessionId: 1 }),
    database.collection("users_collection").createIndex({ email: 1 }, { sparse: true }),
  ]);

  logger.info("mongodb indexes ensured");
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
} as const;

export async function closeDb() {
  if (client) {
    await client.close();
    client = null;
    db = null;
  }
}
