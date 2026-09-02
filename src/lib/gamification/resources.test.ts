import { describe, expect, it } from "vitest";
import { clampResource, maxHp, maxStamina } from "./resources";
import { DEFAULT_STATS } from "./stats";

describe("maxHp", () => {
  it("scales with level and VIT", () => {
    expect(maxHp(1, DEFAULT_STATS)).toBe(410);
    expect(maxHp(5, DEFAULT_STATS)).toBe(490);
    expect(maxHp(1, { ...DEFAULT_STATS, vit: 5 })).toBe(450);
  });
});

describe("maxStamina", () => {
  it("scales with level and DEX", () => {
    expect(maxStamina(1, DEFAULT_STATS)).toBe(260);
    expect(maxStamina(5, DEFAULT_STATS)).toBe(320);
    expect(maxStamina(1, { ...DEFAULT_STATS, dex: 5 })).toBe(300);
  });
});

describe("clampResource", () => {
  it("clamps between 0 and max", () => {
    expect(clampResource(-10, 100)).toBe(0);
    expect(clampResource(150, 100)).toBe(100);
    expect(clampResource(50, 100)).toBe(50);
  });
});
