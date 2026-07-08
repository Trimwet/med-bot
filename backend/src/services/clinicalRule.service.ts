// Clinical Rule Layer — deterministic scoring on top of retrieved
// protocol node metadata. This is intentionally NOT LLM-driven: the
// LLM (Eve) extracts variables from the patient, but the actual
// severity determination is a fixed, auditable formula reviewed by
// the Medical Advisors Board.

import type { KnowledgeChunkMetadata, TriageSeverity } from "@/db/schema";

export interface ClinicalInput {
  severityScale: number; // 1-10, patient-reported
  durationHours: number;
  associatedSymptoms: string[]; // free-text symptoms flagged by Eve
  redFlags: string[]; // matched against metadata.redFlags
}

export interface ClinicalResult {
  score: number;
  severity: TriageSeverity;
  matchedRedFlags: string[];
  nextStep: string;
}

const EMERGENCY_THRESHOLD = 8;
const CONSULT_THRESHOLD = 4;

export function evaluateClinicalRule(
  input: ClinicalInput,
  protocolMetadata: KnowledgeChunkMetadata
): ClinicalResult {
  const knownRedFlags = protocolMetadata.redFlags ?? [];
  const matchedRedFlags = input.redFlags.filter((flag) =>
    knownRedFlags.some((known) => known.toLowerCase() === flag.toLowerCase())
  );

  // Any matched red flag is an automatic emergency, regardless of score.
  if (matchedRedFlags.length > 0) {
    return {
      score: 10,
      severity: "emergency",
      matchedRedFlags,
      nextStep:
        "Seek emergency medical attention immediately. Red flag symptoms detected.",
    };
  }

  // Duration weighting: symptoms lasting longer nudge the score up slightly.
  const durationWeight = Math.min(input.durationHours / 24, 2);
  const rawScore = input.severityScale + durationWeight;
  const score = Math.min(Math.round(rawScore), 10);

  let severity: TriageSeverity;
  let nextStep: string;

  if (score >= EMERGENCY_THRESHOLD) {
    severity = "emergency";
    nextStep = "Seek emergency medical attention immediately.";
  } else if (score >= CONSULT_THRESHOLD) {
    severity = "consult";
    nextStep = "Consult a healthcare professional within 24 hours.";
  } else {
    severity = "self_care";
    nextStep = "Self-care is appropriate. Monitor symptoms and reassess if they worsen.";
  }

  return { score, severity, matchedRedFlags, nextStep };
}
