import { Dumbbell, ArrowUp, Footprints, CircleDot, type LucideIcon } from "lucide-react";

export const categoryIcon: Record<string, LucideIcon> = {
  push: Dumbbell,
  pull: ArrowUp,
  legs: Footprints,
  core: CircleDot,
};

export const DEFAULT_CATEGORY_ICON = Dumbbell;
