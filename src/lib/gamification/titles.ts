/** Secret titles unlocked at streak milestones - each grants a permanent EXP bonus while active. */

export interface TitleMilestone {
  streak: number;
  title: string;
  expBonusPct: number;
}

export const TITLE_MILESTONES: TitleMilestone[] = [
  { streak: 3, title: "Awakened", expBonusPct: 5 },
  { streak: 7, title: "Relentless", expBonusPct: 10 },
  { streak: 14, title: "Iron Will", expBonusPct: 15 },
  { streak: 30, title: "Monarch", expBonusPct: 25 },
];

export interface UnlockedTitle {
  id: string;
  title: string;
  expBonusPct: number;
  unlockedAt: string;
}

/** Milestones newly reached at `streak` that aren't already unlocked. */
export function milestonesReached(streak: number, alreadyUnlocked: UnlockedTitle[]): TitleMilestone[] {
  const unlockedTitles = new Set(alreadyUnlocked.map((t) => t.title));
  return TITLE_MILESTONES.filter((m) => streak >= m.streak && !unlockedTitles.has(m.title));
}

/** The EXP bonus in effect: the active title if set, else the best one unlocked. */
export function activeBonusPct(titles: UnlockedTitle[], activeTitleId: string | null): number {
  if (activeTitleId) {
    const active = titles.find((t) => t.id === activeTitleId);
    if (active) return active.expBonusPct;
  }
  return titles.reduce((max, t) => Math.max(max, t.expBonusPct), 0);
}
