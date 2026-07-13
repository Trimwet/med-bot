---
nodeId: "headache.step_1"
protocolId: "headache"
protocolVersion: "0.1-draft"
category: "neurological"
subcategory: "headache"
title: "Headache — Initial Assessment"
activationThreshold: 0.70
triageQuestions:
  - "When did the headache start, and did it come on suddenly (within seconds to minutes) or gradually?"
  - "On a scale of 1 to 10, how severe is the pain, and is it the worst headache you've ever had?"
  - "Do you have a fever, stiff neck, or dislike of bright light along with the headache?"
  - "Have you had any weakness, numbness, confusion, difficulty speaking, fainting, or vision changes?"
  - "Did the headache start after a fall, blow to the head, or accident?"
  - "Are you pregnant or did you recently give birth?"
severityScale:
  "1-3": "Mild — dull ache, no red flags, responds to rest/hydration"
  "4-6": "Moderate — persistent or worsening pain, no neurological red flags but not settling"
  "7-10": "Severe — thunderclap onset, worst-ever headache, or any red flag symptom present"
redFlags:
  - "sudden explosive onset reaching maximum pain within seconds to minutes (thunderclap headache)"
  - "worst headache of the patient's life"
  - "fever with neck stiffness or dislike of light (possible meningitis)"
  - "weakness, numbness, facial droop, slurred or difficult speech"
  - "confusion, seizure, fainting, or loss of consciousness"
  - "new vision loss, double vision, or eye pain with the headache"
  - "headache following a head injury, fall, or accident"
  - "new or unusual headache during pregnancy or shortly after childbirth"
  - "new headache pattern in someone over 50 with no prior headache history"
edges:
  - toNodeId: "headache.step_2_mild"
    label: "gradual onset, mild-to-moderate pain, no fever/stiff neck/neurological symptoms, not after injury"
  - toNodeId: "headache.step_2_severe"
    label: "sudden severe onset, worst-ever headache, or any red flag such as fever with stiff neck, weakness, confusion, vision loss, or head injury"
updatedBy: "ai-draft-pending-clinical-review"
---

## Overview
Headache is one of the most common complaints in any triage setting. The large majority are primary headaches (tension-type or migraine) and are not dangerous. The purpose of this protocol is not to diagnose the type of headache, but to reliably separate the common, self-limiting presentation from the small minority that signal a serious secondary cause — bleeding around the brain, meningitis, stroke, raised intracranial pressure, or a complication of pregnancy.

## Symptom Details
- Ask specifically about **speed of onset**: a headache that reaches peak intensity within seconds to minutes ("thunderclap") is treated as an emergency regardless of the patient's pain tolerance or history of migraines.
- Ask about **associated symptoms** separately and explicitly — patients often won't volunteer neck stiffness, vision changes, or weakness unless asked directly.
- A headache that is simply "different from my usual headaches" (for a known migraine sufferer) should be treated with more caution than a first presentation matching that person's normal pattern.
- Pregnancy and the postpartum period change the risk calculus significantly (pre-eclampsia/eclampsia risk) — always ask.

## Self-Care Guidance
For mild, gradual-onset headaches with no red flags: rest in a quiet, dim room; drink water, especially if fluid intake has been low; eat if a meal was skipped; a standard-dose over-the-counter analgesic (e.g. paracetamol) may be considered if the patient has no medical reason to avoid it. Advise the patient to seek care if the headache doesn't improve within 48 hours, or worsens.

## When to See a Doctor
A headache that is persistent, progressively worsening over days, disrupts sleep or daily activity, doesn't respond to usual pain relief, or represents a new pattern for the patient — even without a hard red flag — warrants a prompt (non-emergency) clinical review.

## When to Seek Emergency Care
Any of the red flags listed above — in particular thunderclap onset, fever with stiff neck, any new neurological symptom (weakness, confusion, speech difficulty, vision loss, seizure, fainting), or headache after a head injury — should be escalated to emergency care immediately, not scheduled as a routine consult.

## Notes for the Phrasing LLM
Do not reassure the patient that "it's probably nothing" when any red flag is present — state plainly that this combination of symptoms needs urgent in-person evaluation and why (e.g. "a headache with fever and a stiff neck can be a sign of meningitis, which needs urgent treatment"). For mild presentations, it's fine to be reassuring, but still mention the 48-hour/worsening threshold for follow-up.
