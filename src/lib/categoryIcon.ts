import {
  Dumbbell,
  ArrowUp,
  Footprints,
  CircleDot,
  ArrowUpFromLine,
  BicepsFlexed,
  Flame,
  type LucideIcon,
} from "lucide-react";

export const categoryIcon: Record<string, LucideIcon> = {
  push: Dumbbell,
  pull: ArrowUp,
  legs: Footprints,
  core: CircleDot,
  shoulders: ArrowUpFromLine,
  arms: BicepsFlexed,
  cardio: Flame,
};

export const DEFAULT_CATEGORY_ICON = Dumbbell;
