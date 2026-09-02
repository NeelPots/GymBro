"use client";

import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { hoursForLevel, RANK_THRESHOLDS } from "@/lib/gamification/rank";
import { cn } from "@/lib/utils";

interface RankCalculatorProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  level: number;
}

/** Shows the full E-to-S rank ladder with the hunter's current tier highlighted. */
export function RankCalculator({ open, onOpenChange, level }: RankCalculatorProps) {
  const tiers = [...RANK_THRESHOLDS].reverse();
  const currentIndex = [...tiers].reverse().findIndex((t) => level >= t.minLevel);
  const currentTitle = tiers[tiers.length - 1 - currentIndex]?.title;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="mx-auto max-h-[80vh] max-w-xl overflow-y-auto rounded-t-2xl border-t border-signal/25 bg-surface-2 px-5 pt-2 pb-8 hud-panel">
        <SheetHeader className="px-0">
          <SheetTitle className="font-display text-lg hud-glow-text">Rank Calculator</SheetTitle>
        </SheetHeader>

        <div className="flex flex-col gap-2 px-0">
          {tiers.map((tier) => {
            const isCurrent = tier.title === currentTitle;
            const hoursNeeded = hoursForLevel(tier.minLevel);
            return (
              <div
                key={tier.title}
                className={cn(
                  "flex items-center justify-between rounded-md border px-3 py-2.5 font-mono text-xs",
                  isCurrent ? "border-signal/50 bg-signal/10 text-signal" : "border-border text-muted-foreground",
                )}
              >
                <div className="flex items-center gap-2">
                  <span className="font-bold">{tier.title}</span>
                  {isCurrent && <span className="rounded-full bg-signal/20 px-1.5 py-0.5 text-[9px] text-signal">CURRENT</span>}
                </div>
                <div className="text-right">
                  <div>Level {tier.minLevel}+</div>
                  <div className="text-[10px]">~{hoursNeeded} hrs</div>
                </div>
              </div>
            );
          })}
        </div>
      </SheetContent>
    </Sheet>
  );
}
