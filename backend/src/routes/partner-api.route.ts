import crypto from "node:crypto";
import jwt from "jsonwebtoken";
import { Router } from "express";
import { v4 as uuidv4 } from "uuid";
import { env } from "@/config/env";
import { ForbiddenError, ValidationError } from "@/lib/errors";
import { logger } from "@/lib/logger";
import { tenantMiddleware, requireEntitlement } from "@/middleware/tenant.middleware";
import { runTriageAgent } from "@/routes/chat.route";
import { appendMessage, configurePartnerSession, getOrCreateSession, getSessionForTenant, updateSessionGraphState } from "@/services/session.service";
import { getTenantById, getTenantBySlug, recordAssessment } from "@/services/tenant.service";
import { vectorSearch } from "../../agents/triage/tools/vectorSearch";

const router = Router();
const MAX_MESSAGE_LENGTH = 4_000;
const EMERGENCY_PATTERNS = [
  /chest pain/i,
  /difficulty breathing|can't breathe|cannot breathe|shortness of breath/i,
  /suicid(?:e|al)|kill myself|harm myself/i,
  /unconscious|passed out|fainted/i,
  /stroke|face droop|slurred speech/i,
  /severe bleeding|cough\w* (up )?blood|vomit\w* blood|throwing up blood|blood\w* vomit\w*/i,
  /seizure|convulsion|fitting/i,
];
const EMERGENCY_REPLY = "[serious] Your symptoms may need urgent attention. Please call 112 in Nigeria now or go to the nearest emergency department. Do not rely on this chat for emergency care.";

type PartnerChannel = "api" | "embed" | "whatsapp";

function parseChannel(value: unknown, fallback: PartnerChannel): PartnerChannel {
  return value === "embed" || value === "whatsapp" || value === "api" ? value : fallback;
}

async function createSession(tenantId: string, patientReference: string | undefined, channel: PartnerChannel) {
  const sessionId = uuidv4();
  const userId = `partner:${patientReference || sessionId}`;
  const session = await getOrCreateSession(sessionId, userId, tenantId);
  await configurePartnerSession(sessionId, userId, tenantId, channel, patientReference);
  return { sessionId, userId, createdAt: session.createdAt };
}

// Public bootstrap endpoint: the tenant slug is intentionally non-secret. It only creates
// a short-lived, single-session token; no tenant identifier is trusted from the browser.
router.post("/v1/widget/sessions", async (req, res, next) => {
  try {
    const slug = typeof req.body?.tenant === "string" ? req.body.tenant.trim().toLowerCase() : "";
    if (!slug) throw new ValidationError("tenant is required");
    const tenant = await getTenantBySlug(slug);
    if (!tenant || tenant.status === "suspended" || tenant.status === "cancelled") {
      throw new ForbiddenError("Widget is not available for this tenant");
    }
    if (!tenant.entitlements?.enabledChannels.includes("embed")) {
      throw new ForbiddenError("Embed is not enabled for this tenant plan");
    }
    const { sessionId, userId, createdAt } = await createSession(tenant._id!.toString(), undefined, "embed");
    const widgetToken = jwt.sign({ tenantId: tenant._id!.toString(), sessionId, userId, channel: "embed" }, env.jwtSecret, { expiresIn: "1h" });
    res.status(201).json({ sessionId, widgetToken, createdAt, branding: tenant.whitelabelConfig || {} });
  } catch (err) { next(err); }
});

// POST /v1/sessions — API-key/JWT partner session.
router.post("/v1/sessions", tenantMiddleware, requireEntitlement, async (req, res, next) => {
  try {
    const { tenantId, source } = req.tenantContext!;
    const channel = parseChannel(req.body?.channel, source === "widget_token" ? "embed" : "api");
    if (source === "widget_token" && channel !== "embed") throw new ForbiddenError("Widget sessions must use the embed channel");
    const patientReference = typeof req.body?.patientReference === "string" ? req.body.patientReference.slice(0, 128) : undefined;
    const session = await createSession(tenantId, patientReference, channel);
    logger.info("partner session created", { sessionId: session.sessionId, tenantId, channel });
    res.status(201).json({ sessionId: session.sessionId, status: "in_progress", createdAt: session.createdAt });
  } catch (err) { next(err); }
});

