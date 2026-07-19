# MedBot — Build Summary & Current State

> **Last updated:** July 18, 2026  
> **Stack:** React 19 + Vite 8 (frontend) · Express + MongoDB Atlas + TypeScript 7 (backend)  
> **Deployment:** Frontend → Vercel · Backend → Render · Database → MongoDB Atlas

---

## 1. Project Overview

MedBot is an AI-powered medical triage chatbot for Nigerian patients. It guides patients through structured symptom collection, runs doctor-approved decision rules, and returns one of three outcomes: **self-care**, **consult a doctor**, or **emergency**. The platform has three portals:

| Portal | Audience | Route Prefix |
|--------|----------|-------------|
| Customer | Patients doing self-triage | `/dashboard` |
| Business | Hospitals, clinics, HMOs | `/business/dashboard` |
| Admin | Platform super-admins | `/admin/dashboard` |

---

## 2. Architecture (Implemented)

```
[ React Frontend (Vercel) ]
        | HTTPS
        v
[ Express Backend (Render) ]
   ├── Auth & Routing
   ├── Chat/Stream (SSE)
   ├── Clinical Triage Pipeline
   ├── Tenant/Analytics
   ├── Admin
   └── Voice WebSocket
        |
        v
[ MongoDB Atlas ] ←── [ DeepSeek V4 Flash (OpenRouter) ]
                       ←── [ Gemini Embedding-001 ]
                       ←── [ Fish Audio TTS ]
```

### Key Design Decisions (Implemented)

| Decision | Implementation |
|----------|---------------|
| **LLM never decides verdict** | DeepSeek phrases only; Clinical Rule Layer (plain code) returns verdict |
| **SSE streaming** | Real `ReadableStream` with 20ms token rate, 80ms crossfade overlay |
| **Emotion tags for TTS** | LLM emits `[calm]`, `[empathetic]`, `[serious]`, `[warm]`, `[laugh]` etc.; stripped from displayed text |
| **Emergency bypass** | Hardcoded regex pattern check runs before LLM call |
| **Greeting bypass** | Hardcoded greeting patterns return warm response without LLM |
| **Consent check** | LLM/system asks consent before collecting medical info |
| **Tenant-scoped data** | Every session/analytics query filtered by `tenantId` |
| **LocalStorage history** | Recent sessions saved to `localStorage`, up to 20, with custom event for sidebar refresh |

---

## 3. What Has Been Built

### 3.1 Backend (`backend/src/`)

#### Routes (~40 HTTP endpoints + 1 WebSocket)

| File | Routes | Auth |
|------|--------|------|
| `health.route.ts` | `GET /health` | None |
| `auth.route.ts` | `POST /api/auth/signup`, `/verify-otp`, `/resend-otp`, `/login`, `/verify-login-otp`, `/resend-login-otp`, `/forgot-password`, `/reset-password`, `/change-password`; `GET /api/auth/me`, `/api/auth/google`, `/api/auth/google/callback` | Mixed |
| `user.route.ts` | `GET|PUT /api/users/me/profile` | Auth |
| `session.route.ts` | `GET|DELETE /api/sessions/:sessionId`; `GET /session/:sessionId` | Auth |
| `chat.route.ts` | `POST /chat`; `POST /chat/stream` (SSE) | Auth |
| `consent.route.ts` | `GET|POST|DELETE /consent` | Auth |
| `tenant.route.ts` | `POST /api/tenants/signup`, `/verify-otp`, `/login`, `/verify-login-otp` | None |
| `tenant-analytics.route.ts` | `GET /api/tenant/analytics/overview`, `/sessions`, `/trends`, `/session/:sessionId` | JWT (custom) |
| `admin.route.ts` | `GET /api/admin/stats`, `/users`, `/analytics/daily`, `/protocols`, `/protocols/:nodeId`, `/protocol-categories`; `POST|PUT|DELETE /api/admin/protocols/:nodeId` | Admin secret |
| `analytics.route.ts` | `GET /api/v1/analytics/tokens`, `/tenants` | Admin |
| `voice.route.ts` | `POST /api/voice/tts`; `GET /api/voice/status` | Mixed |
| `voiceSocket.ts` | `ws://host/api/voice/tts-stream` (WebSocket) | None |

