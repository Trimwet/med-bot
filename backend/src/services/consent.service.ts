// Consent service — NDPR consent management.
// Every user must explicitly consent before any health data is collected.

import { getDb, COLLECTIONS } from "@/db/client";
import type { UserDocument } from "@/db/schema";
import { ObjectId } from "mongodb";

export async function hasConsented(userId: string): Promise<boolean> {
  const db = await getDb();
  const user = await db.collection<UserDocument>(COLLECTIONS.users).findOne(
    { _id: new ObjectId(userId) },
    { projection: { consentGivenAt: 1 } }
  );
  return !!user?.consentGivenAt;
}

export async function grantConsent(userId: string): Promise<void> {
  const db = await getDb();
  await db.collection<UserDocument>(COLLECTIONS.users).updateOne(
    { _id: new ObjectId(userId) },
    { $set: { consentGivenAt: new Date().toISOString(), updatedAt: new Date().toISOString() } }
  );
}

export async function revokeConsent(userId: string): Promise<void> {
  const db = await getDb();
  await db.collection<UserDocument>(COLLECTIONS.users).updateOne(
    { _id: new ObjectId(userId) },
    { $unset: { consentGivenAt: "" }, $set: { updatedAt: new Date().toISOString() } }
  );
}
