import { Router } from "express";
import { authMiddleware } from "@/middleware/auth.middleware";
import { logger } from "@/lib/logger";
import { getOrCreateSession, appendMessage, updateSessionGraphState } from "@/services/session.service";
import { hasConsented } from "@/services/consent.service";
import { vectorSearch, getProtocolQuestions } from "../../agents/triage/tools/vectorSearch";
import { clinicalRule } from "../../agents/triage/tools/clinicalRule";
import { scheduleFollowup } from "../../agents/triage/tools/scheduleFollowup";
import type { ClinicalInput } from "@/db/schema";
import { getEffectiveMultiplier, computeTokenCost, deductTokens } from "@/services/tenant.service";
import { recordTokenUsage } from "@/services/tokenLedger.service";
import { saveSessionSummary, findRelevantHistory } from "@/services/sessionSummary.service";
import OpenAI from "openai";
import { env } from "@/config/env";

const MAX_MESSAGE_LENGTH = 4_000;

const EMERGENCY_PATTERNS = [
  /chest pain/i,
  /difficulty breathing|can't breathe|cannot breathe|shortness of breath/i,
  /suicid(?:e|al)|kill myself|harm myself/i,
  /unconscious|passed out|fainted/i,
  /stroke|face droop|slurred speech/i,
  /severe bleeding|coughing blood|vomiting blood/i,
];

const EMERGENCY_REPLY =
  "Your symptoms may need urgent attention. Please call 112 in Nigeria now or go to the nearest emergency department. Do not rely on this chat for emergency care.";

const FAILURE_REPLY =
  "I'm sorry, I'm having trouble reaching my medical guidance service right now. If your symptoms are urgent, please go to the nearest hospital or call 112.";

const deepseek = new OpenAI({
  apiKey: env.deepseekApiKey,
  baseURL: env.deepseekBaseUrl,
});

async function extractStructuredData(
  patientMessage: string,
  protocolNode: { title: string; content: string; metadata: { triageQuestions?: string[]; redFlags?: string[] } }
): Promise<{ data: { severityScore: number; durationHours: number; reportedSymptoms: string[] } | null; usage: { promptTokens: number; completionTokens: number } | null }> {
  const questions = protocolNode.metadata.triageQuestions?.join("\n") ?? "";
  const redFlags = protocolNode.metadata.redFlags?.join(", ") ?? "";

  const prompt = `You are a medical data extractor. Given a patient message and a clinical protocol, extract the following fields as JSON. Return ONLY valid JSON with no markdown or explanation.

Protocol: ${protocolNode.title}
Protocol context: ${protocolNode.content.slice(0, 300)}
Triage questions: ${questions}
Known red flags: ${redFlags}

Patient message: "${patientMessage}"

Extract:
- "severityScore": number 1-10 (the patient's reported pain/severity scale, or estimate from description. Default 5 if unclear.)
- "durationHours": number (how long symptoms have lasted in hours. Default 24 if unclear.)
- "reportedSymptoms": string[] (list of symptoms mentioned by the patient, including any red flags)

Return {"severityScore": number, "durationHours": number, "reportedSymptoms": string[]}`;

  try {
    const completion = await deepseek.chat.completions.create({
      model: env.deepseekChatModel,
      temperature: 0.1,
      messages: [{ role: "user", content: prompt }],
      response_format: { type: "json_object" },
    });
    const usage = completion.usage
      ? { promptTokens: completion.usage.prompt_tokens, completionTokens: completion.usage.completion_tokens }
      : null;
    const raw = completion.choices[0]?.message?.content;
    if (!raw) return { data: null, usage };
    return { data: JSON.parse(raw), usage };
  } catch (err) {
    logger.warn("structured extraction failed", { error: (err as Error).message });
    return { data: null, usage: null };
  }
}

async function phraseResponse(
  verdict: string,
  guidanceText: string,
  protocolNode: { title: string; content: string },
  patientMessage: string,
): Promise<{ text: string; usage: { promptTokens: number; completionTokens: number } | null }> {
  const prompt = `You are Eve, a calm, professional medical triage assistant serving Nigerian patients. You speak in plain language, no jargon, no emojis.

You have received a clinical verdict that you must relay to the patient. You CANNOT change, soften, or override this verdict.

Verdict: ${verdict}
Guidance: ${guidanceText}
Protocol: ${protocolNode.title}

Patient said: "${patientMessage}"

Phrase the verdict in a helpful, clear way. Explain what the patient should do next based on the guidance. Keep it concise (2-4 sentences). End with a reminder that this is not a substitute for professional medical care.`;

  try {
    const completion = await deepseek.chat.completions.create({
      model: env.deepseekChatModel,
      temperature: 0.3,
      messages: [{ role: "user", content: prompt }],
    });
    const usage = completion.usage
      ? { promptTokens: completion.usage.prompt_tokens, completionTokens: completion.usage.completion_tokens }
      : null;
    return { text: completion.choices[0]?.message?.content ?? guidanceText, usage };
  } catch {
    return { text: guidanceText, usage: null };
  }
}

