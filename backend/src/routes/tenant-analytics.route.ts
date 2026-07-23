import { Router } from "express";
import { getDb, COLLECTIONS } from "@/db/client";
import type { SessionDocument } from "@/db/schema";
import { UnauthorizedError } from "@/lib/errors";
import { verifyJwtToken } from "@/services/auth.service";
import { ObjectId } from "mongodb";

export const tenantAnalyticsRoute = Router();

/** Extract tenantId from JWT Bearer token */
async function getTenantId(req: any): Promise<string> {
  const auth = req.headers.authorization;
  if (!auth?.startsWith("Bearer ")) throw new UnauthorizedError("Missing token");
  const payload = verifyJwtToken(auth.slice(7)) as any;
  if (!payload?.id) throw new UnauthorizedError("Invalid token");

  const db = await getDb();
  const user = await db.collection("users_collection").findOne({ _id: new ObjectId(payload.id) });
  if (!user?.tenantId) throw new UnauthorizedError("Not a business account");
  return user.tenantId;
}

// ── GET /api/tenant/analytics/overview ── KPI cards + verdict breakdown
tenantAnalyticsRoute.get("/api/tenant/analytics/overview", async (req, res, next) => {
  try {
    const tenantId = await getTenantId(req);
    const db = await getDb();
    const sessions = db.collection<SessionDocument>(COLLECTIONS.sessions);

    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const prevSevenDays = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000);

    const baseQuery = { tenantId };

    const [
      totalSessions,
      activeSessions,
      completedSessions,
      emergencySessions,
      sessionsLast7d,
      sessionsPrev7d,
      verdictBreakdown,
    ] = await Promise.all([
      sessions.countDocuments(baseQuery),
      sessions.countDocuments({ ...baseQuery, status: "in_progress" }),
      sessions.countDocuments({ ...baseQuery, status: "closed" }),
      sessions.countDocuments({ ...baseQuery, verdict: "emergency" }),
      sessions.countDocuments({ ...baseQuery, createdAt: { $gte: sevenDaysAgo.toISOString() } }),
      sessions.countDocuments({ ...baseQuery, createdAt: { $gte: prevSevenDays.toISOString(), $lt: sevenDaysAgo.toISOString() } }),
      sessions.aggregate([
        { $match: baseQuery },
        { $group: { _id: "$verdict", count: { $sum: 1 } } },
      ]).toArray(),
    ]);

    const verdictMap: Record<string, number> = {};
    for (const v of verdictBreakdown) {
      verdictMap[v._id || "unknown"] = v.count;
    }

    const weeklyChange = sessionsPrev7d > 0
      ? Math.round(((sessionsLast7d - sessionsPrev7d) / sessionsPrev7d) * 100)
      : 0;

    res.json({
      totalSessions,
      activeSessions,
      completedSessions,
      emergencySessions,
      weeklyChange,
      verdictBreakdown: {
        self_care: verdictMap["self_care"] || 0,
        consult: verdictMap["consult"] || 0,
        emergency: verdictMap["emergency"] || 0,
      },
    });
  } catch (err) {
    next(err);
  }
});

// ── GET /api/tenant/analytics/sessions ── Paginated session list with filters
tenantAnalyticsRoute.get("/api/tenant/analytics/sessions", async (req, res, next) => {
  try {
    const tenantId = await getTenantId(req);
    const db = await getDb();
    const sessions = db.collection<SessionDocument>(COLLECTIONS.sessions);

    const {
      status,
      verdict,
      search,
      page = "1",
      limit = "20",
    } = req.query as Record<string, string>;

    const pageNum = Math.max(1, parseInt(page) || 1);
    const pageSize = Math.min(100, Math.max(1, parseInt(limit) || 20));
    const offset = (pageNum - 1) * pageSize;

    const query: any = { tenantId };
    if (status) query.status = status;
    if (verdict) query.verdict = verdict;
    if (search) {
      query.$or = [
        { sessionId: { $regex: search, $options: "i" } },
        { "messages.content": { $regex: search, $options: "i" } },
      ];
    }

    const [docs, total] = await Promise.all([
      sessions
        .find(query)
        .sort({ updatedAt: -1 })
        .skip(offset)
        .limit(pageSize)
        .toArray(),
      sessions.countDocuments(query),
    ]);

    res.json({
      sessions: docs.map((d) => ({
        sessionId: d.sessionId,
        userId: d.userId,
        verdict: d.verdict || null,
        channel: d.channel,
        status: d.status,
        messageCount: d.messages?.length ?? 0,
        firstMessage: d.messages?.find((m) => m.role === "user")?.content?.slice(0, 120) || "",
        symptoms: d.extractedAnswers?.reportedSymptoms || [],
        severityScore: d.extractedAnswers?.severityScore ?? d.state?.severityScore ?? null,
        createdAt: d.createdAt,
        updatedAt: d.updatedAt,
      })),
      total,
      page: pageNum,
      pageSize,
      totalPages: Math.ceil(total / pageSize),
    });
  } catch (err) {
    next(err);
  }
});

