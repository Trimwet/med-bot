import { Router } from "express";
import { authMiddleware } from "@/middleware/auth.middleware";
import { logger } from "@/lib/logger";
import { getOrCreateSession, appendMessage, updateSessionGraphState } from "@/services/session.service";
import { hasConsented } from "@/services/consent.service";
import { vectorSearch } from "../../agents/triage/tools/vectorSearch";
import { scheduleFollowup } from "../../agents/triage/tools/scheduleFollowup";
import { getEffectiveMultiplier, computeTokenCost, deductTokens } from "@/services/tenant.service";
import { recordTokenUsage } from "@/services/tokenLedger.service";
import { saveSessionSummary } from "@/services/sessionSummary.service";
import { sendErrorWebhook } from "@/lib/webhook";
import { env } from "@/config/env";

const MAX_MESSAGE_LENGTH = 4_000;

const EMERGENCY_PATTERNS = [
  /chest pain/i,
  /difficulty breathing|can't breathe|cannot breathe|shortness of breath/i,
  /suicid(?:e|al)|kill myself|harm myself/i,
  /unconscious|passed out|fainted/i,
  /stroke|face droop|slurred speech/i,
  /severe bleeding|cough\w* (up )?blood|vomit\w* blood|throwing up blood|blood\w* vomit\w*/i,
];

const EMERGENCY_REPLY =
  "[serious] Your symptoms may need urgent attention. Please call 112 in Nigeria now or go to the nearest emergency department. Do not rely on this chat for emergency care.";