router.post("/v1/sessions/:id/messages", tenantMiddleware, requireEntitlement, async (req, res, next) => {
  try {
    const { tenantId, source } = req.tenantContext!;
    const session = await getSessionForTenant(req.params.id, tenantId);
    if (!session) { res.status(404).json({ error: "NOT_FOUND", message: "Session not found" }); return; }
    if (source === "widget_token") {
      const token = jwt.verify(req.header("x-widget-token")!, env.jwtSecret) as { sessionId?: string };
      if (token.sessionId !== session.sessionId) throw new ForbiddenError("Widget token is not valid for this session");
    }
    const message = req.body?.message;
    if (!message || typeof message !== "string" || !message.trim()) throw new ValidationError("message is required");
    if (message.length > MAX_MESSAGE_LENGTH) throw new ValidationError(`message must be ${MAX_MESSAGE_LENGTH} characters or fewer`);
    if (req.body?.consent !== true) {
      res.status(200).json({ reply: "[calm] Before continuing, please confirm that you consent to the processing of your health information for triage.", sessionId: session.sessionId, status: "awaiting_consent", triage: null, escalation: false });
      return;
    }

    const userMessage = { role: "user" as const, content: message.trim(), timestamp: new Date().toISOString() };
    await appendMessage(session.sessionId, session.userId, userMessage);
    let reply: string;
    let verdict: "self_care" | "consult" | "emergency" | undefined;
    let activeNodeId = session.activeNodeId;
    if (EMERGENCY_PATTERNS.some((pattern) => pattern.test(userMessage.content))) {
      reply = EMERGENCY_REPLY;
      verdict = "emergency";
    } else {
      const traversal = await vectorSearch({ patientMessage: userMessage.content, activeNodeId: session.activeNodeId });
      activeNodeId = traversal.nodeId || session.activeNodeId;
      const messages = [...session.messages, userMessage].map(({ role, content }) => ({ role, content }));
      const result = await runTriageAgent(messages, activeNodeId, session.sessionId, session.userId);
      reply = result.reply || "[gentle] I could not safely complete this assessment. Please contact a healthcare professional.";
      verdict = result.verdict;
      activeNodeId = result.nodeId || activeNodeId;
    }
    await appendMessage(session.sessionId, session.userId, { role: "assistant", content: reply, timestamp: new Date().toISOString() });
    await updateSessionGraphState(session.sessionId, session.userId, { activeNodeId, verdict, status: verdict ? "closed" : "in_progress" });
    if (verdict) {
      const usage = await recordAssessment(tenantId);
      if (!usage.success) throw new ForbiddenError("Monthly assessment limit reached");
    }
    const event = verdict === "emergency" ? "triage.emergency_flagged" : verdict ? "triage.completed" : undefined;
    if (event) void deliverWebhook(tenantId, event, { sessionId: session.sessionId, verdict, channel: session.channel });
    res.json({ reply, sessionId: session.sessionId, status: verdict ? "completed" : "in_progress", triage: verdict || null, escalation: verdict === "emergency" });
  } catch (err) { next(err); }
});

router.get("/v1/sessions/:id", tenantMiddleware, async (req, res, next) => {
  try {
    const session = await getSessionForTenant(req.params.id, req.tenantContext!.tenantId);
    if (!session) { res.status(404).json({ error: "NOT_FOUND", message: "Session not found" }); return; }
    res.json({ sessionId: session.sessionId, status: session.status, verdict: session.verdict || null, channel: session.channel, patientId: session.patientId, messages: session.messages, createdAt: session.createdAt, updatedAt: session.updatedAt });
  } catch (err) { next(err); }
});

router.post("/v1/webhooks/test", tenantMiddleware, async (req, res, next) => {
  try {
    const tenant = await getTenantById(req.tenantContext!.tenantId);
    if (!tenant?.webhookConfig?.url || !tenant.webhookConfig.secret) throw new ValidationError("Configure a webhook URL and secret first");
    await deliverWebhook(req.tenantContext!.tenantId, "webhook.test", { testedAt: new Date().toISOString() });
    res.json({ success: true });
  } catch (err) { next(err); }
});

async function deliverWebhook(tenantId: string, event: string, data: Record<string, unknown>) {
  const tenant = await getTenantById(tenantId);
  const config = tenant?.webhookConfig;
  if (!config?.url || !config.secret || (config.events.length && !config.events.includes(event))) return;
  const payload = JSON.stringify({ id: uuidv4(), event, createdAt: new Date().toISOString(), data });
  const signature = crypto.createHmac("sha256", config.secret).update(payload).digest("hex");
  const response = await fetch(config.url, { method: "POST", headers: { "content-type": "application/json", "x-medbot-signature": `sha256=${signature}` }, body: payload, signal: AbortSignal.timeout(10_000) });
  if (!response.ok) throw new Error(`Webhook delivery failed with ${response.status}`);
}

export { router as partnerApiRoute };
