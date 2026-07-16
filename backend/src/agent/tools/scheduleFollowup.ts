import { defineTool } from "eve/tools";
import { z } from "zod";
import { logger } from "@/lib/logger";
import { env } from "@/config/env";
import { getDb, COLLECTIONS } from "@/db/client";
import type { FollowupJobDocument } from "@/db/schema";
import { getFollowupQueue } from "@/services/queue.service";

export default defineTool({
  description: "Schedule a follow-up check-in for a patient after their triage session. Sends an email reminder after the specified delay.",
  inputSchema: z.object({
    sessionId: z.string().describe("The session ID to follow up on"),
    userId: z.string().describe("The user ID to contact"),
    delayHours: z.number().min(1).max(168).describe("Hours to wait before sending the follow-up"),
    messageTemplate: z.enum(["post_triage_checkin", "missed_followup"]).describe("Which email template to use"),
  }),
  async execute(input) {
    const scheduledFor = new Date(Date.now() + input.delayHours * 3600000).toISOString();
    const dedupeKey = `${input.sessionId}_${scheduledFor.slice(0, 13)}`;

    const db = await getDb();
    try {
      await db.collection<FollowupJobDocument>(COLLECTIONS.followupJobs).insertOne({
        sessionId: input.sessionId,
        tenantId: "",
        patientId: input.userId,
        scheduledFor,
        dedupeKey,
        status: "pending",
      });
    } catch {
      logger.info("followup job already exists", { dedupeKey });
      return { scheduled: true, emailSent: false, queued: false };
    }

    const queue = getFollowupQueue();
    if (queue) {
      await queue.add(
        "send-followup",
        { sessionId: input.sessionId, userId: input.userId, messageTemplate: input.messageTemplate },
        { delay: input.delayHours * 3600000, deduplication: { id: dedupeKey, ttl: 86400000 } },
      );
      return { scheduled: true, queued: true };
    }

    const sent = await sendFollowupEmail(input.userId, input.messageTemplate);
    return { scheduled: true, emailSent: sent, queued: false };
  },
});

async function sendFollowupEmail(userId: string, messageTemplate: string): Promise<boolean> {
  const db = await getDb();
  const users = db.collection<any>(COLLECTIONS.users);
  const user = await users.findOne({ _id: new (require("mongodb").ObjectId)(userId) }, { projection: { email: 1 } });
  if (!user?.email) return false;

  const templates: Record<string, { subject: string; body: (name: string) => string }> = {
    post_triage_checkin: {
      subject: "How are you feeling? — MedBot Follow-Up",
      body: (name) => `Hi ${name},\n\nThank you for using MedBot for your health assessment.\n\nWe wanted to check in and see how you're feeling. If your symptoms have worsened or you have new concerns, please seek care at your nearest clinic or hospital.\n\nIf you'd like to start a new assessment, visit our dashboard anytime.\n\nStay safe,\nThe MedBot Team`,
    },
    missed_followup: {
      subject: "You haven't completed your assessment — MedBot",
      body: (name) => `Hi ${name},\n\nWe noticed you started a health assessment but didn't finish it. Your health is important, and we're here to help.\n\nIf you're still experiencing symptoms or have concerns, please continue your assessment or start a new one on the dashboard.\n\nStay safe,\nThe MedBot Team`,
    },
  };

  const template = templates[messageTemplate];
  if (!template) return false;

  const userName = user.email.split("@")[0];
  const textBody = template.body(userName);
  const htmlBody = textBody.replace(/\n/g, "<br/>");

  try {
    const res = await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: { "Content-Type": "application/json", "api-key": env.brevoApiKey },
      body: JSON.stringify({
        sender: { email: env.senderEmail, name: "MedBot" },
        to: [{ email: user.email }],
        subject: template.subject,
        htmlContent: htmlBody,
      }),
    });
    return res.ok;
  } catch (err) {
    logger.warn("brevo email send failed", { error: (err as Error).message });
    return false;
  }
}
