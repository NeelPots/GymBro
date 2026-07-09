import { describe, expect, it } from "vitest";
import { CONFIG, evaluateMovement, type MovementParams, type SessionEntry } from "./engine";

const baseParams: MovementParams = { reps: 8, sets: 3, difficultyTier: 1 };

function session(overrides: Partial<SessionEntry>): SessionEntry {
  return {
    date: "2026-01-01",
    targetReps: 8,
    targetSets: 3,
    completedReps: 8,
    completedSets: 3,
    rpe: 6,
    ...overrides,
  };
}

describe("evaluateMovement", () => {
  it("holds when there are not enough sessions yet", () => {
    const result = evaluateMovement([session({})], baseParams);
    expect(result.action).toBe("hold");
    expect(result.newParams).toEqual(baseParams);
  });

  it("progresses reps when completion is high and RPE is comfortable", () => {
    const history = [session({}), session({}), session({ rpe: 7 })];
    const result = evaluateMovement(history, baseParams);
    expect(result.action).toBe("progress");
    expect(result.newParams.reps).toBe(baseParams.reps + 1);
  });

  it("holds (does not progress further) when completion is high but RPE is over the ceiling", () => {
    const history = [
      session({ rpe: 9 }),
      session({ rpe: 9.5 }),
      session({ rpe: 9 }),
    ];
    const result = evaluateMovement(history, baseParams);
    expect(result.action).toBe("hold");
    expect(result.newParams).toEqual(baseParams);
  });

  it("deloads reps by ~20% when completion is low", () => {
    const history = [
      session({ completedReps: 3, completedSets: 3, rpe: 8 }),
      session({ completedReps: 4, completedSets: 3, rpe: 8 }),
      session({ completedReps: 3, completedSets: 3, rpe: 8 }),
    ];
    const result = evaluateMovement(history, baseParams);
    expect(result.action).toBe("deload");
    expect(result.newParams.reps).toBe(Math.max(4, Math.round(baseParams.reps * 0.8)));
  });

  it("holds steady in the middle ground (decent but not exceptional)", () => {
    const history = [
      session({ completedReps: 7, completedSets: 3, rpe: 7 }),
      session({ completedReps: 7, completedSets: 3, rpe: 7 }),
      session({ completedReps: 7, completedSets: 3, rpe: 7 }),
    ];
    const result = evaluateMovement(history, baseParams);
    expect(result.action).toBe("hold");
    expect(result.newParams).toEqual(baseParams);
  });

  it("only looks at the configured lookback window", () => {
    const badOld = session({ completedReps: 1, completedSets: 1, rpe: 10 });
    const good = session({ rpe: 6 });
    const history = [badOld, badOld, good, good, good];
    const result = evaluateMovement(history, baseParams);
    expect(result.action).toBe("progress");
    expect(CONFIG.lookbackSessions).toBe(3);
  });

  it("bumps a set once reps hit the cap", () => {
    const nearCap: MovementParams = { reps: 15, sets: 3, difficultyTier: 1 };
    const history = [
      session({ targetReps: 15, completedReps: 15, rpe: 6 }),
      session({ targetReps: 15, completedReps: 15, rpe: 6 }),
      session({ targetReps: 15, completedReps: 15, rpe: 6 }),
    ];
    const result = evaluateMovement(history, nearCap);
    expect(result.action).toBe("progress");
    expect(result.newParams.sets).toBe(4);
    expect(result.newParams.reps).toBe(11);
  });
});
