import { Plus } from "lucide-react";
import { STAT_DESCRIPTIONS, STAT_LABELS, type Stats } from "@/lib/gamification/stats";
import { systemAudio } from "@/lib/gamification/audio";

interface StatAllocatorProps {
  stat: keyof Stats;
  value: number;
  unallocatedPoints: number;
  onAllocate: (stat: keyof Stats) => void;
}

export function StatAllocator({ stat, value, unallocatedPoints, onAllocate }: StatAllocatorProps) {
  const canAllocate = unallocatedPoints > 0;

  return (
    <div className="flex items-center justify-between gap-3 rounded-md border border-signal/15 bg-background/40 px-3 py-2.5">
      <div className="min-w-0">
        <div className="font-mono text-xs font-bold tracking-widest text-signal">{STAT_LABELS[stat]}</div>
        <div className="truncate text-[11px] text-muted-foreground">{STAT_DESCRIPTIONS[stat]}</div>
      </div>
      <div className="flex shrink-0 items-center gap-2.5">
        <span className="font-mono text-lg font-semibold tabular-nums">{value}</span>
        <button
          type="button"
          disabled={!canAllocate}
          onClick={() => {
            systemAudio.click();
            onAllocate(stat);
          }}
          aria-label={`Allocate a point to ${STAT_LABELS[stat]}`}
          className="flex size-6 items-center justify-center rounded-full border border-signal/40 text-signal transition-colors enabled:hover:bg-signal/15 disabled:cursor-not-allowed disabled:opacity-30"
        >
          <Plus size={13} strokeWidth={2.5} />
        </button>
      </div>
    </div>
  );
}
