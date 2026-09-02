import type { Stats } from "./stats";

/**
 * HP/Stamina resource pools - a visual/tactical layer on top of the XP curve,
 * not a second progression system. Both scale gently with level and the
 * stat that thematically governs them (VIT for HP, DEX for Stamina).
 */

export function maxHp(level: number, stats: Stats): number {
  return 400 + (level - 1) * 20 + stats.vit * 10;
}

export function maxStamina(level: number, stats: Stats): number {
  return 250 + (level - 1) * 15 + stats.dex * 10;
}

export const STAMINA_COST_PER_FITNESS_QUEST = 40;
export const HP_COST_PER_PENALTY = 100;
export const RESOURCE_REGEN_PER_TICK = 5;

export function clampResource(value: number, max: number): number {
  return Math.max(0, Math.min(max, value));
}
