import OpenAI from "openai";
import { env } from "@/config/env";

const client = new OpenAI({
  apiKey: env.deepseekApiKey,
  baseURL: env.deepseekBaseUrl,
});

export async function embedText(text: string): Promise<number[]> {
  const response = await client.embeddings.create({
    model: env.deepseekEmbeddingModel,
    input: text,
  });
  return response.data[0].embedding;
}

export async function embedBatch(texts: string[]): Promise<number[][]> {
  const response = await client.embeddings.create({
    model: env.deepseekEmbeddingModel,
    input: texts,
  });
  return response.data.map((d) => d.embedding);
}
