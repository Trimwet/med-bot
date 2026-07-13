---
nodeId: "fatigue.step_1"
protocolId: "fatigue"
protocolVersion: "0.1-draft"
category: "general"
subcategory: "fatigue"
title: "Fatigue / Weakness — Initial Assessment"
activationThreshold: 0.65
triageQuestions:
  - "How long have you been feeling unusually tired or weak — days, weeks, or longer?"
  - "Do you have known sickle cell disease, and if so, does this feel like the start of a pain crisis?"
  - "Are you also short of breath, dizzy, or noticing a fast or irregular heartbeat?"
  - "Have you noticed yellowing of your eyes or skin, or unusually pale skin/gums?"
  - "Do you have a fever alongside the tiredness?"
  - "Is the weakness affecting one side of your body more than the other, or affecting your speech, vision, or walking?"
severityScale:
  "1-3": "Mild — generally tired but functioning normally, no red flags"
  "4-6": "Moderate — persistent fatigue affecting daily activity, or fever/pallor without other red flags"
  "7-10": "Severe — one-sided weakness/numbness, severe shortness of breath, chest pain, confusion, or sickle cell crisis pattern"
redFlags:
  - "sudden weakness or numbness on one side of the body, confusion, or trouble speaking, seeing, or walking (possible stroke)"
  - "known sickle cell disease with severe pain, fever above 38.5°C, chest pain, or breathing difficulty"
  - "shortness of breath, dizziness, or irregular heartbeat alongside fatigue (possible severe anemia)"
  - "very pale skin, gums, or inner eyelids"
  - "yellowing of the skin or eyes (jaundice) with fatigue"
  - "fever above 38.5°C with fatigue, especially in someone with sickle cell disease or another chronic illness"
  - "fatigue so severe the person cannot get out of bed or perform basic daily tasks"
edges:
  - toNodeId: "fatigue.step_2_mild"
    label: "generally tired, functioning normally, no red flags"
  - toNodeId: "fatigue.step_2_severe"
    label: "one-sided weakness, sickle cell crisis pattern, severe shortness of breath, pallor, jaundice, or fever with chronic illness"
updatedBy: "ai-draft-pending-clinical-review"
---

## Overview
Fatigue and weakness are extremely common and usually benign (poor sleep, stress, minor illness), but they are also a leading early warning sign for several serious conditions relevant in Nigeria specifically: severe anemia (including sickle cell crisis), stroke, and serious infection. The purpose of this protocol is to catch the presentations that need urgent attention while reassuring the majority who don't.

## Symptom Details
- Always ask specifically about known sickle cell disease — patients with SCD often recognize fatigue as their own early warning sign of a crisis, and should be taken seriously and escalated with a lower threshold.
- One-sided weakness, numbness, confusion, or speech/vision/walking difficulty is a stroke pattern and is always an emergency, regardless of how the fatigue itself is described.
- Pallor (pale skin, gums, or inner eyelids) and jaundice (yellowing) are visible clues to anemia and hemolysis that patients may not think to mention unprompted — ask directly.
- Shortness of breath or a racing/irregular heartbeat alongside fatigue suggests the body is struggling to compensate for reduced oxygen delivery and should be treated as a red flag.

## Self-Care Guidance
For mild, generalized tiredness without red flags: prioritize sleep, hydration, and regular meals; consider whether recent stress, poor sleep, or a minor illness explains it.

## When to See a Doctor
Fatigue persisting more than a week without a clear cause, or fatigue with mild fever or pallor but no other red flags, should prompt a clinical review, including basic blood tests to check for anemia.

## When to Seek Emergency Care
One-sided weakness/numbness/confusion/speech-vision-walking difficulty, a sickle cell crisis pattern (severe pain, fever, chest pain, breathing difficulty), severe shortness of breath or irregular heartbeat, marked pallor, or jaundice should all be treated as emergencies requiring immediate care.

## Notes for the Phrasing LLM
For suspected stroke (one-sided weakness/speech/vision changes), phrase this with maximum urgency and no hedging — time lost directly costs brain tissue. For patients with known sickle cell disease, validate that they often know their own body's warning signs best and should trust that instinct rather than wait it out.
