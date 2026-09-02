import type { Stats } from "./stats";

export type QuestCategory = "fitness" | "care" | "nutrition" | "work";

export const QUEST_CATEGORY_LABELS: Record<QuestCategory, string> = {
  fitness: "Fitness",
  care: "Daily Care",
  nutrition: "Nutrition",
  work: "Work/Code",
};

/** Which attribute a category's steps train - the stat-allocation side of the category picker. */
export const CATEGORY_STAT: Record<QuestCategory, keyof Stats> = {
  fitness: "str",
  care: "vit",
  nutrition: "vit",
  work: "int",
};

export interface QuestDef {
  id: string;
  name: string;
  description: string;
  exp: number;
  category: QuestCategory;
  statReward: keyof Stats;
  isDefault: boolean;
}

/** The five mandatory daily quests, pre-loaded for every hunter. */
export const DEFAULT_QUESTS: QuestDef[] = [
  {
    id: "morning-hygiene",
    name: "Morning Hygiene Protocol",
    description: "Face wash, ice dunk, moisturizer, sunscreen.",
    exp: 50,
    category: "care",
    statReward: "vit",
    isDefault: true,
  },
  {
    id: "gym-workout",
    name: "Gym & Post-Workout Protocol",
    description: "Hit your split, then shower right after.",
    exp: 100,
    category: "fitness",
    statReward: "str",
    isDefault: true,
  },
  {
    id: "nutrition",
    name: "Nutrition & Supplements",
    description: "Protein intake and your creatine dose.",
    exp: 50,
    category: "nutrition",
    statReward: "vit",
    isDefault: true,
  },
  {
    id: "hydration",
    name: "Hydration Target",
    description: "Hit your required daily water volume.",
    exp: 50,
    category: "nutrition",
    statReward: "vit",
    isDefault: true,
  },
  {
    id: "deep-work",
    name: "Deep Work Protocol",
    description: "Complete your daily work/study session.",
    exp: 100,
    category: "work",
    statReward: "int",
    isDefault: true,
  },
];

export interface CustomQuest {
  id: string;
  name: string;
  exp: number;
  category: QuestCategory;
  statReward: keyof Stats;
  createdAt: string;
}

/** A completed quest can grant a short-lived status effect on top of its EXP. */
export const QUEST_BUFFS: Record<string, { label: string; hours: number }> = {
  hydration: { label: "Fully Hydrated", hours: 20 },
  "gym-workout": { label: "Fresh Routine", hours: 20 },
  "morning-hygiene": { label: "Freshly Groomed", hours: 20 },
  "deep-work": { label: "Deep Focus", hours: 20 },
};
