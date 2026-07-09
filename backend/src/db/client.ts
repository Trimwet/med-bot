// MongoDB client — single connection reused across sessions_collection
// and knowledge_collection. Lazily connects and caches the client so
// serverless/edge invocations (Vercel) reuse the connection when warm.

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
  users: "users_collection",
} as const;

export async function closeDb() {
  if (client) {
    await client.close();
    client = null;
    db = null;
  }
}
