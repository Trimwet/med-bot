// Embeddings service using an OpenAI-compatible embedding API.

import OpenAI from "openai";
import { env } from "@/config/env";

const client = new OpenAI({ apiKey: env.openaiApiKey });

export async function embedText(text: string): Promise<number[]> {
  const response = await client.embeddings.create({
    model: env.embeddingModel,
    input: text,
  });
  return response.data[0].embedding;
}

export async function embedBatch(texts: string[]): Promise<number[][]> {
  const response = await client.embeddings.create({
    model: env.embeddingModel,
    input: texts,
  });
  return response.data.map((d) => d.embedding);
}
