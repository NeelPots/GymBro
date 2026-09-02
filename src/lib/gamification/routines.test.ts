import { describe, expect, it } from "vitest";
import { describeSchedule, isStepDueToday, type RoutineStep } from "./routines";

function makeStep(overrides: Partial<RoutineStep> = {}): RoutineStep {
  return {
    id: "s1",
    routineId: "r1",
    name: "Test step",
    exp: 50,
    category: "care",
    statReward: "vit",
    schedule: { kind: "daily" },
    createdAt: new Date().toISOString(),
    ...overrides,
  };
}

describe("isStepDueToday", () => {
  it("is always due for a daily schedule", () => {
    const step = makeStep({ schedule: { kind: "daily" } });
    expect(isStepDueToday(step, new Date("2026-01-05"))).toBe(true); // a Monday
  });

  it("respects a weekdays schedule", () => {
    const mondayFriday = makeStep({ schedule: { kind: "weekdays", weekdays: [1, 5] } });
    expect(isStepDueToday(mondayFriday, new Date("2026-01-05T12:00:00"))).toBe(true); // Monday
    expect(isStepDueToday(mondayFriday, new Date("2026-01-06T12:00:00"))).toBe(false); // Tuesday
    expect(isStepDueToday(mondayFriday, new Date("2026-01-09T12:00:00"))).toBe(true); // Friday
  });

  it("is due when an interval step has never been completed", () => {
    const step = makeStep({ schedule: { kind: "interval", intervalDays: 3 } });
    expect(isStepDueToday(step, new Date("2026-01-05"))).toBe(true);
  });

  it("is not due until intervalDays have passed since last completion", () => {
    const step = makeStep({ schedule: { kind: "interval", intervalDays: 3 } });
    const lastCompletedAt = "2026-01-05T00:00:00.000Z";
    expect(isStepDueToday(step, new Date("2026-01-06T00:00:00.000Z"), lastCompletedAt)).toBe(false);
    expect(isStepDueToday(step, new Date("2026-01-07T00:00:00.000Z"), lastCompletedAt)).toBe(false);
    expect(isStepDueToday(step, new Date("2026-01-08T00:00:00.000Z"), lastCompletedAt)).toBe(true);
  });
});

describe("describeSchedule", () => {
  it("describes a daily schedule", () => {
    expect(describeSchedule({ kind: "daily" })).toBe("Daily");
  });

  it("describes a weekdays schedule", () => {
    expect(describeSchedule({ kind: "weekdays", weekdays: [5, 1] })).toBe("Mon, Fri");
  });

  it("describes an interval schedule", () => {
    expect(describeSchedule({ kind: "interval", intervalDays: 4 })).toBe("Every 4 days");
  });

  it("falls back cleanly for an empty weekdays schedule", () => {
    expect(describeSchedule({ kind: "weekdays", weekdays: [] })).toBe("No days set");
  });
});
