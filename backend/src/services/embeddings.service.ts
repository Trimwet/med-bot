import OpenAI from "openai";
import { env } from "@/config/env";

// Embeddings must go through OpenAI — DeepSeek has no embeddings endpoint,
// and "text-embedding-3-small" is an OpenAI-only model. Without an
// OPENAI_API_KEY these calls will fail fast, and callers (knowledgeGraph
// .service.ts) fall back to keyword search.
const client = new OpenAI({
  apiKey: env.openaiApiKey,
  baseURL: env.openaiBaseUrl,
});

function assertConfigured() {
  if (!env.openaiApiKey) {
    throw new Error(
      "OPENAI_API_KEY is not set — embeddings are unavailable, falling back to keyword search"
    );
  }
}

export async function embedText(text: string): Promise<number[]> {
  assertConfigured();
  const response = await client.embeddings.create({
    model: env.deepseekEmbeddingModel,
    input: text,
  });
  return response.data[0].embedding;
}

export async function embedBatch(texts: string[]): Promise<number[][]> {
  assertConfigured();
  const response = await client.embeddings.create({
    model: env.deepseekEmbeddingModel,
    input: texts,
  });
  return response.data.map((d) => d.embedding);
}
