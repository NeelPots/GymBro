import type { MovementParams, SessionEntry } from "@/lib/adaptive/engine";

export interface Exercise {
  id: string;
  name: string;
  category: string;
  description: string | null;
  defaultReps: number;
  defaultSets: number;
  difficultyTier: number;
  instructions?: string | null;
  easierVariation?: string | null;
  harderVariation?: string | null;
  videoUrl?: string | null;
}

export interface TrackedMovement extends Exercise {
  params: MovementParams;
  history: SessionEntry[];
}

export interface SignalItem {
  movementId: string;
  movementName: string;
  action: "progress" | "hold" | "deload";
  reason: string;
}
