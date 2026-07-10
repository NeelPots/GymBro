import type { LocalProgram } from "@/hooks/useLocalProgram";
import type { SplitDay } from "@/hooks/useLocalSplit";
import type { Exercise } from "@/lib/types/domain";
import { resolvePlanExercises } from "./planExercises";

export type PlanSource = "ai" | "split" | "default";

function resolveSplitDayExercises(day: SplitDay, library: Exercise[]): Exercise[] {
  const byId = new Map(library.map((e) => [e.id, e]));

  return [...day.exercises]
    .sort((a, b) => a.orderIndex - b.orderIndex)
    .flatMap((se) => {
      const base = byId.get(se.exerciseId);
      if (!base) return [];
      return [
        {
          ...base,
          defaultReps: se.targetReps,
          defaultSets: se.targetSets,
          difficultyTier: 1,
        },
      ];
    });
}

interface ResolveActivePlanArgs {
  source: PlanSource;
  program: LocalProgram | null;
  activeDay: SplitDay | null;
  library: Exercise[];
}

/**
 * The exercise list that drives "today's plan" - whichever of an AI-generated
 * program or a custom split day was most recently activated (tracked by the
 * planSource pointer, see useActivePlanSource), falling back to the default
 * library if the pointed-to source no longer exists (program cleared, split
 * day deleted). Shared by HomeView and the Train tab views so every page
 * agrees on what "the plan" is.
 */
export function resolveActivePlan({ source, program, activeDay, library }: ResolveActivePlanArgs): Exercise[] {
  if (source === "ai" && program) return resolvePlanExercises(program, library);
  if (source === "split" && activeDay) return resolveSplitDayExercises(activeDay, library);
  return library;
}
