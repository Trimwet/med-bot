// Admin routes for the protocol-authoring dashboard. Not patient-facing —
// gated by adminMiddleware. This is what turns "a developer manually
// writes a markdown file and runs a script" into "a doctor fills out a
// form and clicks save."

import { Router } from "express";
import { adminMiddleware } from "@/middleware/admin.middleware";
import { logger } from "@/lib/logger";
import { getDb, COLLECTIONS } from "@/db/client";
import {
  upsertProtocolNode,
  listProtocolNodes,
  getProtocolNode,
  deleteProtocolNode,
  listCategories,
  type ProtocolNodeInput,
} from "@/services/protocolAdmin.service";

export const adminRoute = Router();

adminRoute.use("/api/admin", adminMiddleware);

// Categories the dashboard's dropdown should offer.
adminRoute.get("/api/admin/protocol-categories", (_req, res) => {
  res.json({ categories: listCategories() });
});

// List all protocol nodes (table view).
adminRoute.get("/api/admin/protocols", async (_req, res, next) => {
  try {
    const nodes = await listProtocolNodes();
    res.json({ nodes });
  } catch (err) {
    next(err);
  }
});

// Fetch one node for editing.
adminRoute.get("/api/admin/protocols/:nodeId", async (req, res, next) => {
  try {
    const node = await getProtocolNode(req.params.nodeId);
    res.json({ node });
  } catch (err) {
    next(err);
  }
});

// Create or fully update a node. Embeddings are generated server-side —
// the doctor only ever submits plain text.
adminRoute.post("/api/admin/protocols", async (req, res, next) => {
  try {
    const input = req.body as ProtocolNodeInput;
    const updatedBy = input.updatedBy || (req.headers["x-admin-name"] as string) || "medbot-admin";
    const saved = await upsertProtocolNode({ ...input, updatedBy });
    logger.info("protocol saved via admin API", { nodeId: saved.nodeId });
    res.status(201).json({ node: saved });
  } catch (err) {
    next(err);
  }
});

// Same as POST — kept for clients that prefer PUT semantics on a known nodeId.
adminRoute.put("/api/admin/protocols/:nodeId", async (req, res, next) => {
  try {
    const input = req.body as ProtocolNodeInput;
    const updatedBy = input.updatedBy || (req.headers["x-admin-name"] as string) || "medbot-admin";
    const saved = await upsertProtocolNode({ ...input, nodeId: req.params.nodeId, updatedBy });
    res.json({ node: saved });
  } catch (err) {
    next(err);
  }
});

adminRoute.delete("/api/admin/protocols/:nodeId", async (req, res, next) => {
  try {
    await deleteProtocolNode(req.params.nodeId);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
});

// ── Dashboard Stats ─────────────────────────────────────────────────

adminRoute.get("/api/admin/stats", async (_req, res, next) => {
  try {
    const db = await getDb();

    const [
      totalSessions,
      activeSessions,
      completedSessions,
      emergencySessions,
      totalUsers,
      totalProtocols,
      totalRules,
    ] = await Promise.all([
      db.collection(COLLECTIONS.sessions).countDocuments(),
      db.collection(COLLECTIONS.sessions).countDocuments({ status: "in_progress" }),
      db.collection(COLLECTIONS.sessions).countDocuments({ status: "closed" }),
      db.collection(COLLECTIONS.sessions).countDocuments({ verdict: "emergency" }),
      db.collection(COLLECTIONS.users).countDocuments(),
      db.collection(COLLECTIONS.knowledge).countDocuments(),
      db.collection(COLLECTIONS.clinicalRules).countDocuments(),
    ]);

    const verdictBreakdown = await db
      .collection(COLLECTIONS.sessions)
      .aggregate([
        { $match: { verdict: { $exists: true, $ne: null } } },
        { $group: { _id: "$verdict", count: { $sum: 1 } } },
      ])
      .toArray();

    const recentSessions = await db
      .collection(COLLECTIONS.sessions)
      .find({}, { projection: { sessionId: 1, userId: 1, verdict: 1, status: 1, createdAt: 1 } })
      .sort({ createdAt: -1 })
      .limit(10)
      .toArray();

    res.json({
      totalSessions,
      activeSessions,
      completedSessions,
      emergencySessions,
      totalUsers,
      totalProtocols,
      totalRules,
      verdictBreakdown: Object.fromEntries(verdictBreakdown.map((v) => [v._id, v.count])),
      recentSessions,
    });
  } catch (err) {
    next(err);
  }
});

// ── Users List ──────────────────────────────────────────────────────

adminRoute.get("/api/admin/users", async (_req, res, next) => {
  try {
    const db = await getDb();
    const users = await db
      .collection(COLLECTIONS.users)
      .find({}, { projection: { password: 0, otp: 0, otpExpires: 0 } })
      .sort({ createdAt: -1 })
      .limit(100)
      .toArray();
    res.json({ users });
  } catch (err) {
    next(err);
  }
});

// ── Daily Analytics for Charts ─────────────────────────────────────

adminRoute.get("/api/admin/analytics/daily", async (_req, res, next) => {
  try {
    const db = await getDb();
    const days = 30;
    const since = new Date(Date.now() - days * 86400000).toISOString();

    const [sessionGrowth, userGrowth] = await Promise.all([
      db
        .collection(COLLECTIONS.sessions)
        .aggregate([
          { $match: { createdAt: { $gte: since } } },
          {
            $group: {
              _id: { $dateTrunc: { date: { $dateFromString: { dateString: "$createdAt" } }, unit: "day" } },
              count: { $sum: 1 },
            },
          },
          { $sort: { _id: 1 } },
        ])
        .toArray(),
      db
        .collection(COLLECTIONS.users)
        .aggregate([
          { $match: { createdAt: { $gte: since } } },
          {
            $group: {
              _id: { $dateTrunc: { date: { $dateFromString: { dateString: "$createdAt" } }, unit: "day" } },
              count: { $sum: 1 },
            },
          },
          { $sort: { _id: 1 } },
        ])
        .toArray(),
    ]);

    res.json({
      sessionGrowth: sessionGrowth.map((d) => ({ date: d._id, count: d.count })),
      userGrowth: userGrowth.map((d) => ({ date: d._id, count: d.count })),
    });
  } catch (err) {
    next(err);
  }
});
