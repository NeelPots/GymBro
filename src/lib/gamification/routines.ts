import type { QuestCategory } from "./quests";
import type { Stats } from "./stats";

/**
 * Routines group related steps (a "Face Routine", a "Workout Routine", a
 * "Food Routine"...) instead of everything living in one flat quest list.
 * Steps carry their own schedule, so "shampoo every 3 days" and "only
 * Mon/Fri" both fit alongside plain daily steps in the same routine.
 */
export interface Routine {
  id: string;
  name: string;
  createdAt: string;
  /** Whether the routine's steps are hidden behind a collapsed header - a per-routine, persisted UI preference. */
  collapsed?: boolean;
}

export type ScheduleKind = "daily" | "weekdays" | "interval";

export interface Schedule {
  kind: ScheduleKind;
  /** 0 = Sunday .. 6 = Saturday. Only meaningful when kind === "weekdays". */
  weekdays?: number[];
  /** Days since last completion before it's due again. Only meaningful when kind === "interval". */
  intervalDays?: number;
}

export const DAILY_SCHEDULE: Schedule = { kind: "daily" };

export interface RoutineStep {
  id: string;
  routineId: string;
  name: string;
  description?: string;
  exp: number;
  category: QuestCategory;
  statReward: keyof Stats;
  schedule: Schedule;
  createdAt: string;
}

/**
 * Whether `step` should appear in today's checklist. `weekdays` schedules are
 * pinned to the calendar; `interval` schedules are relative to whenever it
 * was last done (never-completed steps are always due) so a missed day
 * doesn't permanently desync the cadence.
 */
export function isStepDueToday(step: RoutineStep, today: Date, lastCompletedAt?: string): boolean {
  switch (step.schedule.kind) {
    case "daily":
      return true;
    case "weekdays":
      return (step.schedule.weekdays ?? []).includes(today.getDay());
    case "interval": {
      if (!lastCompletedAt) return true;
      const intervalDays = Math.max(1, step.schedule.intervalDays ?? 1);
      const daysSince = Math.floor((today.getTime() - new Date(lastCompletedAt).getTime()) / 86_400_000);
      return daysSince >= intervalDays;
    }
  }
}

const WEEKDAY_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

/** Short human label for a schedule - "Daily", "Mon, Fri", "Every 3 days". */
export function describeSchedule(schedule: Schedule): string {
  switch (schedule.kind) {
    case "daily":
      return "Daily";
    case "weekdays": {
      const days = schedule.weekdays ?? [];
      if (days.length === 0) return "No days set";
      if (days.length === 7) return "Daily";
      return [...days].sort((a, b) => a - b).map((d) => WEEKDAY_LABELS[d]).join(", ");
    }
    case "interval":
      return `Every ${Math.max(1, schedule.intervalDays ?? 1)} days`;
  }
}
