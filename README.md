# 🏋️ Adaptive Coach

A calisthenics training app that adjusts to how you're actually performing —
being rebuilt from a static prototype into a full product: an AI program
builder, a shared and moderated exercise library with instructional media,
and an in-app gym-community social feed.

This README is both onboarding docs and the living roadmap. **Phase 0 is
done** (this rebuild); Phases 1-3 are designed but not yet built.

---

## 🧭 What this app is

- **Signal panel** — a running, plain-English explanation of *why* your plan
  just changed (progress / hold / deload), backed by a deliberately
  explainable rule engine, not a black box.
- **Adaptive engine** — looks at your last few sessions per movement
  (completion rate + RPE) and decides whether to progress, hold, or deload.
- Soon: an **AI assistant** that builds you a full program, a **community
  exercise library** anyone can contribute to (AI-moderated), and a **social
  feed** for the gym-community side of things.

## 🏗️ Architecture

| Layer | Choice |
|---|---|
| Framework | Next.js 16 (App Router, TypeScript) |
| UI | Tailwind CSS v4 + shadcn/ui (Base UI primitives) |
| Motion | Framer Motion — restrained, whitelisted use only (see below) |
| Backend | Supabase (Postgres + Auth + Storage + Realtime) |
| AI | Provider-agnostic service interface; Claude as first implementation |
| Charts | Chart.js via react-chartjs-2 |
| PWA | Web manifest + a lightweight runtime-caching service worker |
| Tests | Vitest (adaptive engine unit tests) |

> **Next.js 16 note:** this scaffold is newer than most training data floating
> around - `middleware.ts` is renamed to `proxy.ts` (exported function
> `proxy`), and `params`/`searchParams` are async everywhere. If something
> looks unfamiliar, check `node_modules/next/dist/docs/` before assuming it's
> wrong.

### Repo layout

```
src/
  app/
    (auth)/login, (auth)/signup        # Supabase email/password auth
    (app)/home                         # signal panel, today's targets, log-a-set
    (app)/train                        # AI program builder (Phase 1 - placeholder)
    (app)/history                      # streak/compliance + volume chart
    (app)/social                       # community feed (Phase 3 - placeholder)
    (app)/settings
  components/
    ui/            shadcn/ui primitives
    nav/           BottomNav, AppHeader, PageTransition
    signal/        SignalPanel, SignalWave
    movement/      MovementRow, LogSetSheet
    charts/        VolumeChart
  lib/
    adaptive/      engine.ts (the rule-based coach) + engine.test.ts
    supabase/      client.ts, server.ts, proxy.ts, config.ts
    types/         database.types.ts, domain.ts
  services/
    movements/     getExercises.ts (Supabase, falls back to local defaults)
  hooks/
    useLocalAdaptiveState.ts   # localStorage-backed state until accounts exist
  proxy.ts         # Supabase auth session refresh (Next.js 16 renamed "middleware")
supabase/
  migrations/0001_init.sql    # profiles, exercises, session_logs
  seed.sql                    # the 4 original default movements
legacy/adaptive-coach/         # the original static prototype, kept for reference
```

## 🚀 Running locally

```bash
npm install
npm run dev      # http://localhost:3000
npm test         # adaptive engine unit tests
npm run build    # production build / type-check
```

The app works out of the box in **local mode** — no Supabase project
required. Training data (movements, logs, streaks) is stored in this
browser's `localStorage`, exactly like the original prototype.

To connect a real backend (needed for accounts, and required for every phase
after this one):

