// Eve Agent — Triage
//
// Filesystem-first agent definition. This folder is independently
// versionable and reviewable by a non-developer: a clinical lead can
// read instructions.md and understand what Eve is supposed to do.
//
// Model: DeepSeek Chat (OpenAI-compatible)
// Tools: vectorSearch, clinicalRule, scheduleFollowup

export { vectorSearch } from "./tools/vectorSearch";
export { clinicalRule } from "./tools/clinicalRule";
export { scheduleFollowup } from "./tools/scheduleFollowup";

export const agentConfig = {
  model: "deepseek-chat",
  temperature: 0.3,
  instructionsPath: __dirname + "/instructions.md",
} as const;
