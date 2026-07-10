import { describe, expect, it } from "vitest";
import { levelFromXp, rankTitle, xpRequiredForLevel } from "./rank";

describe("xpRequiredForLevel", () => {
  it("increases gently with level", () => {
    expect(xpRequiredForLevel(1)).toBe(100);
    expect(xpRequiredForLevel(2)).toBe(125);
    expect(xpRequiredForLevel(5)).toBe(200);
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
    expect(levelFromXp(100)).toEqual({ level: 2, xpIntoLevel: 0, xpForNext: 125 });
  });

  it("carries remaining xp into the next level's progress", () => {
    // level 1 costs 100, level 2 costs 125 -> 250 total lands mid-level-3
    expect(levelFromXp(250)).toEqual({ level: 3, xpIntoLevel: 25, xpForNext: 150 });
  });
});

describe("rankTitle", () => {
  it("maps level ranges to the right rank", () => {
    expect(rankTitle(1)).toBe("E-Rank Trainee");
    expect(rankTitle(4)).toBe("E-Rank Trainee");
    expect(rankTitle(5)).toBe("D-Rank Hunter");
    expect(rankTitle(9)).toBe("D-Rank Hunter");
    expect(rankTitle(10)).toBe("C-Rank Hunter");
    expect(rankTitle(14)).toBe("C-Rank Hunter");
    expect(rankTitle(15)).toBe("B-Rank Hunter");
    expect(rankTitle(19)).toBe("B-Rank Hunter");
    expect(rankTitle(20)).toBe("A-Rank Hunter");
    expect(rankTitle(29)).toBe("A-Rank Hunter");
    expect(rankTitle(30)).toBe("S-Rank Hunter");
    expect(rankTitle(99)).toBe("S-Rank Hunter");
  });
});
