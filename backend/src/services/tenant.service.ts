import { ObjectId } from "mongodb";
import { getDb, COLLECTIONS } from "@/db/client";
import type { TenantDocument } from "@/db/schema";

type TenantTier = TenantDocument["tier"];
import { NotFoundError, ValidationError } from "@/lib/errors";
import { logger } from "@/lib/logger";

const TIER_MULTIPLIERS: Record<TenantTier, number> = {
  growth: 2.0,
  enterprise: 1.0,
  b2c: 5.0,
};

const TIER_OVERAGE_MULTIPLIERS: Record<TenantTier, number> = {
  growth: 2.5,
  enterprise: 2.0,
  b2c: 5.0,
};

const MONTHLY_INCLUDED_TOKENS: Record<TenantTier, number> = {
  growth: 50000,
  enterprise: 200000,
  b2c: 0,
};

const PROMPT_RATE_PER_1K = 0.5;
const COMPLETION_RATE_PER_1K = 1.0;

export function getTierMultiplier(tier: TenantTier): number {
  return TIER_MULTIPLIERS[tier] ?? 5.0;
}

export function getOverageMultiplier(tier: TenantTier): number {
  return TIER_OVERAGE_MULTIPLIERS[tier] ?? 5.0;
}

export function computeTokenCost(
  promptTokens: number,
  completionTokens: number,
  multiplier: number,
): number {
  const promptCost = (promptTokens / 1000) * PROMPT_RATE_PER_1K;
  const completionCost = (completionTokens / 1000) * COMPLETION_RATE_PER_1K;
  return (promptCost + completionCost) * multiplier;
}

export async function createTenant(
  name: string,
  tier: TenantTier,
): Promise<TenantDocument> {
  const db = await getDb();
  const existing = await db.collection<TenantDocument>(COLLECTIONS.tenants).findOne({ name });
  if (existing) throw new ValidationError(`Tenant "${name}" already exists`);

  const now = new Date().toISOString();
  const doc: TenantDocument = {
    name,
    tier,
    tokenBalance: 10000,
    subscriptionStartDate: now,
    subscriptionEndDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    whitelabelConfig: {},
    createdAt: now,
  };
  const result = await db.collection<TenantDocument>(COLLECTIONS.tenants).insertOne(doc);
  logger.info("tenant created", { tenantId: result.insertedId.toString(), name, tier });
  return { ...doc, _id: result.insertedId };
}

export async function getTenantById(tenantId: string): Promise<TenantDocument | null> {
  const db = await getDb();
  return db.collection<TenantDocument>(COLLECTIONS.tenants).findOne({ _id: new ObjectId(tenantId) });
}

export async function getTenantByName(name: string): Promise<TenantDocument | null> {
  const db = await getDb();
  return db.collection<TenantDocument>(COLLECTIONS.tenants).findOne({ name });
}

export async function listTenants(): Promise<TenantDocument[]> {
  const db = await getDb();
  return db.collection<TenantDocument>(COLLECTIONS.tenants).find().sort({ createdAt: -1 }).toArray();
}

export async function updateTenant(
  tenantId: string,
  updates: Partial<Pick<TenantDocument, "name" | "tier" | "whitelabelConfig">>,
): Promise<TenantDocument> {
  const db = await getDb();
  const result = await db.collection<TenantDocument>(COLLECTIONS.tenants).findOneAndUpdate(
    { _id: new ObjectId(tenantId) },
    { $set: updates },
    { returnDocument: "after" },
  );
  if (!result) throw new NotFoundError("Tenant not found");
  return result;
}

export async function getEffectiveMultiplier(tenantId: string): Promise<{ multiplier: number; isOverage: boolean }> {
  const tenant = await getTenantById(tenantId);
  if (!tenant) throw new NotFoundError("Tenant not found");

  const now = new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();

  const db = await getDb();
  const pipeline = [
    { $match: { tenantId, timestamp: { $gte: monthStart } } },
    {
      $group: {
        _id: null,
        totalTokens: { $sum: { $add: ["$promptTokens", "$completionTokens"] } },
      },
    },
  ];
  const result = await db.collection(COLLECTIONS.tokenLedger).aggregate(pipeline).toArray();
  const usedTokens: number = (result[0] as { totalTokens: number } | undefined)?.totalTokens ?? 0;
  const included = MONTHLY_INCLUDED_TOKENS[tenant.tier];

  if (usedTokens >= included) {
    return { multiplier: TIER_OVERAGE_MULTIPLIERS[tenant.tier], isOverage: true };
  }
  return { multiplier: TIER_MULTIPLIERS[tenant.tier], isOverage: false };
}

export async function deductTokens(
  tenantId: string,
  amount: number,
): Promise<number> {
  const db = await getDb();
  const result = await db.collection<TenantDocument>(COLLECTIONS.tenants).findOneAndUpdate(
    { _id: new ObjectId(tenantId), tokenBalance: { $gte: amount } },
    { $inc: { tokenBalance: -amount } },
    { returnDocument: "after" },
  );
  if (!result) throw new ValidationError("Insufficient token balance");
  return result.tokenBalance;
}

export async function addTokens(
  tenantId: string,
  amount: number,
): Promise<number> {
  const db = await getDb();
  const result = await db.collection<TenantDocument>(COLLECTIONS.tenants).findOneAndUpdate(
    { _id: new ObjectId(tenantId) },
    { $inc: { tokenBalance: amount } },
    { returnDocument: "after" },
  );
  if (!result) throw new NotFoundError("Tenant not found");
  return result.tokenBalance;
}

export async function getTenantBalance(tenantId: string): Promise<{ balance: number; tier: string }> {
  const tenant = await getTenantById(tenantId);
  if (!tenant) throw new NotFoundError("Tenant not found");
  return { balance: tenant.tokenBalance, tier: tenant.tier };
}

export const TOKEN_PACKAGES = [
  { id: "tokens_10k", tokens: 10000, amountNgn: 5000, label: "10,000 Tokens" },
  { id: "tokens_50k", tokens: 50000, amountNgn: 20000, label: "50,000 Tokens" },
  { id: "tokens_100k", tokens: 100000, amountNgn: 35000, label: "100,000 Tokens" },
  { id: "tokens_500k", tokens: 500000, amountNgn: 150000, label: "500,000 Tokens" },
] as const;

export function findPackageById(packageId: string): (typeof TOKEN_PACKAGES)[number] | undefined {
  return TOKEN_PACKAGES.find((p) => p.id === packageId);
}
