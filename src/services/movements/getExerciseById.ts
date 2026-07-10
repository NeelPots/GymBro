import "server-only";
import { DEFAULT_EXERCISES } from "@/lib/adaptive/defaultExercises";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { createClient } from "@/lib/supabase/server";
import type { Database } from "@/lib/types/database.types";
import type { Exercise } from "@/lib/types/domain";

type ExerciseRow = Database["public"]["Tables"]["exercises"]["Row"];

export async function getExerciseById(id: string): Promise<Exercise | null> {
  if (!isSupabaseConfigured) {
    return DEFAULT_EXERCISES.find((e) => e.id === id) ?? null;
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("exercises")
    .select(
      "id, name, category, description, default_reps, default_sets, difficulty_tier, instructions, easier_variation, harder_variation, video_url",
    )
    .eq("id", id)
    .eq("moderation_status", "approved")
    .eq("is_public", true)
    .maybeSingle();

  if (error || !data) {
    return DEFAULT_EXERCISES.find((e) => e.id === id) ?? null;
  }

  const row = data as Pick<
    ExerciseRow,
    | "id"
    | "name"
    | "category"
    | "description"
    | "default_reps"
    | "default_sets"
    | "difficulty_tier"
    | "instructions"
    | "easier_variation"
    | "harder_variation"
    | "video_url"
  >;

  return {
    id: row.id,
    name: row.name,
    category: row.category,
    description: row.description,
    defaultReps: row.default_reps,
    defaultSets: row.default_sets,
    difficultyTier: row.difficulty_tier,
    instructions: row.instructions,
    easierVariation: row.easier_variation,
    harderVariation: row.harder_variation,
    videoUrl: row.video_url,
  };
}
