-- Phase 8: cloud sync for the training side of the app (splits, the active
-- AI program, user-authored custom exercises) - previously local-only,
-- unlike the gamification layer's hunter_state. One row per hunter, one
-- column per concern (not one shared jsonb blob) so pushing an update to
-- just splits can never clobber program/custom_exercises written from a
-- different tab/hook without either knowing about the other.

create table public.training_state (
  user_id uuid primary key references public.profiles(id) on delete cascade,
  splits jsonb,
  splits_updated_at timestamptz,
  program jsonb,
  program_updated_at timestamptz,
  custom_exercises jsonb,
  custom_exercises_updated_at timestamptz
);

alter table public.training_state enable row level security;

create policy "users can read their own training state"
  on public.training_state for select
  using (user_id = auth.uid());

create policy "users can upsert their own training state"
  on public.training_state for insert
  with check (user_id = auth.uid());

create policy "users can update their own training state"
  on public.training_state for update
  using (user_id = auth.uid());