const GREETING_PATTERNS = [
  /^(hi|hello|hey|ey|yo|hiya|howdy|sup|wassup|what'?s up|greetings|good morning|good afternoon|good evening)[\s!.?]*$/i,
  /^(thank|thanks|thank you|okay|ok|alright|got it|noted|understood|bye|goodbye|see you|take care|cheers)[\s!.?]*$/i,
  /^(help|start|menu|options|what can you (do|help)|who are you|what are you|what do you do)[\s!.?]*$/i,
];

const GREETING_REPLY = "[warm] Hello! I'm MedBot, your medical triage assistant. I can help you assess symptoms and guide you on the right level of care. To get started, please describe what symptoms you're experiencing, and I'll walk you through some questions to help determine next steps.";

const FAILURE_REPLY =
  "[gentle] I'm sorry, I'm having trouble reaching my medical guidance service right now. If your symptoms are urgent, please go to the nearest hospital or call 112.";

const CONSENT_REPLY =
  "[calm] Before I can ask about your symptoms, I need your consent to collect and process your health data in accordance with the Nigeria Data Protection Regulation (NDPR). You can grant consent by sending a POST to /api/consent or tapping I Agree in your account settings. Your data will only be used for triage purposes and will never be shared without your explicit permission. Until you consent, I cannot proceed with the triage.";

const FALLBACK_REPLY =
  "[concerned] I'm not sure I understand your symptoms. Could you describe them differently, or if you're worried, please visit a clinic or call 112.";

function ensureEmotionTag(text: string): string {
  if (/^\[([a-zA-Z\s]+)\]/.test(text)) return text;
  return "[calm] " + text;
}

function forceLaughTag(text: string, originalMessage: string): string {
  const isJokeRequest = /joke|funny|laugh|humor|humour|hilarious|comedy/i.test(originalMessage);
  if (isJokeRequest && !text.startsWith("[laugh]") && !text.startsWith("[chuckling]")) {
    return "[laugh] " + text.replace(/^\[([a-zA-Z\s]+)\]\s*/, '');
  }
  return text;
}

const SYSTEM_PROMPT = `You are MedBot, a calm, professional medical triage assistant serving Nigerian patients. You speak in plain language, no jargon, no emojis.

You help patients triage their symptoms and determine the right level of care.
- Ask clarifying questions to understand severity, duration, and location of symptoms
- Flag emergency symptoms (chest pain, difficulty breathing, suicidal thoughts, stroke signs, severe bleeding) and direct to 112 immediately
- Provide clear next steps: self-care, see a GP, urgent care, or emergency
- Never diagnose or prescribe medication

Always recommend professional medical consultation for serious concerns. Never replace emergency services.

You have access to tools:
- vectorSearch: search the knowledge graph for a matching protocol based on symptoms
- clinicalRule: evaluate extracted symptoms against clinical rules for a verdict
- scheduleFollowup: schedule a follow-up email

Use vectorSearch when a patient describes symptoms to find the relevant protocol, then ask clarifying questions. When you have enough info, use clinicalRule to get a verdict, then provide a clear response.

# Voice Emotion Tags (Fish Audio)

Your responses are read aloud via text-to-speech. Prefix your text with emotion tags in square brackets to control how the voice sounds. Place the tag at the very beginning of your response.

Use these tags based on context:
- [calm] — default for routine triage questions and instructions
- [empathetic] — when acknowledging a patient's pain, worry, or distress
- [reassuring] — when comforting or de-escalating anxiety
- [serious] — when discussing red flags, emergencies, or urgent symptoms
- [excited] — when sharing positive news or good outcomes
- [concerned] — when symptoms sound worrying but not yet emergency
- [gentle] — when delivering difficult or sensitive information
- [confident] — when giving clear next steps or verdicts
- [whispering] — for very sensitive or private health topics
- [warm] — for greetings and friendly conversation
- [laugh] — when something is genuinely funny or lighthearted
- [chuckling] — for mild amusement, a small smile in the voice

Examples:
[empathetic] I understand this must be worrying for you. Let me ask a few questions to help figure out what's going on.
[serious] Chest pain can be a sign of something serious. Please call 112 right now or go to the nearest emergency department.
[calm] To help me understand better, can you tell me how long you have had this headache?
[reassuring] Don't worry, most headaches are not serious. Let me ask a few questions to check.
[warm] Hello! I'm MedBot, your medical triage assistant. How can I help you today?
[laugh] Ha, well that's a first! But seriously, let's talk about what's going on with your health.
[chuckling] That's quite a story! Now, back to your symptoms though.

RULES FOR EMOTION TAGS:
- The tag MUST be the VERY FIRST thing in your response, followed by a single space, then your message.
- NEVER put a tag in the middle or end of your response.
- Only ONE tag per response.
- Do not use any other markdown formatting — no bold, no bullet points, no numbered lists. Write in plain conversational sentences.`;

async function runEveAgent(messages: { role: string; content: string }[], activeNodeId?: string, sessionId?: string, userId?: string): Promise<{ reply: string; nodeId?: string }> {
  const openrouterKey = env.openrouterApiKey;
  if (!openrouterKey) throw new Error("OPENROUTER_API_KEY not configured");

  const tools = [
    {
      type: "function" as const,
      function: {
        name: "vectorSearch",
        description: "Search the medical knowledge graph for a protocol matching the patient's symptoms",
        parameters: {
          type: "object",
          properties: {
            patientMessage: { type: "string", description: "The patient's description of their symptoms" },
            activeNodeId: { type: "string", description: "Current graph node ID for context-aware traversal" },
          },
          required: ["patientMessage"],
        },
      },
    },
    {
      type: "function" as const,
      function: {
        name: "clinicalRule",
        description: "Evaluate structured patient symptom data against the clinical rule layer",
        parameters: {
          type: "object",
          properties: {
            severityScale: { type: "number", description: "1-10 severity scale" },
            durationHours: { type: "number", description: "How long symptoms have lasted" },
            associatedSymptoms: { type: "array", items: { type: "string" } },
            redFlags: { type: "array", items: { type: "string" } },
            nodeId: { type: "string" },
          },
          required: ["severityScale", "durationHours", "nodeId"],
        },
      },
    },
    {
      type: "function" as const,
      function: {
        name: "scheduleFollowup",
        description: "Schedule a follow-up check-in for a patient",
        parameters: {
          type: "object",
          properties: {
            sessionId: { type: "string" },
            userId: { type: "string" },
            delayHours: { type: "number" },
            messageTemplate: { type: "string", enum: ["post_triage_checkin", "missed_followup"] },
          },
          required: ["sessionId", "userId", "delayHours", "messageTemplate"],
        },
      },
    },
  ];

  let activeNode = activeNodeId;
  const conversation: any[] = [
    {
      role: "system",
      content: SYSTEM_PROMPT,
    },
    ...messages,
  ];

  for (let turn = 0; turn < 5; turn++) {
    const body = {
      model: "deepseek/deepseek-v4-flash",
      messages: conversation,
      tools,
      tool_choice: "auto" as const,
      temperature: 0.3,
      max_tokens: 1024,
    };

    let res: Response | null = null;
    for (let attempt = 0; attempt < 3; attempt++) {
      if (attempt > 0) await new Promise(r => setTimeout(r, 1000 * attempt));
      res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${openrouterKey}` },
        body: JSON.stringify(body),
      });
      if (res.ok) break;
      const errBody = await res.text();
      // Retry on 5xx / 429 / 403 (rate-limit / overloaded)
      if (res.status >= 500 || res.status === 429 || res.status === 403) {
        logger.warn("OpenRouter transient error, retrying", { status: res.status, attempt });
        continue;
      }
      throw new Error(`OpenRouter error ${res.status}: ${errBody}`);
    }
    if (!res || !res.ok) {
      const errBody = res ? await res.text() : "no response";
      throw new Error(`OpenRouter error ${res?.status}: ${errBody}`);
    }

    const data = await res.json() as any;
    const choice = data.choices?.[0];
    if (!choice) throw new Error("No response from OpenRouter");

    const finishReason = choice.finish_reason;
    const msg = choice.message;

    conversation.push(msg);

    if (finishReason === "stop") {
      return { reply: msg?.content || "", nodeId: activeNode };
    }

    if (finishReason === "tool_calls" && msg?.tool_calls) {
      for (const tc of msg.tool_calls) {
        const args = JSON.parse(tc.function.arguments);
        let result: any;
        if (tc.function.name === "vectorSearch") {
          result = await vectorSearch({ patientMessage: args.patientMessage, activeNodeId: args.activeNodeId || activeNode });
          activeNode = result.nodeId || activeNode;
        } else if (tc.function.name === "clinicalRule") {
          const { clinicalRule: ruleFn } = await import("../../agents/triage/tools/clinicalRule");
          result = await ruleFn(args);
        } else if (tc.function.name === "scheduleFollowup") {
          if (sessionId && userId) {
            result = await scheduleFollowup({ sessionId, userId, delayHours: args.delayHours, messageTemplate: args.messageTemplate });
          } else {
            result = { scheduled: false, error: "Missing session or user context" };
          }
        } else {
          result = { ok: true };
        }
        conversation.push({
          role: "tool",
          tool_call_id: tc.id,
          content: JSON.stringify(result),
        });
      }
      continue;
    }

    return { reply: msg?.content || "", nodeId: activeNode };
  }

  return { reply: "I'm not sure I can help with that. Could you describe your symptoms in more detail?", nodeId: activeNode };
}

export const chatRoute = Router();

// ── Shared pre-checks (emergency, greeting, consent, vector search) ──
async function preChecks(
  req: any,
  sessionId: string,
  message: string,
): Promise<{ earlyReturn?: any; session?: any; activeNodeId?: string; userId?: string; userMsg?: any }> {
  const userId = req.user?.id;
  if (!userId) return { earlyReturn: { status: 401, body: { error: "UNAUTHORIZED", message: "A user token is required" } } };

  const tenantId = req.headers["x-tenant-id"] as string | undefined;
  const session = await getOrCreateSession(sessionId, userId, tenantId);
  const userMsg = { role: "user" as const, content: message, timestamp: new Date().toISOString() };
  await appendMessage(sessionId, userId, userMsg);

  if (EMERGENCY_PATTERNS.some((p) => p.test(message))) {
    await appendMessage(sessionId, userId, { role: "assistant", content: EMERGENCY_REPLY, timestamp: new Date().toISOString() });
    await updateSessionGraphState(sessionId, userId, { verdict: "emergency", status: "closed" });
    return { earlyReturn: { status: 200, body: { reply: EMERGENCY_REPLY, saved: true, urgency: "emergency" } }, session, userId, userMsg };
  }

  if (GREETING_PATTERNS.some((p) => p.test(message.trim()))) {
    await appendMessage(sessionId, userId, { role: "assistant", content: GREETING_REPLY, timestamp: new Date().toISOString() });
    return { earlyReturn: { status: 200, body: { reply: GREETING_REPLY, saved: true } }, session, userId, userMsg };
  }

  const consented = await hasConsented(userId);
  if (!consented) {
    await appendMessage(sessionId, userId, { role: "assistant", content: CONSENT_REPLY, timestamp: new Date().toISOString() });
    return { earlyReturn: { status: 200, body: { reply: CONSENT_REPLY, saved: true, consentRequired: true } }, session, userId, userMsg };
  }

  const traversalResult = await vectorSearch({ patientMessage: message, activeNodeId: session.activeNodeId });
  const activeNodeId = traversalResult.nodeId || session.activeNodeId;

  if (!activeNodeId) {
    await appendMessage(sessionId, userId, { role: "assistant", content: FALLBACK_REPLY, timestamp: new Date().toISOString() });
    return { earlyReturn: { status: 200, body: { reply: FALLBACK_REPLY, saved: true } }, session, userId, userMsg };
  }

  await updateSessionGraphState(sessionId, userId, { activeNodeId, lastFiringScore: traversalResult.score });
  return { session, activeNodeId, userId, userMsg };
}

// ── POST /chat (non-streaming) ────────────────────────────────────
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
    const checks = await preChecks(req, sessionId, message);
    if (checks.earlyReturn) { res.status(checks.earlyReturn.status).json(checks.earlyReturn.body); return; }

    const messagesForAgent = [...(checks.session!.messages || []), checks.userMsg].map((m: any) => ({ role: m.role, content: m.content }));
    const agentResult = await runEveAgent(messagesForAgent, checks.activeNodeId, sessionId, checks.userId);

    if (!agentResult.reply) throw new Error("Agent returned empty response");
    agentResult.reply = ensureEmotionTag(agentResult.reply);
    agentResult.reply = forceLaughTag(agentResult.reply, message);

    await appendMessage(sessionId, checks.userId!, { role: "assistant", content: agentResult.reply, timestamp: new Date().toISOString() });
    await updateSessionGraphState(sessionId, checks.userId!, { activeNodeId: agentResult.nodeId || checks.activeNodeId });

    saveSessionSummary(sessionId, checks.userId!, checks.session!.tenantId, { ...checks.session!, activeNodeId: checks.activeNodeId })
      .catch((err) => logger.warn("session summary save failed", { sessionId, error: (err as Error).message }));

    if (checks.session!.tenantId) {
      const totalTokens = Math.ceil((message.length + agentResult.reply.length) / 4);
      getEffectiveMultiplier(checks.session!.tenantId)
        .then((eff) => {
          const cost = computeTokenCost(totalTokens, totalTokens, eff.multiplier);
          return deductTokens(checks.session!.tenantId!, Math.ceil(cost))
            .then(() => recordTokenUsage({ tenantId: checks.session!.tenantId!, sessionId, promptTokens: totalTokens, completionTokens: totalTokens, multiplierApplied: eff.multiplier, costNgn: cost }));
        })
        .catch((err) => logger.warn("metering failed", { sessionId, error: (err as Error).message }));
    }

    res.json({ reply: agentResult.reply, saved: true });
  } catch (err) {
    try {
      const uid = (req as any).user?.id;
      if (uid) await appendMessage(sessionId, uid, { role: "assistant", content: FAILURE_REPLY, timestamp: new Date().toISOString() });
    } catch {}

    const errorMsg = (err as Error).message;
    logger.warn("chat route failed, returning fallback", { sessionId, error: errorMsg });
    sendErrorWebhook(err, { sessionId, route: "POST /chat" });
    const isDev = env.nodeEnv === "development";
    res.json({ reply: FAILURE_REPLY, saved: true, warning: "service_unavailable", ...(isDev && { debug: errorMsg }) });
  }
});

// ── POST /chat/stream (SSE streaming) ─────────────────────────────
chatRoute.post("/chat/stream", authMiddleware, async (req, res, next) => {
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
    logger.info("chat stream received", { sessionId });
    const checks = await preChecks(req, sessionId, message);
    if (checks.earlyReturn) { res.status(checks.earlyReturn.status).json(checks.earlyReturn.body); return; }

    // Set SSE headers
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");
    res.setHeader("X-Accel-Buffering", "no");
    res.flushHeaders();

    const openrouterKey = env.openrouterApiKey;
    if (!openrouterKey) throw new Error("OPENROUTER_API_KEY not configured");

    const messagesForAgent = [...(checks.session!.messages || []), checks.userMsg].map((m: any) => ({ role: m.role, content: m.content }));

    const tools = [
      { type: "function" as const, function: { name: "vectorSearch", description: "Search the knowledge graph", parameters: { type: "object", properties: { patientMessage: { type: "string" }, activeNodeId: { type: "string" } }, required: ["patientMessage"] } } },
      { type: "function" as const, function: { name: "clinicalRule", description: "Evaluate symptoms", parameters: { type: "object", properties: { severityScale: { type: "number" }, durationHours: { type: "number" }, associatedSymptoms: { type: "array", items: { type: "string" } }, redFlags: { type: "array", items: { type: "string" } }, nodeId: { type: "string" } }, required: ["severityScale", "durationHours", "nodeId"] } } },
      { type: "function" as const, function: { name: "scheduleFollowup", description: "Schedule follow-up", parameters: { type: "object", properties: { sessionId: { type: "string" }, userId: { type: "string" }, delayHours: { type: "number" }, messageTemplate: { type: "string", enum: ["post_triage_checkin", "missed_followup"] } }, required: ["sessionId", "userId", "delayHours", "messageTemplate"] } } },
    ];

    let activeNode = checks.activeNodeId;
    const conversation: any[] = [
      { role: "system", content: SYSTEM_PROMPT },
      ...messagesForAgent,
    ];

    let fullReply = "";
    let tagInjected = false;
    const isJokeRequest = /joke|funny|laugh|humor|humour|hilarious|comedy/i.test(message);

    for (let turn = 0; turn < 5; turn++) {
      const body = {
        model: "deepseek/deepseek-v4-flash",
        messages: conversation,
        tools,
        tool_choice: "auto" as const,
        temperature: 0.3,
        max_tokens: 1024,
        stream: true,
      };

      let apiRes: Response | null = null;
      for (let attempt = 0; attempt < 3; attempt++) {
        if (attempt > 0) await new Promise(r => setTimeout(r, 1000 * attempt));
        apiRes = await fetch("https://openrouter.ai/api/v1/chat/completions", {
          method: "POST",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${openrouterKey}` },
          body: JSON.stringify(body),
        });
        if (apiRes.ok) break;
        const errBody = await apiRes.text();
        if (apiRes.status >= 500 || apiRes.status === 429 || apiRes.status === 403) {
          logger.warn("OpenRouter transient error, retrying", { status: apiRes.status, attempt });
          continue;
        }
        throw new Error(`OpenRouter error ${apiRes.status}: ${errBody}`);
      }
      if (!apiRes || !apiRes.ok) {
        const errBody = apiRes ? await apiRes.text() : "no response";
        throw new Error(`OpenRouter error ${apiRes?.status}: ${errBody}`);
      }

      // Process SSE stream
      const reader = apiRes.body!.getReader();
      const decoder = new TextDecoder();
      let buffer = "";
      let turnText = "";
      let toolCalls: Map<number, { id: string; name: string; arguments: string }> = new Map();

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });

        const lines = buffer.split("\n");
        buffer = lines.pop() || "";

        for (const line of lines) {
          if (!line.startsWith("data: ")) continue;
          const data = line.slice(6).trim();
          if (data === "[DONE]") continue;

          let parsed: any;
          try { parsed = JSON.parse(data); } catch { continue; }

          const choice = parsed.choices?.[0];
          if (!choice) continue;

          const delta = choice.delta;
          if (!delta) continue;

          // Text content
          if (delta.content) {
            let chunk = delta.content;
            if (!tagInjected) {
              if (fullReply.length === 0 && !chunk.trimStart().startsWith("[")) {
                const forcedTag = isJokeRequest ? "[laugh] " : "[calm] ";
                chunk = forcedTag + chunk;
              }
              tagInjected = true;
            }
            turnText += chunk;
            fullReply += chunk;
            // Send SSE event to client
            res.write(`data: ${JSON.stringify({ delta: chunk })}\n\n`);
          }

          // Tool calls (accumulate arguments)
          if (delta.tool_calls) {
            for (const tc of delta.tool_calls) {
              const idx = tc.index ?? 0;
              if (!toolCalls.has(idx)) {
                toolCalls.set(idx, { id: tc.id || "", name: tc.function?.name || "", arguments: "" });
              }
              const existing = toolCalls.get(idx)!;
              if (tc.id) existing.id = tc.id;
              if (tc.function?.name) existing.name = tc.function.name;
              if (tc.function?.arguments) existing.arguments += tc.function.arguments;
            }
          }

          if (choice.finish_reason === "stop") break;
        }
        if (lines.some(l => l.startsWith("data: ") && l.slice(6).trim() === "[DONE]")) break;
      }

      // Handle tool calls
      if (toolCalls.size > 0) {
        const assistantMsg: any = { role: "assistant", content: turnText || null };
        assistantMsg.tool_calls = Array.from(toolCalls.values()).map(tc => ({
          id: tc.id,
          type: "function",
          function: { name: tc.name, arguments: tc.arguments },
        }));
        conversation.push(assistantMsg);

        for (const tc of toolCalls.values()) {
          const args = JSON.parse(tc.arguments);
          let result: any;
          if (tc.name === "vectorSearch") {
            result = await vectorSearch({ patientMessage: args.patientMessage, activeNodeId: args.activeNodeId || activeNode });
            activeNode = result.nodeId || activeNode;
          } else if (tc.name === "clinicalRule") {
            const { clinicalRule: ruleFn } = await import("../../agents/triage/tools/clinicalRule");
            result = await ruleFn(args);
          } else if (tc.name === "scheduleFollowup") {
            if (sessionId && checks.userId) {
              result = await scheduleFollowup({ sessionId, userId: checks.userId, delayHours: args.delayHours, messageTemplate: args.messageTemplate });
            } else {
              result = { scheduled: false, error: "Missing session or user context" };
            }
          } else {
            result = { ok: true };
          }
          conversation.push({ role: "tool", tool_call_id: tc.id, content: JSON.stringify(result) });
        }
        continue; // next turn
      }

      // No tool calls — we're done
      break;
    }

    // Send done signal
    res.write(`data: ${JSON.stringify({ done: true })}\n\n`);
    res.end();

    // Persist after streaming
    if (fullReply) {
      await appendMessage(sessionId, checks.userId!, { role: "assistant", content: fullReply, timestamp: new Date().toISOString() });
      await updateSessionGraphState(sessionId, checks.userId!, { activeNodeId: activeNode || checks.activeNodeId });

      saveSessionSummary(sessionId, checks.userId!, checks.session!.tenantId, { ...checks.session!, activeNodeId: checks.activeNodeId })
        .catch((err) => logger.warn("session summary save failed", { sessionId, error: (err as Error).message }));

      if (checks.session!.tenantId) {
        const totalTokens = Math.ceil((message.length + fullReply.length) / 4);
        getEffectiveMultiplier(checks.session!.tenantId)
          .then((eff) => {
            const cost = computeTokenCost(totalTokens, totalTokens, eff.multiplier);
            return deductTokens(checks.session!.tenantId!, Math.ceil(cost))
              .then(() => recordTokenUsage({ tenantId: checks.session!.tenantId!, sessionId, promptTokens: totalTokens, completionTokens: totalTokens, multiplierApplied: eff.multiplier, costNgn: cost }));
          })
          .catch((err) => logger.warn("metering failed", { sessionId, error: (err as Error).message }));
      }
    }
  } catch (err) {
    const errorMsg = (err as Error).message;
    logger.warn("chat stream failed", { sessionId, error: errorMsg });
    sendErrorWebhook(err, { sessionId, route: "POST /chat/stream" });

    // Try to send error as SSE before ending
    try {
      if (!res.headersSent) {
        res.setHeader("Content-Type", "text/event-stream");
        res.setHeader("Cache-Control", "no-cache");
        res.setHeader("Connection", "keep-alive");
        res.flushHeaders();
      }
      res.write(`data: ${JSON.stringify({ delta: FAILURE_REPLY, done: true })}\n\n`);
      res.end();
    } catch {}

    const uid = (req as any).user?.id;
    if (uid) {
      try { await appendMessage(sessionId, uid, { role: "assistant", content: FAILURE_REPLY, timestamp: new Date().toISOString() }); } catch {}
    }
  }
});
