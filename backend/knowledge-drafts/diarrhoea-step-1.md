---
nodeId: "diarrhoea.step_1"
protocolId: "diarrhoea"
protocolVersion: "0.1-draft"
category: "gi"
subcategory: "diarrhoea"
title: "Diarrhoea — Initial Assessment"
activationThreshold: 0.70
triageQuestions:
  - "How many loose/watery stools have you had today?"
  - "Is there any blood in the stool, or does the stool look pale/watery like rice water?"
  - "Are you vomiting as well, and can you keep fluids down?"
  - "Do you feel very thirsty, dizzy when standing, or has your urine become very dark or infrequent?"
  - "Do you feel confused, drowsy, or too weak to sit up on your own?"
  - "How long has the diarrhoea lasted, and have you been in an area with a cholera outbreak?"
severityScale:
  "1-3": "Mild — a few loose stools, drinking fluids normally, no dehydration signs"
  "4-6": "Moderate — frequent watery stools, some thirst/reduced urination, but alert and able to drink"
  "7-10": "Severe — signs of dehydration/shock, unable to keep fluids down, confusion, or bloody/rice-water stool"
redFlags:
  - "unable to keep fluids down due to persistent vomiting"
  - "signs of dehydration: extreme thirst, dry mouth, sunken eyes, little or no urine, dizziness on standing"
  - "confusion, drowsiness, or inability to sit up unaided"
  - "blood in the stool"
  - "pale, watery, 'rice-water' stool (possible cholera)"
  - "known cholera outbreak in the area"
  - "muscle cramps or profound weakness alongside diarrhoea"
  - "diarrhoea in a young child, elderly person, or someone with a chronic illness, lasting more than 24 hours"
edges:
  - toNodeId: "diarrhoea.step_2_mild"
    label: "a few loose stools, drinking fluids normally, alert, no blood, no dehydration signs"
  - toNodeId: "diarrhoea.step_2_severe"
    label: "signs of dehydration, unable to keep fluids down, confusion, blood or rice-water stool, or known cholera exposure"
edges2note: "kept for reference only"
updatedBy: "ai-draft-pending-clinical-review"
---

## Overview
Diarrhoeal illness is extremely common and usually self-limiting, but it is also one of the most dangerous presentations in a Nigerian triage context specifically, because severe dehydration from cholera or other acute watery diarrhoea can progress to shock and death within hours if untreated. The core job of this protocol is to catch dehydration and cholera-pattern illness early, since oral rehydration is highly effective if started promptly.

## Symptom Details
- Ask about **stool appearance** directly — pale, watery "rice-water" stool is a specific and important clue for cholera.
- Dehydration signs to screen for: extreme thirst, dry mouth, sunken eyes, reduced or absent urination, dizziness on standing, and — in more severe cases — confusion, drowsiness, or inability to sit up unaided.
- Ask whether the patient can keep fluids down; this determines whether oral rehydration is feasible at home or whether the patient needs IV fluids at a facility.
- Children, elderly patients, and anyone with a chronic illness dehydrate faster and should be escalated with a lower threshold.

## Self-Care Guidance
For mild presentations (a few loose stools, no dehydration signs, tolerating fluids): the most important action is to keep drinking — water, oral rehydration solution (ORS), broth, or diluted juice. ORS is strongly preferred if available: 1 sachet mixed with 1 litre of clean water, or a homemade version using 1 litre of water with 6 level teaspoons of sugar and half a teaspoon of salt if sachets are unavailable. Avoid anti-diarrhoeal medications unless a clinician has advised them, since they can mask worsening illness. Continue eating as tolerated.

## When to See a Doctor
Diarrhoea persisting more than 2-3 days without improvement, or in a young child/elderly patient lasting more than 24 hours, warrants a clinical review even without hard dehydration red flags.

## When to Seek Emergency Care
Any sign of dehydration (extreme thirst, dry mouth, sunken eyes, little/no urine, dizziness), inability to keep fluids down, confusion or drowsiness, blood in the stool, rice-water stool, or known cholera exposure should be treated as an emergency. Advise the patient to go to the nearest health facility or cholera treatment centre immediately, while continuing to encourage fluid intake on the way if the patient is able to drink.

## Notes for the Phrasing LLM
Always mention oral rehydration solution by name for any diarrhoea case, mild or severe — it's the single most actionable, life-saving piece of guidance regardless of severity. For the severe/emergency branch, be explicit that dehydration from diarrhoea can become life-threatening within hours, and that the patient should not wait to see if things improve on their own.
