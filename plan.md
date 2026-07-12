MedBot
Final System Architecture & Business Blueprint
AI-Powered Medical Triage & Patient Engagement Platform — Nigeria

Technology Stack
Node.js  ·  Express  ·  MongoDB Atlas  ·  Eve Agent Framework  ·  DeepSeek LLM  ·  Redis / BullMQ  ·  Termii / Twilio  ·  Vercel
July 2026  —  Version 1.0  —  CONFIDENTIAL


1.  Executive Summary
MedBot is a multi-tenant, AI-driven medical triage and patient engagement platform built specifically for the Nigerian healthcare market. It guides patients through a structured clinical conversation, collects symptom data, applies doctor-approved decision rules, and returns one of three clear outcomes: self-care, see a doctor, or emergency. Proactive follow-up messages are sent automatically after each session to keep patients engaged without holding an expensive LLM session open.
The system is deliberately simple: six components, each with one job. Complexity lives in how those components work together, not in the number of moving parts. A hospital deploying MedBot does not need to understand machine learning. They interact with a dashboard, review session logs, and follow up on flagged cases.
This document is the single source of truth for the technology, data design, safety approach, and business model. Every implementation decision should be traceable back to a section in this document.

2.  Core Design Principles
Principle	What it means in practice
One component, one responsibility	Each of the six components does exactly one thing. Nothing overlaps. If you cannot describe a component's job in one sentence, it is too complex.
The LLM never makes clinical decisions	DeepSeek phrases answers in human language. It never decides emergency vs. self-care. That decision is always made by plain code reading plain numbers.
Every decision is auditable	A completed session produces a literal chain of nodes that fired, with scores. A doctor reviewing a case can see exactly why the system said emergency.
Protocol changes are data changes	Updating a clinical guideline means editing a record in MongoDB. It never requires touching or redeploying the agent code.
No complexity without a problem to solve	No ClickHouse, no Kafka, no Prometheus, no microservices. These solve problems MedBot does not have yet. Add them when the problem arrives, not before.


3.  System Architecture
3.1  The Six Components
Component	One-line responsibility
Express API Layer	Receives all HTTP requests. Handles auth, tenant resolution, rate limits, and routing.
Eve Agent Framework	Runs the patient conversation in natural language using DeepSeek LLM.
Clinical Rule Layer	A plain code module inside Express. Reads numbers, returns a verdict. The only place allowed to say emergency, see-a-doctor, or self-care.
MongoDB Atlas	Stores everything: patient records, session logs, clinical protocol nodes (as vectors), decision rules, token ledger, follow-up jobs.
Redis / BullMQ	Holds delayed jobs for proactive follow-up messages. Nothing more.
Notification Engine	Sends the follow-up messages via Termii or Twilio. No LLM involved.
3.2  Architecture Diagram
                  [ Patient ]
                  Web / WhatsApp / Mobile
                       |
                       | HTTPS
                       v
           ┌─────────────────────────┐
           │     Express API Layer    │
           │  Auth · Routing · Guards │
           └────────────┬────────────┘
                        |
          ┌─────────────┼──────────────┐
          |             |              |
          v             v              v
   ┌────────────┐ ┌──────────┐ ┌────────────────┐
   │  Eve Agent │ │ Clinical │ │  Redis/BullMQ  │
   │ DeepSeek   │ │  Rule    │ │  Delayed Jobs  │
   │ LLM        │ │  Layer   │ └───────┬────────┘
   └─────┬──────┘ └────┬─────┘         |
         |             |                v
         └──────┬──────┘      [ Notification Engine ]
                |              Termii / Twilio
                v              SMS / WhatsApp
       ┌─────────────────┐
       │  MongoDB Atlas  │
       │                 │
       │ knowledge graph │
       │ clinical rules  │
       │ sessions        │
       │ patients        │
       │ tenants         │
       │ token ledger    │
       │ followup jobs   │
       └─────────────────┘
