import type { LocalProgram } from "@/hooks/useLocalProgram";
import type { Exercise } from "@/lib/types/domain";

/**
 * The exercise list that drives "today's plan": the active AI-generated
 * program's exercises (targets overridden per the program, ordered by
 * orderIndex) if one exists, otherwise the default library. Shared by
 * HomeView and ActiveProgramView so both pages agree on what "the plan" is.
 */
export function resolvePlanExercises(program: LocalProgram | null, library: Exercise[]): Exercise[] {
  if (!program) return library;

  const byId = new Map(library.map((e) => [e.id, e]));

  return [...program.exercises]
    .sort((a, b) => a.orderIndex - b.orderIndex)
    .flatMap((pe) => {
      const base = byId.get(pe.exerciseId);
      if (!base) return [];
      return [
        {
          ...base,
          defaultReps: pe.targetReps,
          defaultSets: pe.targetSets,
          difficultyTier: 1,
        },
      ];
    });
}
