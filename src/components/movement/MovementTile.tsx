import { Button } from "@/components/ui/button";
import { categoryIcon, DEFAULT_CATEGORY_ICON } from "@/lib/categoryIcon";
import type { MovementParams } from "@/lib/adaptive/engine";

interface MovementTileProps {
  name: string;
  category: string;
  params: MovementParams;
  onLog: () => void;
}

export function MovementTile({ name, category, params, onLog }: MovementTileProps) {
  const Icon = categoryIcon[category] ?? DEFAULT_CATEGORY_ICON;

  return (
    <div className="flex flex-col items-center gap-2.5 rounded-xl border border-border bg-surface-2/40 p-4 text-center transition-colors hover:border-signal/30">
      <div className="flex size-12 items-center justify-center rounded-2xl bg-signal/10 text-signal">
        <Icon size={20} strokeWidth={2} />
      </div>
      <div>
        <div className="text-sm font-medium text-foreground">{name}</div>
        <div className="mt-0.5 font-mono text-xs text-muted-foreground">
          {params.sets} × {params.reps} · tier {params.difficultyTier}
        </div>
      </div>
      <Button variant="outline" size="sm" onClick={onLog} className="mt-1 w-full font-mono">
        Log
      </Button>
    </div>
  );
}
