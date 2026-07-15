import crypto from "node:crypto";
import { ObjectId } from "mongodb";
import { getDb, COLLECTIONS } from "@/db/client";

const KEY_PREFIX = "mb_";
const KEY_BYTES = 32;

function hashKey(key: string): string {
  return crypto.createHash("sha256").update(key).digest("hex");
}

function generateApiKey(): { raw: string; prefix: string; hash: string } {
  const raw = KEY_PREFIX + crypto.randomBytes(KEY_BYTES).toString("base64url");
  const prefix = raw.slice(0, 10);
  const hash = hashKey(raw);
  return { raw, prefix, hash };
}

export async function createApiKey(
  tenantId: string,
  label: string,
  expiresInDays?: number,
): Promise<{ rawKey: string; key: Record<string, unknown> }> {
  const db = await getDb();
  const { raw, prefix, hash } = generateApiKey();

  const doc = {
    tenantId,
    label,
    keyPrefix: prefix,
    keyHash: hash,
    isActive: true,
    expiresAt: expiresInDays
      ? new Date(Date.now() + expiresInDays * 86400000).toISOString()
      : null,
    createdAt: new Date().toISOString(),
  };

  const result = await db.collection(COLLECTIONS.apiKeys).insertOne(doc);
  return { rawKey: raw, key: { ...doc, _id: result.insertedId.toString() } };
}

export async function listApiKeys(tenantId: string) {
  const db = await getDb();
  return db
    .collection(COLLECTIONS.apiKeys)
    .find(
      { tenantId, isActive: true },
      { projection: { keyHash: 0 } },
    )
    .sort({ createdAt: -1 })
    .toArray();
}

export async function revokeApiKey(tenantId: string, keyId: string) {
  const db = await getDb();
  const result = await db.collection(COLLECTIONS.apiKeys).updateOne(
    { _id: new ObjectId(keyId), tenantId },
    { $set: { isActive: false } },
  );
  return result.modifiedCount > 0;
}

export async function validateApiKey(rawKey: string): Promise<string | null> {
  if (!rawKey.startsWith(KEY_PREFIX)) return null;
  const hash = hashKey(rawKey);
  const db = await getDb();
  const key = await db.collection(COLLECTIONS.apiKeys).findOne({
    keyHash: hash,
    isActive: true,
    $or: [
      { expiresAt: null },
      { expiresAt: { $gt: new Date().toISOString() } },
    ],
  });
  if (!key) return null;
  await db.collection(COLLECTIONS.apiKeys).updateOne(
    { _id: key._id },
    { $set: { lastUsedAt: new Date().toISOString() } },
  );
  return key.tenantId;
}
