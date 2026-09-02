import type { Stats } from "./stats";
import { applyStatDelta } from "./stats";

export type EffectKind = "buff" | "debuff";

/** A temporary buff/debuff - e.g. `[Buff: Fully Hydrated]`, `[Debuff: Penalty Hangover -10% EXP]`. */
export interface StatusEffect {
  id: string;
  label: string;
  kind: EffectKind;
  expiresAt: string;
  xpMultiplierPct?: number;
  statDelta?: Partial<Stats>;
}

export function isActive(effect: StatusEffect, now: number = Date.now()): boolean {
  return new Date(effect.expiresAt).getTime() > now;
}

export function pruneExpired(effects: StatusEffect[], now: number = Date.now()): StatusEffect[] {
  return effects.filter((e) => isActive(e, now));
}

export function totalXpMultiplierPct(effects: StatusEffect[], now: number = Date.now()): number {
  return effects.filter((e) => isActive(e, now)).reduce((sum, e) => sum + (e.xpMultiplierPct ?? 0), 0);
}

/** Base stats with every active effect's statDelta layered on top - never mutates base. */
export function effectiveStats(base: Stats, effects: StatusEffect[], now: number = Date.now()): Stats {
  return effects
    .filter((e) => isActive(e, now) && e.statDelta)
    .reduce((acc, e) => applyStatDelta(acc, e.statDelta!), base);
}

export function expiresIn(effect: StatusEffect, now: number = Date.now()): string {
  const ms = Math.max(0, new Date(effect.expiresAt).getTime() - now);
  const hours = Math.floor(ms / 3_600_000);
  const minutes = Math.floor((ms % 3_600_000) / 60_000);
  if (hours > 0) return `${hours}h ${minutes}m`;
  return `${minutes}m`;
}
