# MedBot Backend

Symptom triage chatbot backend for MedBot — a 24/7 AI assistant for
patients in Nigeria, built to safely route people toward self-care,
telemedicine, or emergency care.

## Architecture

Single-database design: **MongoDB** handles both unstructured session
logs and semantic vector search, avoiding sync lag between separate
systems.

```
[ User ] -> [ Chatbot ] -> [ Eve (agent core) ]
                                  |
                    +-------------+-------------+
                    |                           |
            [ sessions_collection ]   [ knowledge_collection ]
              raw chat transcripts       markdown + embeddings
              & session state            ($vectorSearch, HNSW)
                    |                           |
                    +-------------+-------------+
                                  |
                     [ Clinical Rule Layer ]
                (deterministic severity scoring)
                                  |
                  [ Next triage action & output ]
```

1. **Ingest & session tracking** — every patient message and session
   state is written to `sessions_collection` as it happens.
2. **Vector search** — Eve embeds the patient's latest message and
   runs `$vectorSearch` against `knowledge_collection` to find the
   matching clinical protocol node (e.g. *Chest Pain Protocol - Step 1*).
3. **Clinical Rule Layer** — Eve extracts structured variables
   (severity 1-10, duration, associated symptoms, red flags) and hands
   them to a deterministic scoring function. Eve never invents a
   severity — the rule layer is the single source of truth.
4. **Response** — the resulting severity and next step are relayed to
   the patient in plain language.

## Stack

- **Runtime**: Bun
- **Web framework**: Elysia
- **Database**: MongoDB (sessions + vector search via Atlas `$vectorSearch`)
- **Embeddings/LLM**: OpenAI-compatible API
- **Hosting**: Vercel (Edge Functions)

## Folder structure

```
backend/
├── api/
│   └── [[...slugs]].ts       # Vercel edge adapter
├── knowledge/
│   └── chest-pain.md         # example protocol (frontmatter + markdown)
├── scripts/
│   └── ingest-knowledge.ts   # chunk + embed + upsert protocols
├── src/
│   ├── agent/
│   │   ├── eve.ts            # orchestrates search + rule layer + LLM
│   │   ├── system.ts         # Eve's system prompt
│   │   └── tools/
│   │       ├── vectorSearch.tool.ts
│   │       └── clinicalRule.tool.ts
│   ├── config/
│   │   └── env.ts            # validated env loader
│   ├── db/
│   │   ├── client.ts         # Mongo connection (cached for warm invocations)
│   │   ├── schema.ts         # shared Mongo document types
│   │   └── setup-indexes.ts  # creates the Atlas vector search index
│   ├── lib/
│   │   ├── errors.ts
│   │   └── logger.ts
│   ├── middleware/
│   │   └── auth.middleware.ts  # x-core-secret trusted-agent auth
│   ├── routes/
│   │   ├── health.route.ts
│   │   ├── session.route.ts
│   │   └── chat.route.ts
│   ├── services/
│   │   ├── clinicalRule.service.ts
│   │   ├── embeddings.service.ts
│   │   └── session.service.ts
│   ├── app.ts                # Elysia app assembly
│   └── index.ts              # local dev entry point
├── tests/
│   ├── chat.test.ts
│   └── setup.ts
├── .env.example
├── bunfig.toml
├── package.json
├── tsconfig.json
└── vercel.json
```

## Getting started

```bash
cd backend
bun install
cp .env.example .env   # fill in MONGODB_URI, OPENAI_API_KEY, CORE_SECRET

# requires an Atlas cluster (M10+ or Search-enabled shared tier)
bun run db:setup-indexes

bun run ingest          # embeds knowledge/*.md into knowledge_collection
bun run dev             # local dev server on :3000
```

## Auth

All routes except `/health` require an `x-core-secret` header matching
`CORE_SECRET`. This mirrors the trusted-agent bypass pattern used in
TADA VTU — this backend expects to sit behind a WhatsApp/web frontend
that holds the shared secret, not to be called directly by end users.

## Notes / open items

- The Clinical Rule Layer thresholds (`EMERGENCY_THRESHOLD`,
  `CONSULT_THRESHOLD` in `clinicalRule.service.ts`) are placeholders —
  these need sign-off from the Medical Advisors Board before launch.
- Only one example protocol (`chest-pain.md`) is included; the rest of
  the protocol library still needs to be authored and reviewed.
- `vercel-ai-cli` fallback architecture mentioned earlier is deferred —
  not implemented in this scaffold.
- No frontend/WhatsApp channel wiring yet — this repo is backend-only.
