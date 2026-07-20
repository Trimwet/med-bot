import { Router } from "express";
import { authMiddleware } from "@/middleware/auth.middleware";
import { textToSpeech as fishTts, isFishAudioConfigured } from "@/services/fishAudio.service";
import { textToSpeech as supertonicTts, isSupertonicConfigured, checkStatus as supertonicStatus } from "@/services/supertonic.service";
import { logger } from "@/lib/logger";

const router = Router();

/**
 * POST /api/voice/tts
 * Convert text to speech using Fish Audio.
 * Body: { text: string, format?: "mp3" | "wav" | "opus", speed?: number }
 * Returns: audio binary stream
 */
router.post("/tts", authMiddleware, async (req, res) => {
  try {
    if (!isFishAudioConfigured()) {
      res.status(503).json({ error: "Voice service not configured" });
      return;
    }

    const { text, format = "mp3", speed = 1 } = req.body;

    if (!text || typeof text !== "string" || text.trim().length === 0) {
      res.status(400).json({ error: "Text is required" });
      return;
    }

    if (text.length > 5000) {
      res.status(400).json({ error: "Text must be under 5000 characters" });
      return;
    }

    const audioBuffer = await fishTts({ text: text.trim(), format, speed });

    const contentTypes: Record<string, string> = {
      mp3: "audio/mpeg",
      wav: "audio/wav",
      opus: "audio/opus",
    };

    res.set({
      "Content-Type": contentTypes[format] || "audio/mpeg",
      "Content-Length": audioBuffer.length.toString(),
      "Cache-Control": "no-cache",
    });

    res.send(audioBuffer);
  } catch (error) {
    logger.error("Fish Audio TTS error:", error);
    res.status(500).json({ error: "Failed to generate speech" });
  }
});

/**
 * POST /api/voice/supertonic
 * Convert text to speech using local Supertonic server.
 * Body: { text: string, voice?: string, speed?: number }
 * Returns: WAV audio binary stream
 */
router.post("/supertonic", authMiddleware, async (req, res) => {
  try {
    const { text, voice = "M1", speed = 1.05 } = req.body;

    if (!text || typeof text !== "string" || text.trim().length === 0) {
      res.status(400).json({ error: "Text is required" });
      return;
    }

    const audioBuffer = await supertonicTts({ text: text.trim(), voice, speed });

    res.set({
      "Content-Type": "audio/wav",
      "Content-Length": audioBuffer.length.toString(),
      "Cache-Control": "no-cache",
    });

    res.send(audioBuffer);
  } catch (error) {
    logger.error("Supertonic TTS error:", error);
    res.status(500).json({ error: "Failed to generate speech" });
  }
});

/**
 * GET /api/voice/status
 * Check if voice services are available.
 */
router.get("/status", async (_req, res) => {
  const [fishAvailable, supertonicAvailable] = await Promise.all([
    Promise.resolve(isFishAudioConfigured()),
    supertonicStatus(),
  ]);
  res.json({
    fishAudio: fishAvailable,
    supertonic: supertonicAvailable,
  });
});

export default router;
