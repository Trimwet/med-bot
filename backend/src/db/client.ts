import { MongoClient, type Db } from "mongodb";
import { env } from "@/config/env";

let client: MongoClient | null = null;
let db: Db | null = null;

export async function getDb(): Promise<Db> {
  if (db) return db;
  client = new MongoClient(env.mongodbUri);
  await client.connect();
  db = client.db(env.mongodbDbName);
  return db;
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
