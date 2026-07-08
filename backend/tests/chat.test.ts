// Basic health route test.

import { describe, expect, it } from "bun:test";
import { app } from "@/app";

describe("GET /health", () => {
  it("returns ok status", async () => {
    const response = await app.handle(new Request("http://localhost/health"));
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body.status).toBe("ok");
  });
});
