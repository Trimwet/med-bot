import { GoogleGenAI } from "@google/genai";
import { env } from "@/config/env";

// Google AI Studio gemini-embedding-001 — free tier, 3072 dimensions.
const ai = new GoogleGenAI({ apiKey: env.geminiApiKey });

function assertConfigured() {
  if (!env.geminiApiKey) {
    throw new Error(
      "GEMINI_API_KEY is not set — embeddings unavailable, falling back to keyword search"
    );
  }
}

export async function embedText(text: string): Promise<number[]> {
  assertConfigured();
  const res = await ai.models.embedContent({
    model: "gemini-embedding-001",
    contents: text,
  });
  return res.embeddings[0].values;
}

export async function embedBatch(texts: string[]): Promise<number[][]> {
  assertConfigured();
  const results = await Promise.all(
    texts.map((t) =>
      ai.models.embedContent({ model: "gemini-embedding-001", contents: t })
    )
  );
  return results.map((r) => r.embeddings[0].values);
}
