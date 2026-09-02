/**
 * Hunter attributes - STR/INT/VIT/DEX. Pure math, same spirit as rank.ts:
 * plain numbers, unit-tested, no hidden state.
 */

export interface Stats {
  str: number;
  int: number;
  vit: number;
  dex: number;
}

export const DEFAULT_STATS: Stats = { str: 1, int: 1, vit: 1, dex: 1 };

export const STAT_KEYS: (keyof Stats)[] = ["str", "int", "vit", "dex"];

export const STAT_LABELS: Record<keyof Stats, string> = {
  str: "STR",
  int: "INT",
  vit: "VIT",
  dex: "DEX",
};

export const STAT_DESCRIPTIONS: Record<keyof Stats, string> = {
  str: "Physical output - gym sessions and hard sets.",
  int: "Focus and craft - work and deep study.",
  vit: "Recovery and upkeep - hydration, grooming, nutrition.",
  dex: "Consistency - routine and daily agility.",
};

/** Points awarded per level gained on a level-up. */
export const STAT_POINTS_PER_LEVEL = 3;

export function pointsAwardedForLevels(levelsGained: number): number {
  return Math.max(0, levelsGained) * STAT_POINTS_PER_LEVEL;
}

export function allocateStat(stats: Stats, stat: keyof Stats, amount = 1): Stats {
  return { ...stats, [stat]: Math.max(0, stats[stat] + amount) };
}

/** Applies a (possibly negative) delta to some subset of stats, clamped at 0. */
export function applyStatDelta(stats: Stats, delta: Partial<Stats>): Stats {
  const next = { ...stats };
  for (const key of STAT_KEYS) {
    const d = delta[key];
    if (d) next[key] = Math.max(0, next[key] + d);
  }
  return next;
}
