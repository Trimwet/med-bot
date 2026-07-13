---
nodeId: "chest_pain.step_1"
protocolId: "chest_pain"
protocolVersion: "1.0"
category: "cardiac"
subcategory: "chest_pain"
title: "Chest Pain — Initial Assessment"
activationThreshold: 0.78
triageQuestions:
  - "On a scale of 1-10, how severe is the pain?"
  - "How long have you had this pain (in hours)?"
  - "Are you also experiencing shortness of breath, sweating, or pain radiating to your arm or jaw?"
severityScale:
  "1-3": "Mild discomfort"
  "4-6": "Moderate pain"
  "7-10": "Severe pain"
redFlags:
  - "shortness of breath"
  - "radiating arm pain"
  - "radiating jaw pain"
  - "cold sweat"
  - "fainting"
edges:
  - toNodeId: "chest_pain.step_2_radiating"
    label: "pain radiates to arm or jaw"
  - toNodeId: "chest_pain.step_2_local"
    label: "pain stays in chest only"
updatedBy: "Dr. Musa (clinical lead)"
---

# Chest Pain Protocol — Step 1

Chest pain can range from minor muscular discomfort to a sign of a cardiac emergency. Ask the patient about severity, duration, and any accompanying red-flag symptoms before determining urgency.

If the patient reports **any** red-flag symptom (shortness of breath, pain radiating to the arm or jaw, cold sweat, or fainting), treat this as a probable emergency regardless of the reported pain score, and advise immediate emergency care.