3.3  Request Flow in Plain English
●Patient sends a message via web or WhatsApp.
●Express receives it, checks authentication, identifies the tenant (clinic/HMO), checks the session turn limit (circuit breaker), then passes it along.
●The safety floor runs first. Before anything else, if the message contains hardcoded emergency keywords (chest pain, can't breathe, unconscious, severe bleeding), the system returns an emergency response immediately — no LLM, no database query, no possible failure point.
●If the safety floor does not fire, the message goes to Eve.
●Eve asks MongoDB's vector index which clinical protocol node most closely matches what the patient said. This is retrieval only — no decision is made here.
●Eve reads the questions from that node, asks the patient the next question, and collects their answer (severity number, duration, symptoms).
●Those structured answers go to the Clinical Rule Layer — plain code. It reads the clinical_rules record for this node and returns one of three verdicts: self-care, see-a-doctor, or emergency.
●Eve is handed that verdict and phrases it clearly to the patient. She adds the relevant guidance from the protocol node. She cannot change the verdict.
●The session is updated in MongoDB: active node, firing score, conversation log, verdict.
●Token usage is written to the ledger asynchronously — it never slows down the response.
●After the session closes, a delayed follow-up job is registered in BullMQ. When it fires, the Notification Engine sends a WhatsApp/SMS message — no LLM involved.


4.  Eve Agent Framework
Eve is a filesystem-first agent. Each agent is a folder, not a class in application code. This means the agent's behavior is independently versionable and reviewable by a non-developer — a clinical lead can read instructions.md and understand what the bot is supposed to do.
4.1  Directory Structure
/agents/triage/
  instructions.md         ← behavior contract (what Eve is and is not allowed to do)
  agent.ts                ← DeepSeek model config + tool bindings
  tools/
    vectorSearch.ts       ← queries the knowledge graph, returns a matched node
    clinicalRule.ts       ← calls the Clinical Rule Layer, returns the verdict
    scheduleFollowup.ts   ← registers a delayed BullMQ job after session ends
4.2  What Goes in instructions.md
This file defines how Eve behaves and speaks. It never contains clinical content — no thresholds, no red-flag lists, no protocol logic. Those live in MongoDB where they can be updated without touching this file.
●Eve's identity: a calm, professional medical triage assistant serving Nigerian patients.
●Tone rules: plain language, no jargon, no emojis, always calm even in emergencies.
●The non-override rule: Eve always relays the Clinical Rule Layer's verdict exactly. She is not allowed to soften, upgrade, or bypass it based on what the patient says.
●Scope limits: Eve does not diagnose. She does not prescribe. She does not contradict the verdict because the patient disagrees.
●Consent: at session start, Eve must confirm the patient's consent before collecting any medical information.
4.3  What Eve Does Per Turn
Turn stage	What Eve does	What Eve does NOT do
Receive message	Sends message to vectorSearch tool to find matching node	Guess the topic herself
Read node	Reads the questions stored in the matched node	Invent her own clinical questions
Collect answers	Asks the patient for severity, duration, associated symptoms	Decide what the answers mean
Get verdict	Calls clinicalRule tool with the extracted numbers	Compute or override the verdict
Reply to patient	Phrases the verdict in clear, calm language with next steps	Change the verdict based on patient reaction
Close session	Calls scheduleFollowup tool to register a delayed job	Hold the session open or send the follow-up herself


5.  Clinical Knowledge Graph — Vector Nodes as Neurons
The knowledge graph is the clinical content of MedBot stored in MongoDB. Instead of searching the entire knowledge base from scratch every time a patient says something, the graph works like a network of neurons: when a node fires (matches), the next search is limited to only that node's neighbors. This keeps the conversation inside the correct clinical pathway and produces an auditable trail of exactly which steps fired and why.
5.1  How a Node is Structured
{
  nodeId:              "chest_pain.step_1",
  protocolId:          "chest_pain",
  protocolVersion:     "1.2",
  title:               "Chest Pain — Initial Assessment",
  content:             "Ask the patient about the nature, location, and onset of chest pain...",
  embedding:           [ ...1536 numbers ],
  activationThreshold: 0.78,
  edges: [
    { toNodeId: "chest_pain.step_2_radiating",
      triggerEmbedding: [...], label: "pain radiates to arm or jaw" },
    { toNodeId: "chest_pain.step_2_local",
      triggerEmbedding: [...], label: "pain stays in chest only" }
  ],
  updatedAt:           "2026-07-11",
  updatedBy:           "Dr. Musa (clinical lead)"
}
5.2  Traversal — Step by Step
●No active node yet (first message): run an unconstrained vector search across the entire knowledge_collection to find the entry node for this complaint.
●Active node exists (subsequent messages): search only within that node's edges[].toNodeId set. MongoDB Atlas vector search supports pre-filtering, so this is a real query, not an application-side filter loop.
●Score the patient's latest answer against each edge's triggerEmbedding. The edge that clears activationThreshold fires and becomes the new active node.
●No edge clears the threshold: do not force a match. Re-root to an unconstrained search — the conversation moved somewhere the graph did not anticipate.
●Store the new activeNodeId and the firing score on the session document after every turn.
5.3  Confidence Thresholds
Not every match is equally confident. The system behaves differently depending on the similarity score returned:
Score range	What it means	What happens
Above 0.85	High confidence match	Continue normally along the matched pathway.
0.65 – 0.85	Moderate confidence match	Eve asks a clarifying question before continuing. Example: Just to confirm — is the pain mainly in your chest?
Below 0.65	Low confidence match	Eve tells the patient the system is not confident about the topic and re-roots to a global search, or suggests they call a clinic directly.


6.  Clinical Rule Layer
The Clinical Rule Layer is a plain TypeScript module inside the Express application — not a separate service, not the LLM. It receives structured numbers extracted from the patient conversation and returns exactly one verdict. It cannot be talked into changing its mind by a patient.
6.1  What It Receives
{
  nodeId:          "chest_pain.step_1",
  severityScore:   8,
  durationHours:   2,
  reportedSymptoms: ["chest pain", "radiating to left arm", "sweating"],
}
6.2  How It Decides
●Loads the clinical_rules record for this nodeId from MongoDB (plain key-value lookup, not vector search).
●Checks reported symptoms against the node's red-flag list. Any match → emergency, regardless of severity score.
●If no red flags: checks severity score. At or above the emergency threshold → emergency.
●If severity is in the mid-range and duration exceeds the watch-period → see-a-doctor.
●Otherwise → self-care with the guidance text from the node.
6.3  What It Returns
{
  verdict:        "emergency",
  redFlagsFound:  ["radiating to left arm"],
  severityScore:  8,
  nextNodeId:     null,
  guidanceText:   "This may be a cardiac emergency. Go to the nearest hospital now."
}
The Clinical Rule Layer is the only component allowed to set the verdict field. Eve reads this result and phrases it — she is never given the opportunity to replace it with her own opinion.
6.4  Why It Is a Module, Not a Separate Service
Keeping it as a module inside Express means it is simpler to test (a plain function call), has no network latency, shares the same deployment, and does not require another service to be running. It only becomes a separate service if other applications need to call it independently — and that is not a current requirement.


7.  Safety Floor — Emergency Fallback
MedBot depends on MongoDB and DeepSeek being reachable. When they are not, a patient with a genuine emergency must still get a useful response. The safety floor is approximately 15 lines of code — a hardcoded keyword check that runs before any database or LLM call is made.
7.1  How It Works
●A short, hardcoded list of high-risk terms: chest pain, can't breathe, difficulty breathing, unconscious, severe bleeding, stroke, not breathing, heart attack, fitting, seizure.
●Every incoming message is checked against this list before anything else runs.
●Match found → the system returns a fixed emergency response immediately, regardless of whether MongoDB or DeepSeek is available.
●No match, but the main system call subsequently fails → the system returns a fixed connectivity-error response that still advises the patient to seek care if the situation feels urgent.
7.2  The Two Fixed Responses
// Emergency keyword match:
"What you are describing may be a medical emergency.
 Please go to the nearest hospital or call emergency services now.
 Do not wait."

// System unavailable, no keyword match:
"I am having trouble connecting right now.
 If your symptoms feel urgent or are getting worse,
 please go to the nearest hospital or call a doctor immediately."
This is not a fallback system — it is a safety rail. It adds no new component, no new database, nothing to maintain. It is one if-statement and two string constants.


8.  Monitoring — The Minimum That Is Not Nothing
Full observability stacks (Prometheus, Grafana, ClickHouse) solve problems MedBot does not have. What MedBot does need is one signal: if the Clinical Rule Layer crashes on a session that should have returned emergency, someone must know same-day. Everything else is noise at this stage.
8.1  What Gets Logged
●Every unhandled error, with the sessionId attached, written to stdout. Vercel captures this automatically — no new tool.
●Every escalation decision: sessionId, nodeId, verdict, red flags found. Written to the session document in MongoDB. Not a separate log service — it is part of the session record that already exists.
8.2  The One Alert
●A single webhook (Slack, WhatsApp, or email) that fires only when the Clinical Rule Layer itself throws an error.
●This is one try/catch block around the clinicalRule module with a single HTTP POST to a webhook URL on failure.
●No monitoring stack. No dashboards. One webhook, one error type.
Monitoring gets expanded when there are real users generating real patterns to observe. Not before.


9.  Protocol Versioning
Nigeria updates clinical guidelines. Malaria treatment protocols change. Hypertension thresholds shift. When that happens, MedBot should know which version of a protocol was used for which patient — not because it is legally required today, but because a doctor reviewing a historical case will want to know.
9.1  How Versioning Works
●Every node in knowledge_collection carries a protocolVersion field (e.g. "1.2").
●Every clinical_rules record carries a matching version field.
●When a session starts, the version of the active protocol is written to the session document.
●Updating a protocol means inserting new node records with an incremented version number — never overwriting old ones.
●Old versions are retained in the database indefinitely for audit purposes. They are excluded from active searches by a simple version filter.
9.2  What This Looks Like on a Session
{
  sessionId:        "sess_abc123",
  activeNodeId:     "chest_pain.step_2_radiating",
  protocolVersion:  "1.2",
  ...
}


10.  Database Schema — All Collections
10.1  knowledge_collection  (the neuron graph, vector-indexed)
{ nodeId, protocolId, protocolVersion, title, content,
  embedding [ ],  activationThreshold,
  edges: [{ toNodeId, triggerEmbedding [ ], label }],
  updatedAt, updatedBy }
10.2  clinical_rules  (the rulebook, plain lookup)
{ nodeId, protocolId, protocolVersion,
  emergencyThreshold,   // severity score at which verdict = emergency
  seeDoctorThreshold,   // severity score at which verdict = see-a-doctor
  watchPeriodHours,     // duration beyond which see-a-doctor overrides self-care
  redFlags: [ ],        // symptom strings; any match = emergency
  selfCareGuidance,     // text returned for low-severity sessions
  updatedAt, updatedBy }
clinical_rules is separated from knowledge_collection intentionally. A clinician can update a threshold without triggering a re-embedding. These are two different kinds of change with two different risk levels.
10.3  tenants
{ _id, name, tier, tokenBalance,
  subscriptionStartDate, subscriptionEndDate,
  whitelabelConfig: { logoUrl, primaryColor },
  createdAt }
10.4  patients
{ _id, tenantId, phone, name,
  consentGivenAt,         // NDPR: must exist before any health data is stored
  dataRetentionPolicy,    // how long this patient's records are kept
  createdAt }
10.5  sessions
{ _id, tenantId, patientId, channel,
  activeNodeId, lastFiringScore, protocolVersion,
  verdict,                // self-care | see-a-doctor | emergency
  status,                 // in-progress | closed
  messages: [{ role, content, timestamp }],
  extractedAnswers: { severityScore, durationHours, reportedSymptoms: [] },
  createdAt, updatedAt }
10.6  session_summaries  (separate from sessions)
Stores vector embeddings of completed session summaries so Eve can recall relevant patient history at the start of a new session. Kept separate from knowledge_collection because these are patient-history vectors — a wrong match here is a different risk than a wrong match on a clinical protocol.
{ _id, sessionId, patientId, tenantId,
  summaryText, embedding [ ],
  createdAt }
10.7  tokenLedger
{ _id, tenantId, sessionId,
  promptTokens, completionTokens, multiplierApplied,
  costNgn,
  timestamp }
10.8  followupJobs  (BullMQ idempotency guard)
{ _id, sessionId, tenantId, patientId,
  scheduledFor, sentAt,
  dedupeKey,    // unique index on (sessionId + scheduledFor)
  status }      // pending | sent | failed


11.  API Endpoint Architecture
11.1  Triage & Chat
Method	Endpoint	Purpose
POST	/api/v1/chat/session/start	Captures consent, initializes Eve agent, recalls prior session summaries via vector search, returns sessionId.
POST	/api/v1/chat/message	Runs one full turn: safety floor → vector traversal → Clinical Rule Layer → DeepSeek phrasing → stream reply. Updates session. Logs tokens asynchronously.
GET	/api/v1/chat/session/:id	Returns full session document including message history, active node, and verdict for dashboard review.
11.2  Token Management & Billing
Method	Endpoint	Purpose
GET	/api/v1/analytics/tokens	Returns token balance and historical consumption for a tenant. Requires X-Tenant-ID header.
POST	/api/v1/tenants/topup	Processes a credit top-up via Paystack or Flutterwave. Adds tokens to the tenant's balance.
11.3  Internal (Server-to-Server)
Method	Endpoint	Purpose
POST	/api/v1/internal/schedule-followup	Called by Eve's scheduleFollowup tool during an active session. Registers a delayed job in BullMQ. Requires X-Core-Secret header.


12.  Security & Compliance
12.1  NDPR / NDPA (Nigeria Data Protection Act)
●Explicit consent captured at session start. consentGivenAt is written to the patients document before any health data is stored. If consent is not given, the session does not continue.
●Data retention policy stored per patient. Health records are not kept indefinitely.
●Patients can request deletion — a delete route removes the patient document, all session documents, and all session summary embeddings for that patient.
12.2  Tenant Isolation
●Every database read and write is scoped by tenantId at the query level — not enforced by trust in what the client sends.
●A clinic can never see another clinic's patient data, even if they know a patient's ID.
12.3  Token Security
●Internal routes are protected by X-Core-Secret header, not exposed to clients.
●Patient-facing routes use session tokens tied to the patient's consent record.
12.4  Audit Trail
●Every verdict produced by the Clinical Rule Layer is written to the session document with the nodeId, protocolVersion, and red flags found.
●A doctor reviewing a historical case can reconstruct the exact path through the knowledge graph and the exact rule that produced the outcome.


13.  Business Model Canvas
Block	Detail
Key Partners	National and regional HMOs · Private clinics · DeepSeek AI · MongoDB Atlas · Termii / Twilio · Paystack / Flutterwave · Vercel
Key Activities	Clinical knowledge graph curation · Agent prompt engineering · Protocol versioning management · Background queue operations
Value Proposition — HMO	Redirection of non-emergency cases back to self-care, directly reducing claims volume and payout costs.
Value Proposition — Patient	24/7 access to structured, calm, consistent triage guidance — the same quality of first response regardless of time, location, or who is on call.
Customer Relationships	Automated self-service for B2C patients. Dedicated customer success engineers for B2B enterprise clients.
Customer Segments — B2B	Nigerian HMOs and multi-location hospital groups seeking to reduce emergency department overload.
Customer Segments — B2C	Individual patients seeking self-triage, especially in areas with limited immediate access to a clinic.
Key Resources	MongoDB Atlas clusters · DeepSeek API access · Clinical knowledge graph (the competitive moat) · Node.js server infrastructure on Vercel
Channels	B2B: direct sales team and white-labeled portal integrations. B2C: WhatsApp, mobile app, web.
Cost Structure	DeepSeek LLM token consumption · MongoDB Atlas compute and storage · SMS/WhatsApp gateway fees (Termii/Twilio) · Vercel hosting
Revenue Streams	B2B SaaS monthly/annual subscriptions · Token usage markup on LLM costs · B2C pay-per-consultation


14.  Subscription & Pricing Model
14.1  The Token Multiplier Principle
MedBot's primary variable cost is DeepSeek token consumption via the eve framework. To protect margins from LLM cost volatility and ensure every tier is profitable, a Metered Cost Multiplier is applied to the raw token cost before billing:
Multiplier	Applied to	Rationale
2×	Standard Clinic / Growth tier	Absorbs engineering overhead and server costs. Provides approximately 50% gross margin on token spend.
2.5×	Growth tier overage	Discourages excessive usage beyond the included pool without punishing it severely.
2×	Enterprise tier overage	Stabilised rate for high-volume, predictable HMO usage. Reconciled quarterly.
5×	B2C Pay-As-You-Go / Premium tier	Prices in the risk of long, unpredictable conversational sessions from individual users.
14.2  B2B Tiers
	Growth Tier	Enterprise Tier
Target	Independent clinics, small hospitals	HMO networks, multi-location hospital groups
Pricing	₦150,000 / month flat fee	Custom annual contract
Staff accounts	Up to 5	Unlimited
Token pool	1,000,000 tokens included	Negotiated volume commitment
Overage rate	2.5× multiplier on tokens beyond pool	2× multiplier, reconciled quarterly
Dashboard	Standard session and token analytics	Full analytics + white-labeling + custom branding
Support	Email support	Dedicated customer success engineer
Deployment	Shared infrastructure	Dedicated deployment with priority BullMQ queues
Protocol updates	Standard versioned protocol releases	Custom protocol additions on request
14.3  B2C Model
●Pay-per-consultation: a fixed fee per completed triage session.
●Priced to be accessible but with a 5× token multiplier protecting margin on variable-length sessions.
●Entry point for individual patients who are not covered by an HMO using MedBot.


15.  Build Roadmap
Phase	What gets built	Done when
Phase 1 — Foundation	MongoDB Atlas setup · knowledge_collection vector index · clinical_rules collection seeded with 3 protocols (chest pain, fever, breathing difficulty) · Express scaffolding · NDPR consent capture	Database is running, first 3 protocols are ingested and searchable.
Phase 2 — Agent Core	Eve agent directory (instructions.md, agent.ts, tools/) · DeepSeek wiring · vector traversal logic · confidence threshold routing · Clinical Rule Layer module	A test conversation goes from first message to verdict without a human in the loop.
Phase 3 — Safety & Queue	Safety floor keyword check · BullMQ delayed follow-up jobs · Notification Engine (Termii) · followupJobs idempotency guard · Clinical Rule Layer error webhook	An emergency keyword fires the safety floor. A closed session sends a follow-up message the next day.
Phase 4 — Multi-tenancy	Tenant collection · token ledger · multiplier logic · Paystack top-up endpoint · Growth tier dashboard	A clinic can sign up, get a token balance, and see their session logs.
Phase 5 — Pilot	One clinic on the Growth tier in a controlled rollout · Protocol versioning live · audit trail review with clinical lead	Real patients complete real triage sessions. A clinician reviews 20 session transcripts and signs off on the outcome quality.

MedBot — Confidential — Version 1.0 — July 2026