import { getDb, COLLECTIONS } from "@/db/client";
import type { ClinicalInput, ClinicalResult, ClinicalRuleDocument } from "@/db/schema";

export async function loadClinicalRule(nodeId: string): Promise<ClinicalRuleDocument | null> {
  const db = await getDb();
  return db.collection<ClinicalRuleDocument>(COLLECTIONS.clinicalRules).findOne({ nodeId });
}

export async function evaluateClinicalRule(
  input: ClinicalInput,
  nodeId: string
): Promise<ClinicalResult> {
  const rule = await loadClinicalRule(nodeId);

  const emergencyThreshold = rule?.emergencyThreshold ?? 8;
  const consultThreshold = rule?.seeDoctorThreshold ?? 4;
  const watchPeriodHours = rule?.watchPeriodHours ?? 48;
  const knownRedFlags = rule?.redFlags ?? [];
  const selfCareGuidance = rule?.selfCareGuidance ?? "Monitor symptoms and rest. Seek care if they worsen.";

  const matchedRedFlags = input.redFlags.filter((flag) =>
    knownRedFlags.some((known) => known.toLowerCase() === flag.toLowerCase())
  );

  if (matchedRedFlags.length > 0) {
    return {
      score: 10,
      severity: "emergency",
      matchedRedFlags,
      nextStep: "Seek emergency medical attention immediately. Red flag symptoms detected.",
      guidanceText: "This may be a medical emergency. Go to the nearest hospital now.",
    };
  }

  const durationWeight = Math.min(input.durationHours / 24, 2);
  const rawScore = input.severityScale + durationWeight;
  const score = Math.min(Math.round(rawScore), 10);

  if (score >= emergencyThreshold) {
    return {
      score,
      severity: "emergency",
      matchedRedFlags: [],
      nextStep: "Seek emergency medical attention immediately.",
      guidanceText: "Your symptoms suggest this may need urgent care. Please see a doctor right away.",
    };
  }

  if (score >= consultThreshold || input.durationHours >= watchPeriodHours) {
    return {
      score,
      severity: "consult",
      matchedRedFlags: [],
      nextStep: "Consult a healthcare professional within 24 hours.",
      guidanceText: "Your symptoms should be evaluated by a doctor soon. Schedule an appointment.",
    };
  }

  return {
    score,
    severity: "self_care",
    matchedRedFlags: [],
    nextStep: "Self-care is appropriate.",
    guidanceText: selfCareGuidance,
  };
}
