---
nodeId: "fever.step_2_severe"
protocolId: "fever"
protocolVersion: "1.0"
category: "infectious"
subcategory: "fever"
title: "Fever — Severe Assessment"
activationThreshold: 0.75
triageQuestions:
  - "Has the fever come down with paracetamol or ibuprofen?"
  - "Are you able to keep fluids down?"
  - "Is there any blood in your urine or stool?"
severityScale:
  "1-3": "Fever responding to medication"
  "4-6": "Fever partially responding"
  "7-10": "Fever not responding to medication"
redFlags:
  - "blood in urine"
  - "blood in stool"
  - "can't keep fluids down"
  - "confusion"
edges: []
updatedBy: "Dr. Musa (clinical lead)"
---

# Fever Protocol — Step 2 (Severe)

High fever with red flags requires prompt medical evaluation. In the Nigerian context, this includes ruling out severe malaria, typhoid, and meningitis. Advise the patient to go to a clinic or hospital for blood work.

If the patient is a child under 5, elderly, or pregnant, urgency is higher regardless of reported severity.
