---
nodeId: "cough.step_1"
protocolId: "cough"
protocolVersion: "0.1-draft"
category: "respiratory"
subcategory: "cough"
title: "Cough — Initial Assessment"
activationThreshold: 0.70
triageQuestions:
  - "How long have you had the cough — days, weeks, or longer?"
  - "Are you coughing up any blood, or thick yellow/green mucus?"
  - "Do you have a fever, chest pain, or difficulty breathing along with the cough?"
  - "Have you had night sweats or unexplained weight loss?"
  - "Are your lips or fingertips looking bluish, or do you feel confused or unusually drowsy?"
  - "Do you have a known chronic illness such as asthma, COPD, heart failure, TB, or HIV?"
severityScale:
  "1-3": "Mild — short duration, no fever, no breathing difficulty, no blood in cough"
  "4-6": "Moderate — persistent (over 2-3 weeks), or with fever but no breathing difficulty/red flags"
  "7-10": "Severe — breathing difficulty, coughing blood, bluish lips, confusion, or chest pain with the cough"
redFlags:
  - "coughing up blood (hemoptysis)"
  - "breathlessness at rest or severe difficulty breathing"
  - "bluish lips or fingertips (cyanosis)"
  - "confusion or altered level of consciousness"
  - "chest pain with coughing or breathing"
  - "high fever (above 39°C) with the cough"
  - "cough lasting more than 2 weeks, especially with night sweats or weight loss (possible TB)"
  - "known HIV or other immunocompromising condition with a new persistent cough"
edges:
  - toNodeId: "cough.step_2_mild"
    label: "short-duration cough, no fever, no breathing difficulty, no blood, no weight loss"
  - toNodeId: "cough.step_2_severe"
    label: "breathing difficulty, blood in cough, bluish lips, confusion, chest pain, high fever, or cough over 2 weeks with night sweats/weight loss"
updatedBy: "ai-draft-pending-clinical-review"
---

## Overview
Most coughs are due to a mild, self-limiting upper respiratory infection. The purpose of this protocol is to separate that common presentation from pneumonia, severe asthma/COPD exacerbation, and tuberculosis — all of which are significant causes of morbidity and mortality in Nigeria and require prompt medical attention rather than self-care.

## Symptom Details
- Duration matters: a cough lasting more than 2-3 weeks is "chronic" by clinical convention and should prompt consideration of TB, especially when combined with night sweats, weight loss, or known TB/HIV exposure.
- Ask about breathing difficulty and chest pain explicitly and separately from "how bad is the cough" — patients often underreport breathlessness.
- Children, the elderly, and anyone with a chronic illness (asthma, COPD, heart failure, sickle cell disease, HIV) can deteriorate faster and should be treated with a lower threshold for escalation.
- Hemoptysis (blood in the cough/sputum) should always be treated as needing evaluation, not self-managed, regardless of how small the amount seems.

## Self-Care Guidance
For a short-duration cough with no fever, no breathing difficulty, and no red flags: rest, stay hydrated, warm fluids (e.g. tea with honey) may soothe throat irritation, and avoid smoke/dust irritants where possible.

## When to See a Doctor
A cough persisting beyond 2-3 weeks, a cough with fever but no breathing difficulty, or a cough that is not improving as expected should prompt a clinical review — particularly to rule out TB, which is common and treatable but easy to miss if dismissed as "just a cold."

## When to Seek Emergency Care
Difficulty breathing, blood in the cough, bluish lips or fingertips, confusion, or chest pain accompanying the cough should be treated as an emergency and the patient directed to the nearest emergency facility immediately.

## Notes for the Phrasing LLM
When TB risk factors are present (cough >2 weeks + night sweats/weight loss, or known HIV status), phrase the recommendation to see a doctor clearly and without stigma — TB is treatable, and early testing matters. Avoid alarming language; state the recommendation plainly and matter-of-factly.
