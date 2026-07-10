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
