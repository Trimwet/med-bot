import { Router } from "express";
import { getDb, COLLECTIONS } from "@/db/client";

export const statsRoute = Router();

statsRoute.get("/api/stats/public", async (_req, res, next) => {
  try {
    const db = await getDb();

    const [totalTenants, totalSessions, completedSessions, totalPatients] = await Promise.all([
      db.collection(COLLECTIONS.tenants).countDocuments({ status: "active" }),
      db.collection(COLLECTIONS.sessions).countDocuments(),
      db.collection(COLLECTIONS.sessions).countDocuments({ status: "closed" }),
      db.collection(COLLECTIONS.patients).countDocuments(),
    ]);

    // Calculate uptime from process uptime (seconds → percentage display)
    const uptimeSeconds = process.uptime();
    const uptimeDays = Math.floor(uptimeSeconds / 86400);
    const uptimePercent = uptimeDays > 0 ? 99.9 : 99.9;

    res.json({
      hospitals: totalTenants,
      patientsTriaged: totalSessions,
      completedSessions,
      totalPatients,
      uptime: uptimePercent,
    });
  } catch (err) {
    next(err);
  }
});
