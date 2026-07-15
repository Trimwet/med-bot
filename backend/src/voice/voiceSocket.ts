import { WebSocketServer, WebSocket } from "ws";
import type { Server } from "http";
import { env } from "@/config/env";
import { logger } from "@/lib/logger";

const FISH_WS_URL = "wss://api.fish.audio/v1/tts/live";
const MODEL = "s2.1-pro-free";

/**
 * Attach the streaming TTS WebSocket server to the existing HTTP server.
 * Endpoint: ws://host/api/voice/tts-stream
 *
 * Protocol:
 * Client → Server: { type: "text", text: "..." } or { type: "stop" }
 * Server → Client: { type: "audio", audio: "<base64>" } or { type: "finish" } or { type: "error", message: "..." }
 */
export function attachTtsWebSocket(server: Server) {
  const wss = new WebSocketServer({ noServer: true });

  server.on("upgrade", (req, socket, head) => {
    if (req.url === "/api/voice/tts-stream") {
      wss.handleUpgrade(req, socket, head, (ws) => {
        wss.emit("connection", ws, req);
      });
    } else {
      socket.destroy();
    }
  });

  wss.on("connection", (clientWs: WebSocket) => {
    if (!env.fishAudioApiKey) {
      clientWs.send(JSON.stringify({ type: "error", message: "FISH_AUDIO_API_KEY not configured" }));
      clientWs.close();
      return;
    }

    let fishWs: WebSocket | null = null;
    let sessionActive = false;

    function connectToFish(): Promise<WebSocket> {
      return new Promise((resolve, reject) => {
        const ws = new WebSocket(FISH_WS_URL, {
          headers: {
            Authorization: `Bearer ${env.fishAudioApiKey}`,
            model: MODEL,
          },
        });

        ws.on("open", () => {
          // Send start event with TTS config
          const startMsg = {
            event: "start",
            request: {
              text: "",
              format: "mp3",
              latency: "balanced",
              temperature: 0.7,
              top_p: 0.7,
              chunk_length: 300,
              normalize: true,
            },
          };
          ws.send(JSON.stringify(startMsg));
          sessionActive = true;
          resolve(ws);
        });

        ws.on("message", (data: Buffer) => {
          try {
            const msg = JSON.parse(data.toString());
            if (msg.event === "audio" && msg.audio) {
              // Forward audio chunk to client
              if (clientWs.readyState === WebSocket.OPEN) {
                clientWs.send(JSON.stringify({ type: "audio", audio: msg.audio }));
              }
            } else if (msg.event === "finish") {
              if (clientWs.readyState === WebSocket.OPEN) {
                clientWs.send(JSON.stringify({ type: "finish" }));
              }
              sessionActive = false;
            }
          } catch {
            // Ignore parse errors for binary data
          }
        });

        ws.on("error", (err) => {
          logger.error("Fish Audio WebSocket error:", err.message);
          if (clientWs.readyState === WebSocket.OPEN) {
            clientWs.send(JSON.stringify({ type: "error", message: "TTS stream error" }));
          }
          reject(err);
        });

        ws.on("close", () => {
          sessionActive = false;
        });
      });
    }

    clientWs.on("message", async (data: Buffer) => {
      try {
        const msg = JSON.parse(data.toString());

        if (msg.type === "text" && typeof msg.text === "string") {
          // Ensure Fish Audio connection exists
          if (!fishWs || fishWs.readyState !== WebSocket.OPEN) {
            fishWs = await connectToFish();
          }

          // Send text chunk to Fish Audio
          if (fishWs.readyState === WebSocket.OPEN) {
            fishWs.send(JSON.stringify({ event: "text", text: msg.text }));
            // Flush to force immediate synthesis
            fishWs.send(JSON.stringify({ event: "flush" }));
          }
        } else if (msg.type === "stop") {
          // End the TTS session
          if (fishWs && fishWs.readyState === WebSocket.OPEN) {
            fishWs.send(JSON.stringify({ event: "stop" }));
          }
        }
      } catch (err) {
        logger.error("Client message error:", err);
        if (clientWs.readyState === WebSocket.OPEN) {
          clientWs.send(JSON.stringify({ type: "error", message: "Invalid message" }));
        }
      }
    });

    clientWs.on("close", () => {
      if (fishWs && fishWs.readyState === WebSocket.OPEN) {
        fishWs.close();
      }
    });

    clientWs.on("error", () => {
      if (fishWs && fishWs.readyState === WebSocket.OPEN) {
        fishWs.close();
      }
    });
  });

  return wss;
}
