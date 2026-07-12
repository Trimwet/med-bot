---
nodeId: "fever.step_1"
protocolId: "fever"
protocolVersion: "1.0"
title: "Fever — Initial Assessment"
activationThreshold: 0.75
triageQuestions:
  - "What is your temperature (if you have a thermometer)?"
  - "How many days have you had the fever?"
  - "Do you have any other symptoms like cough, body aches, or vomiting?"
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
  - toNodeId: "fever.step_2_severe"
    label: "high fever with red flags"
  - toNodeId: "fever.step_2_mild"
    label: "mild to moderate fever without red flags"
updatedBy: "Dr. Musa (clinical lead)"
---

# Fever Protocol — Step 1

Fever is a common symptom that can range from a mild viral illness to a sign of serious bacterial infection or malaria. Assess severity, duration, and accompanying symptoms.

In Nigeria, fever with any malaria-like symptoms (body aches, headache, chills) should be evaluated for malaria testing, especially in children and pregnant women.
