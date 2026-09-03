/**
 * Sleep tracking - a daily bedtime/wake-time prompt that feeds a real
 * consequence (see useLocalQuest's logSleep) rather than just a log.
 */

export interface SleepEntry {
  /** The date this entry is for (the wake-up day). */
  date: string;
  bedTime: string;
  wakeTime: string;
  hours: number;
}

/** Under this many hours counts as insufficient sleep and triggers the penalty. */
export const SLEEP_PENALTY_THRESHOLD_HOURS = 6;

/**
 * Hours slept between two "HH:MM" times. Bed time is assumed to be the
 * night before wake time unless wake is later the same clock-day (e.g. a
 * nap), so "23:30 -> 07:00" and "01:00 -> 07:00" both resolve forward
 * across midnight instead of coming out negative.
 */
export function computeSleepHours(bedTime: string, wakeTime: string): number {
  const [bedH, bedM] = bedTime.split(":").map(Number);
  const [wakeH, wakeM] = wakeTime.split(":").map(Number);
  const bedMinutes = bedH * 60 + bedM;
  let wakeMinutes = wakeH * 60 + wakeM;
  if (wakeMinutes <= bedMinutes) wakeMinutes += 24 * 60;
  return Math.round(((wakeMinutes - bedMinutes) / 60) * 10) / 10;
}

export function isSleepInsufficient(hours: number): boolean {
  return hours < SLEEP_PENALTY_THRESHOLD_HOURS;
}

/**
 * Converts last night's sleep into a 0-100 "energy" reading for today's
 * capacity - the halfway point is pinned to SLEEP_PENALTY_THRESHOLD_HOURS so
 * the number lines up with the same threshold that triggers the penalty
 * (below it climbs steeply from 0, at-or-above it climbs the rest of the way
 * to a full 100% by 3 hours past the threshold; more sleep past that doesn't
 * add anything - there's no bonus for oversleeping).
 */
export function energyPercentFromSleepHours(hours: number): number {
  const h = Math.max(0, hours);
  if (h <= SLEEP_PENALTY_THRESHOLD_HOURS) {
    return Math.round((h / SLEEP_PENALTY_THRESHOLD_HOURS) * 50);
  }
  const bonusWindowHours = 3;
  const bonus = Math.min(h - SLEEP_PENALTY_THRESHOLD_HOURS, bonusWindowHours);
  return Math.round(50 + (bonus / bonusWindowHours) * 50);
}

export function energyLabel(pct: number): string {
  if (pct >= 100) return "Fully Charged";
  if (pct >= 67) return "Steady";
  if (pct >= 34) return "Running Low";
  return "Depleted";
}

export function energyColor(pct: number): string {
  if (pct >= 100) return "#33ff88";
  if (pct >= 67) return "#33aaff";
  if (pct >= 34) return "#ffbb33";
  return "#ff0055";
}
