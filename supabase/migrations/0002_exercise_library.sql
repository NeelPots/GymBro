-- Phase 2: richer exercise library - step-by-step instructions, easier/harder
-- variations, and a video slot (left null until a real video is added later).

alter table public.exercises
  add column instructions text,
  add column easier_variation text,
  add column harder_variation text,
  add column video_url text;
