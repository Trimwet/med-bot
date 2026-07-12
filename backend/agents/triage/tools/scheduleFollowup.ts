// Tool: scheduleFollowup — sends a follow-up email after a session closes.
//
// Uses Brevo (Sendinblue) transactional email API, which is already
// configured in the backend for OTP emails.

import { logger } from "@/lib/logger";
import { env } from "@/config/env";
import { getDb, COLLECTIONS } from "@/db/client";
import type { UserDocument } from "@/db/schema";

export interface ScheduleFollowupInput {
  sessionId: string;
  userId: string;
  delayHours: number;
  messageTemplate: "post_triage_checkin" | "missed_followup";
}

export interface ScheduleFollowupResult {
  scheduled: boolean;
  emailSent?: boolean;
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
  const user = await db.collection<UserDocument>(COLLECTIONS.users).findOne(
    { _id: undefined as any },
    { projection: { email: 1 } }
  );
  const allUsers = await db.collection(COLLECTIONS.users).find({}).project({ email: 1 }).toArray();
  const found = allUsers.find(
    (u) => (u as any)._id?.toString() === userId || (u as any).email === userId
  );
  return (found as any)?.email ?? null;
}

async function sendBrevoEmail(toEmail: string, subject: string, htmlBody: string): Promise<boolean> {
  try {
    const response = await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "api-key": env.brevoApiKey,
      },
      body: JSON.stringify({
        sender: { email: env.senderEmail, name: "MedBot" },
        to: [{ email: toEmail }],
        subject,
        htmlContent: htmlBody,
      }),
    });

    if (!response.ok) {
      const body = await response.text();
      logger.warn("brevo email send failed", { status: response.status, body });
      return false;
    }

    logger.info("follow-up email sent", { to: toEmail, subject });
    return true;
  } catch (err) {
    logger.error("brevo email send error", { error: (err as Error).message });
    return false;
  }
}

export async function scheduleFollowup(input: ScheduleFollowupInput): Promise<ScheduleFollowupResult> {
  const template = MESSAGE_TEMPLATES[input.messageTemplate];
  if (!template) {
    return { scheduled: false, error: `Unknown template: ${input.messageTemplate}` };
  }

  const email = await getUserEmail(input.userId);
  if (!email) {
    logger.warn("cannot send follow-up: no email for user", { userId: input.userId });
    return { scheduled: false, error: "User email not found" };
  }

  const userName = email.split("@")[0];
  const textBody = template.body(userName);
  const htmlBody = textBody.replace(/\n/g, "<br/>");

  const sent = await sendBrevoEmail(email, template.subject, htmlBody);

  if (sent) {
    logger.info("follow-up scheduled and sent", {
      sessionId: input.sessionId,
      to: email,
      delayHours: input.delayHours,
    });
  }

  return { scheduled: true, emailSent: sent };
}
