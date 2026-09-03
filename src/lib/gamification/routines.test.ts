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

  it("follows a fixed on/off cycle from creation, regardless of weekday or completion history", () => {
    // 3 days on, 1 day off, created on a Thursday (2026-01-01).
    const step = makeStep({
      schedule: { kind: "cycle", onDays: 3, offDays: 1 },
      createdAt: "2026-01-01T00:00:00.000Z",
    });
    expect(isStepDueToday(step, new Date("2026-01-01T12:00:00.000Z"))).toBe(true); // day 1 of cycle - on
    expect(isStepDueToday(step, new Date("2026-01-02T12:00:00.000Z"))).toBe(true); // day 2 - on
    expect(isStepDueToday(step, new Date("2026-01-03T12:00:00.000Z"))).toBe(true); // day 3 - on
    expect(isStepDueToday(step, new Date("2026-01-04T12:00:00.000Z"))).toBe(false); // day 4 - rest
    expect(isStepDueToday(step, new Date("2026-01-05T12:00:00.000Z"))).toBe(true); // day 5 - cycle repeats, on
    expect(isStepDueToday(step, new Date("2026-01-08T12:00:00.000Z"))).toBe(false); // day 8 - rest again

    // Skipping an "on" day doesn't shift the rotation - it's a fixed calendar
    // pattern, not a reminder that reschedules around actual completion.
    expect(isStepDueToday(step, new Date("2026-01-09T12:00:00.000Z"), "2026-01-01T00:00:00.000Z")).toBe(true);
  });

  it("lets an explicit anchorDate override createdAt, so the user can pick which day is on vs off", () => {
    // createdAt alone would make Jan 5 an off day (daysSinceStart=3, 3 % 4 === 3, not < onDays).
    const step = makeStep({
      schedule: { kind: "cycle", onDays: 3, offDays: 1, anchorDate: "2026-01-05T00:00:00.000Z" },
      createdAt: "2026-01-02T00:00:00.000Z",
    });
    // The anchorDate makes Jan 5 day 0 of the rotation instead - an on day.
    expect(isStepDueToday(step, new Date("2026-01-05T12:00:00.000Z"))).toBe(true);
    expect(isStepDueToday(step, new Date("2026-01-08T12:00:00.000Z"))).toBe(false); // day 3 - off
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

  it("describes a cycle schedule", () => {
    expect(describeSchedule({ kind: "cycle", onDays: 3, offDays: 1 })).toBe("3 on, 1 off");
  });
});
