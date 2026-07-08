// Eve agent core — orchestrates vector search + clinical rule layer +
// LLM response generation for a single turn of the conversation.

import OpenAI from "openai";
import { env } from "@/config/env";
import { EVE_SYSTEM_PROMPT } from "./system";
import { searchKnowledge } from "./tools/vectorSearch.tool";
import { clinicalRuleTool } from "./tools/clinicalRule.tool";
import { getOrCreateSession, appendMessage, updateSessionState } from "@/services/session.service";
import type { SessionMessage } from "@/db/schema";

const llm = new OpenAI({ apiKey: env.openaiApiKey });

// Cap how much history gets sent to the LLM to keep latency/cost bounded.
const MAX_HISTORY_MESSAGES = 12;

export interface EveTurnResult {
  reply: string;
  severity?: string;
  nextStep?: string;
}

export async function runEveTurn(
  sessionId: string,
  userMessage: string
): Promise<EveTurnResult> {
  const session = await getOrCreateSession(sessionId);

  const userMsg: SessionMessage = {
    role: "user",
    content: userMessage,
    timestamp: new Date().toISOString(),
  };
  await appendMessage(sessionId, userMsg);

  // 1. Vector search for the matching protocol node.
  const matches = await searchKnowledge(userMessage, 1);
  const match = matches[0];

  if (!match) {
    const fallback =
      "I couldn't confidently match your symptoms to a known protocol yet — could you describe what you're feeling in a bit more detail?";
    await appendMessage(sessionId, {
      role: "assistant",
      content: fallback,
      timestamp: new Date().toISOString(),
    });
    return { reply: fallback };
  }

  await updateSessionState(sessionId, {
    currentProtocol: match.metadata.protocolName,
    currentStep: match.metadata.step,
  });

  const recentHistory = session.messages.slice(-MAX_HISTORY_MESSAGES);

  const completion = await llm.chat.completions.create({
    model: env.llmModel,
    temperature: 0.2,
    messages: [
      { role: "system", content: EVE_SYSTEM_PROMPT },
      {
        role: "system",
        content: `Matched protocol node:\n${JSON.stringify(match.metadata, null, 2)}\n\nProtocol text:\n${match.text}`,
      },
      ...recentHistory.map((m) => ({
        role: m.role,
        content: m.content,
      })),
      { role: "user", content: userMessage },
    ],
    tools: [{ type: "function", function: clinicalRuleTool as any }],
  });

  const choice = completion.choices[0];
  const reply = choice.message.content ?? "";

  await appendMessage(sessionId, {
    role: "assistant",
    content: reply,
    timestamp: new Date().toISOString(),
  });

  return { reply };
}