#### Services (18 files)

| Service | Purpose | Status |
|---------|---------|--------|
| `auth.service.ts` | JWT sign/verify, password hash, signup/login OTP flow, Google OAuth, password reset | ✅ Complete |
| `user.service.ts` | Profile get/update | ✅ Complete |
| `tenant.service.ts` | Tenant signup/OTP/login, token cost computation, deduct | ✅ Complete |
| `session.service.ts` | CRUD sessions, append messages, update state | ✅ Complete |
| `consent.service.ts` | Grant/revoke consent checks | ✅ Complete |
| `chat.service.ts` (inline in route) | `SYSTEM_PROMPT`, `preChecks()`, `ensureEmotionTag()`, `forceLaughTag()` | ✅ Complete |
| `clinicalRule.service.ts` | Load/evaluate clinical rules by nodeId | ✅ Complete |
| `categoryClassifier.service.ts` | Classify messages into protocol categories | ✅ Complete |
| `embeddings.service.ts` | Gemini `embedText()`/`embedBatch()` (3072-dim) | ✅ Complete |
| `vectorSearch.service.ts` | Atlas `$vectorSearch` with in-memory fallback | ✅ Complete |
| `knowledgeGraph.service.ts` | Graph traversal (entry node → edge-constrained) | ✅ Complete |
| `fishAudio.service.ts` | Fish Audio TTS with `reference_id`, `s2.1-pro-free` model | ✅ Complete |
| `paystack.service.ts` | Payment initialize/verify/webhook | ✅ Complete |
| `protocolAdmin.service.ts` | Protocol CRUD for admin dashboard | ✅ Complete |
| `sessionSummary.service.ts` | Vector-embedded session summaries for history recall | ✅ Complete |
| `tokenLedger.service.ts` | Record/query token usage by tenant | ✅ Complete |
| `queue.service.ts` | BullMQ followup queue (disabled - no Redis) | ⚠️ Disabled |
| `apiKey.service.ts` | Create/list/revoke/validate API keys | ✅ Complete |
| `otp.service.ts` | Send OTP via Brevo | ✅ Complete |

#### Database (MongoDB Atlas)

| Collection | Purpose | Documents |
|-----------|---------|-----------|
| `sessions_collection` | Triage sessions with messages, verdict, state | ~10 (test) |
| `knowledge_collection` | Clinical protocol nodes with vector embeddings | ~10 |
| `clinical_rules` | Triage decision rules per node | ~10 |
| `tenants` | Organization accounts | ~1 (test) |
| `users_collection` | User accounts (patient + business admin) | ~1 (test) |
| `patients` | Patient records | 0 |
| `session_summaries` | Vector-embedded session summaries | 0 |
| `token_ledger` | Token billing records | 0 |
| `followup_jobs` | Delayed followup jobs | 0 |
| `api_keys` | Tenant API keys | 0 |

**Vector index:** `vector_index` on `knowledge_collection` (3072-dim cosine, 10/10 docs indexed)

### 3.2 Frontend (`frontend/src/`)

#### Routes (35 routes)

