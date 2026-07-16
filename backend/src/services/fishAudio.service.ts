import { env } from "@/config/env";

const FISH_API_URL = "https://api.fish.audio/v1/tts";
const MODEL = "s2.1-pro-free";

interface TTSOptions {
  text: string;
  format?: "mp3" | "wav" | "opus";
  speed?: number;
}

/**
 * Convert text to speech using Fish Audio's free tier.
 * Returns a ReadableStream of audio data.
 */
export async function textToSpeech(options: TTSOptions): Promise<Buffer> {
  const { text, format = "mp3", speed = 1 } = options;

  if (!env.fishAudioApiKey) {
    throw new Error("FISH_AUDIO_API_KEY is not configured");
  }

  if (!text || text.trim().length === 0) {
    throw new Error("Text is required for TTS synthesis");
  }

  const payload: Record<string, any> = {
    text: text.slice(0, 5000),
    format,
    temperature: 0.7,
    top_p: 0.7,
    prosody: {
      speed,
      volume: 0,
      normalize_loudness: true,
    },
    chunk_length: 300,
    normalize: true,
    latency: "balanced" as const,
  };

  if (env.fishAudioVoiceId) {
    payload.reference_id = env.fishAudioVoiceId;
  }

  const response = await fetch(FISH_API_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${env.fishAudioApiKey}`,
      "Content-Type": "application/json",
      model: MODEL,
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(`Fish Audio TTS failed (${response.status}): ${errorBody}`);
  }

  const arrayBuffer = await response.arrayBuffer();
  return Buffer.from(arrayBuffer);
}

/**
 * Check if Fish Audio is configured.
 */
export function isFishAudioConfigured(): boolean {
  return Boolean(env.fishAudioApiKey);
}
