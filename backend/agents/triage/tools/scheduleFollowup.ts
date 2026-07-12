// Tool: scheduleFollowup — registers a delayed follow-up message
// after a session closes.
//
// Not yet implemented: requires BullMQ + Termii/Twilio.
// Currently a no-op that logs the intent.

import { logger } from "@/lib/logger";

export interface ScheduleFollowupInput {
  sessionId: string;
  patientPhone: string;
  delayHours: number;
  messageTemplate: "post_triage_checkin" | "missed_followup";
}

export interface ScheduleFollowupResult {
  scheduled: boolean;
  jobId?: string;
}

export async function scheduleFollowup(input: ScheduleFollowupInput): Promise<ScheduleFollowupResult> {
  logger.info("followup requested (not yet implemented)", {
    sessionId: input.sessionId,
    delayHours: input.delayHours,
    template: input.messageTemplate,
  });

  // TODO: Register a BullMQ delayed job that sends via Termii/Twilio
  return { scheduled: false };
}
