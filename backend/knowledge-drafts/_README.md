# Knowledge Drafts — PENDING CLINICAL REVIEW

Files in this folder are **research drafts, not live protocols.** They were
compiled by an AI (Claude) from public clinical sources (NHS, WHO, CDC,
Merck Manual, peer-reviewed literature) to give a Nigerian clinician a
structured starting point — not a finished, deployable protocol.

## Do NOT run `npm run ingest` against this folder.

The ingest script only reads `backend/knowledge/`. These files live outside
that folder specifically so they can't accidentally go live to patients
before a doctor has checked them.

## Review workflow

1. **Validate structure first** — run `npm run validate-drafts` from `backend/`.
   This checks required fields, category enum correctness, edge routing,
   red-flag presence, and body section completeness. It catches structural
   bugs (e.g. a typo'd category) but says nothing about clinical accuracy —
   that part is still on a human.

2. **Clinician reviews content** against the checklist below.

3. **Promote reviewed files** — run:
   ```
   npm run promote-draft -- <file1.md> [file2.md ...]
   npm run promote-draft -- --protocol headache      # all headache-*.md files
   ```
   This will **refuse to promote** any file where `updatedBy` is still the
   AI placeholder (`ai-draft-pending-clinical-review`) — i.e. it enforces
   that a clinician has actually signed off, not just that the file exists.
   The script moves the file from `knowledge-drafts/` into `knowledge/` and
   deletes the draft copy.

4. **Ingest** — run `npm run ingest` to load the promoted file(s) into the DB.

## Review checklist before promoting a draft to `knowledge/`

- [ ] A licensed clinician has read the full body content, not just skimmed it
- [ ] Red flags match what you'd actually want a Nigerian patient asked, in Nigerian terms
      (e.g. malaria-endemic exposure, sickle cell status, local availability of care)
- [ ] `activationThreshold` and severity thresholds have been sanity-checked, not left at defaults
- [ ] Triage questions are things a patient can realistically self-report over WhatsApp/chat
- [ ] Self-care guidance doesn't overstate what's safe without a diagnosis
- [ ] `updatedBy` is changed from the AI-draft placeholder to the reviewing clinician's name
      (required — `promote-draft` will block on this)
- [ ] Sources are still current (medical guidance changes; see per-batch sourcing below)

## Sources used, by batch

**Batch 1 — headache, cough, diarrhoea** (compiled July 2026)
- NHS: National Headache Pathway (NHSCFSD), NHS headache guidance, Imperial NHS headache advice leaflet
- SNOOP red-flag framework for headache (widely used clinical mnemonic)
- Merck Manual Professional Edition — Cough in Adults
- WHO — Cholera fact sheet, cholera outbreak guidance, danger signs
- CDC — Cholera signs and symptoms
- WHO IMCI-style danger signs for pediatric pneumonia/respiratory distress (referenced via published triage literature)

**Batch 2 — abdominal pain, fatigue/weakness, skin rash/wound** (compiled July 2026)
- Emergency Medicine physician guidance (ACEP) — abdominal pain red flags, appendicitis, ectopic pregnancy
- PSNet/AHRQ, StatPearls (NIH) — abdominal pain in pregnancy, appendicitis in pregnancy
- NHLBI (NIH) — Sickle Cell Disease symptoms and emergency warning signs
- Mayo Clinic, Cleveland Clinic — sickle cell anemia complications, stroke warning signs (F.A.S.T.)
- Sickle Cell Information Center (scinfo.org) — recognizing emergencies, splenic sequestration, aplastic crisis
- Mayo Clinic — cellulitis symptoms, causes, and when to seek care
- Sepsis Alliance — cellulitis-to-sepsis progression
- GoodRx, general ED-physician sourced guidance — infected wound red flags, necrotizing fasciitis warning signs

None of this replaces an actual clinician writing/approving Nigeria-specific
guidance — treat the sourcing above as a starting bibliography, not a
substitute for review.

## Protocol status

| Protocol       | Nodes | Status              |
|----------------|-------|----------------------|
| headache       | 3     | drafted, unreviewed |
| cough          | 3     | drafted, unreviewed |
| diarrhoea      | 3     | drafted, unreviewed |
| abdominal_pain | 3     | drafted, unreviewed |
| fatigue        | 3     | drafted, unreviewed |
| skin_wound     | 3     | drafted, unreviewed |
| fever (revision) | 3   | drafted, unreviewed — see note below |

21 nodes across 6 new protocols + 1 revised protocol, 0 promoted to `knowledge/` so far.

### Special note: fever-step-1.md, fever-step-2-malaria.md, fever-step-2-typhoid.md

These three files are a **linked set** that revises the existing live `fever`
protocol (currently reviewed/live, credited to Dr. Musa) rather than a new
protocol. Per the earlier architecture decision, malaria and typhoid are
chief-complaint sub-branches under fever — not separate top-level protocols
— since patients self-report by these names but the underlying presentation
is still "fever."

`fever-step-1.md` in this folder is a **proposed revision** of the live file:
it adds one triage question and two new routing edges to the malaria/typhoid
branches, but keeps all original red flags and content otherwise unchanged.

**Promote these three together, not individually** — promoting `fever-step-1.md`
without the other two would create edges pointing at nodes that don't exist
yet in `knowledge/`. Suggested command once reviewed:
```
npm run promote-draft -- fever-step-1.md fever-step-2-malaria.md fever-step-2-typhoid.md
```

**Sources for this batch:**
- WHO criteria for severe malaria / danger signs (convulsions, prostration,
  inability to drink/breastfeed, repeated vomiting, impaired consciousness) —
  cross-checked against multiple WHO-referencing clinical trial protocols
- Mayo Clinic — malaria complications (cerebral malaria, blackwater fever, organ failure)
- Coalition Against Typhoid / Take on Typhoid — typhoid intestinal perforation
  epidemiology, specifically Africa/Nigeria-relevant TIP mortality data
- Severe Typhoid Fever Surveillance in Africa Program (Oxford Academic/OFID) —
  TIP presentation and country-level data including Nigeria
- Mayo Clinic — typhoid fever symptoms, complications, and emergency warning signs
