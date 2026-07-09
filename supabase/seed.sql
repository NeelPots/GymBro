-- Seeds the same 4 default movements the original prototype shipped with,
-- as system-owned, pre-approved exercises everyone can see.
insert into public.exercises (name, category, description, default_reps, default_sets, difficulty_tier, source, moderation_status, is_public)
values
  ('Push-ups', 'push', 'Hands under shoulders, lower chest to just above the floor, press back up keeping your body in a straight line.', 8, 3, 1, 'system', 'approved', true),
  ('Pull-ups', 'pull', 'Dead hang from the bar, pull your chin above the bar, lower back down under control.', 4, 3, 1, 'system', 'approved', true),
  ('Squats', 'legs', 'Feet shoulder-width apart, hips back and down until thighs are at least parallel, drive back up through your heels.', 12, 3, 1, 'system', 'approved', true),
  ('Plank (secs)', 'core', 'Forearms and toes on the floor, body in a straight line from head to heels, brace your core and hold.', 30, 3, 1, 'system', 'approved', true);
