import { Router } from "express";
import { tenantMiddleware, requireEntitlement } from "@/middleware/tenant.middleware";
import { logger } from "@/lib/logger";
import { getOrCreateSession, appendMessage, getSession } from "@/services/session.service";
import { recordAssessment } from "@/services/tenant.service";
import { v4 as uuidv4 } from "uuid";

const router = Router();

// POST /v1/sessions - Create a new triage session
router.post("/v1/sessions", tenantMiddleware, requireEntitlement, async (req, res, next) => {
  try {
    const { tenantId } = req.tenantContext!;
    const { patientReference, channel = "api", metadata = {} } = req.body;

    const sessionId = uuidv4();
    const userId = `patient_${patientReference || uuidv4()}`;

    const session = await getOrCreateSession(sessionId, userId, tenantId);

    // Update session with API-specific fields
    session.channel = channel as any;
    session.patientId = patientReference;
    
    await appendMessage(sessionId, {
      role: "system",
      content: `Session created via API. Channel: ${channel}`,
    });

    logger.info("API session created", { sessionId, tenantId, channel });

    res.status(201).json({
      sessionId,
      status: "in_progress",
      createdAt: session.createdAt,
    });
  } catch (err) {
    next(err);
  }
});

// POST /v1/sessions/:id/messages - Send a message to a session
router.post("/v1/sessions/:id/messages", tenantMiddleware, requireEntitlement, async (req, res, next) => {
  try {
    const { tenantId } = req.tenantContext!;
    const { id: sessionId } = req.params;
    const { message, consent = false } = req.body;

    if (!message || typeof message !== "string") {
      res.status(400).json({ error: "Message is required" });
      return;
    }

    const session = await getSession(sessionId, tenantId);
    if (!session) {
      res.status(404).json({ error: "Session not found" });
      return;
    }

    // Add user message
    await appendMessage(sessionId, { role: "user", content: message });

    // Run triage (simplified for API - in production, use the full triage engine)
    const triageResult = await runTriageForApi(sessionId, tenantId, message, consent);

    // Record assessment
    await recordAssessment(tenantId);

    logger.info("API message processed", { sessionId, tenantId, verdict: triageResult.triage });

    res.json({
      reply: triageResult.reply,
      sessionId,
      status: triageResult.status,
      triage: triageResult.triage,
      escalation: triageResult.escalation,
      usage: triageResult.usage,
    });
  } catch (err) {
    next(err);
  }
});

// GET /v1/sessions/:id - Get session details
router.get("/v1/sessions/:id", tenantMiddleware, requireEntitlement, async (req, res, next) => {
  try {
    const { tenantId } = req.tenantContext!;
    const { id: sessionId } = req.params;

    const session = await getSession(sessionId, tenantId);
    if (!session) {
      res.status(404).json({ error: "Session not found" });
      return;
    }

    res.json({
      sessionId: session.sessionId,
      status: session.status,
      verdict: session.verdict,
      channel: session.channel,
      patientId: session.patientId,
      messages: session.messages.map(m => ({
        role: m.role,
        content: m.content,
        timestamp: m.timestamp,
      })),
      createdAt: session.createdAt,
      updatedAt: session.updatedAt,
    });
  } catch (err) {
    next(err);
  }
});

// POST /v1/webhooks/test - Test webhook delivery
router.post("/v1/webhooks/test", tenantMiddleware, async (req, res, next) => {
  try {
    const { tenantId } = req.tenantContext!;
    const { url, secret } = req.body;

    // TODO: Implement webhook test with HMAC signing
    logger.info("Webhook test requested", { tenantId, url });

    res.json({ success: true, message: "Webhook test endpoint ready" });
  } catch (err) {
    next(err);
  }
});

// Simplified triage for API - in production, use the full triage engine
async function runTriageForApi(
  sessionId: string,
  tenantId: string,
  message: string,
  consent: boolean
): Promise<{
  reply: string;
  status: string;
  triage: "self_care" | "consult" | "emergency" | null;
  escalation: boolean;
  usage: { tokens: number; cost: number };
}> {
  // Emergency check
  const emergencyPatterns = [
    /chest pain/i,
    /difficulty breathing|can't breathe/i,
    /suicid(?:e|al)|kill myself/i,
    /unconscious|passed out/i,
    /stroke|face droop|slurred speech/i,
    /severe bleeding|cough\w* (up )?blood/i,
    /seizure|convulsion/i,
  ];

  const isEmergency = emergencyPatterns.some(p => p.test(message));

  if (isEmergency) {
    return {
      reply: "Your symptoms may need urgent attention. Please call 112 in Nigeria now or go to the nearest emergency department. Do not rely on this chat for emergency care.",
      status: "completed",
      triage: "emergency",
      escalation: true,
      usage: { tokens: 0, cost: 0 },
    };
  }

  // Consent check
  if (!consent) {
    return {
      reply: "Before I can ask about your symptoms, I need your consent to collect and process your health data. Please provide consent to continue.",
      status: "awaiting_consent",
      triage: null,
      escalation: false,
      usage: { tokens: 0, cost: 0 },
    };
  }

  // Simplified triage response
  return {
    reply: "Thank you for describing your symptoms. Based on what you've told me, I recommend consulting with a healthcare professional. If your symptoms worsen, please seek immediate medical attention.",
    status: "completed",
    triage: "consult",
    escalation: false,
    usage: { tokens: 150, cost: 0.75 },
  };
}

export { router as partnerApiRoute };