1. Create a free project at [supabase.com](https://supabase.com).
2. Copy `.env.local.example` to `.env.local` and fill in the project URL +
   anon key (Project Settings → API).
3. Run the migration and seed against your project:
   ```bash
   npx supabase db push        # applies supabase/migrations/0001_init.sql
   ```
   then run `supabase/seed.sql` against your project (SQL editor or CLI).
4. Restart `npm run dev`. Auth pages (`/login`, `/signup`) and Supabase-backed
   exercise fetching will start working automatically — the app detects
   whether Supabase is configured and falls back gracefully if not.

## 🎨 Design system

Dark-first, no light theme (yet) — this was a deliberate choice carried over
from the original prototype's identity, not an oversight.

| Token | Value | Used for |
|---|---|---|
| `background` | `#0A0B0D` | app background |
| `surface` / `surface-2` | `#15171A` / `#1E2124` | cards, sheets |
| `border` | `#26292E` | hairlines |
| `signal` | `#FF4D2E` | brand accent — streak, active nav, primary CTA, "progress" waveform |
| `progress` | `#3ECF8E` | adaptive engine "progress" state |
| `deload` | `#FFB020` | adaptive engine "deload" state |
| Fonts | Space Grotesk (display) / Inter (body) / JetBrains Mono (numbers, data) | |

**Motion policy** (explicitly restrained — "clean, modern, not too much
animation" was direct user feedback): Framer Motion is used *only* for the
~180ms fade/slide between the four bottom-nav sections, and belongs nowhere
else by default. No hover-lift/tilt/glow, no stagger/parallax, no
elastic/bounce easing anywhere in the app.

## 🗺️ Roadmap

### ✅ Phase 0 — Foundation (done)
Migrated off the static prototype onto Next.js + Supabase-ready
infrastructure. Ported the adaptive engine and design language 1:1. New
4-tab navigation shell (Home / Train / History / Social). Reached parity
with the original app's logging flow, now backed by a typed, tested engine.

### 🧠 Phase 1 — AI Program Builder
Pick a goal (build strength / lose fat / gain muscle / stay lean) or type a
free-form prompt, and get a full program generated from the exercise
library — never freeform, always composed of real exercises by ID.
- New tables: `programs`, `program_exercises`.
- New service: `services/ai/generateProgram` behind a provider-agnostic
  `AIProvider` interface (`services/ai/provider.ts`), so swapping Claude /
  OpenAI / others later doesn't touch the rest of the app.
- **Blocker:** requires an AI provider API key (e.g. `ANTHROPIC_API_KEY`)
  with billing enabled.

### 📚 Phase 2 — Exercise Library, Submission & Moderation
Anyone can submit a custom exercise; an AI moderation pass checks it's
appropriate before it becomes visible to everyone else. Every exercise gets
instructional media (short looping clip / image sequence) plus written
instructions.
- New tables: `exercise_media`, `moderation_queue`.
- New service: `services/ai/moderateExercise` (pass/fail + reason).
- New Supabase Storage bucket: `exercise-media`.
- **Blockers:** sourcing/filming/generating instructional media for the
  initial library; deciding whether moderation reviews media itself (vision)
  or stays text-only.

### 📱 Phase 3 — Social Feed
An in-app, Instagram/Facebook-inspired feed — posts, 24-hour stories, likes,
comments — for the gym-community side of the app. Not connected to real
Instagram/Facebook (that's an explicit later step, not this one).
- New tables: `posts`, `stories`, `post_likes`, `post_comments`.
- New Supabase Storage bucket: `social-media`.
- **Open decision to make before building:** fully public feed vs. a
  followers model.

### 🔮 Future (flagged, not scheduled)
- **Wearable / device integration** — auto-detecting a completed set or a
  finished rest timer from a wristband or other paired device. This is a
  real, intended direction for the app, just not an active phase yet.
- Native App Store / Play Store builds (currently: installable PWA only).
- Real Instagram/Facebook integration (currently: in-app feed only).
- A second AI provider (the seam already exists - Phase 1 just needs a new
  `services/ai/providers/*.ts` file).

## 🧪 Testing

`src/lib/adaptive/engine.test.ts` covers the progress / hold / deload
decision branches, the lookback window, and the rep→set→tier progression
curve. Run with `npm test`.
