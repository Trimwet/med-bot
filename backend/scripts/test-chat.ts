// Full pipeline test — initial message + follow-up to get a verdict.
import { env } from "@/config/env";
import { getDb, COLLECTIONS, closeDb } from "@/db/client";
import { hashPassword, signJwtToken } from "@/services/auth.service";

const SESSION = `test-${Date.now()}`;

async function chat(token: string, message: string): Promise<any> {
  const res = await fetch(`http://localhost:${env.port}/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    body: JSON.stringify({ sessionId: SESSION, message }),
  });
  return res.json();
}

async function main() {
  console.log("=== Pipeline Test ===\n");

  // Create test user
  const db = await getDb();
  const users = db.collection(COLLECTIONS.users);
  let user = await users.findOne({ email: "test@pipeline.test" });
  if (!user) {
    const r = await users.insertOne({
      email: "test@pipeline.test",
      password: hashPassword("test1234"),
      isVerified: true,
      consentGivenAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    } as any);
    user = { _id: r.insertedId, email: "test@pipeline.test" } as any;
  }
  const token = signJwtToken((user as any)._id!.toString());
  console.log(`Session: ${SESSION}\n`);

  // Message 1 — initial symptoms
  const msg1 = "I have a fever of 39 degrees and a bad headache for 2 days now";
  console.log(`1) User: ${msg1}`);
  const r1 = await chat(token, msg1);
  console.log(`   Bot:  ${r1.reply}`);
  if (r1.clarifying) console.log("   (clarifying question)");
  console.log();

  // Message 2 — answer the clarifying question
  const msg2 = "I took paracetamol but the fever is still high";
  console.log(`2) User: ${msg2}`);
  const r2 = await chat(token, msg2);
  console.log(`   Bot:  ${r2.reply}`);
  console.log();

  // Message 3 — if still clarifying, provide more detail
  if (r2.clarifying) {
    const msg3 = "No other symptoms. I am drinking water and resting.";
    console.log(`3) User: ${msg3}`);
    const r3 = await chat(token, msg3);
    console.log(`   Bot:  ${r3.reply}`);
    console.log();
    printVerdict(r3);
  } else {
    printVerdict(r2);
  }

  await closeDb();
}

function printVerdict(res: any) {
  console.log("--- Verdict ---");
  if (res.verdict) console.log(`   Verdict: ${res.verdict}`);
  if (res.score !== undefined) console.log(`   Score:   ${res.score}`);
  if (res.matchedRedFlags) console.log(`   Red flags: ${(res.matchedRedFlags as string[]).join(", ") || "none"}`);
  if (res.warning) console.log(`   Warning: ${res.warning}`);
  if (res.debug) console.log(`   Debug:   ${res.debug}`);
  if (!res.verdict && !res.clarifying && !res.warning) console.log(`   Reply:  ${res.reply}`);
  if (res.clarifying) console.log("   (still gathering info)");
}

main().catch((e) => { console.error("FAIL:", e); process.exit(1); });
