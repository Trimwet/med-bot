import { createServer } from "node:http";
import { afterEach, describe, expect, it } from "bun:test";

const servers: Array<{ close: () => void }> = [];

async function startTestServer() {
  process.env.OPENAI_API_KEY = "invalid-key";
  process.env.CORE_SECRET = "test-secret";
  process.env.NODE_ENV = "test";
  process.env.MONGODB_URI = "mongodb+srv://piusdivine18_db_user:divine1234@med-bot.jz1rvmm.mongodb.net/medbot?appName=Med-bot";

  const [{ app }] = await Promise.all([import("@/app")]);
  const server = createServer(app);
  await new Promise<void>((resolve) => server.listen(0, "127.0.0.1", resolve));
  servers.push(server);

  const address = server.address();
  if (!address || typeof address === "string") {
    throw new Error("Failed to allocate test server");
  }

  return { server, port: address.port };
}

afterEach(async () => {
  while (servers.length > 0) {
    const server = servers.pop();
    if (!server) continue;
    await new Promise<void>((resolve, reject) => server.close((err) => (err ? reject(err) : resolve())));
  }
});

describe("GET /health", () => {
  it("returns ok status", async () => {
    const { port } = await startTestServer();
    const response = await fetch(`http://127.0.0.1:${port}/health`);
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body.status).toBe("ok");
  });
});

describe("POST /chat", () => {
  it("persists the session even when the AI service is unavailable", async () => {
    const { port } = await startTestServer();
    const sessionId = `test-session-${Date.now()}`;

    const response = await fetch(`http://127.0.0.1:${port}/chat`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-core-secret": "test-secret",
      },
      body: JSON.stringify({ sessionId, message: "hello from test" }),
    });

    const body = await response.json();
    expect(response.status).toBe(200);
    expect(body.reply).toContain("trouble reaching");

    const { getDb, COLLECTIONS } = await import("@/db/client");
    const db = await getDb();
    const savedSession = await db.collection(COLLECTIONS.sessions).findOne({ sessionId });
    expect(savedSession?.messages).toHaveLength(2);
    expect(savedSession?.messages[1]?.role).toBe("assistant");

    await db.collection(COLLECTIONS.sessions).deleteOne({ sessionId });
  });
});
