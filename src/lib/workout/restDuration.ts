const CATEGORY_BASE_SECONDS: Record<string, number> = {
  legs: 150,
  push: 120,
  pull: 120,
  shoulders: 90,
  arms: 75,
  core: 60,
  cardio: 45,
};

const DEFAULT_BASE_SECONDS = 90;

const TIER_ADJUSTMENT_SECONDS: Record<number, number> = {
  1: -15,
  2: 0,
  3: 20,
};

/**
 * Exercises have no structured compound/isolation or equipment field, so
 * category + difficultyTier is the best available signal: leg/push/pull
 * work skews toward heavier compound lifts (longer rest) while
 * arms/core/cardio skew toward isolation/conditioning work (shorter rest).
 */
export function getRestSeconds(category: string, difficultyTier: number): number {
  const base = CATEGORY_BASE_SECONDS[category] ?? DEFAULT_BASE_SECONDS;
  const adjustment = TIER_ADJUSTMENT_SECONDS[difficultyTier] ?? 0;
  const seconds = base + adjustment;
  return Math.min(240, Math.max(30, Math.round(seconds / 5) * 5));
}