export const chatRoute = Router();

chatRoute.post("/chat", authMiddleware, async (req, res, next) => {
  const { sessionId, message } = req.body;

  if (!sessionId || typeof sessionId !== "string") {
    res.status(400).json({ error: "VALIDATION_ERROR", message: "sessionId is required" });
    return;
  }
  if (!message || typeof message !== "string" || message.trim().length === 0) {
    res.status(400).json({ error: "VALIDATION_ERROR", message: "message is required" });
    return;
  }
  if (message.length > MAX_MESSAGE_LENGTH) {
    res.status(400).json({ error: "VALIDATION_ERROR", message: `message must be ${MAX_MESSAGE_LENGTH} characters or fewer` });
    return;
  }

  try {
    logger.info("chat turn received", { sessionId });

    const userId = (req as any).user?.id;
    if (!userId) {
      res.status(401).json({ error: "UNAUTHORIZED", message: "A user token is required" });
      return;
    }

    const tenantId = req.headers["x-tenant-id"] as string | undefined;
    const session = await getOrCreateSession(sessionId, userId, tenantId);

    const userMsg = { role: "user" as const, content: message, timestamp: new Date().toISOString() };
    await appendMessage(sessionId, userId, userMsg);

    // ── Safety Floor ──────────────────────────────────────────────
    if (EMERGENCY_PATTERNS.some((p) => p.test(message))) {
      await appendMessage(sessionId, userId, {
        role: "assistant", content: EMERGENCY_REPLY, timestamp: new Date().toISOString(),
      });
      await updateSessionGraphState(sessionId, userId, { verdict: "emergency", status: "closed" });
      res.json({ reply: EMERGENCY_REPLY, saved: true, urgency: "emergency" });
      return;
    }

    // ── Consent Check ─────────────────────────────────────────────
    const consented = await hasConsented(userId);
    if (!consented) {
      const consentMsg = "Before I can ask about your symptoms, I need your consent to collect and process your health data in accordance with the Nigeria Data Protection Regulation (NDPR).\n\nYou can grant consent by sending a POST to **/api/consent** (or tapping \"I Agree\" in your account settings). Your data will only be used for triage purposes and will never be shared without your explicit permission.\n\nUntil you consent, I cannot proceed with the triage.";
      await appendMessage(sessionId, userId, { role: "assistant", content: consentMsg, timestamp: new Date().toISOString() });
      res.json({ reply: consentMsg, saved: true, consentRequired: true });
      return;
    }

    // ── Graph Traversal (via Eve agent tool) ──────────────────────
    let activeNodeId = session.activeNodeId;
    const traversalResult = await vectorSearch({
      patientMessage: message,
      activeNodeId,
    });

    activeNodeId = traversalResult.nodeId;

    if (!activeNodeId) {
      const fallback = "I'm not sure I understand your symptoms. Could you describe them differently, or if you're worried, please visit a clinic or call 112.";
      await appendMessage(sessionId, userId, { role: "assistant", content: fallback, timestamp: new Date().toISOString() });
      res.json({ reply: fallback, saved: true });
      return;
    }

    const protocolQuestions = await getProtocolQuestions(activeNodeId);

    // Save the active node
    await updateSessionGraphState(sessionId, userId, {
      activeNodeId,
      lastFiringScore: traversalResult.score,
    });

    // ── Confidence Routing ────────────────────────────────────────
    if (traversalResult.confidence === "low") {
      const reply = "I'm having trouble matching your symptoms to a known pattern. Could you rephrase or describe what you're feeling in more detail? If this is urgent, please call 112.";
      await appendMessage(sessionId, userId, { role: "assistant", content: reply, timestamp: new Date().toISOString() });
      res.json({ reply, saved: true });
      return;
    }

    if (traversalResult.confidence === "moderate") {
      const question = protocolQuestions[0] ?? "Can you tell me more about your symptoms?";
      await appendMessage(sessionId, userId, { role: "assistant", content: question, timestamp: new Date().toISOString() });
      res.json({ reply: question, saved: true, clarifying: true });
      return;
    }

    // ── History recall ───────────────────────────────────────────
    let historyContext = "";
    try {
      const relevant = await findRelevantHistory(userId, message);
      if (relevant.length > 0) {
        historyContext = "\nPatient history:\n" + relevant.map((h) => `- ${h.summaryText}`).join("\n");
      }
    } catch {
      // non-blocking
    }

    // ── High confidence: extract, evaluate, respond ───────────────
    const extracted = await extractStructuredData(historyContext ? `${message}\n\n${historyContext}` : message, {
      title: traversalResult.title,
      content: traversalResult.title,
      metadata: { triageQuestions: protocolQuestions, redFlags: [] },
    });

    const clinicalInput: ClinicalInput = {
      severityScale: extracted.data?.severityScore ?? 5,
      durationHours: extracted.data?.durationHours ?? 24,
      associatedSymptoms: extracted.data?.reportedSymptoms ?? [],
      redFlags: extracted.data?.reportedSymptoms ?? [],
    };

    // Evaluate via the agent tool
    let clinicalResult;
    try {
      clinicalResult = await clinicalRule({
        severityScale: clinicalInput.severityScale,
        durationHours: clinicalInput.durationHours,
        associatedSymptoms: clinicalInput.associatedSymptoms,
        redFlags: clinicalInput.redFlags,
        nodeId: activeNodeId,
      });
    } catch (ruleErr) {
      // Fire error webhook — the one alert the plan requires
      logger.error("Clinical Rule Layer error", { sessionId, nodeId: activeNodeId, error: (ruleErr as Error).message });
      if (env.errorWebhookUrl) {
        fetch(env.errorWebhookUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            event: "clinical_rule_error",
            sessionId,
            nodeId: activeNodeId,
            error: (ruleErr as Error).message,
            timestamp: new Date().toISOString(),
          }),
        }).catch(() => {}); // fire-and-forget
      }
      throw ruleErr;
    }

    const phrased = await phraseResponse(clinicalResult.severity, clinicalResult.guidanceText ?? clinicalResult.nextStep, { title: traversalResult.title, content: traversalResult.title }, message);

    await appendMessage(sessionId, userId, { role: "assistant", content: phrased.text, timestamp: new Date().toISOString() });

    const shouldClose = clinicalResult.severity === "emergency";
    await updateSessionGraphState(sessionId, userId, {
      verdict: clinicalResult.severity,
      lastFiringScore: clinicalResult.score,
      extractedAnswers: {
        severityScore: clinicalInput.severityScale,
        durationHours: clinicalInput.durationHours,
        reportedSymptoms: clinicalInput.associatedSymptoms,
      },
      ...(shouldClose ? { status: "closed" } : {}),
    });

    // Schedule follow-up for closed sessions (async, non-blocking)
    if (shouldClose) {
      scheduleFollowup({
        sessionId,
        userId,
        delayHours: 24,
        messageTemplate: "post_triage_checkin",
      }).catch((err) => logger.warn("followup schedule failed", { sessionId, error: (err as Error).message }));
    }

    // Save session summary (async, non-blocking)
    saveSessionSummary(sessionId, userId, session.tenantId, {
      ...session,
      activeNodeId,
      verdict: clinicalResult.severity,
      extractedAnswers: {
        severityScore: clinicalInput.severityScale,
        durationHours: clinicalInput.durationHours,
        reportedSymptoms: clinicalInput.associatedSymptoms,
      },
    }).catch((err) => logger.warn("session summary save failed", { sessionId, error: (err as Error).message }));

    // Non-blocking metering
    if (session.tenantId) {
      const pTokens = extracted.usage?.promptTokens ?? 0;
      const cTokens = extracted.usage?.completionTokens ?? 0;
      const pTokensPhrase = phrased.usage?.promptTokens ?? 0;
      const cTokensPhrase = phrased.usage?.completionTokens ?? 0;
      const totalPrompt = pTokens + pTokensPhrase || Math.ceil(message.length / 4);
      const totalCompletion = cTokens + cTokensPhrase || Math.ceil(phrased.text.length / 4);

      getEffectiveMultiplier(session.tenantId)
        .then((eff) => {
          const cost = computeTokenCost(totalPrompt, totalCompletion, eff.multiplier);
          return deductTokens(session.tenantId!, Math.ceil(cost))
            .then(() => recordTokenUsage({
              tenantId: session.tenantId!,
              sessionId,
              promptTokens: totalPrompt,
              completionTokens: totalCompletion,
              multiplierApplied: eff.multiplier,
              costNgn: cost,
            }));
        })
        .catch((err) => logger.warn("metering failed", { sessionId, error: (err as Error).message }));
    }

    res.json({
      reply: phrased.text,
      saved: true,
      verdict: clinicalResult.severity,
      matchedRedFlags: clinicalResult.matchedRedFlags.length > 0 ? clinicalResult.matchedRedFlags : undefined,
      score: clinicalResult.score,
    });

  } catch (err) {
    try {
      const uid = (req as any).user?.id;
      if (uid) {
        await appendMessage(sessionId, uid, {
          role: "assistant", content: FAILURE_REPLY, timestamp: new Date().toISOString(),
        });
      }
    } catch { /* ignore persistence errors in fallback */ }

    const errorMsg = (err as Error).message;
    logger.warn("chat route failed, returning fallback", { sessionId, error: errorMsg });

    // In dev, include the error detail so you can debug without checking logs
    const isDev = env.nodeEnv === "development";
    res.json({
      reply: FAILURE_REPLY,
      saved: true,
      warning: "service_unavailable",
      ...(isDev && { debug: errorMsg }),
    });
  }
});
