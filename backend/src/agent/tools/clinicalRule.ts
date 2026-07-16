import { defineTool } from "eve/tools";
import { z } from "zod";
import { evaluateClinicalRule } from "@/services/clinicalRule.service";
import type { ClinicalInput } from "@/db/schema";

export default defineTool({
  description: "Evaluate structured patient symptom data against the clinical rule layer and return a severity verdict (emergency, consult, or self_care) with guidance.",
  inputSchema: z.object({
    severityScale: z.number().min(1).max(10).describe("Patient-reported pain/severity on a 1-10 scale"),
    durationHours: z.number().describe("How long symptoms have lasted in hours"),
    associatedSymptoms: z.array(z.string()).describe("List of symptoms reported by the patient"),
    redFlags: z.array(z.string()).describe("Any red-flag symptoms present"),
    nodeId: z.string().describe("The matched protocol node ID"),
  }),
  async execute(input) {
    const clinicalInput: ClinicalInput = {
      severityScale: input.severityScale,
      durationHours: input.durationHours,
      associatedSymptoms: input.associatedSymptoms,
      redFlags: input.redFlags,
    };
    return evaluateClinicalRule(clinicalInput, input.nodeId);
  },
});
