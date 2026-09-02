import { describe, expect, it } from "vitest";
import {
  hoursForLevel,
  hoursTrainedFromSessions,
  levelFromXp,
  nextRankTier,
  rankTitle,
  streakBonusXp,
  xpRequiredForLevel,
} from "./rank";

describe("xpRequiredForLevel", () => {
  it("increases exponentially with level", () => {
    expect(xpRequiredForLevel(1)).toBe(100);
    expect(xpRequiredForLevel(2)).toBe(108);
    expect(xpRequiredForLevel(3)).toBe(117);
    expect(xpRequiredForLevel(5)).toBe(136);
  });

  it("grows faster (multiplicatively) at higher levels than a flat linear curve would", () => {
    const earlyJump = xpRequiredForLevel(2) - xpRequiredForLevel(1);
    const lateJump = xpRequiredForLevel(40) - xpRequiredForLevel(39);
    expect(lateJump).toBeGreaterThan(earlyJump * 10);
  });
});

describe("levelFromXp", () => {
  it("starts at level 1 with no xp", () => {
    expect(levelFromXp(0)).toEqual({ level: 1, xpIntoLevel: 0, xpForNext: 100 });
  });

  it("stays at level 1 until the first threshold is crossed", () => {
    expect(levelFromXp(99)).toEqual({ level: 1, xpIntoLevel: 99, xpForNext: 100 });
  });

  it("advances to level 2 exactly at the threshold", () => {
    expect(levelFromXp(100)).toEqual({ level: 2, xpIntoLevel: 0, xpForNext: 108 });
  });

  it("carries remaining xp into the next level's progress", () => {
    // level 1 costs 100, level 2 costs 108 -> 250 total lands mid-level-3
    expect(levelFromXp(250)).toEqual({ level: 3, xpIntoLevel: 42, xpForNext: 117 });
  });
});

describe("streakBonusXp", () => {
  it("scales up with a longer streak", () => {
    expect(streakBonusXp(0)).toBe(10);
    expect(streakBonusXp(1)).toBe(12);
    expect(streakBonusXp(10)).toBe(30);
  });

  it("caps out at STREAK_BONUS_CAP_DAYS", () => {
    expect(streakBonusXp(30)).toBe(70);
    expect(streakBonusXp(100)).toBe(70);
  });

  it("never goes negative for a bad streak value", () => {
    expect(streakBonusXp(-5)).toBe(10);
  });
});

describe("rankTitle", () => {
  it("maps level ranges to the right rank", () => {
    expect(rankTitle(1)).toBe("E-Rank Trainee");
    expect(rankTitle(15)).toBe("E-Rank Trainee");
    expect(rankTitle(16)).toBe("D-Rank Hunter");
    expect(rankTitle(27)).toBe("D-Rank Hunter");
    expect(rankTitle(28)).toBe("C-Rank Hunter");
    expect(rankTitle(37)).toBe("C-Rank Hunter");
    expect(rankTitle(38)).toBe("B-Rank Hunter");
    expect(rankTitle(49)).toBe("B-Rank Hunter");
    expect(rankTitle(50)).toBe("A-Rank Hunter");
    expect(rankTitle(64)).toBe("A-Rank Hunter");
    expect(rankTitle(65)).toBe("S-Rank Hunter");
    expect(rankTitle(200)).toBe("S-Rank Hunter");
  });
});

describe("nextRankTier", () => {
  it("finds the next tier up", () => {
    expect(nextRankTier(1)).toEqual({ minLevel: 16, title: "D-Rank Hunter" });
    expect(nextRankTier(15)).toEqual({ minLevel: 16, title: "D-Rank Hunter" });
    expect(nextRankTier(16)).toEqual({ minLevel: 28, title: "C-Rank Hunter" });
    expect(nextRankTier(64)).toEqual({ minLevel: 65, title: "S-Rank Hunter" });
  });

  it("returns null once at the top rank", () => {
    expect(nextRankTier(65)).toBeNull();
    expect(nextRankTier(200)).toBeNull();
  });
});

describe("hoursForLevel", () => {
  it("is zero at level 1 (no xp needed yet)", () => {
    expect(hoursForLevel(1)).toBe(0);
  });

  it("increases for higher levels, tracking the rank climb", () => {
    const d = hoursForLevel(16);
    const c = hoursForLevel(28);
    const b = hoursForLevel(38);
    expect(d).toBeGreaterThan(0);
    expect(c).toBeGreaterThan(d);
    expect(b).toBeGreaterThan(c);
  });
});

describe("hoursTrainedFromSessions", () => {
  it("converts sessions to hours using the estimated session length", () => {
    expect(hoursTrainedFromSessions(0)).toBe(0);
    expect(hoursTrainedFromSessions(3)).toBe(1); // 3 * 20min = 1hr
    expect(hoursTrainedFromSessions(1)).toBe(0.3); // 20min rounded to 0.1hr
  });
});
