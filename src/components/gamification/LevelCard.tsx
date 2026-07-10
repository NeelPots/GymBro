import { Swords } from "lucide-react";
import { XpBar } from "./XpBar";

interface LevelCardProps {
  level: number;
  rankTitle: string;
  xpIntoLevel: number;
  xpForNext: number;
}

export function LevelCard({ level, rankTitle, xpIntoLevel, xpForNext }: LevelCardProps) {
  return (
    <div className="rounded-[var(--radius)] border border-border bg-surface p-5">
      <div className="flex items-center gap-3">
        <div className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-signal/10 text-signal ring-1 ring-signal/25">
          <Swords size={20} strokeWidth={2} />
        </div>
        <div className="min-w-0">
          <div className="font-display text-base font-bold tracking-tight">Level {level}</div>
          <div className="truncate text-xs text-muted-foreground">{rankTitle}</div>
        </div>
      </div>
      <div className="mt-4">
        <XpBar xpIntoLevel={xpIntoLevel} xpForNext={xpForNext} />
      </div>
    </div>
  );
}
