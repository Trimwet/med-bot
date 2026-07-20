# MedBot

AI-powered medical triage chatbot for Nigerian patients. Assesses symptoms through natural conversation and routes people toward self-care, telemedicine, or emergency care based on clinical severity scoring.

## Overview

MedBot is a 24/7 AI health assistant that conducts symptom assessments via chat or voice, scores clinical urgency using evidence-based protocols, and provides actionable triage recommendations. Built for the Nigerian healthcare landscape with support for English and local languages.

**Three portals:**
- **Customer** — Patient-facing chat with real-time streaming, voice input/output, and session history
- **Business** — Hospital/enterprise dashboard with analytics, session management, and tenant reporting
- **Admin** — Platform super-admin for user management and system configuration

## Architecture

```
┌──────────────────────────────────────────────────────┐
│               Frontend (React + Vite)                 │
│  Landing │ Auth │ Customer │ Business │ Admin         │
└──────────────────────┬───────────────────────────────┘
                       │ REST + SSE + WebSocket
┌──────────────────────┴───────────────────────────────┐
│                Backend (Express + Node)                │
│  Auth │ Chat │ Sessions │ Users │ Tenants │ Voice     │
│  ┌──────────┐  ┌───────────┐  ┌──────────────┐      │
│  │ DeepSeek  │  │  Gemini   │  │  Fish Audio  │      │
│  │  LLM API  │  │Embeddings │  │     TTS      │      │
│  └──────────┘  └───────────┘  └──────────────┘      │
└──────────────────────┬───────────────────────────────┘
                       │
┌──────────────────────┴───────────────────────────────┐
│              MongoDB Atlas (single DB)                │
│  sessions │ users │ tenants │ knowledge │ rules       │
│  (chat logs + vector search via $vectorSearch)        │
└──────────────────────────────────────────────────────┘
```

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 19, Vite 8, TypeScript, Tailwind CSS v4, Recharts, Framer Motion |
| Backend | Node.js 22, Express, TypeScript |
| Database | MongoDB Atlas (vector search via `$vectorSearch`) |
| LLM | DeepSeek V4 Flash (via OpenRouter) |
| Embeddings | Google Gemini `gemini-embedding-001` (3072 dimensions) |
| Voice | Fish Audio TTS (Nigerian voices), Supertonic TTS (local fallback) |
| Auth | JWT + OTP via Brevo email |
| Payments | Paystack |
| Deployment | Vercel (frontend), Render (backend) |

## Features

- **Real-time SSE streaming** — Token-by-token response rendering at ~60fps
- **Voice I/O** — Fish Audio TTS with emotion tags, microphone input support
- **Severity scoring** — Three-tier triage: self-care, consult, emergency
- **Clinical protocols** — Vector-searched knowledge base of WHO/Nigerian guidelines
- **Chat history** — LocalStorage persistence with session management
- **Business analytics** — Real-time KPIs, verdict breakdown, session filtering
- **Dark mode** — Full dark theme across all portals
- **Responsive** — Mobile-first design for all screen sizes

## Getting Started

### Prerequisites

- Node.js 22 (`nvm use 22` — Node 24 causes TLS issues with MongoDB Atlas)
- MongoDB Atlas cluster (M0+ with vector search enabled)
- API keys for DeepSeek, Gemini, Fish Audio, Brevo

### Backend

```bash
cd backend
npm install
cp .env.example .env   # fill in all API keys

# Seed clinical rules and ingest knowledge base
npm run setup

# Start dev server
npm run dev
```

### Frontend

```bash
cd frontend
npm install

# Start dev server
npm run dev
```

### Environment Variables

See `backend/.env` and `frontend/.env` for full configuration. Key variables:

| Variable | Description |
|----------|-------------|
| `MONGODB_URI` | MongoDB Atlas connection string |
| `OPENROUTER_API_KEY` | DeepSeek LLM API key |
| `GOOGLE_AI_STUDIO_API_KEY` | Gemini embeddings key |
| `FISH_AUDIO_API_KEY` | Fish Audio TTS key |
| `JWT_SECRET` | JWT signing secret |
| `BREVO_API_KEY` | Brevo OTP email service |

## Project Structure

```
med-bot/
├── backend/
│   ├── src/
│   │   ├── routes/          # Express route handlers
│   │   ├── services/        # Business logic (auth, chat, TTS, embeddings)
│   │   ├── middleware/       # JWT auth, error handling
│   │   ├── db/              # MongoDB client, schema, indexes
│   │   ├── config/          # Environment validation
│   │   └── lib/             # Utilities, webhook, logger
│   ├── agents/              # Triage agent (Eve framework structure)
│   ├── scripts/             # Knowledge ingestion, seeding
│   └── knowledge/           # Clinical protocol markdown files
├── frontend/
│   ├── src/
│   │   ├── components/      # UI components (customer, business, admin, ui)
│   │   ├── pages/           # Route pages (landing, auth, dashboards)
│   │   ├── lib/             # API client, utilities
│   │   └── hooks/           # Custom React hooks
│   └── public/              # Static assets
├── render.yaml              # Render deployment config
└── vercel.json              # Vercel deployment config
```

## Deployment

- **Frontend**: Deployed to Vercel at `https://medbotfrontend.vercel.app`
- **Backend**: Deployed to Render (Node 22 runtime, port 5001)
- **Database**: MongoDB Atlas (PiusDivine18 cluster)

## License

Private — All rights reserved.
