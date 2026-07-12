// Tool: clinicalRule — evaluates structured patient data against
// the Clinical Rule Layer and returns a verdict.
//
// Eve reads this result and phrases it — she never overrides it.

import { evaluateClinicalRule as evaluateRule } from "@/services/clinicalRule.service";
import type { ClinicalInput, ClinicalResult } from "@/db/schema";

export interface ClinicalRuleInput {
  severityScale: number;
  durationHours: number;
  associatedSymptoms: string[];
  redFlags: string[];
  nodeId: string;
}

export async function clinicalRule(input: ClinicalRuleInput): Promise<ClinicalResult> {
  const clinicalInput: ClinicalInput = {
    severityScale: input.severityScale,
    durationHours: input.durationHours,
    associatedSymptoms: input.associatedSymptoms,
    redFlags: input.redFlags,
  };

  return evaluateRule(clinicalInput, input.nodeId);
}
