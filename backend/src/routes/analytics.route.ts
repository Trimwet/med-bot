import { Router } from "express";
import { adminMiddleware } from "@/middleware/admin.middleware";
import { getAggregatedUsage, getDailyTokenUsage, getTokenUsageByTenant } from "@/services/tokenLedger.service";
import { listTenants } from "@/services/tenant.service";
import { getDb, COLLECTIONS } from "@/db/client";

export const analyticsRoute = Router();
analyticsRoute.use("/api/v1/analytics", adminMiddleware);

analyticsRoute.get("/api/v1/analytics/tokens", async (req, res, next) => {
  try {
    const { startDate, endDate, tenantId, days } = req.query;

    if (tenantId) {
      if (days) {
        const daily = await getDailyTokenUsage(tenantId as string, Number(days));
        res.json({ daily });
      } else {
        const data = await getTokenUsageByTenant(
          tenantId as string,
          startDate as string | undefined,
          endDate as string | undefined,
        );
        res.json(data);
      }
      return;
    }

    const aggregated = await getAggregatedUsage(
      startDate as string | undefined,
      endDate as string | undefined,
    );
    res.json(aggregated);
  } catch (err) {
    next(err);
  }
});

analyticsRoute.get("/api/v1/analytics/tenants", async (_req, res, next) => {
  try {
    const tenants = await listTenants();
    const db = await getDb();

    const enriched = await Promise.all(
      tenants.map(async (t) => {
        const sessionCount = await db
          .collection(COLLECTIONS.sessions)
          .countDocuments({ tenantId: t._id?.toString() });
        const patientCount = await db
          .collection(COLLECTIONS.patients)
          .countDocuments({ tenantId: t._id?.toString() });
        return {
          id: t._id?.toString(),
          name: t.name,
          tier: t.tier,
          tokenBalance: t.tokenBalance,
          sessionCount,
          patientCount,
          createdAt: t.createdAt,
        };
      }),
    );

    res.json({ tenants: enriched });
  } catch (err) {
    next(err);
  }
});
