---
nodeId: "fever.step_1"
protocolId: "fever"
protocolVersion: "1.1-draft"
category: "infectious"
subcategory: "fever"
title: "Fever — Initial Assessment"
activationThreshold: 0.75
triageQuestions:
  - "What is your temperature (if you have a thermometer)?"
  - "How many days have you had the fever?"
  - "Do you have any other symptoms like cough, body aches, or vomiting?"
  - "Do you suspect this might be malaria or typhoid, or have you had either before?"
severityScale:
  "1-3": "Low-grade fever (under 38°C)"
  "4-6": "Moderate fever (38-39°C)"
  "7-10": "High fever (above 39°C)"
redFlags:
  - "stiff neck"
  - "confusion"
  - "difficulty breathing"
  - "rash that doesn't fade when pressed"
  - "seizure"
edges:
  - toNodeId: "fever.step_2_malaria"
    label: "fever with chills, body aches, headache, sweats, or patient suspects/mentions malaria"
  - toNodeId: "fever.step_2_typhoid"
    label: "gradually rising fever with fatigue, headache, loss of appetite, abdominal discomfort, or patient suspects/mentions typhoid"
  - toNodeId: "fever.step_2_severe"
    label: "high fever with red flags not otherwise captured by malaria/typhoid branches"
  - toNodeId: "fever.step_2_mild"
    label: "mild to moderate fever without red flags and no malaria/typhoid-specific pattern"
updatedBy: "ai-draft-pending-clinical-review"
---

# Fever Protocol — Step 1

**REVISION NOTE FOR REVIEWER:** This is a proposed revision of the live
`fever.step_1` (currently reviewed by Dr. Musa). The only changes are:
(1) one added triage question asking directly about suspected malaria/typhoid,
and (2) two new routing edges to the new `fever.step_2_malaria` and
`fever.step_2_typhoid` branch nodes, positioned before the existing
mild/severe fallback edges. All original content, red flags, and severity
scale are unchanged. Please review alongside `fever-step-2-malaria.md` and
`fever-step-2-typhoid.md` as one linked set — promoting this file alone
without the other two would create dangling edges.

Fever is a common symptom that can range from a mild viral illness to a sign of serious bacterial infection or malaria. Assess severity, duration, and accompanying symptoms.

In Nigeria, fever with any malaria-like symptoms (body aches, headache, chills) should be evaluated for malaria testing, especially in children and pregnant women.

Patients presenting with a gradually rising fever, fatigue, and loss of appetite — or who explicitly mention typhoid — should be routed to the dedicated typhoid branch, which screens specifically for intestinal perforation and bleeding, the most dangerous typhoid complications in this setting.
