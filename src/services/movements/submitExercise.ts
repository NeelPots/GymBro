"use client";

import { createClient } from "@/lib/supabase/client";
import type { Database } from "@/lib/types/database.types";
import type { Exercise } from "@/lib/types/domain";

type ExerciseInsert = Database["public"]["Tables"]["exercises"]["Insert"];

/**
 * Best-effort mirror of a locally-created custom exercise to Supabase, so it
 * can eventually be reviewed/shared instead of living only on this device.
 * Silently no-ops when signed out or Supabase isn't configured - the local
 * copy (useLocalCustomExercises) is already the source of truth the app
 * actually reads from, so a failed submit here never breaks the feature.
 */
export async function submitExercise(exercise: Exercise): Promise<void> {
  try {
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;

    const payload: ExerciseInsert = {
      name: exercise.name,
      category: exercise.category,
      description: exercise.description,
      default_reps: exercise.defaultReps,
      default_sets: exercise.defaultSets,
      difficulty_tier: exercise.difficultyTier,
      source: "user_submitted",
      submitted_by: user.id,
      moderation_status: "pending",
    };
    await supabase.from("exercises").insert(payload);
  } catch {
    // Offline, unreachable, or RLS-rejected - the local copy already works regardless.
  }
}
