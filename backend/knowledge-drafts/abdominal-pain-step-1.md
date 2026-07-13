---
nodeId: "abdominal_pain.step_1"
protocolId: "abdominal_pain"
protocolVersion: "0.1-draft"
category: "gi"
subcategory: "abdominal_pain"
title: "Abdominal Pain — Initial Assessment"
activationThreshold: 0.70
triageQuestions:
  - "Where exactly is the pain, and did it come on suddenly or gradually?"
  - "How severe is the pain, and has it stayed the same, gotten better, or gotten worse?"
  - "Do you have fever, persistent vomiting, or blood in your vomit or stool (including black, tarry stool)?"
  - "Is there any chance you could be pregnant, and if so, do you have any vaginal bleeding or dizziness?"
  - "Does the pain spread to your chest, back, shoulder, or groin?"
  - "Do you have yellowing of the eyes/skin, or has your abdomen become swollen or distended?"
severityScale:
  "1-3": "Mild — dull or crampy pain, tolerable, no red flags"
  "4-6": "Moderate — persistent pain affecting daily activity, no red flags, or fever without other red flags"
  "7-10": "Severe — sudden/intense onset, red flag symptoms present, or pregnancy-related concern"
redFlags:
  - "sudden, severe, or 'worst ever' abdominal pain"
  - "pain with fever and chills"
  - "persistent vomiting, unable to keep anything down"
  - "blood in vomit, or black/tarry stool"
  - "possible pregnancy with abdominal pain, vaginal bleeding, dizziness, or fainting"
  - "pain radiating to chest, back, shoulder, or groin"
  - "abdomen that is rigid, swollen, or extremely tender to touch"
  - "yellowing of the skin or eyes (jaundice) with abdominal pain"
  - "pain in someone over 65, pregnant, or with a chronic illness that is new, severe, or worsening"
edges:
  - toNodeId: "abdominal_pain.step_2_mild"
    label: "mild-moderate pain, no red flags, tolerating fluids, alert"
  - toNodeId: "abdominal_pain.step_2_severe"
    label: "sudden/severe onset, red flag symptoms, or pregnancy-related concern"
updatedBy: "ai-draft-pending-clinical-review"
---

## Overview
Abdominal pain has an extremely wide range of causes, from mild indigestion to life-threatening surgical emergencies like a ruptured appendix, ectopic pregnancy, or perforated ulcer. The purpose of this protocol is not to diagnose the cause, but to reliably separate presentations that can be safely observed at home from those needing urgent evaluation — since delay in the latter group can be fatal.

## Symptom Details
- Location and onset are important clues but should not be over-relied on: pain that starts vaguely and later localizes (e.g. moving to the lower right side) is a classic appendicitis pattern, but presentations vary, especially in children, pregnant patients, and the elderly.
- Always ask about pregnancy possibility directly and non-judgmentally in anyone of childbearing age with abdominal pain — ectopic pregnancy is a time-critical emergency that can present with only moderate pain early on.
- Sudden, severe, "tearing" or "worst ever" pain is a red flag regardless of location, and can indicate a perforated organ or ruptured aneurysm.
- Older adults and immunocompromised patients can have serious intra-abdominal disease with deceptively mild pain — apply a lower threshold to escalate in this group.

## Self-Care Guidance
For mild, tolerable pain without any red flags: rest, sip clear fluids, avoid solid food temporarily if nauseated, and avoid alcohol and NSAIDs (e.g. ibuprofen) which can worsen stomach irritation. Monitor closely over the next several hours for any new or worsening symptoms.

## When to See a Doctor
Pain that persists beyond 24-48 hours, is getting worse rather than better, or interferes significantly with eating, drinking, or daily activity should prompt a clinical review even without hard red flags.

## When to Seek Emergency Care
Sudden or severe pain, pain with fever, persistent vomiting, blood in vomit or stool, suspected pregnancy with bleeding or dizziness, pain radiating to chest/back/shoulder/groin, a rigid or distended abdomen, or jaundice should all be treated as emergencies. Advise the patient to go to the nearest emergency department immediately rather than waiting to see if the pain settles.

## Notes for the Phrasing LLM
Ask about pregnancy possibility matter-of-factly, without assumption either way, since this materially changes urgency. For sudden/severe onset, be direct that this pattern is a classic sign of a surgical emergency and needs immediate evaluation — avoid hedging language that could delay care.
