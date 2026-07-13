import { getDb, COLLECTIONS } from "@/db/client";
import type { TokenLedgerDocument } from "@/db/schema";
import { logger } from "@/lib/logger";

export interface TokenUsageRecord {
  tenantId: string;
  sessionId: string;
  promptTokens: number;
  completionTokens: number;
  multiplierApplied: number;
  costNgn: number;
}

export async function recordTokenUsage(record: TokenUsageRecord): Promise<void> {
  const db = await getDb();
  const doc: TokenLedgerDocument = {
    tenantId: record.tenantId,
    sessionId: record.sessionId,
    promptTokens: record.promptTokens,
    completionTokens: record.completionTokens,
    multiplierApplied: record.multiplierApplied,
    costNgn: record.costNgn,
    timestamp: new Date().toISOString(),
  };
  await db.collection<TokenLedgerDocument>(COLLECTIONS.tokenLedger).insertOne(doc);
}

export async function getTokenUsageByTenant(
  tenantId: string,
  startDate?: string,
  endDate?: string,
): Promise<{ totalPromptTokens: number; totalCompletionTokens: number; totalCostNgn: number; entries: TokenLedgerDocument[] }> {
  const db = await getDb();
  const filter: Record<string, unknown> = { tenantId };
  if (startDate || endDate) {
    const timestampFilter: Record<string, string> = {};
    if (startDate) timestampFilter.$gte = startDate;
    if (endDate) timestampFilter.$lte = endDate;
    filter.timestamp = timestampFilter;
  }
  const entries = await db
    .collection<TokenLedgerDocument>(COLLECTIONS.tokenLedger)
    .find(filter)
    .sort({ timestamp: -1 })
    .limit(500)
    .toArray();

  const totals = entries.reduce(
    (acc, e) => ({
      totalPromptTokens: acc.totalPromptTokens + e.promptTokens,
      totalCompletionTokens: acc.totalCompletionTokens + e.completionTokens,
      totalCostNgn: acc.totalCostNgn + e.costNgn,
    }),
    { totalPromptTokens: 0, totalCompletionTokens: 0, totalCostNgn: 0 },
  );

  return { ...totals, entries };
}

export async function getDailyTokenUsage(
  tenantId: string,
  days: number = 30,
): Promise<{ date: string; promptTokens: number; completionTokens: number; costNgn: number }[]> {
  const db = await getDb();
  const startDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString();

  const entries = await db
    .collection<TokenLedgerDocument>(COLLECTIONS.tokenLedger)
    .find({ tenantId, timestamp: { $gte: startDate } })
    .sort({ timestamp: 1 })
    .toArray();

  const dailyMap = new Map<string, { promptTokens: number; completionTokens: number; costNgn: number }>();
  for (const entry of entries) {
    const date = entry.timestamp.slice(0, 10);
    const existing = dailyMap.get(date) || { promptTokens: 0, completionTokens: 0, costNgn: 0 };
    existing.promptTokens += entry.promptTokens;
    existing.completionTokens += entry.completionTokens;
    existing.costNgn += entry.costNgn;
    dailyMap.set(date, existing);
  }

  return Array.from(dailyMap.entries()).map(([date, data]) => ({
    date,
    ...data,
  }));
}

export async function getAggregatedUsage(
  startDate?: string,
  endDate?: string,
): Promise<{
  totalPromptTokens: number;
  totalCompletionTokens: number;
  totalCostNgn: number;
  byTenant: Array<{ tenantId: string; promptTokens: number; completionTokens: number; costNgn: number }>;
}> {
  const db = await getDb();
  const filter: Record<string, unknown> = {};
  if (startDate || endDate) {
    const timestampFilter: Record<string, string> = {};
    if (startDate) timestampFilter.$gte = startDate;
    if (endDate) timestampFilter.$lte = endDate;
    filter.timestamp = timestampFilter;
  }

  const entries = await db
    .collection<TokenLedgerDocument>(COLLECTIONS.tokenLedger)
    .find(filter)
    .toArray();

  const byTenantMap = new Map<string, { promptTokens: number; completionTokens: number; costNgn: number }>();
  let totalPromptTokens = 0;
  let totalCompletionTokens = 0;
  let totalCostNgn = 0;

  for (const entry of entries) {
    totalPromptTokens += entry.promptTokens;
    totalCompletionTokens += entry.completionTokens;
    totalCostNgn += entry.costNgn;

    const existing = byTenantMap.get(entry.tenantId) || { promptTokens: 0, completionTokens: 0, costNgn: 0 };
    existing.promptTokens += entry.promptTokens;
    existing.completionTokens += entry.completionTokens;
    existing.costNgn += entry.costNgn;
    byTenantMap.set(entry.tenantId, existing);
  }

  return {
    totalPromptTokens,
    totalCompletionTokens,
    totalCostNgn,
    byTenant: Array.from(byTenantMap.entries()).map(([tenantId, data]) => ({ tenantId, ...data })),
  };
}
