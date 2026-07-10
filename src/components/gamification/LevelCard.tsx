import { Swords } from "lucide-react";
import { XpBar } from "./XpBar";
import { hoursForLevel, hoursTrainedFromSessions, nextRankTier } from "@/lib/gamification/rank";

interface LevelCardProps {
  level: number;
  rankTitle: string;
  xpIntoLevel: number;
  xpForNext: number;
  totalSessionsLogged: number;
}

export function LevelCard({ level, rankTitle, xpIntoLevel, xpForNext, totalSessionsLogged }: LevelCardProps) {
  const next = nextRankTier(level);
  const hoursTrained = hoursTrainedFromSessions(totalSessionsLogged);
  const hoursTarget = next ? hoursForLevel(next.minLevel) : null;
  const hoursPct = hoursTarget && hoursTarget > 0 ? Math.min(100, Math.round((hoursTrained / hoursTarget) * 100)) : 0;

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

      <div className="mt-3 border-t border-border pt-3">
        {next && hoursTarget !== null ? (
          <>
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-surface-2">
              <div
                className="h-full rounded-full bg-progress"
                style={{ width: `${hoursPct}%`, boxShadow: "0 0 6px rgba(62,207,142,0.5)" }}
              />
            </div>
            <p className="mt-1.5 font-mono text-[11px] text-muted-foreground">
              ~{hoursTrained}/{hoursTarget} hrs trained to reach <span className="text-foreground">{next.title}</span>
            </p>
          </>
        ) : (
          <p className="font-mono text-[11px] text-muted-foreground">
            ~{hoursTrained} hrs trained - top rank reached
          </p>
        )}
      </div>
    </div>
  );
}
