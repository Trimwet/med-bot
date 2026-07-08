// Clinical rule tool wrapper — Eve's interface to the deterministic
// scoring layer. Eve calls this after extracting structured variables
// from the patient's message plus the matched protocol node.

import {
  evaluateClinicalRule,
  type ClinicalInput,
  type ClinicalResult,
} from "@/services/clinicalRule.service";
import type { KnowledgeChunkMetadata } from "@/db/schema";

export const clinicalRuleTool = {
  name: "evaluate_clinical_rule",
  description:
    "Runs the deterministic Clinical Rule Layer against extracted patient variables and the matched protocol's metadata. Returns a severity score, category, and next step. This must be used for every triage decision — never state a severity without calling it.",
  parameters: {
    type: "object",
    properties: {
      severityScale: { type: "number", description: "Patient-reported severity, 1-10" },
      durationHours: { type: "number", description: "How long symptoms have persisted, in hours" },
      associatedSymptoms: { type: "array", items: { type: "string" } },
      redFlags: {
        type: "array",
        items: { type: "string" },
        description: "Any red-flag symptoms the patient mentioned, matched against protocol red flags",
      },
    },
    required: ["severityScale", "durationHours", "associatedSymptoms", "redFlags"],
  },
  execute(
    input: ClinicalInput,
    protocolMetadata: KnowledgeChunkMetadata
  ): ClinicalResult {
    return evaluateClinicalRule(input, protocolMetadata);
  },
};
