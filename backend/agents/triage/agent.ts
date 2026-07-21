// Eve Agent — Triage
//
// Filesystem-first agent definition. This folder is independently
// versionable and reviewable by a non-developer: a clinical lead can
// read instructions.md and understand what Eve is supposed to do.
//
// Model: DeepSeek Chat (OpenAI-compatible)
// Tools: vectorSearch, clinicalRule, scheduleFollowup

import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

export { vectorSearch } from "./tools/vectorSearch";
export { clinicalRule } from "./tools/clinicalRule";
export { scheduleFollowup } from "./tools/scheduleFollowup";

const agentDirectory = dirname(fileURLToPath(import.meta.url));

export const agentConfig = {
  model: "deepseek-chat",
  temperature: 0.3,
  instructionsPath: join(agentDirectory, "instructions.md"),
} as const;
