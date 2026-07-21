import { getDb, COLLECTIONS } from "@/db/client";
import { logger } from "@/lib/logger";
import { env } from "@/config/env";

interface NotificationPrefs {
  userId: string;
  emailNotifications: boolean;
  pushNotifications: boolean;
  assessmentAlerts: boolean;
  weeklyDigest: boolean;
  updatedAt: string;
}

const DEFAULT_PREFS: Omit<NotificationPrefs, "userId" | "updatedAt"> = {
  emailNotifications: true,
  pushNotifications: true,
  assessmentAlerts: true,
  weeklyDigest: false,
};

export async function getNotificationPrefs(userId: string): Promise<NotificationPrefs> {
  const db = await getDb();
  const prefs = await db
    .collection<NotificationPrefs>(COLLECTIONS.notificationPrefs)
    .findOne({ userId });
  return prefs || { ...DEFAULT_PREFS, userId, updatedAt: new Date().toISOString() };
}

export async function updateNotificationPrefs(
  userId: string,
  update: Partial<Omit<NotificationPrefs, "userId" | "updatedAt">>
): Promise<void> {
  const db = await getDb();
  await db
    .collection<NotificationPrefs>(COLLECTIONS.notificationPrefs)
    .updateOne(
      { userId },
      { $set: { ...update, updatedAt: new Date().toISOString() } },
      { upsert: true }
    );
}

/**
 * Send assessment completion email via Brevo.
 */
export async function sendAssessmentEmail(
  to: string,
  userName: string,
  verdict: string,
  summary?: string
): Promise<void> {
  if (!env.brevoApiKey) {
    logger.warn("BREVO_API_KEY not set, skipping assessment email");
    return;
  }

  const verdictLabel =
    verdict === "emergency"
      ? "Emergency"
      : verdict === "urgent"
      ? "Urgent"
      : verdict === "soon"
      ? "See a Doctor Soon"
      : verdict === "self-care"
      ? "Self-Care"
      : verdict;

  const subject = `Your MedBot Assessment Result — ${verdictLabel}`;
  const htmlContent = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="background: #073B4C; color: white; padding: 20px; border-radius: 8px 8px 0 0;">
        <h1 style="margin: 0; font-size: 20px;">MedBot Assessment Complete</h1>
      </div>
      <div style="background: #f9fafb; padding: 20px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 8px 8px;">
        <p>Hello ${userName || "there"},</p>
        <p>Your triage assessment has been completed. Here's a summary:</p>
        <div style="background: white; padding: 16px; border-radius: 8px; border-left: 4px solid ${
          verdict === "emergency" ? "#ef4444" : verdict === "urgent" ? "#f59e0b" : "#10b981"
        }; margin: 16px 0;">
          <p style="margin: 0; font-weight: bold; font-size: 16px;">Result: ${verdictLabel}</p>
          ${summary ? `<p style="margin: 8px 0 0; color: #6b7280;">${summary}</p>` : ""}
        </div>
        <p style="color: #6b7280; font-size: 14px;">
          <strong>Important:</strong> This is an AI-powered assessment and does not replace professional medical advice.
          If you're experiencing a medical emergency, please call 112 or visit your nearest hospital immediately.
        </p>
        <p style="margin-top: 24px;">
          <a href="${env.clientUrl}/dashboard" style="background: #073B4C; color: white; padding: 10px 20px; text-decoration: none; border-radius: 6px; font-weight: bold;">View Full Report</a>
        </p>
      </div>
    </div>
  `;

  try {
    const res = await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "api-key": env.brevoApiKey,
      },
      body: JSON.stringify({
        sender: { email: env.senderEmail, name: "MedBot" },
        to: [{ email: to }],
        subject,
        htmlContent,
      }),
    });

    if (!res.ok) {
      const err = await res.text();
      logger.warn("Assessment email failed", { to, status: res.status, error: err });
    } else {
      logger.info("Assessment email sent", { to });
    }
  } catch (err) {
    logger.warn("Assessment email error", { to, error: (err as Error).message });
  }
}