// ── GET /api/tenant/analytics/trends ── Time-series data (daily session counts)
tenantAnalyticsRoute.get("/api/tenant/analytics/trends", async (req, res, next) => {
  try {
    const tenantId = await getTenantId(req);
    const db = await getDb();
    const sessions = db.collection<SessionDocument>(COLLECTIONS.sessions);

    const { range = "30d" } = req.query as Record<string, string>;
    const now = new Date();
    let startDate: Date;
    let dateFormat: string;

    if (range === "7d") {
      startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      dateFormat = "%Y-%m-%d";
    } else if (range === "90d") {
      startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
      dateFormat = "%Y-%m-%d";
    } else {
      startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      dateFormat = "%Y-%m-%d";
    }

    const daily = await sessions.aggregate([
      { $match: { tenantId, createdAt: { $gte: startDate.toISOString() } } },
      {
        $group: {
          _id: { $dateToString: { format: dateFormat, date: { $toDate: "$createdAt" } } },
          total: { $sum: 1 },
          emergency: { $sum: { $cond: [{ $eq: ["$verdict", "emergency"] }, 1, 0] } },
          consult: { $sum: { $cond: [{ $eq: ["$verdict", "consult"] }, 1, 0] } },
          self_care: { $sum: { $cond: [{ $eq: ["$verdict", "self_care"] }, 1, 0] } },
        },
      },
      { $sort: { _id: 1 } },
    ]).toArray();

    // Also get top symptoms across all sessions in range
    const symptomPipeline = await sessions.aggregate([
      { $match: { tenantId, createdAt: { $gte: startDate.toISOString() } } },
      { $unwind: { path: "$extractedAnswers.reportedSymptoms", preserveNullAndEmptyArrays: false } },
      { $group: { _id: "$extractedAnswers.reportedSymptoms", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 },
    ]).toArray();

    res.json({
      daily: daily.map((d) => ({
        date: d._id,
        total: d.total,
        emergency: d.emergency,
        consult: d.consult,
        self_care: d.self_care,
      })),
      topSymptoms: symptomPipeline.map((s) => ({ name: s._id, count: s.count })),
    });
  } catch (err) {
    next(err);
  }
});

// ── GET /api/tenant/analytics/session/:sessionId ── Single session detail
tenantAnalyticsRoute.get("/api/tenant/analytics/session/:sessionId", async (req, res, next) => {
  try {
    const tenantId = await getTenantId(req);
    const db = await getDb();
    const sessions = db.collection<SessionDocument>(COLLECTIONS.sessions);

    const session = await sessions.findOne({
      sessionId: req.params.sessionId,
      tenantId,
    });

    if (!session) {
      res.status(404).json({ error: "Session not found" });
      return;
    }

    res.json({
      sessionId: session.sessionId,
      userId: session.userId,
      verdict: session.verdict || null,
      status: session.status,
      messages: session.messages?.map((m) => ({
        role: m.role,
        content: m.content,
        timestamp: m.timestamp,
      })) || [],
      symptoms: session.extractedAnswers?.reportedSymptoms || [],
      severityScore: session.extractedAnswers?.severityScore ?? null,
      durationHours: session.extractedAnswers?.durationHours ?? null,
      createdAt: session.createdAt,
      updatedAt: session.updatedAt,
    });
  } catch (err) {
    next(err);
  }
});
