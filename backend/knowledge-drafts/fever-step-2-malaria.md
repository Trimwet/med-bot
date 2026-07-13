---
nodeId: "fever.step_2_malaria"
protocolId: "fever"
protocolVersion: "1.1-draft"
category: "infectious"
subcategory: "malaria"
title: "Fever — Suspected Malaria"
activationThreshold: 0.70
triageQuestions:
  - "Have you had 1 or more convulsions (fits/seizures) in the last 24 hours?"
  - "Are you able to drink or breastfeed normally, and are you vomiting everything you take?"
  - "Are you able to sit up or stand on your own?"
  - "Have you noticed your urine looking unusually dark, red, or cola-colored?"
  - "Do you feel confused, unusually drowsy, or hard to wake up?"
  - "Have you noticed yellowing of your eyes or skin?"
severityScale:
  "1-3": "Mild — fever with typical malaria symptoms (chills, body aches, headache), alert, tolerating fluids, no danger signs"
  "4-6": "Moderate — persistent fever despite antimalarial treatment, or fever beyond 2-3 days without improvement"
  "7-10": "Severe — any WHO danger sign present: convulsion, unable to drink/breastfeed, repeated vomiting, unable to sit/stand, dark urine, confusion, jaundice"
redFlags:
  - "one or more convulsions in the past 24 hours"
  - "unable to drink or breastfeed"
  - "vomiting everything, unable to keep any fluids down"
  - "unable to sit or stand without help (prostration)"
  - "dark, red, or cola-colored urine (possible blackwater fever)"
  - "confusion, drowsiness, or difficulty waking (possible cerebral malaria)"
  - "yellowing of the eyes or skin (jaundice)"
  - "child under 5, pregnant, or known sickle cell disease with any fever suggestive of malaria"
edges: []
updatedBy: "ai-draft-pending-clinical-review"
---

## Overview
Malaria is the most common cause of fever in Nigeria and, per WHO criteria, can progress from uncomplicated illness to a life-threatening emergency (cerebral malaria, severe anemia, organ failure) within a day if the danger signs below are missed. This branch applies when the patient reports fever with typical malaria-associated symptoms (chills, body aches, headache, sweats) or explicitly mentions suspecting malaria. The goal is to reliably separate uncomplicated malaria — which is very treatable with prompt antimalarial therapy — from severe malaria, which needs emergency parenteral treatment.

## Symptom Details
- The WHO danger signs for severe/complicated malaria are: any convulsion in the past 24 hours, inability to drink or breastfeed, vomiting everything, inability to sit or stand unaided (prostration), and lethargy/reduced consciousness. Any one of these on its own is enough to escalate to emergency.
- Dark or "cola-colored" urine (hemoglobinuria) is a specific and serious sign — it indicates large-scale red blood cell destruction ("blackwater fever") and possible kidney involvement.
- Jaundice (yellow eyes/skin) with fever suggests either severe malaria-related hemolysis or another serious hepatic process, and should be treated with the same urgency.
- Children under 5, pregnant women, and people with sickle cell disease are all at substantially higher risk of rapid deterioration from malaria and should be triaged with a lower threshold — even a "mild-sounding" fever in these groups deserves prompt testing.
- A rapid diagnostic test (RDT) or blood film is the only way to confirm malaria — this protocol cannot and should not attempt a diagnosis, only route urgency.

## Self-Care Guidance
For mild presentations with no danger signs: advise the patient to get a malaria test (RDT or blood film) as soon as possible — same day if achievable — rather than self-treating blind. While awaiting testing/treatment, encourage fluids, rest, and paracetamol for fever/pain (avoid NSAIDs like ibuprofen if dengue-like illness can't be ruled out and platelet effects are a concern locally). Do not take leftover or partial-course antimalarials, as under-dosing contributes to drug resistance.

## When to See a Doctor
Fever persisting beyond 2-3 days despite antimalarial treatment, or fever that improves and then returns, should prompt a clinical review — this may indicate treatment failure, drug resistance, or a different or coexisting illness (e.g. typhoid).

## When to Seek Emergency Care
Any WHO danger sign — convulsion, inability to drink/breastfeed, repeated vomiting, inability to sit/stand, dark urine, confusion/reduced consciousness, or jaundice — should be treated as a medical emergency. Advise the patient to go to the nearest hospital immediately for parenteral (injectable) antimalarial treatment; oral medication and home management are not sufficient once danger signs appear. This applies with a lower threshold for children under 5, pregnant women, and people with sickle cell disease.

## Notes for the Phrasing LLM
When the patient mentions "malaria" by name, treat this as a strong signal to route here rather than the generic fever branch — but always still ask the danger-sign questions rather than assuming severity from the label alone. For danger signs, be direct and unambiguous: state clearly this needs hospital treatment now, and that oral medicine at home is not enough at this stage. Avoid alarming language for the mild branch — most malaria is very treatable once diagnosed and treated promptly.
