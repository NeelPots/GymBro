import { describe, expect, it } from "vitest";
import { computeSleepHours, isSleepInsufficient, SLEEP_PENALTY_THRESHOLD_HOURS } from "./sleep";

describe("computeSleepHours", () => {
  it("computes a typical overnight sleep", () => {
    expect(computeSleepHours("23:30", "07:00")).toBe(7.5);
  });

  it("wraps correctly when bed time is after midnight", () => {
    expect(computeSleepHours("01:00", "07:00")).toBe(6);
  });

  it("handles an exact 8-hour night", () => {
    expect(computeSleepHours("22:00", "06:00")).toBe(8);
  });

  it("handles a short same-day nap without wrapping", () => {
    expect(computeSleepHours("14:00", "15:30")).toBe(1.5);
  });
});

describe("isSleepInsufficient", () => {
  it("flags anything under the threshold", () => {
    expect(isSleepInsufficient(5)).toBe(true);
    expect(isSleepInsufficient(5.9)).toBe(true);
  });

  it("does not flag the threshold itself or above", () => {
    expect(isSleepInsufficient(SLEEP_PENALTY_THRESHOLD_HOURS)).toBe(false);
    expect(isSleepInsufficient(8)).toBe(false);
  });
});
