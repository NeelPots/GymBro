import { describe, expect, it } from "vitest";
import { validateProgramExercises } from "./validateProgramExercises";
import type { GeneratedProgramExercise } from "./types";

function exercise(overrides: Partial<GeneratedProgramExercise>): GeneratedProgramExercise {
  return {
    exerciseId: "push-ups",
    orderIndex: 0,
    targetReps: 8,
    targetSets: 3,
    ...overrides,
  };
}

describe("validateProgramExercises", () => {
  it("keeps exercises that are in the candidate set", () => {
    const candidates = new Set(["push-ups", "squats"]);
    const result = validateProgramExercises(
      [exercise({ exerciseId: "push-ups" }), exercise({ exerciseId: "squats", orderIndex: 1 })],
      candidates,
    );
    expect(result).toHaveLength(2);
  });

  it("drops hallucinated exercise ids not in the candidate set", () => {
    const candidates = new Set(["push-ups"]);
    const result = validateProgramExercises(
      [exercise({ exerciseId: "push-ups" }), exercise({ exerciseId: "made-up-exercise", orderIndex: 1 })],
      candidates,
    );
    expect(result).toEqual([exercise({ exerciseId: "push-ups" })]);
  });

  it("returns an empty array when nothing matches", () => {
    const candidates = new Set(["squats"]);
    const result = validateProgramExercises([exercise({ exerciseId: "push-ups" })], candidates);
    expect(result).toEqual([]);
  });
});
