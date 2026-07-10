import { Dumbbell, ArrowUp, Footprints, CircleDot, type LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { MovementParams } from "@/lib/adaptive/engine";

interface MovementRowProps {
  name: string;
  category: string;
  params: MovementParams;
  onLog: () => void;
  isFirst?: boolean;
}

const categoryIcon: Record<string, LucideIcon> = {
  push: Dumbbell,
  pull: ArrowUp,
  legs: Footprints,
  core: CircleDot,
};

export function MovementRow({ name, category, params, onLog, isFirst }: MovementRowProps) {
  const Icon = categoryIcon[category] ?? Dumbbell;

  return (
    <div className={`flex items-center justify-between py-3 ${isFirst ? "" : "border-t border-border"}`}>
      <div className="flex items-center gap-3">
        <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-surface-2 text-signal">
          <Icon size={16} strokeWidth={2} />
        </div>
        <div>
          <div className="text-sm font-medium text-foreground">{name}</div>
          <div className="mt-0.5 font-mono text-xs text-muted-foreground">
            {params.sets} × {params.reps} · tier {params.difficultyTier}
          </div>
        </div>
      </div>
      <Button variant="outline" size="sm" onClick={onLog} className="font-mono">
        Log
      </Button>
    </div>
  );
}
