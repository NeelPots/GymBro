/**
 * XP/level math for the gamification layer. Pure and unit-tested, same
 * spirit as src/lib/adaptive/engine.ts - the leveling curve and rank
 * thresholds are plain numbers anyone can reason about, not a black box.
 */

export const XP_PER_SESSION = 15;
export const XP_PROGRESS_BONUS = 75;
export const XP_STREAK_BONUS = 10;
export const XP_REDEMPTION = 50;
/** Streak length (in days) at which the consistency bonus below caps out. */
export const STREAK_BONUS_CAP_DAYS = 30;

/**
 * XP required to go from `level` to `level + 1`. Genuinely exponential
 * (18% compounding per level) rather than linear or quadratic: level 1->2
 * is still a friendly 100 XP, but the curve compounds hard at the top, so
 * S-Rank (level 30) takes a real long-term grind instead of a good month.
 */
export function xpRequiredForLevel(level: number): number {
  return Math.round(100 * 1.18 ** (level - 1));
}

/**
 * The streak-advance bonus scales with how long the streak already is, so
 * staying consistent is worth disproportionately more than the same total
 * effort done in one binge - capped so it doesn't dwarf everything else at
 * very long streaks.
 */
export function streakBonusXp(currentStreak: number): number {
  return XP_STREAK_BONUS + Math.min(Math.max(0, currentStreak), STREAK_BONUS_CAP_DAYS) * 2;
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

export interface RankTier {
  minLevel: number;
  title: string;
}

export const RANK_THRESHOLDS: RankTier[] = [
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
