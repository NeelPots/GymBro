-- Phase 0: profiles, exercises (system + user-submitted/moderated), session_logs.
-- Programs/program_exercises (Phase 1), exercise_media/moderation_queue (Phase 2),
-- and posts/stories/likes/comments (Phase 3) are deliberately not created yet -
-- see README.md for the full schema design.

create extension if not exists "pgcrypto";

-- ---------- profiles ----------
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  username text unique,
  display_name text,
  avatar_url text,
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

create policy "profiles are publicly readable"
  on public.profiles for select
  using (true);

create policy "users can insert their own profile"
  on public.profiles for insert
  with check (auth.uid() = id);

create policy "users can update their own profile"
  on public.profiles for update
  using (auth.uid() = id);

-- Auto-create a profile row whenever a new auth user signs up.
create function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, username)
  values (new.id, new.email);
  return new;
end;
$$ language plpgsql security definer set search_path = public;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ---------- exercises ----------
create table public.exercises (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  category text not null,
  description text,
  default_reps integer not null,
  default_sets integer not null,
  difficulty_tier integer not null default 1,
  source text not null default 'system' check (source in ('system', 'user_submitted')),
  submitted_by uuid references public.profiles(id) on delete set null,
  moderation_status text not null default 'approved' check (moderation_status in ('approved', 'pending', 'rejected')),
  is_public boolean not null default true,
  created_at timestamptz not null default now()
);

alter table public.exercises enable row level security;

create policy "approved exercises are publicly readable, submitters can see their own"
  on public.exercises for select
  using (moderation_status = 'approved' or submitted_by = auth.uid());

create policy "users can submit their own exercises as pending"
  on public.exercises for insert
  with check (
    submitted_by = auth.uid()
    and source = 'user_submitted'
    and moderation_status = 'pending'
  );

create policy "submitters can update their own pending submissions"
  on public.exercises for update
  using (submitted_by = auth.uid() and moderation_status = 'pending');

-- ---------- session_logs ----------
create table public.session_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  exercise_id uuid not null references public.exercises(id) on delete cascade,
  logged_date date not null,
  target_reps integer not null,
  target_sets integer not null,
  completed_reps integer not null,
  completed_sets integer not null,
  rpe numeric(3, 1) not null,
  created_at timestamptz not null default now()
);

alter table public.session_logs enable row level security;

create policy "users can read their own session logs"
  on public.session_logs for select
  using (user_id = auth.uid());

create policy "users can insert their own session logs"
  on public.session_logs for insert
  with check (user_id = auth.uid());

create index session_logs_user_exercise_date_idx
  on public.session_logs (user_id, exercise_id, logged_date desc);
