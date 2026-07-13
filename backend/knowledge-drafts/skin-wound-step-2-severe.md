---
nodeId: "skin_wound.step_2_severe"
protocolId: "skin_wound"
protocolVersion: "0.1-draft"
category: "skin"
subcategory: "skin_wound"
title: "Skin Rash / Wound — Severe / Red Flag Present"
activationThreshold: 0.70
triageQuestions: []
severityScale:
  "7-10": "Severe — rapidly spreading redness, red streaking, fever with feeling very unwell, or discolored/numb skin"
redFlags:
  - "redness spreading rapidly (visibly larger within hours)"
  - "red streaks extending from the wound or rash toward the rest of the body"
  - "fever with chills, confusion, rapid heartbeat, or feeling very unwell (possible sepsis)"
  - "pain that is severe and out of proportion to how the area looks"
  - "skin that is turning gray, purple, or black, or has become numb or hard"
  - "diabetes, poor circulation, or a weakened immune system with any spreading infection"
edges: []
updatedBy: "ai-draft-pending-clinical-review"
---

## Overview
This branch applies whenever redness is spreading rapidly, red streaking is present, fever accompanies a feeling of being very unwell, pain is out of proportion to appearance, or skin is discolored/numb. These patterns point toward cellulitis progressing to sepsis, or a rare but severe deep soft-tissue infection — both of which can worsen by the hour without treatment.

## When to Seek Emergency Care
Advise the patient to go to the nearest emergency department immediately, or call emergency services if the patient feels very unwell, confused, or is deteriorating quickly. Do not wait to see if the redness stops spreading — early IV antibiotics significantly change the outcome. Patients with diabetes, poor circulation, or a weakened immune system should be told explicitly that their infection can progress faster than usual and should not be watched at home.

## Notes for the Phrasing LLM
Be direct and unambiguous — avoid hedging language like "keep an eye on it." State clearly that this needs emergency care now, and if severe pain out of proportion to appearance is mentioned, flag this as especially urgent even if the skin doesn't look severe, since this can be an early sign of a deep, fast-moving infection.
