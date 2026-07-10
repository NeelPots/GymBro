/**
 * XP/level math for the gamification layer. Pure and unit-tested, same
 * spirit as src/lib/adaptive/engine.ts - the leveling curve and rank
 * thresholds are plain numbers anyone can reason about, not a black box.
 */

export const XP_PER_SESSION = 15;
export const XP_PROGRESS_BONUS = 75;
export const XP_STREAK_BONUS = 10;
export const XP_REDEMPTION = 50;

/** XP required to go from `level` to `level + 1`. Gently increasing. */
export function xpRequiredForLevel(level: number): number {
  return 100 + (level - 1) * 25;
}

export interface LevelInfo {
  level: number;
  xpIntoLevel: number;
  xpForNext: number;
}

/** Peels level thresholds off cumulative XP to derive the current level. */
export function levelFromXp(totalXp: number): LevelInfo {
  let level = 1;
  let remaining = totalXp;

  while (remaining >= xpRequiredForLevel(level)) {
    remaining -= xpRequiredForLevel(level);
    level += 1;
  }

  return { level, xpIntoLevel: remaining, xpForNext: xpRequiredForLevel(level) };
}

const RANK_THRESHOLDS: { minLevel: number; title: string }[] = [
  { minLevel: 30, title: "S-Rank Hunter" },
  { minLevel: 20, title: "A-Rank Hunter" },
  { minLevel: 15, title: "B-Rank Hunter" },
  { minLevel: 10, title: "C-Rank Hunter" },
  { minLevel: 5, title: "D-Rank Hunter" },
  { minLevel: 1, title: "E-Rank Trainee" },
];

export function rankTitle(level: number): string {
  const match = RANK_THRESHOLDS.find((r) => level >= r.minLevel);
  return match?.title ?? "E-Rank Trainee";
}

/** The next rank tier above `level`, or null if already at the top (S-Rank). */
export function nextRankTier(level: number): { minLevel: number; title: string } | null {
  const upcoming = [...RANK_THRESHOLDS].reverse().find((r) => r.minLevel > level);
  return upcoming ?? null;
}

/**
 * A friendlier "accomplishments" framing on top of the same XP curve - not a
 * second, separately-tuned system. Assumes a flat estimated session length
 * since the app doesn't track a stopwatch; both this and hoursTrainedFromSessions
 * use the same assumption so they stay comparable.
 */
export const ESTIMATED_MINUTES_PER_SESSION = 20;

function cumulativeXpForLevel(level: number): number {
  let total = 0;
  for (let l = 1; l < level; l++) total += xpRequiredForLevel(l);
  return total;
}

/** Estimated hours of training XP-equivalent to reaching `level`. */
export function hoursForLevel(level: number): number {
  const equivalentSessions = cumulativeXpForLevel(level) / XP_PER_SESSION;
  return Math.round((equivalentSessions * ESTIMATED_MINUTES_PER_SESSION) / 60);
}

/** Estimated hours actually trained, from real logged sessions (not XP). */
export function hoursTrainedFromSessions(totalSessions: number): number {
  return Math.round(((totalSessions * ESTIMATED_MINUTES_PER_SESSION) / 60) * 10) / 10;
}
