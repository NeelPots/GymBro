import { Button } from "@/components/ui/button";
import type { MovementParams } from "@/lib/adaptive/engine";

interface MovementRowProps {
  name: string;
  params: MovementParams;
  onLog: () => void;
  isFirst?: boolean;
}

export function MovementRow({ name, params, onLog, isFirst }: MovementRowProps) {
  return (
    <div className={`flex items-center justify-between py-3 ${isFirst ? "" : "border-t border-border"}`}>
      <div>
        <div className="text-sm font-medium text-foreground">{name}</div>
        <div className="mt-0.5 font-mono text-xs text-muted-foreground">
          {params.sets} × {params.reps} · tier {params.difficultyTier}
        </div>
      </div>
      <Button variant="outline" size="sm" onClick={onLog} className="font-mono">
        Log
      </Button>
    </div>
  );
}
