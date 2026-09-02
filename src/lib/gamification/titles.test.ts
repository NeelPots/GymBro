import { describe, expect, it } from "vitest";
import { activeBonusPct, milestonesReached, type UnlockedTitle } from "./titles";

describe("milestonesReached", () => {
  it("returns nothing below the first threshold", () => {
    expect(milestonesReached(2, [])).toEqual([]);
  });

  it("returns every milestone reached that isn't already unlocked", () => {
    const reached = milestonesReached(10, []);
    expect(reached.map((m) => m.title)).toEqual(["Awakened", "Relentless"]);
  });

  it("excludes milestones already unlocked", () => {
    const unlocked: UnlockedTitle[] = [
      { id: "1", title: "Awakened", expBonusPct: 5, unlockedAt: new Date().toISOString() },
    ];
    const reached = milestonesReached(10, unlocked);
    expect(reached.map((m) => m.title)).toEqual(["Relentless"]);
  });
});

describe("activeBonusPct", () => {
  const titles: UnlockedTitle[] = [
    { id: "a", title: "Awakened", expBonusPct: 5, unlockedAt: new Date().toISOString() },
    { id: "b", title: "Relentless", expBonusPct: 10, unlockedAt: new Date().toISOString() },
  ];

  it("uses the active title's bonus when set", () => {
    expect(activeBonusPct(titles, "a")).toBe(5);
  });

  it("falls back to the best unlocked bonus when nothing is active", () => {
    expect(activeBonusPct(titles, null)).toBe(10);
  });

  it("falls back to the best bonus if the active id no longer matches", () => {
    expect(activeBonusPct(titles, "missing")).toBe(10);
  });

  it("is zero with no titles unlocked", () => {
    expect(activeBonusPct([], null)).toBe(0);
  });
});
