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
