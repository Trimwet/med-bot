# Protocol Template — MedBot Knowledge Node
#
# Copy this file and fill in the fields to add a new protocol.
# Save as `knowledge/{protocol-slug}-step-1.md`.
#
# Categories:
#   infectious   — malaria, typhoid, fever, Lassa, meningitis
#   respiratory  — cough, TB, pneumonia, breathing difficulty, asthma
#   cardiac      — chest pain, hypertension, palpitations
#   gi           — diarrhoea, vomiting, dehydration, cholera, abdominal pain
#   neurological — headache, stroke, seizure, confusion, sickle cell crisis
#   maternal     — pregnancy complications, postpartum
#   trauma       — injuries, burns, fractures, snake bites
#   skin         — rashes, wounds, cellulitis, abscess
#   mental       — anxiety, depression, suicidal thoughts, panic
#   general      — non-specific, default fallback
#
# Protocol naming convention:
#   nodeId:   "{protocol_id}.step_{step}"  (e.g. malaria.step_1)
#   protocolId: "{protocol_id}"            (e.g. malaria)
#   filename:  "{protocol}-step-{n}.md"    (e.g. malaria-step-1.md)

---
nodeId: "example.step_1"
protocolId: "example"
protocolVersion: "1.0"
category: "general"
# subcategory: "example"
title: "Example — Initial Assessment"
activationThreshold: 0.70
triageQuestions:
  - "First follow-up question for the patient?"
  - "Second follow-up question?"
severityScale:
  "1-3": "Mild — description"
  "4-6": "Moderate — description"
  "7-10": "Severe — description"
redFlags:
  - "red flag symptom 1"
  - "red flag symptom 2"
edges:
  - toNodeId: "example.step_2_mild"
    label: "mild presentation without red flags"
  - toNodeId: "example.step_2_severe"
    label: "severe presentation with red flags"
updatedBy: "medbot-admin"
---

Write the protocol body here in plain, clinical English.

## Overview
Brief description of the condition and what the triage should focus on.

## Symptom Details
- Key feature 1
- Key feature 2

## Self-Care Guidance
What the patient can do if the verdict is self_care.

## When to See a Doctor
What warrants a consult verdict.

## When to Seek Emergency Care
What warrants an emergency verdict.

## Notes for the Phrasing LLM
Any specific guidance on how to communicate this protocol's results.
