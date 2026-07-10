import type { GeneratedProgramExercise } from "./types";

/**
 * The one guarantee this whole feature rests on: a program can only ever
 * contain exercises that actually exist in the library. Pure function, kept
 * free of the "server-only" import so it can be unit-tested directly (see
 * validateProgramExercises.test.ts).
 */
export function validateProgramExercises(
  exercises: GeneratedProgramExercise[],
  candidateIds: ReadonlySet<string>,
): GeneratedProgramExercise[] {
  return exercises.filter((e) => candidateIds.has(e.exerciseId));
}