| Path | Component | Status |
|------|-----------|--------|
| `/` | `LandingPage` (Navbar + Hero + Features + Stats + Testimonials + Pricing + Footer) | ✅ |
| `/login` | `AuthPage` (login → OTP → redirect) | ✅ |
| `/signup` | `DisclaimerPage` → `AuthPage` (signup → OTP → health profile) | ✅ |
| `/forgot-password` | `ForgotPasswordPage` (email → OTP → new password) | ✅ |
| `/health-profile` | `HealthProfilePage` | ✅ |
| `/dashboard/*` | `CustomerDashboardLayout` + Outlet | ✅ |
| `/dashboard` | `CustomerDashboardHome` (chat interface) | ✅ |
| `/dashboard/assessment-history` | `AssessmentHistory` | ✅ |
| `/dashboard/health-reports` | `HealthReports` | ✅ |
| `/dashboard/health-library` | `HealthLibrary` | ✅ |
| `/dashboard/settings` | `CustomerSettings` | ✅ |
| `/business/login` | `BusinessLogin` (no Google auth) | ✅ |
| `/business/signup` | `BusinessSignup` (no Google auth) | ✅ |
| `/business/dashboard/*` | `BusinessDashboardLayout` + Outlet | ✅ |
| `/business/dashboard` | `BusinessDashboardHome` (KPI cards, charts) | ✅ |
| `/business/dashboard/assessments` | `BusinessAnalytics` (real API data) | ✅ |
| `/business/dashboard/patient-insights` | `PatientInsights` | ✅ |
| `/business/dashboard/reports` | `BusinessReports` (dummy data) | ⚠️ Needs real data |
| `/business/dashboard/subscriptions` | `BusinessSubscription` | ✅ |
| `/business/dashboard/settings` | `BusinessSettings` | ✅ |
| `/business/dashboard/staff` | `StaffManagement` | ✅ |
| `/business/dashboard/payment` | `BusinessPayment` | ✅ |
| `/business/dashboard/protocols` | `ProtocolAdmin` | ✅ |
| `/admin/login` | `AdminLogin` | ✅ |
| `/admin/dashboard/*` | `AdminLayout` (auth-guarded) | ✅ |
| `/admin/dashboard` | `AdminOverview` | ✅ |
| `/admin/dashboard/tenants` | `AdminTenants` | ✅ |
| `/admin/dashboard/users` | `AdminUsers` | ✅ |
| `/admin/dashboard/analytics` | `AdminAnalytics` | ✅ |
| `/admin/dashboard/settings` | `AdminSettings` | ✅ |

#### Key Components

| Component | What it does |
|-----------|-------------|
| `customer-dashboard-home.tsx` | Chat UI: streaming messages, Markdown rendering, TTS audio player, thinking animation, autoscroll, stop button, session management |
| `customer-dashboard-layout.tsx` | Sidebar with recent sessions (localStorage), header, backend keep-alive |
| `business-analytics.tsx` | Real data: KPI cards, verdict breakdown bar, top symptoms, trends chart (Recharts), sessions table with pagination/filter/search, session detail modal |
| `business-dashboard-home.tsx` | Home with KPI cards, growth chart, recent activity |
| `hero-ai-infrastructure.tsx` | SplitText animations, rotating teal words, mobile responsive |
| `feature-hero.tsx` | Phosphor icons: ArrowsLeftRight, Urgency Scoring, Symptom Triage, etc. |
| `admin-api.ts` | Admin API client (stats, users, tenants, tokens) |

#### UI Components (20)

`Button`, `Badge`, `Avatar`, `Input`, `Select`, `Dialog`, `Tooltip`, `HoverCard`, `Collapsible`, `Progress`, `Skeleton`, `SplitText`, `SidebarNav`, `BackButton`, `DateDropdown`, `ChartCard`, `ChartTheme`, `ChartUtils`, `TimelineAnimation`, `MotionDrawer`

#### API Client (`lib/api.ts`)

27 exported functions covering auth, profile, chat, voice, sessions, admin, tenant auth, and tenant analytics.

---

## 4. Key Implementation Details

### 4.1 Chat & Streaming

- **Endpoint:** `POST /chat/stream` returns SSE `data: {delta, done}`
- **Content-type detection:** If response is JSON (non-streaming early returns for greeting/emergency/consent), render immediately
- **Rendering:** `Markdown` component (not `@chenglou/pretext`); 80ms overlap crossfade between streaming bubble and permanent message
- **Stream rate:** 20ms
- **Abort:** `AbortController` stops fetch + axios source
- **Auto-scroll:** 100px threshold from bottom

### 4.2 TTS (Text-to-Speech)

- **Provider:** Fish Audio (`s2.1-pro-free`, `s2-pro` requires paid plan)
- **Voice:** `f248b08382a244a087ab5ee5fda8f6c2` — "Nigerian Storyteller"
- **Speed:** Cycles 0.75× → 1× → 1.25× → 1.5× via button
- **Emotion tags:** LLM emits `[calm]`, `[empathetic]`, `[serious]`, `[warm]`, `[laugh]`, `[chuckling]` — stripped from displayed text, passed to TTS
- **Forced tags:** `ensureEmotionTag()` injects `[calm]` if missing; `forceLaughTag()` forces `[laugh]` for joke/funny requests
- **Player:** Premium audio player above composer with play/pause, rewind/forward 15s, clickable progress bar, speed cycle, close button

