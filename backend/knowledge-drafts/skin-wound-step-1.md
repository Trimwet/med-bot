---
nodeId: "skin_wound.step_1"
protocolId: "skin_wound"
protocolVersion: "0.1-draft"
category: "skin"
subcategory: "skin_wound"
title: "Skin Rash / Wound — Initial Assessment"
activationThreshold: 0.65
triageQuestions:
  - "Is this a wound/cut, a rash, or a swollen/red area of skin — and how did it start?"
  - "Is the redness spreading quickly, or do you see red streaks moving away from the area?"
  - "Do you have a fever, chills, a fast heartbeat, or feel generally unwell along with the skin problem?"
  - "Is there pus, cloudy or foul-smelling drainage, or is the pain much worse than the area looks?"
  - "Do you have diabetes, a weakened immune system, or poor circulation?"
  - "Is any part of the skin turning gray, purple, or black, or has it become numb?"
severityScale:
  "1-3": "Mild — small wound or localized rash, no spreading, no fever, no red flags"
  "4-6": "Moderate — localized redness/swelling with mild fever, or a wound not healing as expected, no severe red flags"
  "7-10": "Severe — rapidly spreading redness, red streaking, fever with feeling very unwell, or discolored/numb skin"
redFlags:
  - "redness spreading rapidly (visibly larger within hours)"
  - "red streaks extending from the wound or rash toward the rest of the body"
  - "fever with chills, confusion, rapid heartbeat, or feeling very unwell (possible sepsis)"
  - "pain that is severe and out of proportion to how the area looks"
  - "skin that is turning gray, purple, or black, or has become numb or hard"
  - "pus or thick, cloudy, green, or foul-smelling drainage"
  - "infection on the face, near the eyes, or in the genital area"
  - "wound from an animal or human bite, or occurring after recent surgery"
  - "diabetes, poor circulation, or a weakened immune system with any spreading infection"
edges:
  - toNodeId: "skin_wound.step_2_mild"
    label: "small wound or localized rash, no spreading, no fever, no red flags"
  - toNodeId: "skin_wound.step_2_severe"
    label: "rapidly spreading redness, red streaking, fever with feeling unwell, discolored/numb skin, or high-risk factors present"
updatedBy: "ai-draft-pending-clinical-review"
---

## Overview
Most minor cuts, scrapes, and rashes heal on their own with basic care. The purpose of this protocol is to catch the minority that represent a spreading bacterial skin infection (cellulitis), a deep or rapidly progressing soft-tissue infection, or early sepsis — all of which can escalate from "looks manageable" to life-threatening within hours to days if missed.

## Symptom Details
- A healthy healing wound should steadily improve day by day, with pain decreasing; some mild redness, warmth, and swelling in the first 1-2 days is normal.
- Ask specifically about the speed of spread — cellulitis characteristically expands visibly over hours, not days. If available, marking the edge of redness and rechecking in a few hours can help judge this.
- Pain that is severe and clearly out of proportion to how the wound or rash looks is a specific red flag for a rare but dangerous deep soft-tissue infection (necrotizing fasciitis) and should never be dismissed.
- Diabetes, poor circulation, and immunosuppression (chemotherapy, steroids, HIV) all raise the risk of rapid progression — apply a lower threshold to escalate in these patients.

## Self-Care Guidance
For a small wound or localized rash with no spreading, fever, or red flags: clean the wound gently with soap and water, keep it covered with a clean dressing, and change the dressing daily. Watch for the healing signs above over the next 1-2 days.

## When to See a Doctor
If a wound isn't visibly improving by day 2-3, if a rash is spreading slowly without other red flags, or if there is mild fever without other severe symptoms, advise a clinical review — oral antibiotics may be needed even without emergency-level severity.

## When to Seek Emergency Care
Rapidly spreading redness, red streaking, fever with chills/confusion/rapid heartbeat, severe pain out of proportion to appearance, or gray/purple/black/numb skin should all be treated as emergencies. Advise the patient to go to the nearest emergency department or urgent care immediately, especially if they have diabetes, poor circulation, or a weakened immune system.

## Notes for the Phrasing LLM
Be explicit that "getting worse over hours, not days" is the key distinguishing feature of a serious skin infection — patients often wait days before acting because they're comparing to a normal cold or cut. For pain out of proportion to appearance, flag this clearly as a reason to seek care immediately even if the skin doesn't look alarming yet.
