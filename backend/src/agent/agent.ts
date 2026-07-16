import { defineAgent } from "eve";
import { openrouter } from "@openrouter/ai-sdk-provider";

export default defineAgent({
  model: openrouter("deepseek/deepseek-v4-flash"),
  modelContextWindowTokens: 128_000,
});
