interface XpBarProps {
  xpIntoLevel: number;
  xpForNext: number;
}

/** A slim XP progress bar - the fill uses the same signal accent as everything else. */
export function XpBar({ xpIntoLevel, xpForNext }: XpBarProps) {
  const pct = xpForNext > 0 ? Math.min(100, Math.round((xpIntoLevel / xpForNext) * 100)) : 0;

  return (
    <div className="flex flex-col gap-1.5">
      <div className="h-2 w-full overflow-hidden rounded-full bg-surface-2">
        <div
          className="h-full rounded-full bg-signal"
          style={{
            width: `${pct}%`,
            boxShadow: "0 0 8px rgba(51,170,255,0.6)",
          }}
        />
      </div>
      <div className="flex justify-between font-mono text-[11px] text-muted-foreground">
        <span>{xpIntoLevel} XP</span>
        <span>{xpForNext} XP to next rank</span>
      </div>
    </div>
  );
}
