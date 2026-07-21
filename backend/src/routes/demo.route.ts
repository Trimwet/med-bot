import { Router } from "express";
import { createHash, randomBytes, randomUUID } from "node:crypto";
import { COLLECTIONS, getDb } from "@/db/client";
import type { DemoSessionDocument } from "@/db/schema";
import { AppError, ValidationError } from "@/lib/errors";
import { runTriageAgent } from "@/routes/chat.route";

const DEMO_REQUEST_LIMIT = 10;
const DEMO_MESSAGE_LIMIT = 500;
const DEMO_LIFETIME_MS = 24 * 60 * 60 * 1000;
const EMERGENCY_PATTERNS = [
  /chest pain/i, /difficulty breathing|can't breathe|cannot breathe|shortness of breath/i,
  /suicid(?:e|al)|kill myself|harm myself/i, /unconscious|passed out|fainted/i,
  /stroke|face droop|slurred speech/i, /severe bleeding|cough\w* (up )?blood|vomit\w* blood|throwing up blood|blood\w* vomit\w*/i,
];
const EMERGENCY_REPLY = "[serious] Your symptoms may need urgent attention. Please call 112 in Nigeria now or go to the nearest emergency department. Do not rely on this chat for emergency care.";
const GREETING_PATTERNS = [/^(hi|hello|hey|good morning|good afternoon|good evening)[\s!.?]*$/i];
const GREETING_REPLY = "[warm] Hello! I'm MedBot, your medical triage assistant. Describe what symptoms you're experiencing and I'll walk you through some questions.";
const FAILURE_REPLY = "[gentle] I'm sorry, I'm having trouble reaching my medical guidance service right now. If your symptoms are urgent, please go to the nearest hospital or call 112.";

export const demoRoute = Router();

function hash(value: string) {
  return createHash("sha256").update(value).digest("hex");
}

function demoCredentials(req: any) {
  const token = req.header("x-demo-token");
  const browserBinding = req.header("x-demo-browser");
  if (!token || !browserBinding) throw new AppError("Temporary session token not found", 401, "DEMO_TOKEN_MISSING");
  return { token, browserBinding };
}

async function getDemo(req: any): Promise<DemoSessionDocument> {
  const { token, browserBinding } = demoCredentials(req);
  const db = await getDb();
  const demo = await db.collection<DemoSessionDocument>(COLLECTIONS.demoSessions).findOne({ tokenHash: hash(token) });
  if (!demo) throw new AppError("Temporary session token is invalid", 401, "DEMO_TOKEN_INVALID");
  if (demo.browserBindingHash !== hash(browserBinding)) throw new AppError("This temporary session belongs to a different browser", 401, "DEMO_BROWSER_MISMATCH");
  if (demo.expiresAt.getTime() <= Date.now()) throw new AppError("Your temporary session has expired", 410, "DEMO_EXPIRED");
  return demo;
}

function publicStatus(demo: DemoSessionDocument) {
  return {
    demoId: demo.demoId,
    remainingRequests: demo.remainingRequests,
    requestLimit: DEMO_REQUEST_LIMIT,
    consented: Boolean(demo.consentGivenAt),
    expiresAt: demo.expiresAt.toISOString(),
  };
}

demoRoute.post("/api/demo/start", async (req, res, next) => {
  try {
    const browserBinding = req.body?.browserBinding;
    if (!browserBinding || typeof browserBinding !== "string" || browserBinding.length < 24) {
      throw new ValidationError("A browser binding is required");
    }
    const token = randomBytes(32).toString("base64url");
    const now = new Date();
    const demo: DemoSessionDocument = {
      demoId: randomUUID(), tokenHash: hash(token), browserBindingHash: hash(browserBinding),
      remainingRequests: DEMO_REQUEST_LIMIT, messages: [], createdAt: now.toISOString(),
      expiresAt: new Date(now.getTime() + DEMO_LIFETIME_MS),
    };
    const db = await getDb();
    await db.collection<DemoSessionDocument>(COLLECTIONS.demoSessions).insertOne(demo);
    res.status(201).json({ token, ...publicStatus(demo) });
  } catch (err) { next(err); }
});

demoRoute.get("/api/demo/status", async (req, res, next) => {
  try { res.json(publicStatus(await getDemo(req))); } catch (err) { next(err); }
});

demoRoute.post("/api/demo/consent", async (req, res, next) => {
  try {
    const demo = await getDemo(req);
    const db = await getDb();
    const consentGivenAt = demo.consentGivenAt || new Date().toISOString();
    await db.collection<DemoSessionDocument>(COLLECTIONS.demoSessions).updateOne({ _id: demo._id }, { $set: { consentGivenAt } });
    res.json({ ...publicStatus({ ...demo, consentGivenAt }), consented: true });
  } catch (err) { next(err); }
});

demoRoute.post("/api/demo/chat", async (req, res, next) => {
  try {
    const message = req.body?.message;
    if (!message || typeof message !== "string" || !message.trim()) throw new ValidationError("message is required");
    if (message.length > DEMO_MESSAGE_LIMIT) throw new AppError(`message must be ${DEMO_MESSAGE_LIMIT} characters or fewer`, 400, "DEMO_MESSAGE_TOO_LONG");
    const demo = await getDemo(req);
    if (!demo.consentGivenAt) throw new AppError("Consent is required before using the demo", 403, "DEMO_CONSENT_REQUIRED");
    const db = await getDb();
    const consumed = await db.collection<DemoSessionDocument>(COLLECTIONS.demoSessions).updateOne(
      { _id: demo._id, remainingRequests: { $gt: 0 } }, { $inc: { remainingRequests: -1 } },
    );
    if (!consumed.modifiedCount) throw new AppError("Your 10 demo requests have been used", 429, "DEMO_LIMIT_REACHED");

    const userMessage = { role: "user" as const, content: message.trim(), timestamp: new Date().toISOString() };
    let reply: string;
    let nodeId = demo.activeNodeId;
    if (EMERGENCY_PATTERNS.some((pattern) => pattern.test(userMessage.content))) {
      reply = EMERGENCY_REPLY;
    } else if (GREETING_PATTERNS.some((pattern) => pattern.test(userMessage.content))) {
      reply = GREETING_REPLY;
    } else {
      try {
        const result = await runTriageAgent([...demo.messages, userMessage].map(({ role, content }) => ({ role, content })), demo.activeNodeId, demo.demoId);
        reply = result.reply || FAILURE_REPLY;
        nodeId = result.nodeId || nodeId;
      } catch {
        reply = FAILURE_REPLY;
      }
    }
    const assistantMessage = { role: "assistant" as const, content: reply, timestamp: new Date().toISOString() };
    await db.collection<DemoSessionDocument>(COLLECTIONS.demoSessions).updateOne(
      { _id: demo._id }, { $push: { messages: { $each: [userMessage, assistantMessage] } }, $set: { activeNodeId: nodeId } },
    );
    res.json({ reply, saved: true, remainingRequests: demo.remainingRequests - 1, requestLimit: DEMO_REQUEST_LIMIT });
  } catch (err) { next(err); }
});
