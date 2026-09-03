import { describe, expect, it } from "vitest";
import { mergeAdaptiveState, type LocalState } from "./useLocalAdaptiveState";

function makeState(overrides: Partial<LocalState> = {}): LocalState {
  return {
    movements: {},
    history: {},
    sessionLog: [],
    lastSignal: [],
    streak: 0,
    weekCompletion: 0,
    ...overrides,
  };
}

describe("mergeAdaptiveState", () => {
  it("unions history entries by id without duplicating a set logged on both sides", () => {
    const shared = { id: "h1", date: "2026-01-01", targetReps: 8, targetSets: 3, completedReps: 8, completedSets: 3, rpe: 7 };
    const onlyA = { ...shared, id: "h2", date: "2026-01-02" };
    const onlyB = { ...shared, id: "h3", date: "2026-01-03" };

    const a = makeState({ history: { pushups: [shared, onlyA] } });
    const b = makeState({ history: { pushups: [shared, onlyB] } });

    const merged = mergeAdaptiveState(a, b);
    expect(merged.history.pushups.map((e) => e.id).sort()).toEqual(["h1", "h2", "h3"]);
  });

  it("unions sessionLog entries by id, so streak/week-completion see sets logged on either device", () => {
    const a = makeState({ sessionLog: [{ id: "s1", date: "2026-01-05", exerciseId: "pushups", avgRpe: 7 }] });
    const b = makeState({ sessionLog: [{ id: "s2", date: "2026-01-06", exerciseId: "pushups", avgRpe: 8 }] });

    const merged = mergeAdaptiveState(a, b);
    expect(merged.sessionLog.map((s) => s.id).sort()).toEqual(["s1", "s2"]);
  });

  it("keeps movement params from whichever side logged the more recent session for that exercise", () => {
    const olderEntry = { id: "h1", date: "2026-01-01", targetReps: 8, targetSets: 3, completedReps: 8, completedSets: 3, rpe: 6 };
    const newerEntry = { id: "h2", date: "2026-01-10", targetReps: 10, targetSets: 3, completedReps: 10, completedSets: 3, rpe: 6 };

    // Device A progressed to 10 reps more recently; device B is stale (older last session, lower reps).
    const a = makeState({
      movements: { pushups: { reps: 10, sets: 3, difficultyTier: 1 } },
      history: { pushups: [olderEntry, newerEntry] },
    });
    const b = makeState({
      movements: { pushups: { reps: 6, sets: 3, difficultyTier: 1 } },
      history: { pushups: [olderEntry] },
    });

    const merged = mergeAdaptiveState(a, b);
    expect(merged.movements.pushups).toEqual({ reps: 10, sets: 3, difficultyTier: 1 });

    // Symmetric - same result regardless of argument order.
    const mergedReversed = mergeAdaptiveState(b, a);
    expect(mergedReversed.movements.pushups).toEqual({ reps: 10, sets: 3, difficultyTier: 1 });
  });

  it("keeps an exercise's movements/history even when only one side has ever logged it", () => {
    const a = makeState({
      movements: { pullups: { reps: 5, sets: 3, difficultyTier: 1 } },
      history: { pullups: [] },
    });
    const b = makeState();

    const merged = mergeAdaptiveState(a, b);
    expect(merged.movements.pullups).toEqual({ reps: 5, sets: 3, difficultyTier: 1 });
    expect(merged.history.pullups).toEqual([]);
  });

  it("recomputes streak/weekCompletion from the merged sessionLog rather than keeping either side's stale value", () => {
    const today = new Date().toISOString().slice(0, 10);
    const a = makeState({ sessionLog: [], streak: 0, weekCompletion: 0 });
    const b = makeState({ sessionLog: [{ id: "s1", date: today, exerciseId: "pushups", avgRpe: 7 }], streak: 1, weekCompletion: 17 });

    const merged = mergeAdaptiveState(a, b);
    expect(merged.streak).toBe(1);
  });
});
