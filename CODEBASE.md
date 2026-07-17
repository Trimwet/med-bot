# MedBot — Codebase Map

AI-powered medical triage chatbot for Nigerian patients. Three portals: Customer (patient), Business (hospital/enterprise), Admin (platform super-admin).

**Stack**: React (Vite) frontend, Express + MongoDB Atlas backend, DeepSeek V4 Flash LLM, Gemini embeddings, Fish Audio TTS, Paystack payments.

---

## Table of Contents

- [Architecture](#architecture)
- [Frontend](#frontend)
  - [Entry & Routing](#entry--routing)
  - [Marketing / Landing](#marketing--landing)
  - [Auth & Onboarding](#auth--onboarding)
  - [Customer Portal](#customer-portal)
  - [Business Portal](#business-portal)
  - [Admin Portal](#admin-portal)
  - [Shared UI Components](#shared-ui-components)
  - [Libraries & Utilities](#libraries--utilities)
- [Backend](#backend)
  - [Entry & Config](#entry--config)
  - [Database](#database)
  - [Middleware](#middleware)
  - [Routes](#routes)
  - [Services](#services)
  - [Voice WebSocket](#voice-websocket)
- [MongoDB Collections](#mongodb-collections)
- [Key Architecture Patterns](#key-architecture-patterns)

---

## Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    Frontend (Vite)                        │
│  Landing Page │ Auth │ Customer Dashboard │ Biz │ Admin  │
└────────────────────────┬────────────────────────────────┘
                         │ REST + SSE + WebSocket
┌────────────────────────┴────────────────────────────────┐
│                  Backend (Express)                        │
│  Auth │ Chat │ Sessions │ Users │ Tenants │ Admin │ Voice│
│  ┌─────────┐  ┌──────────┐  ┌─────────────┐            │
│  │DeepSeek  │  │Gemini    │  │Fish Audio   │            │
│  │LLM API   │  │Embeddings│  │TTS          │            │
│  └─────────┘  └──────────┘  └─────────────┘            │
└────────────────────────┬────────────────────────────────┘
                         │
┌────────────────────────┴────────────────────────────────┐
│              MongoDB Atlas (10 collections)              │
└─────────────────────────────────────────────────────────┘
```

---

## Frontend

### Entry & Routing

| File | Purpose |
|------|---------|
| `frontend/src/main.tsx` | React entry point, renders `<App />` into DOM |
| `frontend/src/App.tsx` | All route definitions: `/` (landing), `/auth`, `/forgot-password`, `/disclaimer`, `/health-profile`, `/dashboard/*` (customer), `/business/*`, `/admin/*` |
| `frontend/src/index.css` | Global styles, Tailwind directives, custom animations |

---

### Marketing / Landing

| File | Description |
|------|-------------|
| `pages/landing.tsx` | Marketing landing page — composes Hero, Features, Stats, Testimonials, Pricing, Footer |
| `components/navbar.tsx` | Public site navbar — scroll-aware styling, active section tracking, mobile hamburger, login/signup triggers |
| `components/hero-ai-infrastructure.tsx` | Main hero — animated rotating words ("Always Available", "Here to Help", etc.), SplitText character animations, "Start Symptom Check" CTA |
| `components/feature-hero.tsx` | Features showcase — 5 glassmorphism cards with hover spotlight: Urgency Scoring, Symptom Triage, Clinical Handoff, Evidence-Based Logic, HIPAA Compliant |
| `components/stats-section.tsx` | Impact stats — animated number counters: 500+ patients, 62% wait reduction, 99.9% uptime, 120+ partners |
| `components/marque-testimonial.tsx` | Scrolling marquee testimonials — 6 Nigerian healthcare professional testimonials, dual-row layout |
| `components/pricing-section.tsx` | Pricing cards — 3 tiers: Starter (N49,000/mo), Growth (N149,000/mo), Enterprise (Custom) |
| `components/compare-section.tsx` | Feature comparison table — 18 features across plans (Triage, Scoring, Platform, Support, Compliance) |
| `components/health-bot.tsx` | SVG MedBot mascot illustration — robot in doctor's coat with animated eyes, antenna pulse |
| `components/footer-detailed.tsx` | Full marketing footer — CTA banner, link columns, email signup, copyright |

---

### Auth & Onboarding

| File | Description |
|------|-------------|
| `components/auth-page.tsx` | Multi-step auth — signup, OTP verification, login, login OTP, Google OAuth, toggle login/signup modes |
| `components/disclaimer-page.tsx` | Medical disclaimer — checkbox acknowledgment ("I understand this is not a diagnosis"), Accept & Continue |
| `components/health-profile-page.tsx` | Health profile creation — age, gender, height, weight, blood group, allergies, conditions, medications, emergency contact |
| `components/forgot-password-page.tsx` | 3-step forgot password — email entry → OTP + new password → success confirmation |

---

### Customer Portal

Patient-facing chat interface and health dashboard.

| File | Description |
|------|-------------|
| `components/customer/customer-dashboard-layout.tsx` | Layout wrapper — sidebar + navbar, lazy-loads all sub-pages |
| `components/customer/customer-dashboard-home.tsx` | **Main chat interface** — real SSE streaming, TTS playback with speed control, thinking animation, localStorage session history, voice input, emotion tag stripping, markdown stripping for TTS |
| `components/customer/customer-sidebar.tsx` | Sidebar navigation — Home, Chat, Assessments, Reports, Health Library, Settings |
| `components/customer/customer-navbar.tsx` | Top navbar — mobile menu toggle, notifications bell, user avatar with dropdown |
| `components/customer/customer-footer.tsx` | Simple footer — copyright and links |
| `components/customer/customer-settings.tsx` | Settings — Profile, Security, Privacy, Notifications, Appearance (light/dark/system theme) |
| `components/customer/chat-history.tsx` | Chat history view — lists past sessions with delete capability |
| `components/customer/assessment-history.tsx` | Assessment history — table with verdict badges, message counts, dates |
| `components/customer/health-reports.tsx` | Health reports — placeholder page |
| `components/customer/health-library.tsx` | Health library — 8 articles (Common Cold, Flu, Fever, Headache, Vaccinations, Nutrition, Healthy Habits, Treating Minor Cuts, Managing Stress) |
| `components/customer/dashboard-header.tsx` | Dashboard header — greeting, session controls |
| `components/customer/dashboard-empty-state.tsx` | Empty state — CTA to start first chat |
| `components/customer/patient-context-panel.tsx` | Patient context — shows health profile data alongside chat |
| `components/customer/VoiceCall.tsx` | Voice call UI — microphone button, speech-to-text, TTS playback, animated orb (currently unused) |
| `components/customer/DashboardOrb.tsx` | Animated floating orb — pulse/glow effects for voice UI |

---

### Business Portal

Hospital/enterprise dashboard for viewing patient data, analytics, and managing staff.

| File | Description |
|------|-------------|
| `components/business/business-login.tsx` | Business login — email/password + OTP verification (no Google auth) |
| `components/business/business-signup.tsx` | Business signup — org name, type, country, email, phone, size, password (no Google auth) |
| `components/business/business-dashboard-layout.tsx` | Layout wrapper — sidebar + navbar for business portal |
| `components/business/business-dashboard-home.tsx` | Dashboard home — KPIs, charts, patient insights |
| `components/business/business-sidebar.tsx` | Sidebar — Dashboard, Patients, Reports, Staff, Analytics, Settings |
| `components/business/business-navbar.tsx` | Top navbar — search, notifications, dark mode toggle, user avatar |
| `components/business/business-footer.tsx` | Simple footer |
| `components/business/business-analytics.tsx` | Analytics — Recharts: patient volume, triage distribution, time series |
| `components/business/business-reports.tsx` | Reports — session summaries and export |
| `components/business/business-settings.tsx` | Settings — profile, billing, notification preferences |
| `components/business/business-subscription.tsx` | Subscription — current plan, upgrade/downgrade |
| `components/business/business-payment.tsx` | Payment — Paystack integration for subscription payments |
| `components/business/patient-insights.tsx` | Patient insights — demographics, triage patterns |
| `components/business/staff-management.tsx` | Staff management — list of staff, roles, permissions |
| `components/business/kpi-cards.tsx` | KPI metric cards component |
| `components/business/dark-mode-context.tsx` | Dark mode context provider |

---

### Admin Portal

Platform super-admin dashboard for managing tenants, users, protocols, and analytics.

| File | Description |
|------|-------------|
| `components/admin/admin-login.tsx` | Admin login — secret key input, validates against `x-core-secret` header |
| `components/admin/admin-layout.tsx` | Layout wrapper — sidebar + navbar, checks admin auth |
| `components/admin/admin-sidebar.tsx` | Sidebar — Overview, Tenants, Users, Analytics, Partners, Settings. Collapsible, logout |
| `components/admin/admin-navbar.tsx` | Top navbar — search, dark mode, notifications, "Super Admin" avatar |
| `components/admin/admin-overview.tsx` | Overview — platform stats (sessions, users, protocols), recent sessions, verdict breakdown |
| `components/admin/admin-users.tsx` | User management — list all users, search/filter (all/verified/unverified), stats cards |
| `components/admin/admin-tenants.tsx` | Tenant management — list all hospital tenants, search/filter by tier, stats cards |
| `components/admin/admin-partners.tsx` | Partner hospitals — partnership metrics |
| `components/admin/admin-analytics.tsx` | Token analytics — daily token consumption, cost chart, prompt vs completion stacked chart, KPI cards |
| `components/admin/admin-settings.tsx` | Admin settings — update secret key, manage session, platform info |
| `components/admin/protocol-admin.tsx` | Protocol authoring — list/create/edit/delete clinical protocol nodes |
| `components/admin/protocol-form.tsx` | Protocol form — nodeId, protocolId, version, category, title, content, triage questions, red flags, severity scale, edges |
| `components/admin/admin-api.ts` | Admin API client — stores secret in localStorage, `adminFetch()` with x-core-secret header |

---

### Shared UI Components

| File | Description |
|------|-------------|
| `components/ui/button.tsx` | Button component |
| `components/ui/badge.tsx` | Badge component |
| `components/ui/input.tsx` | Input component |
| `components/ui/select.tsx` | Custom select/dropdown |
| `components/ui/dialog.tsx` | Modal dialog |
| `components/ui/tooltip.tsx` | Tooltip |
| `components/ui/hover-card.tsx` | Hover card popover |
| `components/ui/skeleton.tsx` | Loading skeleton |
| `components/ui/progress.tsx` | Progress bar |
| `components/ui/avatar.tsx` | Avatar component |
| `components/ui/collapsible.tsx` | Collapsible section |
| `components/ui/back-button.tsx` | Back navigation button |
| `components/ui/sidebar-nav.tsx` | Sidebar navigation |
| `components/ui/date-dropdown.tsx` | Date picker dropdown |
| `components/ui/motion-drawer.tsx` | Animated drawer |
| `components/ui/chart-card.tsx` | Chart wrapper card |
| `components/ui/chart-theme.tsx` | Chart theme hook (Recharts dark/light colors) |
| `components/ui/chart-utils.tsx` | Chart tooltip utilities |
| `components/ui/timeline-animation.tsx` | Scroll-triggered timeline animation |
| `components/ui/SplitText.tsx` | GSAP text splitting animation |
| `components/ui/SplitText.tsx` | Text splitting animation |
| `components/ai-elements/shimmer.tsx` | Shimmer loading effect |
| `components/ai-elements/reasoning.tsx` | AI reasoning display |
| `components/ai-elements/persona.tsx` | AI persona component |
| `components/ai-elements/context.tsx` | AI context display |
| `components/ai-elements/chain-of-thought.tsx` | Chain of thought visualization |
| `components/assistant-ui/thread.tsx` | Chat thread component |
| `components/assistant-ui/markdown-text.tsx` | Markdown rendering in chat |
| `components/assistant-ui/reasoning.tsx` | Reasoning display in chat |
| `components/assistant-ui/tool-group.tsx` | Tool group display |
| `components/assistant-ui/tool-fallback.tsx` | Fallback for unknown tools |
| `components/assistant-ui/tooltip-icon-button.tsx` | Icon button with tooltip |
| `components/assistant-ui/follow-up-suggestions.tsx` | Follow-up suggestion chips |
| `components/assistant-ui/attachment.tsx` | File attachment component |
| `components/motion/loader.tsx` | Multi-variant animated loader (spinner, dots, bars, etc.) |

---

### Libraries & Utilities

| File | Description |
|------|-------------|
| `lib/api.ts` | Main API client — all user-facing calls (auth, profile, chat, sessions, TTS, tenant auth). JWT from localStorage, SSE streaming |
| `lib/adminApi.ts` | Admin API client — protocol management (x-core-secret auth, CRUD) |
| `lib/recent-sessions.ts` | localStorage session cache — max 20 sessions, stores full message history, custom event for real-time refresh |
| `lib/utils.ts` | `cn()` utility — combines `clsx` + `tailwind-merge` |
| `lib/ease.ts` | Motion animation easing constants |
| `hooks/use-media-query.tsx` | Custom hook for CSS media query matching |
| `hooks/use-theme.ts` | Theme management — light/dark/system, persists to localStorage |
| `data/health-library-content.ts` | 8 health articles content |
| `types/speech.d.ts` | TypeScript declarations for Web Speech API |

---

## Backend

### Entry & Config

| File | Description |
|------|-------------|
| `backend/src/index.ts` | Server entry — starts Express, attaches WebSocket for TTS, connects MongoDB, ensures indexes |
| `backend/src/app.ts` | Express setup — CORS, JSON parser, mounts all route groups, global error handler |
| `backend/src/config/env.ts` | Env vars with defaults — MongoDB URI, JWT secret, DeepSeek/Gemini/Paystack/Brevo/Fish Audio keys |
| `backend/src/lib/logger.ts` | JSON logger (info/warn/error/debug) |
| `backend/src/lib/errors.ts` | Custom errors — AppError, UnauthorizedError, NotFoundError, ValidationError |

---

### Database

| File | Description |
|------|-------------|
| `backend/src/db/client.ts` | MongoDB singleton — `getDb()`, `ensureIndexes()` (10 indexes across 8 collections), `COLLECTIONS` constant |
| `backend/src/db/schema.ts` | All TypeScript interfaces — UserDocument, SessionDocument, KnowledgeDocument, ProtocolNode, TenantDocument, TokenLedgerDocument, etc. CATEGORIES array: cardiac, respiratory, infectious, gi, neurological, maternal, trauma, skin, mental, general |

---

### Middleware

| File | Description |
|------|-------------|
| `backend/src/middleware/auth.middleware.ts` | Auth middleware — **currently hardcoded** to return a test user. Must be fixed before production |
| `backend/src/middleware/admin.middleware.ts` | Admin gate — validates `x-core-secret` header against env.coreSecret |

---

### Routes

| File | Endpoint(s) | Description |
|------|-------------|-------------|
| `routes/health.route.ts` | `GET /health` | Health check — returns `{ status: "ok", timestamp }` |
| `routes/auth.route.ts` | `/api/auth/*` | Full user auth — signup, verify-otp, resend-otp, login (2-step), verify-login-otp, forgot-password, reset-password, Google OAuth, delete account |
| `routes/user.route.ts` | `GET/PUT /api/users/me/profile` | Health profile CRUD — age, gender, height, weight, blood group, allergies, conditions, medications |
| `routes/session.route.ts` | `GET/DELETE /api/sessions` | Session management — list with filtering/pagination, delete |
| `routes/chat.route.ts` | `POST /chat`, `POST /chat/stream` | **Core triage** — emergency detection (30+ patterns) → greeting detection → knowledge graph traversal → DeepSeek LLM → triage verdict → token billing. SSE streaming |
| `routes/tenant.route.ts` | `/api/tenants/*` | Tenant auth — signup, OTP verify, 2-step login. Creates tenant with "growth" tier, 1M tokens |
| `routes/consent.route.ts` | `GET/POST/DELETE /consent` | NDPR consent — check, grant, revoke |
| `routes/admin.route.ts` | `/api/admin/*` | Admin CRUD — protocol nodes (list/create/update/delete), platform stats, users, analytics. Gated by adminMiddleware |
| `routes/analytics.route.ts` | `/api/v1/analytics/*` | Analytics — per-tenant token usage, tenant list with session/patient counts. Gated by adminMiddleware |
| `routes/voice.route.ts` | `POST /api/voice/tts`, `GET /api/voice/status` | Text-to-speech — Fish Audio TTS (returns audio binary), voice status check |

---

### Services

| File | Description |
|------|-------------|
| `services/auth.service.ts` | Auth — password hashing (scrypt), JWT, OTP generation, user CRUD, 2-step login, Google OAuth, forgot password, delete account (NDPR) |
| `services/user.service.ts` | User profile — validate inputs (age 0-130, valid genders/blood groups), get/update profile |
| `services/session.service.ts` | Sessions — list with filtering, get-or-create, append messages, update graph state (activeNodeId, verdict, status) |
| `services/consent.service.ts` | NDPR consent — hasConsented, grantConsent, revokeConsent |
| `services/clinicalRule.service.ts` | Clinical rules — load rule by nodeId, evaluate severity (emergency/consult/self_care), score 0-10 |
| `services/vectorSearch.service.ts` | Two-layer vector search — Layer 1 (keyword classification) → Layer 2 (cosine similarity). Atlas $vectorSearch with in-memory fallback |
| `services/embeddings.service.ts` | Gemini embeddings — `embedText()` and `embedBatch()` using `gemini-embedding-001` (3072 dimensions) |
| `services/knowledgeGraph.service.ts` | Knowledge graph — `findEntryNode()` (global vector search), `traverseGraph()` (follow edges). Confidence: high (>0.7), moderate (>0.4), low |
| `services/protocolAdmin.service.ts` | Protocol CRUD — auto-embedding, validates nodeId format (`protocol.step`), upserts with versioning |
| `services/tokenLedger.service.ts` | Token billing — record usage, per-tenant aggregation, daily breakdown, platform-wide stats |
| `services/sessionSummary.service.ts` | Session summaries — builds summary text, embeds it, stores for future retrieval. `findRelevantHistory()` by cosine similarity |
| `services/tenant.service.ts` | Tenant management — signup (tenant + admin user), OTP, 2-step login, cost multipliers (enterprise=0.7, growth=1.0, starter=1.5) |
| `services/apiKey.service.ts` | API keys — generate (mb_ prefix, SHA-256 hash), create/list/revoke/validate |
| `services/paystack.service.ts` | Paystack — initialize payment, verify payment, webhook signature verification |
| `services/otp.service.ts` | Brevo email — branded HTML OTP emails with 6-digit codes, MedBot styling |
| `services/categoryClassifier.service.ts` | Layer 1 classifier — maps messages to 9 categories via 80+ keyword patterns, falls back to "general" |
| `services/fishAudio.service.ts` | Fish Audio TTS — text to speech (mp3/wav/opus), speed control, `s2.1-pro-free` model |
| `services/queue.service.ts` | BullMQ job queue (optional, requires Redis) — follow-up message scheduling |
| `services/patient-context.service.ts` | Builds patient context from profile for chat |

---

### Voice WebSocket

| File | Description |
|------|-------------|
| `voice/voiceSocket.ts` | WebSocket for streaming TTS — attaches at `/api/voice/tts-stream`, bridges to Fish Audio WebSocket. Protocol: client sends `{ type: "text", text }` or `{ type: "stop" }`, server returns `{ type: "audio", audio: "<base64>" }` |

---

## MongoDB Collections

| Collection | Purpose |
|------------|---------|
| `users_collection` | User accounts — email, password hash, OTP, verification, profile, consent, Google ID, tenant ID |
| `sessions_collection` | Chat sessions — messages array, activeNodeId, verdict, status, extracted answers, state |
| `knowledge_collection` | Protocol knowledge nodes — embeddings, edges, metadata, triage questions, red flags, severity scales |
| `clinical_rules` | Clinical rule documents — emergency/consult thresholds, red flags, self-care guidance |
| `tenants` | Hospital organizations — name, tier, token balance, subscription dates, whitelabel config |
| `patients` | Patient records — linked to tenants, TTL index on retainUntil |
| `session_summaries` | Embedding-backed session summaries for history retrieval |
| `token_ledger` | Per-tenant token usage — prompt/completion tokens, cost in NGN |
| `api_keys` | Tenant API keys — hashed, mb_ prefix, expiry |
| `followup_jobs` | BullMQ follow-up job deduplication |

---

## Key Architecture Patterns

1. **Three-portal architecture** — Customer (patient), Business (hospital admin), Admin (platform super-admin). Each has own auth flow, layout, sidebar, navbar.

2. **Dual-mode data layer** — All services support MongoDB + in-memory array fallback for local development without a database.

3. **Two-layer knowledge graph** — Coarse keyword classification (Layer 1) narrows category → vector search (Layer 2) finds specific protocol nodes → graph traversal follows edges.

4. **Streaming chat** — `/chat/stream` uses Server-Sent Events (SSE) for token-by-token delivery. Non-streaming early returns (greetings, emergencies, consent) as JSON.

5. **Emergency detection** — 30+ regex patterns catch life-threatening emergencies before they reach the AI.cd

6. **Token billing** — Every AI interaction metered. Costs computed per prompt + completion tokens, with per-tenant multipliers by subscription tier.

7. **NDPR compliance** — Explicit consent gate before health data processing. Account deletion removes all associated data.

8. **Fish Audio TTS** — Emotion tags in LLM system prompt (`[calm]`, `[empathetic]`, `[laugh]`, etc.) parsed by Fish Audio for expressive voice output. Backend forces tags if LLM forgets.

9. **localStorage session history** — Recent sessions cached client-side with custom events for real-time sidebar refresh.

---

## Environment Variables

| Variable | Purpose |
|----------|---------|
| `MONGODB_URI` | MongoDB Atlas connection string |
| `JWT_SECRET` | JWT signing secret |
| `DEEPSEEK_API_KEY` | DeepSeek LLM API key (via OpenRouter) |
| `GEMINI_API_KEY` | Google AI Studio API key for embeddings |
| `OPENROUTER_API_KEY` | OpenRouter API key |
| `FISH_AUDIO_API_KEY` | Fish Audio TTS API key |
| `FISH_AUDIO_VOICE_ID` | Fish Audio voice ID |
| `PAYSTACK_SECRET_KEY` | Paystack payment secret |
| `BREVO_API_KEY` | Brevo (SMTP) API key for OTP emails |
| `ADMIN_CORE_SECRET` | Admin portal secret key |
| `REDIS_URL` | Redis URL (optional, for BullMQ) |

---

## Routes Summary

| Route | Portal | Description |
|-------|--------|-------------|
| `/` | Public | Marketing landing page |
| `/auth` | Public | Login/signup with OTP |
| `/forgot-password` | Public | Password reset flow |
| `/disclaimer` | Customer | Medical disclaimer acknowledgment |
| `/health-profile` | Customer | Health profile creation |
| `/dashboard` | Customer | Chat interface + health dashboard |
| `/business/login` | Business | Hospital login |
| `/business/signup` | Business | Hospital registration |
| `/business/dashboard` | Business | Analytics, patients, reports |
| `/admin` | Admin | Platform admin dashboard |
