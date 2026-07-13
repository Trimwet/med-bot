---
nodeId: "fever.step_2_typhoid"
protocolId: "fever"
protocolVersion: "1.1-draft"
category: "infectious"
subcategory: "typhoid"
title: "Fever — Suspected Typhoid"
activationThreshold: 0.65
triageQuestions:
  - "How many days have you had the fever, and does it tend to rise in the afternoon/evening?"
  - "Do you have severe or worsening abdominal pain, or does your belly feel swollen or rigid?"
  - "Have you vomited blood, or passed black, tarry, or bloody stool?"
  - "Have you completed a full course of antibiotics before, or is the fever not improving after 3-5 days of treatment?"
  - "Do you feel confused, unusually drowsy, or notice any change in your thinking or awareness?"
  - "Have your symptoms suddenly gotten worse after initially starting to feel better?"
severityScale:
  "1-3": "Mild — early fever with fatigue/headache/loss of appetite, no red flags"
  "4-6": "Moderate — fever persisting beyond 3-5 days despite treatment, or ongoing constipation/diarrhoea without red flags"
  "7-10": "Severe — sudden/severe abdominal pain or rigidity, GI bleeding, or confusion/altered awareness"
redFlags:
  - "sudden, severe, or sharply worsening abdominal pain (possible intestinal perforation)"
  - "abdomen that feels swollen, rigid, or extremely tender"
  - "vomiting blood, or black/tarry/bloody stool (possible intestinal bleeding)"
  - "confusion, altered awareness, or unusual drowsiness (possible typhoid encephalopathy)"
  - "sudden worsening of symptoms after initial improvement (possible complication or relapse)"
  - "fever lasting more than 5 days without improvement despite antibiotics (possible treatment failure or resistant strain)"
  - "signs of severe dehydration alongside fever and GI symptoms"
edges: []
updatedBy: "ai-draft-pending-clinical-review"
---

## Overview
Typhoid fever (Salmonella Typhi) is one of the most commonly self-reported illnesses in Nigeria and is generally treatable with antibiotics if caught early. Its most dangerous complication is intestinal perforation, which typically develops in the third week of untreated or inadequately treated illness and is a surgical emergency — data from Africa-wide surveillance (including Nigeria specifically) shows children are disproportionately affected, and outcomes are worse than in better-resourced settings. This branch applies when the patient reports a gradually rising ("step-ladder") fever with fatigue, headache, loss of appetite, and abdominal discomfort, or explicitly mentions suspecting typhoid.

## Symptom Details
- Typhoid fever classically rises gradually over several days rather than spiking suddenly, and is often described as worse in the late afternoon/evening.
- Sudden, sharp, or significantly worsening abdominal pain — especially with a rigid or swollen abdomen — is the hallmark of intestinal perforation and should never be dismissed as "just typhoid pain getting worse."
- GI bleeding (vomiting blood, black/tarry stool) is a distinct and serious complication separate from perforation, and also needs urgent hospital care.
- A sudden turn for the worse after the patient seemed to be improving is a specific pattern worth asking about directly — it can signal a developing complication rather than normal illness fluctuation.
- Because blood culture (the gold-standard test) is often unavailable or delayed in many Nigerian healthcare settings, typhoid is frequently diagnosed clinically — this makes red-flag screening even more important as a safety net.

## Self-Care Guidance
For mild, early-stage symptoms with no red flags: advise the patient to seek a clinical evaluation and testing rather than self-medicating with leftover or partial antibiotic courses, since inappropriate use drives antibiotic resistance and can mask worsening illness. While awaiting evaluation, encourage fluids, rest, and paracetamol for fever.

## When to See a Doctor
Fever persisting beyond 3-5 days, especially with the typical fatigue/headache/appetite-loss pattern, should prompt prompt clinical evaluation and testing — early treatment is what prevents progression to third-week complications like perforation.

## When to Seek Emergency Care
Sudden or severe abdominal pain, a rigid or swollen abdomen, vomiting blood, black/tarry stool, confusion or altered awareness, or a sudden worsening after initial improvement should all be treated as emergencies. Advise the patient to go to the nearest hospital immediately — intestinal perforation requires emergency surgery, and outcomes are strongly time-dependent.

## Notes for the Phrasing LLM
When the patient mentions "typhoid" by name, treat this as a signal to route here — but always still screen for the red flags above rather than assuming severity from the label. For suspected perforation (severe/worsening abdominal pain, rigid abdomen), be direct and unambiguous: this needs emergency surgical evaluation now, not a routine clinic visit. Avoid alarming language for the mild branch — most typhoid resolves well with prompt antibiotic treatment when caught early.
