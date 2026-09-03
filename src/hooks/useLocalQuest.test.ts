import { describe, expect, it } from "vitest";
import { mergeQuestStates, type QuestState } from "./useLocalQuest";

function makeState(overrides: Partial<QuestState> = {}): QuestState {
  return {
    xp: 0,
    lastStreakSeen: 0,
    pendingPenalty: null,
    penaltyLog: [],
    stats: { str: 1, int: 1, vit: 1, dex: 1 },
    unallocatedPoints: 0,
    routines: [],
    steps: [],
    completedToday: [],
    rewardedToday: [],
    lastCompletedAt: {},
    lastQuestDate: "2026-01-01",
    titles: [],
    activeTitleId: null,
    effects: [],
    emergencyPenalty: null,
    log: [],
    lastLevelUp: null,
    hp: 410,
    stamina: 260,
    coins: 0,
    gems: 0,
    sleepLog: [],
    updatedAt: "2026-01-01T00:00:00.000Z",
    ...overrides,
  };
}

describe("mergeQuestStates", () => {
  it("keeps a routine unique to each side, even when one side's updatedAt is far newer (the reported bug)", () => {
    const phone = makeState({
      routines: [{ id: "r-phone", name: "Face Routine", createdAt: "2026-01-01T00:00:00.000Z" }],
      // updatedAt intentionally older than desktop's - this is exactly what
      // plain last-write-wins would have discarded.
      updatedAt: "2026-01-01T00:00:00.000Z",
    });
    const desktop = makeState({
      routines: [{ id: "r-desktop", name: "Workout Routine", createdAt: "2026-01-02T00:00:00.000Z" }],
      updatedAt: "2026-01-05T12:00:00.000Z",
    });

    const merged = mergeQuestStates(phone, desktop);
    const names = merged.routines.map((r) => r.name).sort();
    expect(names).toEqual(["Face Routine", "Workout Routine"]);
  });

  it("unions steps by id without duplicating a step present on both sides", () => {
    const shared = { id: "s1", routineId: "r1", name: "Shared", exp: 50, category: "care" as const, statReward: "vit" as const, schedule: { kind: "daily" as const }, createdAt: "2026-01-01T00:00:00.000Z" };
    const onlyA = { ...shared, id: "s2", name: "Only A" };
    const onlyB = { ...shared, id: "s3", name: "Only B" };

    const a = makeState({ steps: [shared, onlyA] });
    const b = makeState({ steps: [shared, onlyB] });

    const merged = mergeQuestStates(a, b);
    expect(merged.steps.map((s) => s.id).sort()).toEqual(["s1", "s2", "s3"]);
  });

  it("takes the max of progress values rather than one side's value", () => {
    const a = makeState({ xp: 500, coins: 20, gems: 1, stats: { str: 3, int: 1, vit: 1, dex: 1 } });
    const b = makeState({ xp: 300, coins: 45, gems: 4, stats: { str: 1, int: 5, vit: 1, dex: 1 } });

    const merged = mergeQuestStates(a, b);
    expect(merged.xp).toBe(500);
    expect(merged.coins).toBe(45);
    expect(merged.gems).toBe(4);
    expect(merged.stats).toEqual({ str: 3, int: 5, vit: 1, dex: 1 });
  });

  it("keeps an active penalty from either side rather than dropping it", () => {
    const penalty = { id: "p1", assignedAt: "2026-01-01T00:00:00.000Z", deadline: "2026-01-01T03:00:00.000Z", objective: "Run 5km", manual: false };
    const withPenalty = makeState({ emergencyPenalty: penalty });
    const without = makeState({ emergencyPenalty: null });

    expect(mergeQuestStates(withPenalty, without).emergencyPenalty).toEqual(penalty);
    expect(mergeQuestStates(without, withPenalty).emergencyPenalty).toEqual(penalty);
  });

  it("merges sleep logs by date without duplicate entries for the same day", () => {
    const a = makeState({ sleepLog: [{ date: "2026-01-01", bedTime: "23:00", wakeTime: "07:00", hours: 8 }] });
    const b = makeState({ sleepLog: [{ date: "2026-01-02", bedTime: "01:00", wakeTime: "05:00", hours: 4 }] });

    const merged = mergeQuestStates(a, b);
    expect(merged.sleepLog.map((s) => s.date).sort()).toEqual(["2026-01-01", "2026-01-02"]);
  });

  it("keeps the later lastCompletedAt entry per step instead of an arbitrary one", () => {
    const a = makeState({ lastCompletedAt: { s1: "2026-01-01T00:00:00.000Z" } });
    const b = makeState({ lastCompletedAt: { s1: "2026-01-03T00:00:00.000Z" } });

    expect(mergeQuestStates(a, b).lastCompletedAt.s1).toBe("2026-01-03T00:00:00.000Z");
  });
});
