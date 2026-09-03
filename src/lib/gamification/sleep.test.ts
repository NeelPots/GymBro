import { describe, expect, it } from "vitest";
import {
  computeSleepHours,
  energyLabel,
  energyPercentFromSleepHours,
  isSleepInsufficient,
  SLEEP_PENALTY_THRESHOLD_HOURS,
} from "./sleep";

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

describe("energyPercentFromSleepHours", () => {
  it("hits 0 at no sleep and 50 at the penalty threshold", () => {
    expect(energyPercentFromSleepHours(0)).toBe(0);
    expect(energyPercentFromSleepHours(SLEEP_PENALTY_THRESHOLD_HOURS)).toBe(50);
  });

  it("climbs linearly below the threshold", () => {
    expect(energyPercentFromSleepHours(3)).toBe(25);
  });

  it("climbs the rest of the way to 100 within 3 hours past the threshold", () => {
    expect(energyPercentFromSleepHours(SLEEP_PENALTY_THRESHOLD_HOURS + 1.5)).toBe(75);
    expect(energyPercentFromSleepHours(SLEEP_PENALTY_THRESHOLD_HOURS + 3)).toBe(100);
  });

  it("caps at 100 - no bonus for oversleeping", () => {
    expect(energyPercentFromSleepHours(SLEEP_PENALTY_THRESHOLD_HOURS + 10)).toBe(100);
  });

  it("never goes negative for a bad/negative reading", () => {
    expect(energyPercentFromSleepHours(-2)).toBe(0);
  });
});

describe("energyLabel", () => {
  it("labels each band", () => {
    expect(energyLabel(0)).toBe("Depleted");
    expect(energyLabel(33)).toBe("Depleted");
    expect(energyLabel(34)).toBe("Running Low");
    expect(energyLabel(66)).toBe("Running Low");
    expect(energyLabel(67)).toBe("Steady");
    expect(energyLabel(99)).toBe("Steady");
    expect(energyLabel(100)).toBe("Fully Charged");
  });
});
