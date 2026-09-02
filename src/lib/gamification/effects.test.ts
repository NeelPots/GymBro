import { describe, expect, it } from "vitest";
import { effectiveStats, isActive, pruneExpired, totalXpMultiplierPct, type StatusEffect } from "./effects";

const now = Date.parse("2026-01-01T12:00:00Z");
const future = new Date(now + 3_600_000).toISOString();
const past = new Date(now - 3_600_000).toISOString();

describe("isActive", () => {
  it("is true for a future expiry and false for a past one", () => {
    const effect: StatusEffect = { id: "1", label: "x", kind: "buff", expiresAt: future };
    expect(isActive(effect, now)).toBe(true);
    expect(isActive({ ...effect, expiresAt: past }, now)).toBe(false);
  });
});

describe("pruneExpired", () => {
  it("keeps only effects still active", () => {
    const effects: StatusEffect[] = [
      { id: "1", label: "active", kind: "buff", expiresAt: future },
      { id: "2", label: "expired", kind: "buff", expiresAt: past },
    ];
    expect(pruneExpired(effects, now).map((e) => e.id)).toEqual(["1"]);
  });
});

describe("totalXpMultiplierPct", () => {
  it("sums xp multipliers from active effects only", () => {
    const effects: StatusEffect[] = [
      { id: "1", label: "a", kind: "buff", expiresAt: future, xpMultiplierPct: 10 },
      { id: "2", label: "b", kind: "debuff", expiresAt: future, xpMultiplierPct: -10 },
      { id: "3", label: "c", kind: "debuff", expiresAt: past, xpMultiplierPct: -50 },
    ];
    expect(totalXpMultiplierPct(effects, now)).toBe(0);
  });
});

describe("effectiveStats", () => {
  it("layers active statDeltas onto base stats without mutating it", () => {
    const base = { str: 5, int: 5, vit: 5, dex: 5 };
    const effects: StatusEffect[] = [
      { id: "1", label: "weakened", kind: "debuff", expiresAt: future, statDelta: { str: -5, int: -5, vit: -5, dex: -5 } },
    ];
    expect(effectiveStats(base, effects, now)).toEqual({ str: 0, int: 0, vit: 0, dex: 0 });
    expect(base).toEqual({ str: 5, int: 5, vit: 5, dex: 5 });
  });

  it("ignores expired effects", () => {
    const base = { str: 5, int: 5, vit: 5, dex: 5 };
    const effects: StatusEffect[] = [
      { id: "1", label: "expired", kind: "debuff", expiresAt: past, statDelta: { str: -5 } },
    ];
    expect(effectiveStats(base, effects, now)).toEqual(base);
  });
});