### 4.3 Thinking Animation

- Collapsible shimmer text (`shimmer-text` keyframes)
- Dark gray on light mode, light on dark mode
- Teal bouncing dot (`dot-bounce` keyframes) beside text
- No brain icon

### 4.4 Emotion Tag Stripping

| Surface | Stripped? |
|---------|-----------|
| Streaming bubble | ✅ |
| Completed message | ✅ |
| Clipboard copy | ✅ |
| Edit message | ✅ |

### 4.5 Business Analytics (Latest Feature)

| Endpoint | Purpose | Implementation |
|----------|---------|---------------|
| `GET /api/tenant/analytics/overview` | KPI counts + verdict breakdown + weekly Δ | 7 `countDocuments` queries in `Promise.all` |
| `GET /api/tenant/analytics/sessions` | Paginated sessions with verdict/status/search filters, symptom tags | `find` + `countDocuments` with regex search |
| `GET /api/tenant/analytics/trends` | Daily time-series + top 10 symptoms | `$dateToString` + `$group` aggregation |
| `GET /api/tenant/analytics/session/:id` | Full session detail with message history | Single `findOne` |

### 4.6 Auth Flow

**Customer:** Signup → OTP → Verify → Set Profile → Dashboard  
**Business:** Signup (org details) → OTP → Verify → Login → OTP → Verify → Dashboard  
**Admin:** Secret key (`x-core-secret` header) → Dashboard  
**Google OAuth:** Available for customers only (removed from business portal)

---

## 5. Known Issues & Blockers

| Issue | Impact | Status |
|-------|--------|--------|
| **MongoDB TLS handshake** hangs on local machine (antivirus/firewall intercepting) | Cannot run backend locally | Workaround: deploy to Render |
| **Node 24** causes `ECONNRESET` on Atlas TLS handshake | Must use `nvm use 22` | Documented |
| **TypeScript 7.0.2** (Go-based `tsc`) broken on local — missing `lib.d.ts` | Cannot typecheck backend locally | Pre-existing env issue |
| **Redis not configured** | Followup queue worker disabled | Acceptable for MVP |
| **Atlas `$vectorSearch`** unavailable (wrong cluster tier?) | Falls back to in-memory cosine search | Warning in logs |
| **Business Reports** page still uses dummy data | Not wired to real API | Next task |
| **Auth middleware** is hardcoded stub (bypasses real JWT check) | No real auth enforcement | Test-only |
| **Phone call / VoiceCall** removed from customer dashboard | Feature cut | Confirmed with user |

---

## 6. Environment Variables

### Backend (27 vars defined in `env.ts`)

| Variable | Source | Used For |
|----------|--------|----------|
| `PORT` | Default `5001` | HTTP server |
| `MONGODB_URI` | `.env` | Database connection |
| `MONGODB_DB_NAME` | Default `medbot` | Database name |
| `DEEPSEEK_API_KEY` | `.env` | Deprecated (now OpenRouter) |
| `OPENROUTER_API_KEY` | `.env` | **Active** LLM provider |
| `GEMINI_API_KEY` | `.env` | Embeddings (Gemini Embedding-001) |
| `FISH_AUDIO_API_KEY` | `.env` | TTS |
| `FISH_AUDIO_VOICE_ID` | `.env` | TTS voice reference |
| `JWT_SECRET` | Default `dev-jwt-secret` | Auth tokens |
| `CORE_SECRET` | Default `dev-core-secret` | Admin gate |
| `CLIENT_URL` | Default `http://localhost:5173` | CORS |
| `BREVO_API_KEY` | `.env` | OTP emails |
| `SENDER_EMAIL` | Default | Email sender |
| `GOOGLE_CLIENT_ID/SECRET` | `.env` | Google OAuth |
| `PAYSTACK_SECRET/PUBLIC_KEY` | `.env` | Payments |
| `EMBEDDING_DIMENSION` | `3072` | Vector size |

### Frontend

| Variable | Default | Used For |
|----------|---------|----------|
| `VITE_API_URL` | `''` (proxied in dev) | Backend URL |

---

## 7. Deployment

### Frontend → Vercel

| Property | Value |
|----------|-------|
| Project | `medbot_frontend` |
| Domain | `https://medbotfrontend.vercel.app` |
| Root dir | `frontend/` |
| Build | `vite build` |
| Output | `dist/` |

