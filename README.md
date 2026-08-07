# VitalityBridge

AI life companion — Next.js app with voice, emotion detection, Life Map (Neo4j), and Supabase.

## ⚠️ Before you upload: delete and recreate the GitHub repo

Your current repo has files scattered across multiple locations (root level,
`mnt/user-data/outputs/app/`, `app/`, etc.) from earlier manual uploads. The
cleanest fix is to **delete the repo and start over** with this package,
which has the correct, single, clean structure below.

1. Go to `https://github.com/techwokx-cloud/VitalityBridge/settings`
2. Scroll to the bottom → **Delete this repository** → confirm
3. Create a new repo with the same name: `VitalityBridge` (empty, no README/gitignore)

## 📁 Folder structure (exactly as it should be)

```
VitalityBridge/
├── .env.example
├── package.json
├── tsconfig.json
├── next.config.ts
├── tailwind.config.ts
├── postcss.config.mjs
├── app/
│   ├── page.tsx
│   ├── layout.tsx
│   ├── globals.css
│   ├── signin/page.tsx
│   └── app/
│       ├── layout.tsx
│       ├── page.tsx
│       ├── conversation/page.tsx
│       ├── conversations/page.tsx
│       └── lifemap/page.tsx
├── components/
│   ├── robot/animated-robot.tsx
│   ├── robot/mini-robot.tsx
│   ├── branding/logo.tsx
│   └── layout/sidebar.tsx, topbar.tsx
├── lib/
│   ├── ai/gemini.ts, groq.ts
│   ├── api/google-voice.ts, google-emotion.ts, neo4j.ts
│   ├── services/conversation-orchestrator.ts
│   └── supabase/client.ts, server.ts, schema.sql
└── docs/
    ├── PRODUCT.md
    ├── ARCHITECTURE.md
    ├── API_OPTIMIZATION_STRATEGY.md
    ├── API_IMPLEMENTATION_ROADMAP.md
    ├── ROBOT_ANIMATIONS.md
    ├── REUSE_MAP.md
    └── 48-HOUR-BUILD-GUIDE.md
```

**No files should ever sit at the repo root except**: `.env.example`,
`package.json`, `tsconfig.json`, `next.config.ts`, `tailwind.config.ts`,
`postcss.config.mjs`, `README.md`. Everything else lives inside `app/`,
`components/`, `lib/`, or `docs/`.

## 🚀 Upload steps

1. Download this entire folder, keeping the structure intact
2. On the new empty GitHub repo page, click **"uploading an existing file"**
3. Drag the whole folder in (GitHub preserves subfolder paths when you drop a folder)
4. Commit directly to `main`

If your upload method doesn't preserve folders, use git instead:

```bash
cd vitalitybridge
git init
git add -A
git commit -m "Clean VitalityBridge MVP"
git branch -M main
git remote add origin https://github.com/techwokx-cloud/VitalityBridge.git
git push -u origin main
```

## ✅ All TypeScript build errors are already fixed

- `lib/ai/gemini.ts` — added missing `generateCompanionResponse`, `generateResponseWithContext`, `suggestNextStep`
- `lib/ai/groq.ts` — fixed `model` possibly undefined
- `lib/api/google-emotion.ts` — fixed entity type nullability
- `lib/api/google-voice.ts` — fixed null safety, removed invalid `isFinal` property
- `lib/api/neo4j.ts` — removed invalid `encrypted` config option (encryption comes from the `neo4j+s://` URI scheme)
- `lib/supabase/server.ts` — added explicit types for cookie params
- `lib/services/conversation-orchestrator.ts` — added explicit types, fixed imports
- Removed `lib/graph/`, `lib/maps/`, `lib/audio/`, `lib/emotion/` — these were broken duplicates of working code already in `lib/api/`

## 🔑 After upload

1. Copy `.env.example` → `.env.local` (locally) or add each variable in Render's Environment tab
2. Run `lib/supabase/schema.sql` in your Supabase SQL editor
3. Redeploy on Render — build should succeed now
