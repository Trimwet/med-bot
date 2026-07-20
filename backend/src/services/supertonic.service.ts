import { logger } from "@/lib/logger";

const SUPERTONIC_URL = process.env.SUPERTONIC_URL || "http://127.0.0.1:7788";

export function isSupertonicConfigured(): boolean {
  return !!process.env.SUPERTONIC_URL || true;
}

export async function textToSpeech(options: {
  text: string;
  voice?: string;
  speed?: number;
  steps?: number;
}): Promise<Buffer> {
  const { text, voice = "M1", speed = 1.05, steps = 8 } = options;

  const res = await fetch(`${SUPERTONIC_URL}/v1/tts`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      text,
      voice,
      lang: "en",
      steps,
      speed,
      response_format: "wav",
    }),
  });

  if (!res.ok) {
    const errText = await res.text().catch(() => "unknown");
    throw new Error(`Supertonic TTS failed (${res.status}): ${errText}`);
  }

  const arrayBuffer = await res.arrayBuffer();
  return Buffer.from(arrayBuffer);
}

export async function checkStatus(): Promise<boolean> {
  try {
    const res = await fetch(`${SUPERTONIC_URL}/docs`, { method: "GET", signal: AbortSignal.timeout(3000) });
    return res.ok;
  } catch {
    return false;
  }
}
