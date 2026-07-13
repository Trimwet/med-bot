import { logger } from "@/lib/logger";
import { env } from "@/config/env";
import { getDb, COLLECTIONS } from "@/db/client";
import type { UserDocument, FollowupJobDocument } from "@/db/schema";
import { ObjectId } from "mongodb";
import { getFollowupQueue } from "@/services/queue.service";

export interface ScheduleFollowupInput {
  sessionId: string;
  userId: string;
  delayHours: number;
  messageTemplate: "post_triage_checkin" | "missed_followup";
}

export interface ScheduleFollowupResult {
  scheduled: boolean;
  emailSent?: boolean;
  queued?: boolean;
  error?: string;
}

const MESSAGE_TEMPLATES: Record<string, { subject: string; body: (userName: string) => string }> = {
  post_triage_checkin: {
    subject: "How are you feeling? — MedBot Follow-Up",
    body: (name: string) =>
      `Hi ${name},

Thank you for using MedBot for your health assessment.

We wanted to check in and see how you're feeling. If your symptoms have worsened or you have new concerns, please seek care at your nearest clinic or hospital.

If you'd like to start a new assessment, visit our dashboard anytime.

Stay safe,
The MedBot Team

—
This is an automated follow-up message. Please do not reply directly.`,
  },
  missed_followup: {
    subject: "You haven't completed your assessment — MedBot",
    body: (name: string) =>
      `Hi ${name},

We noticed you started a health assessment but didn't finish it. Your health is important, and we're here to help.

If you're still experiencing symptoms or have concerns, please continue your assessment or start a new one on the dashboard.

Stay safe,
The MedBot Team

—
This is an automated follow-up message. Please do not reply directly.`,
  },
};

async function getUserEmail(userId: string): Promise<string | null> {
  const db = await getDb();
  const users = db.collection<UserDocument>(COLLECTIONS.users);

  if (ObjectId.isValid(userId)) {
    const byId = await users.findOne(
      { _id: new ObjectId(userId) },
      { projection: { email: 1 } }
    );
    if (byId?.email) return byId.email;
  }

  const byEmail = await users.findOne(
    { email: userId },
    { projection: { email: 1 } }
  );
  return byEmail?.email ?? null;
}

export async function sendFollowupEmail(userId: string, messageTemplate: string): Promise<boolean> {
  const template = MESSAGE_TEMPLATES[messageTemplate];
  if (!template) {
    logger.warn("unknown followup template", { messageTemplate });
    return false;
  }

  const email = await getUserEmail(userId);
  if (!email) {
    logger.warn("cannot send follow-up: no email for user", { userId });
    return false;
  }

  const userName = email.split("@")[0];
  const textBody = template.body(userName);
  const htmlBody = textBody.replace(/\n/g, "<br/>");

  try {
    const response = await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "api-key": env.brevoApiKey,
      },
      body: JSON.stringify({
        sender: { email: env.senderEmail, name: "MedBot" },
        to: [{ email }],
        subject: template.subject,
        htmlContent: htmlBody,
      }),
    });

    if (!response.ok) {
      const body = await response.text();
      logger.warn("brevo email send failed", { status: response.status, body });
      return false;
    }

    logger.info("follow-up email sent", { to: email, subject: template.subject });
    return true;
  } catch (err) {
    logger.error("brevo email send error", { error: (err as Error).message });
    return false;
  }
}

export async function scheduleFollowup(input: ScheduleFollowupInput): Promise<ScheduleFollowupResult> {
  const scheduledFor = new Date(Date.now() + input.delayHours * 3600000).toISOString();
  const dedupeKey = `${input.sessionId}_${scheduledFor.slice(0, 13)}`;

  // Persist job to followupJobs collection for idempotency
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
    // Duplicate key — job already scheduled, skip
    logger.info("followup job already exists", { dedupeKey });
    return { scheduled: true, emailSent: false, queued: false };
  }

  // BullMQ path (async, delayed)
  const queue = getFollowupQueue();
  if (queue) {
    await queue.add(
      "send-followup",
      { sessionId: input.sessionId, userId: input.userId, messageTemplate: input.messageTemplate },
      { delay: input.delayHours * 3600000, deduplication: { id: dedupeKey, ttl: 86400000 } },
    );
    logger.info("followup job queued", { sessionId: input.sessionId, delayHours: input.delayHours });
    return { scheduled: true, queued: true };
  }

  // Fallback: send synchronously (no Redis)
  const sent = await sendFollowupEmail(input.userId, input.messageTemplate);
  return { scheduled: true, emailSent: sent, queued: false };
}
