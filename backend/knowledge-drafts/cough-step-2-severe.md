---
nodeId: "cough.step_2_severe"
protocolId: "cough"
protocolVersion: "0.1-draft"
category: "respiratory"
subcategory: "cough"
title: "Cough — Severe / Red Flag Present"
activationThreshold: 0.65
triageQuestions: []
severityScale:
  "7-10": "Severe — breathing difficulty, hemoptysis, cyanosis, confusion, chest pain, or TB-pattern symptoms"
redFlags:
  - "breathlessness at rest"
  - "coughing up blood"
  - "bluish lips or fingertips"
  - "confusion or altered consciousness"
  - "chest pain with breathing"
  - "cough over 2 weeks with night sweats/weight loss"
edges: []
updatedBy: "ai-draft-pending-clinical-review"
---

## Overview
This branch applies when the cough is accompanied by breathing difficulty, blood in the sputum, bluish discoloration, confusion, chest pain, a high fever, or a pattern consistent with possible TB (persistent >2 weeks with night sweats/weight loss).

## When to Seek Emergency Care
Breathing difficulty at rest, coughing blood, bluish lips/fingertips, confusion, or chest pain with breathing should be treated as a medical emergency — direct the patient to the nearest emergency facility immediately, do not delay for home treatment to be tried first.

## When to See a Doctor (non-emergency but urgent)
If the presentation is the TB-pattern (cough >2 weeks with night sweats or weight loss) without acute breathing difficulty or cyanosis, this still needs prompt clinical evaluation and TB testing — not a routine "see a doctor eventually," but a "get tested soon" recommendation.

## Notes for the Phrasing LLM
Distinguish clearly in your phrasing between the acute-emergency red flags (breathing difficulty, blood, cyanosis, confusion, chest pain — go now) and the TB-pattern red flags (long duration + night sweats/weight loss — get tested promptly, but this is not necessarily a same-hour emergency). Don't collapse both into identical urgency language, since the correct behaviors are different (ER now vs. book a test this week).
