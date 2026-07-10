# 🏋️ GymBro

A calisthenics training app that adjusts to how you're actually performing —
being rebuilt from a static prototype into a full product: an AI program
builder, a shared and moderated exercise library with instructional media,
and an in-app gym-community social feed.

This README is both onboarding docs and the living roadmap. **Phases 0-6 are
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
- **Custom workout splits** — build your own named training days (e.g. "Push
  Day"), each with its own exercises/sets/reps, and activate one as today's
  plan - an alternative to the AI builder that drives Home the same way.
- **Exercise library** — 300+ calisthenics + gym exercises across 7 categories
  (push/pull/legs/shoulders/arms/core/cardio), searchable and filterable,
  each with step-by-step instructions, easier/harder variations, and a
  looping illustrative pictogram (real video takes priority when set).
- **Social feed** — an in-app, Instagram-style feed: posts, 24-hour stories,
  likes, comments, a filter + draggable-text post/story editor, and a
  "share your PR" prompt whenever the adaptive engine detects real progress.
  Fully public (no followers model), gated behind sign-in.
- **Google sign-in** on top of email/password, for the whole app.
- **Leveling system** — XP and hunter ranks (E through S) for consistent
  training, and a "penalty gate" that opens - gently, never forced - when a
  training streak breaks, with an honor-system redemption workout.

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
    train/         GoalPicker, ActiveProgramView, TrainView, SplitsView, SplitDayCard, SplitDayEditorSheet
    exercises/     ExerciseCard, ExerciseLibraryView, ExerciseDetailView, CategoryAnimation
    social/        StoriesBar, PostCard, ComposerSheet, PostEditor, StoryViewer, SocialFeedView, AuthorAvatar
    auth/          AuthForm, GoogleSignInButton
    settings/      SettingsRow, SettingsSection, SettingsActions
    shared/        NumberStepper, CircularProgress, ComingSoon, ServiceWorkerRegister
  lib/
    adaptive/      engine.ts (the rule-based coach) + engine.test.ts + defaultExercises.ts + planExercises.ts + activePlan.ts
    supabase/      client.ts, server.ts, proxy.ts, config.ts
    types/         database.types.ts, domain.ts
    categoryIcon.ts, formatRelativeTime.ts
  services/
    movements/     getExercises.ts, getExerciseById.ts (Supabase, falls back to local defaults)
    ai/            types.ts, provider.ts, providers/anthropic.ts, generateProgram.ts (+ tests)
    social/        getFeed.ts, getStories.ts (server), socialClient.ts (client: create/like/comment/delete)
  hooks/
    useLocalAdaptiveState.ts   # localStorage-backed logging state (with per-set delete) until accounts exist
    useLocalProgram.ts         # localStorage-backed AI-generated program
    useLocalSplit.ts           # localStorage-backed custom workout-split days
    useActivePlanSource.ts     # which of AI program / split / default currently drives Home
  proxy.ts         # Supabase auth session refresh (Next.js 16 renamed "middleware")
supabase/
  migrations/0001_init.sql    # profiles, exercises, session_logs
  migrations/0002_exercise_library.sql   # instructions/easier/harder/video_url columns
  migrations/0003_social.sql             # posts/stories/post_likes/post_comments + storage bucket
  seed.sql                    # the 4 original default movements
  seed_library.sql            # the original ~32-exercise library content
  seed_library_2.sql          # Phase 4: ~50 more exercises + shoulders/arms/cardio categories
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
   - `supabase/seed_library_2.sql` (Phase 4's ~50 additional exercises + the
     shoulders/arms/cardio categories - no new migration needed, same table)
   - `supabase/seed_library_3.sql` (Phase 6's ~220 additional exercises,
     bringing the library to 300+ - same table again, no new migration)
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
elastic/bounce easing anywhere in the app. The one deliberate exception is
`CategoryAnimation` on the exercise detail page - a small looping CSS
pictogram that fills the "demo video" slot when no `video_url` is set; it's
scoped to that one illustrative slot, not a change to the wider policy.

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
Expanded further in Phase 4 below.
- `exercises` table extended with `instructions`, `easier_variation`,
  `harder_variation`, `video_url` (`0002_exercise_library.sql` +
  `seed_library.sql`); the same content is mirrored in
  `defaultExercises.ts` so local mode gets the full library too.
- **Not done, on purpose:** real demo videos. `video_url` is a real schema
  column that renders as an embedded video when present; every exercise
  without one shows a looping illustrative pictogram instead (see Phase 4) -
  filming/licensing real footage is still a content task, not a code task.
  Add a video by setting that column (or the local fallback's `videoUrl`
  field) to a real embed URL.
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

### ✅ Phase 4 — GymBro rebrand, bigger library, splits, and social editor (done)
- **Rebrand:** display name changed to GymBro across the header, sidebar,
  auth pages, manifest, and this README (internal package/folder names stay
  `adaptive-coach` - no reason to churn those).
- **Bigger library:** ~50 more exercises (`seed_library_2.sql`, mirrored in
  `defaultExercises.ts`) plus three new categories - shoulders, arms,
  cardio - alongside the original push/pull/legs/core.
- **Category pictograms:** `CategoryAnimation` - a small looping CSS/SVG
  stick-figure animation, one consistent style per category, filling the
  demo slot on the exercise detail page whenever no real `video_url` is set.
- **Custom workout splits:** build named training days (e.g. "Push Day")
  with your own exercises/sets/reps via `useLocalSplit` (localStorage,
  mirrors `useLocalProgram`'s pattern), from a new "My Splits" tab on
  `/train` next to "AI Coach". Activating either a split day or an AI
  program updates a `planSource` pointer (`useActivePlanSource`); `activePlan.ts`
  resolves whichever was most recently activated into "today's plan" on
  Home, falling back to the default library if that source is later cleared.
- **Delete a logged set:** session/history entries now carry a stable `id`;
  `useLocalAdaptiveState.deleteSession(exerciseId, id)` removes one from both
  the per-exercise history and the flat session log, with a trash button on
  each row in History → Recent sessions.
- **Social - share your PR:** logging a set that the adaptive engine scores
  as `"progress"` (a genuine improvement, the engine's existing signal) shows
  a toast with a **Share 🎉** action, deep-linking to `/social?share=...`
  which auto-opens the composer pre-filled with a caption.
- **Social - post/story editor:** `PostEditor` adds filter presets (mono,
  warm, cool, vivid, fade) and a draggable, recolorable text overlay to the
  composer; on Share, the chosen filter and text are flattened onto the
  image via an offscreen canvas (`drawImage` + `ctx.filter` + `fillText` +
  `toBlob()`) so the edits are baked into the uploaded file, not just stored
  as metadata.
- **Not yet exercised end-to-end:** the post editor and share-a-PR deep link
  need a real signed-in account to click through fully (same Phase 3
  limitation) - the share toast → `/social?share=...` navigation is verified
  working for signed-out users too (falls back to the sign-in prompt without
  breaking), but posting with an edited image needs a real login to confirm.

### ✅ Phase 5 — Leveling system: XP, ranks, and penalty gates (done)
A gamification layer, entirely local-first like the adaptive engine and
splits before it - no accounts required.
- `src/lib/gamification/rank.ts` - a small, unit-tested XP curve
  (`rank.test.ts`) and a level → rank-title mapping (E-Rank Trainee through
  S-Rank Hunter).
- `useLocalQuest` (`adaptive-coach-quest-v1`) awards XP for logged sessions,
  a bonus for adaptive-engine "progress", and a bonus for each new day of a
  streak - and reconciles the streak useLocalAdaptiveState already computes
  to detect exactly one thing: a streak that just broke.
- When that happens, a "penalty gate" appears on Home (`PenaltyGate`):
  an honor-system redemption quest (30 minutes of cardio, linking straight
  to the cardio-filtered exercise library) that's encouraged, never forced.
  Skipping is always one tap away behind a confirm dialog
  (`PenaltySkipDialog`, built on a new `components/ui/alert-dialog.tsx`
  primitive) with an optional note field - so a genuine reason (illness,
  travel, a planned rest day) can be recorded without guilt, without
  blocking anyone who really does just want to skip it.
- `MotivationalBanner` shows a rotating motivational quote - decorative
  only, `pointer-events-none`, and picked from the current date rather than
  random/`Date.now()` at render time to avoid the same render-purity issue
  solved earlier in `useLocalAdaptiveState`. Redesigned in Phase 6 below -
  see that section for the current, bigger version.
- Level is visible everywhere via `LevelBadge`, not just on Home - it's in
  the mobile header and the desktop sidebar too.

### ✅ Phase 6 — Profile pages, concrete level-ups, social demo data, 300+ exercises (done)
- **Real auth state:** `/settings` now shows who you're actually signed in
  as (avatar, email, sign-out) instead of always showing a generic "Sign
  in" link regardless of session.
- **New `/profile` page:** one page, two tabs (Training / Social, the same
  toggle pattern as `/train`'s AI Coach / My Splits). Training reuses
  `LevelCard`/`SignalPanel`/stats and works with zero sign-in; Social shows
  your Supabase profile plus a grid of your own posts (`getMyPosts.ts`), or
  a sign-in prompt if you're not signed in.
- **Concrete level-up framing:** `LevelCard` now also shows an estimated
  "hours trained" line per rank (e.g. "12/40 hrs trained to reach C-Rank
  Hunter") - a friendlier translation of the same XP curve
  (`hoursForLevel`/`hoursTrainedFromSessions` in `rank.ts`), not a second,
  separately-tuned system.
- **Social feed populated immediately:** `src/lib/social/mockSocialData.ts`
  seeds ~8 demo authors, 15 posts, and 6 stories (real, public placeholder
  media via `picsum.photos`/`i.pravatar.cc`, not invented URLs) so `/social`
  is never empty - visible even signed out now (browsing only; posting/
  liking/commenting still require a real sign-in, gated inline rather than
  behind a full-page wall).
- **Exercise library, ~82 → 300+:** `supabase/seed_library_3.sql` (mirrored
  into `defaultExercises.ts`) adds roughly 220 more exercises at the same
  depth as before across all 7 categories - more machine/cable/band
  variants, more compound-lift variants, more bodyweight progressions, more
  cardio/functional movements.
- **Real bug fix:** the category pictogram's shoulder-press, curl, and
  squat animations were pivoting from the wrong point (a `transform-box:
  fill-box` rule was reinterpreting SVG-coordinate `transform-origin`
  values as offsets from each shape's own bounding box). Fixed by dropping
  that rule and adding the hip pivot the squat animation was missing
  entirely - confirmed via computed-style inspection, not just a visual
  guess.
- **Motivational banners redesigned:** the previous absolutely-positioned
  background ribbons turned out to render fully hidden behind Home's large
  opaque cards once tested at real scroll depth. Replaced with real,
  always-visible banner cards in the normal page flow - bigger, bolder,
  and confirmed visible top-to-bottom of the page instead of only in a
  thin gap near the top.

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