### Backend → Render

| Property | Value |
|----------|-------|
| Type | Web Service |
| Root dir | `backend/` |
| Build | `npm install` |
| Start | `npm start` (`tsx src/index.ts`) |
| Node | 22 |

---

## 8. Remaining Work

### High Priority
- [ ] Wire Business Reports page to real API endpoints
- [ ] Replace hardcoded auth middleware with real JWT verification
- [ ] Fix Atlas `$vectorSearch` (upgrade cluster or debug permission)
- [ ] Configure Redis for followup queue

### Medium Priority
- [ ] Add WhatsApp channel integration (Twilio/Termii)
- [ ] Implement B2C pay-per-consultation flow
- [ ] Add data retention policy enforcement
- [ ] Build patient deletion flow (NDPR compliance)

### Low Priority
- [ ] Add more clinical protocols (seed scripts exist)
- [ ] Implement rate limiting per tenant
- [ ] Add error webhook for Clinical Rule Layer failures
- [ ] Expand test coverage

---

## 9. Git History (Recent)

```
22a15e0 Hero mobile fix
f2ac61a Minor UI tweaks
c700b1f Fix emotion tag stripping, thinking animation shimmer, premium audio player
2487174 Fix hero mobile responsiveness, increase MongoDB timeout to 30s
826b93c Trigger Vercel deployment
d7acd66 Remove VoiceCall and Google auth from business portal, fix Phosphor icon import, add CODEBASE.md
f5875b5 fix: use env.openrouterApiKey instead of process.env in chat route fallbacks
7cc5197 fix: use getGoogleAuthUrl for production (Vercel) compat
bbb6068 fix b2b google oauth: auto-create tenant, fix logout, vite proxy for /api
01b1d85 b2b signup/signin w/ OTP: tenant routes, service, schema, frontend API
58519f5 rename Eve to MedBot across chat route and instructions
43cfd43 remove chain of thought display, keep simple thinking indicator
14ec7cc add greeting detection to skip triage pipeline for greetings
f955df1 add OPENROUTER_API_KEY to env spec
9e4a9d0 fix consent service to handle invalid ObjectIds and bypass for test user
7bd610f bypass auth middleware for testing
9a74339 feat: wire forgot-password to real backend with OTP + reset flow
0d8a349 add OpenRouter provider, switch Eve agent to deepseek/deepseek-v4-flash:free
7541654 fix all date dropdowns with shared DateDropdown component
91d503c make date filter functional on assessments page
```

---

## 10. File Map (Key Files)

```
med bot/
├── plan.md                           ← This file
├── CODEBASE.md                       ← Full codebase map
├── render.yaml                       ← Render deploy config
├── vercel.json                       ← Vercel SPA rewrite
├── backend/
│   ├── src/
│   │   ├── app.ts                    ← Route registration
│   │   ├── index.ts                  ← Entry point
│   │   ├── config/env.ts             ← 27 env vars
│   │   ├── db/client.ts              ← MongoDB connection, indexes
│   │   ├── db/schema.ts              ← 12 document interfaces
│   │   ├── routes/ (11 files)        ← ~40 endpoints
│   │   ├── services/ (18 files)      ← Business logic
│   │   ├── middleware/ (2 files)     ← Auth (stub) + admin
│   │   ├── agent/                    ← Eve AI framework
│   │   └── voice/voiceSocket.ts      ← WebSocket TTS
│   ├── package.json
│   └── .env
└── frontend/
    ├── src/
    │   ├── App.tsx                    ← 35 routes
    │   ├── components/               ← 91 component files
    │   │   ├── customer/ (16 files)  ← Patient portal
    │   │   ├── business/ (16 files)  ← Hospital portal
    │   │   ├── admin/ (12 files)     ← Super-admin portal
    │   │   └── ui/ (20 files)       ← Shared UI kit
    │   ├── lib/api.ts                ← 27 API functions
    │   ├── lib/adminApi.ts           ← Protocol CRUD API
    │   └── hooks/                    ← Theme, media query
    ├── package.json
    └── vite.config.ts
```

---

**This document replaces the original `plan.md` (architecture blueprint) with a living build summary. Update as new features are completed.**
