# 🏋️ Adaptive Coach

A calisthenics training app that adjusts to how you're actually performing —
being rebuilt from a static prototype into a full product: an AI program
builder, a shared and moderated exercise library with instructional media,
and an in-app gym-community social feed.

This README is both onboarding docs and the living roadmap. **Phases 0-3 are
all built** - what's left is a handful of real-world setup steps (below)
that only you can do: adding your own API keys, running SQL migrations
against your Supabase project, and configuring Google OAuth.

---

## 🧭 What this app is

- **Signal panel** — a running, plain-English explanation of *why* your plan
  just changed (progress / hold / deload), backed by a deliberately
  explainable rule engine, not a black box.
- **Adaptive engine** — looks at your last few sessions per movement
  (completion rate + RPE) and decides whether to progress, hold, or deload.
- **AI program builder** — pick a goal or write a custom prompt and get a
  training program composed strictly from real exercises in the library
  (never invented ones).
- **Exercise library** — ~32 calisthenics + gym exercises, searchable and
  filterable by category, each with step-by-step instructions and
  easier/harder variations. Video demos are a content slot, not filled yet.
- **Social feed** — an in-app, Instagram-style feed: posts, 24-hour stories,
  likes, comments. Fully public (no followers model), gated behind sign-in.
- **Google sign-in** on top of email/password, for the whole app.

## 🏗️ Architecture

| Layer | Choice |
|---|---|
| Framework | Next.js 16 (App Router, TypeScript) |
| UI | Tailwind CSS v4 + shadcn/ui (Base UI primitives) |
| Motion | Framer Motion — restrained, whitelisted use only (see below) |
| Backend | Supabase (Postgres + Auth + Storage + Realtime) |
| AI | Provider-agnostic service interface (`services/ai`); Claude (`claude-opus-4-8`) as first implementation, forced tool-use for structured output |
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
    (auth)/login, (auth)/signup        # Supabase email/password + Google OAuth
    auth/callback                      # OAuth code-exchange route
    (app)/home                         # signal panel, today's targets, log-a-set
    (app)/train                        # AI program builder: goal picker + active program
    (app)/exercises, (app)/exercises/[id]   # searchable library + exercise detail
    (app)/history                      # streak/compliance + volume chart
    (app)/social                       # Instagram-style feed (posts/stories/likes/comments)
    (app)/settings                     # sectioned preferences
    api/ai/generate-program            # AI program builder route handler
  components/
    ui/            shadcn/ui primitives
    nav/           BottomNav, DesktopSidebar, AppHeader, PageTransition, navItems
    signal/        SignalPanel, SignalWave
    movement/      MovementTile, LogSetSheet (per-set checklist)
    charts/        VolumeChart
    home/          ProfileCard (desktop right rail)
    train/         GoalPicker, ActiveProgramView, TrainView
    exercises/     ExerciseCard, ExerciseLibraryView, ExerciseDetailView
    social/        StoriesBar, PostCard, ComposerSheet, StoryViewer, SocialFeedView, AuthorAvatar
    auth/          AuthForm, GoogleSignInButton
    settings/      SettingsRow, SettingsSection, SettingsActions
    shared/        NumberStepper, CircularProgress, ComingSoon, ServiceWorkerRegister
  lib/
    adaptive/      engine.ts (the rule-based coach) + engine.test.ts + defaultExercises.ts + planExercises.ts
    supabase/      client.ts, server.ts, proxy.ts, config.ts
    types/         database.types.ts, domain.ts
    categoryIcon.ts, formatRelativeTime.ts
  services/
    movements/     getExercises.ts, getExerciseById.ts (Supabase, falls back to local defaults)
    ai/            types.ts, provider.ts, providers/anthropic.ts, generateProgram.ts (+ tests)
    social/        getFeed.ts, getStories.ts (server), socialClient.ts (client: create/like/comment/delete)
  hooks/
    useLocalAdaptiveState.ts   # localStorage-backed logging state until accounts exist
    useLocalProgram.ts         # localStorage-backed AI-generated program
  proxy.ts         # Supabase auth session refresh (Next.js 16 renamed "middleware")
supabase/
  migrations/0001_init.sql    # profiles, exercises, session_logs
  migrations/0002_exercise_library.sql   # instructions/easier/harder/video_url columns
  migrations/0003_social.sql             # posts/stories/post_likes/post_comments + storage bucket
  seed.sql                    # the 4 original default movements
  seed_library.sql            # the full ~32-exercise library content
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
3. Run each SQL file below against your project, in order, via the
   **SQL Editor** in the Supabase dashboard (simplest - no service role key
   needed on your machine):
   - `supabase/migrations/0001_init.sql` then `supabase/seed.sql`
   - `supabase/migrations/0002_exercise_library.sql` then `supabase/seed_library.sql`
   - `supabase/migrations/0003_social.sql`
4. Restart `npm run dev`. Auth pages (`/login`, `/signup`), Supabase-backed
   exercise fetching, and the social feed will start working automatically —
   the app detects whether Supabase is configured and falls back gracefully
   if not.

### Google sign-in

The "Continue with Google" button and `/auth/callback` route are already
built - Google sign-in itself needs two things only you can do:

1. In [Google Cloud Console](https://console.cloud.google.com/apis/credentials),
   create an **OAuth 2.0 Client ID** (Application type: Web application).
   Set the **Authorized redirect URI** to:
   `https://<your-project-ref>.supabase.co/auth/v1/callback`
   (find `<your-project-ref>` in your Supabase project URL).
2. In the Supabase dashboard: **Authentication → Providers → Google**,
   paste in the Client ID and Client Secret from step 1, and enable it.

No app code or env vars change - Supabase handles the OAuth exchange using
the credentials you configure there.

To use the **AI program builder** (`/train`), add an Anthropic API key —
this is independent of Supabase, since generated programs are stored in
`localStorage` rather than the database (see Phase 1 below):

1. Create a key at [console.anthropic.com](https://console.anthropic.com) with billing enabled.
2. Add `ANTHROPIC_API_KEY=...` to `.env.local` (`AI_PROVIDER=anthropic` is already the default).
3. Restart `npm run dev`. Without a key, `/train` still renders and explains
   what's missing instead of failing silently.

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
~180ms fade/slide between the five bottom-nav sections, and belongs nowhere
else by default. No hover-lift/tilt/glow, no stagger/parallax, no
elastic/bounce easing anywhere in the app.

## 🗺️ Roadmap

### ✅ Phase 0 — Foundation (done)
Migrated off the static prototype onto Next.js + Supabase-ready
infrastructure. Ported the adaptive engine and design language 1:1. New
4-tab navigation shell (Home / Train / History / Social). Reached parity
with the original app's logging flow, now backed by a typed, tested engine.

### ✅ Phase 1 — AI Program Builder (done)
Pick a goal (build strength / lose fat / gain muscle / stay lean) or type a
free-form prompt, and get a full program generated from the exercise
library — never freeform, always composed of real exercises by ID.
- `services/ai/generateProgram.ts` fetches the current exercise library via
  the existing `getExercises()`, injects it as the candidate set, calls the
  configured `AIProvider`, then filters the response against that candidate
  set - a hallucinated exercise ID is dropped, never silently invented.
  `validateProgramExercises()` is unit-tested in isolation.
- `services/ai/providers/anthropic.ts` forces the model through a
  strict-schema tool call (`tool_choice` pinned to `generate_program`) so the
  output is always structurally valid JSON, never free text to parse.
- **Revised from the original design:** rather than new `programs` /
  `program_exercises` Supabase tables requiring sign-in, the generated
  program persists to `localStorage` (`useLocalProgram`) - consistent with
  how the rest of the app degrades gracefully without Supabase, and it means
  the AI builder works the moment an Anthropic key is added, no account
  required. Logging a set against a program exercise flows through the same
  `useLocalAdaptiveState` engine Home already uses.
- **Blocker:** requires `ANTHROPIC_API_KEY` with billing enabled - without
  it, `/train` still renders and explains what's missing rather than
  failing silently.

### ✅ Phase 2 — Exercise Library (done, minus real video)
A searchable, filterable library (`/exercises`) of ~32 calisthenics + gym
exercises across push/pull/legs/core, each with numbered step-by-step
instructions and "make it easier" / "make it harder" variation cards.
- `exercises` table extended with `instructions`, `easier_variation`,
  `harder_variation`, `video_url` (`0002_exercise_library.sql` +
  `seed_library.sql`); the same content is mirrored in
  `defaultExercises.ts` so local mode gets the full library too.
- **Not done, on purpose:** real demo videos. `video_url` is a real schema
  column that renders as an embedded video when present, but every exercise
  currently shows a "demo video coming soon" placeholder - filming/licensing
  footage is a content task, not a code task. Add a video by setting that
  column (or the local fallback's `videoUrl` field) to a real embed URL.
- User-submitted exercises + AI moderation (the `moderation_status`/
  `submitted_by` columns already exist from Phase 0) is still unbuilt -
  the library is currently system-curated only.

### ✅ Phase 3 — Social Feed (done, needs a real account to fully test)
An in-app, Instagram-style feed — posts, 24-hour stories, likes, comments -
gated behind sign-in, fully public (no followers model).
- New tables: `posts`, `stories`, `post_likes`, `post_comments`
  (`0003_social.sql`), plus a public `social-media` storage bucket scoped so
  users can only write under their own `auth.uid()` folder.
- `/social` has three states: Supabase not configured → setup message;
  configured but signed out → a "join the community" prompt; signed in → the
  real feed.
- **Verified:** the signed-out prompt. **Not yet exercised end-to-end** with
  a real account (needs either email confirmation, which was rate-limited
  during development, or Google sign-in once configured) - the code path,
  types, and RLS policies are all in place and build cleanly, but posting/
  liking/commenting should get a real click-through once you can sign in.

### 🔮 Future (flagged, not scheduled)
- **Wearable / device integration** — auto-detecting a completed set or a
  finished rest timer from a wristband or other paired device. This is a
  real, intended direction for the app, just not an active phase yet.
- Real exercise demo videos (see Phase 2) and user-submitted exercises with
  AI moderation.
- Native App Store / Play Store builds (currently: installable PWA only).
- Real Instagram/Facebook integration (currently: in-app feed only).
- A second AI provider (the seam already exists - Phase 1 just needs a new
  `services/ai/providers/*.ts` file).
- A followers model for the social feed (currently fully public).

## 🧪 Testing

- `src/lib/adaptive/engine.test.ts` covers the progress / hold / deload
  decision branches, the lookback window, and the rep→set→tier progression
  curve.
- `src/services/ai/validateProgramExercises.test.ts` covers the
  candidate-exercise validation that guarantees the AI can never introduce
  an exercise outside the library.

Run with `npm test`.
