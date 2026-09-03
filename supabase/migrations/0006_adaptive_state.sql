-- Phase 9: cloud sync for workout history and the adaptive engine's
-- per-movement state (reps/sets/difficulty tier + logged sessions) -
-- previously local-only, unlike everything else in the training_state
-- table. Same column-per-concern pattern as 0005 so this can never
-- clobber splits/program/custom_exercises written independently.

alter table public.training_state
  add column adaptive_state jsonb,
  add column adaptive_state_updated_at timestamptz;
