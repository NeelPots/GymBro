import type { Exercise } from "@/lib/types/domain";

/**
 * Fallback library used until a Supabase project is connected (see
 * src/services/movements/getExercises.ts). Mirrors the seed data in
 * supabase/seed.sql so local/demo mode and a live project agree.
 */
export const DEFAULT_EXERCISES: Exercise[] = [
  {
    id: "push-ups",
    name: "Push-ups",
    category: "push",
    description:
      "Hands under shoulders, lower chest to just above the floor, press back up keeping your body in a straight line.",
    defaultReps: 8,
    defaultSets: 3,
    difficultyTier: 1,
  },
  {
    id: "pull-ups",
    name: "Pull-ups",
    category: "pull",
    description:
      "Dead hang from the bar, pull your chin above the bar, lower back down under control.",
    defaultReps: 4,
    defaultSets: 3,
    difficultyTier: 1,
  },
  {
    id: "squats",
    name: "Squats",
    category: "legs",
    description:
      "Feet shoulder-width apart, hips back and down until thighs are at least parallel, drive back up through your heels.",
    defaultReps: 12,
    defaultSets: 3,
    difficultyTier: 1,
  },
  {
    id: "plank",
    name: "Plank (secs)",
    category: "core",
    description:
      "Forearms and toes on the floor, body in a straight line from head to heels, brace your core and hold.",
    defaultReps: 30,
    defaultSets: 3,
    difficultyTier: 1,
  },
];
