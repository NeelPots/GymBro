import "server-only";
import { DEFAULT_EXERCISES } from "@/lib/adaptive/defaultExercises";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { createClient } from "@/lib/supabase/server";
import type { Database } from "@/lib/types/database.types";
import type { Exercise } from "@/lib/types/domain";

type ExerciseRow = Database["public"]["Tables"]["exercises"]["Row"];

/**
 * Public/approved exercise library. Falls back to the bundled default
 * movements until a Supabase project is connected - see
 * .env.local.example and README.md "Running locally".
 */
export async function getExercises(): Promise<Exercise[]> {
  if (!isSupabaseConfigured) {
    return DEFAULT_EXERCISES;
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("exercises")
    .select("id, name, category, description, default_reps, default_sets, difficulty_tier")
    .eq("moderation_status", "approved")
    .eq("is_public", true);

  if (error || !data || data.length === 0) {
    return DEFAULT_EXERCISES;
  }

  const rows = data as Pick<
    ExerciseRow,
    "id" | "name" | "category" | "description" | "default_reps" | "default_sets" | "difficulty_tier"
  >[];

  return rows.map((row) => ({
    id: row.id,
    name: row.name,
    category: row.category,
    description: row.description,
    defaultReps: row.default_reps,
    defaultSets: row.default_sets,
    difficultyTier: row.difficulty_tier,
  }));
}
