# VitalityBridge

**An AI life companion for real-life moments** — marriage, parenting, friendships, career, money, and the hard decisions in between.

VitalityBridge isn't a chatbot, a medical app, or a fitness tracker. It's a proactive AI companion that remembers context, checks in when it matters, and helps people move from a hard conversation to a concrete next step.

---

## Core Loop

**Understand → Prioritize → Act → Reflect → Adapt**

A typical session: *"My teenage son has stopped talking to me and I'm worried we're losing our relationship."* → Talk → Understand → Life Map → Next Step → Practice → What Happened → Replan → Journey.

## Three Agents

| Agent | Role |
|---|---|
| **Companion** | Listens, remembers, talks, provides emotional support |
| **Navigator** | Maintains the Life Map, sets priorities and goals, builds 7-day plans, suggests next actions, replans when things change |
| **Follow-Up** | Tracks open loops and decides when to check in, via a Companion Policy Engine |

---

## Tech Stack

- **Framework:** Next.js 16 (App Router, Turbopack), React 19, TypeScript
- **Styling:** Tailwind CSS
- **AI:** Gemini (primary), Groq (fallback)
- **Voice:** Google Cloud Speech-to-Text / Text-to-Speech
- **Emotion detection:** Google Cloud Natural Language API
- **Relational data:** Supabase (PostgreSQL) — conversations, messages, users, outcomes
- **Graph data:** Neo4j — Life Map, domains, patterns, relationships
- **Email:** Resend (proactive check-ins)

All integrations are built against free tiers — see [`docs/API_OPTIMIZATION_STRATEGY.md`](docs/API_OPTIMIZATION_STRATEGY.md) for the full cost breakdown (~$0–5/month).

---

## Project Structure

```
VitalityBridge/
├── app/                        # Next.js App Router
│   ├── page.tsx                 # Landing page
│   ├── layout.tsx
│   ├── globals.css
│   ├── signin/page.tsx
│   └── app/                     # Authenticated app shell
│       ├── page.tsx              # Dashboard
│       ├── conversation/page.tsx # Voice/text conversation UI
│       ├── conversations/page.tsx
│       └── lifemap/page.tsx      # Neo4j-backed Life Map visualization
├── components/
│   ├── robot/                   # Animated companion (landing + mini conversation robot)
│   ├── branding/                # Logo
│   └── layout/                  # Sidebar, topbar
├── lib/
│   ├── ai/                      # gemini.ts, groq.ts
│   ├── api/                     # google-voice.ts, google-emotion.ts, neo4j.ts
│   ├── services/                # conversation-orchestrator.ts (ties every API together)
│   └── supabase/                # client.ts, server.ts, schema.sql
└── docs/                        # Product, architecture, and rollout docs
```

---

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment variables

```bash
cp .env.example .env.local
```

Fill in your keys for: Gemini, Groq, Google Cloud (Speech, Text-to-Speech, Natural Language), Neo4j, Supabase, and Resend.

### 3. Set up the database

Run [`lib/supabase/schema.sql`](lib/supabase/schema.sql) in your Supabase SQL editor to create all tables (conversations, messages, emotions, open loops, patterns, outcomes, journey events, life domains, companion context).

### 4. Run locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### 5. Build for production

```bash
npm run build
npm start
```

---

## Deployment

The app deploys cleanly on [Render](https://render.com) or [Vercel](https://vercel.com). Build command:

```bash
npm install --legacy-peer-deps && npm run build
```

Add all variables from `.env.example` in your hosting provider's environment settings before deploying.

---

## Documentation

| Doc | Covers |
|---|---|
| [`docs/PRODUCT.md`](docs/PRODUCT.md) | Product vision and concept |
| [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) | System architecture |
| [`docs/API_OPTIMIZATION_STRATEGY.md`](docs/API_OPTIMIZATION_STRATEGY.md) | Full API strategy and cost breakdown |
| [`docs/API_IMPLEMENTATION_ROADMAP.md`](docs/API_IMPLEMENTATION_ROADMAP.md) | 4-week implementation plan |
| [`docs/ROBOT_ANIMATIONS.md`](docs/ROBOT_ANIMATIONS.md) | Companion animation states and design |
| [`docs/REUSE_MAP.md`](docs/REUSE_MAP.md) | Code reuse strategy across source repos |
| [`docs/48-HOUR-BUILD-GUIDE.md`](docs/48-HOUR-BUILD-GUIDE.md) | Original rapid-build spec |

---

## Status

**Built:** Landing page, dashboard, conversation UI, animated companion, logo, navigation, all API integration modules, database schema.

**In progress:** Wiring the conversation API route, Life Map visualization, persistence UI, proactive check-in scheduler — see the roadmap doc above for the week-by-week plan.

---

## License

Proprietary — © TechWokx IT Solutions.
