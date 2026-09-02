import { describe, expect, it } from "vitest";
import { allocateStat, applyStatDelta, DEFAULT_STATS, pointsAwardedForLevels } from "./stats";

describe("pointsAwardedForLevels", () => {
  it("awards 3 points per level gained", () => {
    expect(pointsAwardedForLevels(1)).toBe(3);
    expect(pointsAwardedForLevels(3)).toBe(9);
  });

  it("never goes negative", () => {
    expect(pointsAwardedForLevels(0)).toBe(0);
    expect(pointsAwardedForLevels(-2)).toBe(0);
  });
});

describe("allocateStat", () => {
  it("increments a single stat and leaves the rest untouched", () => {
    expect(allocateStat(DEFAULT_STATS, "str")).toEqual({ str: 2, int: 1, vit: 1, dex: 1 });
  });
});

describe("applyStatDelta", () => {
  it("applies a partial delta and clamps at zero", () => {
    expect(applyStatDelta({ str: 3, int: 3, vit: 3, dex: 3 }, { str: -5, int: -1 })).toEqual({
      str: 0,
      int: 2,
      vit: 3,
      dex: 3,
    });
  });

  it("is a no-op for stats not included in the delta", () => {
    expect(applyStatDelta(DEFAULT_STATS, {})).toEqual(DEFAULT_STATS);
  });
});
