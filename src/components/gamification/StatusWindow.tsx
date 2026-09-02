"use client";

import { useState } from "react";
import { Calculator, Flame, Swords, Users } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { XpBar } from "@/components/gamification/XpBar";
import { StatAllocator } from "@/components/gamification/StatAllocator";
import { ResourceBars } from "@/components/gamification/ResourceBars";
import { CurrencyDisplay } from "@/components/gamification/CurrencyDisplay";
import { RankCalculator } from "@/components/gamification/RankCalculator";
import { FriendsPanel } from "@/components/gamification/FriendsPanel";
import { expiresIn } from "@/lib/gamification/effects";
import { STAT_KEYS } from "@/lib/gamification/stats";
import { systemAudio } from "@/lib/gamification/audio";
import { cn } from "@/lib/utils";
import { useQuest } from "@/components/gamification/QuestProvider";

interface StatusWindowProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  streak: number;
}

/** The full "STATUS" HUD sheet - level, stats, resources, currency, allocator, active effects, and unlocked titles. */
export function StatusWindow({ open, onOpenChange, streak }: StatusWindowProps) {
  const quest = useQuest();
  const [rankOpen, setRankOpen] = useState(false);
  const [friendsOpen, setFriendsOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="mx-auto max-h-[88vh] max-w-xl overflow-y-auto rounded-t-2xl border-t border-signal/25 bg-surface-2 px-5 pt-2 pb-8 hud-panel">
        <SheetHeader className="px-0">
          <div className="flex items-center justify-between gap-3">
            <SheetTitle className="flex items-center gap-2 font-display text-lg hud-glow-text">
              <Swords size={18} className="text-signal" />
              STATUS
            </SheetTitle>
            <CurrencyDisplay coins={quest.coins} gems={quest.gems} />
          </div>
        </SheetHeader>

        <div className="flex flex-col gap-5 px-0">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                systemAudio.click();
                setFriendsOpen(true);
              }}
              className="flex flex-1 items-center justify-center gap-1.5 rounded-md border border-signal/25 bg-signal/5 px-2 py-1.5 font-mono text-[10px] tracking-wide text-signal transition-colors hover:bg-signal/15"
            >
              <Users size={12} />
              FRIENDS
            </button>
            <button
              type="button"
              onClick={() => {
                systemAudio.click();
                setRankOpen(true);
              }}
              className="flex flex-1 items-center justify-center gap-1.5 rounded-md border border-signal/25 bg-signal/5 px-2 py-1.5 font-mono text-[10px] tracking-wide text-signal transition-colors hover:bg-signal/15"
            >
              <Calculator size={12} />
              CALCULATE RANK
            </button>
          </div>

          <div className="rounded-md border border-signal/20 bg-background/40 p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-display text-xl font-bold tracking-tight">Level {quest.level}</div>
                <div className="font-mono text-xs text-signal">{quest.rankTitle}</div>
              </div>
              <div className="flex items-center gap-1.5 font-mono text-xs text-deload">
                <Flame size={14} />
                {streak} day streak
              </div>
            </div>
            <div className="mt-3">
              <XpBar xpIntoLevel={quest.xpIntoLevel} xpForNext={quest.xpForNext} />
            </div>
            <div className="mt-3 border-t border-border pt-3">
              <ResourceBars hp={quest.hp} hpMax={quest.hpMax} stamina={quest.stamina} staminaMax={quest.staminaMax} />
            </div>
          </div>

          <section>
            <div className="mb-2 flex items-center justify-between">
              <h3 className="font-mono text-[11px] uppercase tracking-widest text-muted-foreground">Attributes</h3>
              <span className="font-mono text-[11px] text-signal">
                Ability Points: <span className="font-bold">{quest.unallocatedPoints}</span>
              </span>
            </div>
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              {STAT_KEYS.map((stat) => (
                <StatAllocator
                  key={stat}
                  stat={stat}
                  value={quest.stats[stat]}
                  unallocatedPoints={quest.unallocatedPoints}
                  onAllocate={quest.allocateStatPoint}
                />
              ))}
            </div>
          </section>

          <section>
            <h3 className="mb-2 font-mono text-[11px] uppercase tracking-widest text-muted-foreground">Status Effects</h3>
            {quest.effects.length === 0 ? (
              <p className="text-xs text-muted-foreground">No active buffs or debuffs.</p>
            ) : (
              <div className="flex flex-col gap-1.5">
                {quest.effects.map((effect) => (
                  <div
                    key={effect.id}
                    className={cn(
                      "flex items-center justify-between rounded-md border px-3 py-2 font-mono text-xs",
                      effect.kind === "buff" ? "border-progress/30 bg-progress/10 text-progress" : "border-destructive/30 bg-destructive/10 text-destructive",
                    )}
                  >
                    <span>
                      [{effect.kind === "buff" ? "Buff" : "Debuff"}: {effect.label}
                      {effect.xpMultiplierPct ? ` ${effect.xpMultiplierPct > 0 ? "+" : ""}${effect.xpMultiplierPct}% EXP` : ""}]
                    </span>
                    <span className="text-muted-foreground">{expiresIn(effect)}</span>
                  </div>
                ))}
              </div>
            )}
          </section>

          <section>
            <h3 className="mb-2 font-mono text-[11px] uppercase tracking-widest text-muted-foreground">Titles</h3>
            {quest.titles.length === 0 ? (
              <p className="text-xs text-muted-foreground">No titles unlocked yet. Keep your streak alive.</p>
            ) : (
              <div className="flex flex-col gap-1.5">
                <button
                  type="button"
                  onClick={() => {
                    systemAudio.click();
                    quest.setActiveTitle(null);
                  }}
                  className={cn(
                    "rounded-md border px-3 py-2 text-left font-mono text-xs transition-colors",
                    quest.activeTitleId === null ? "border-signal/50 bg-signal/10 text-signal" : "border-border text-muted-foreground hover:text-foreground",
                  )}
                >
                  Auto (best bonus)
                </button>
                {quest.titles.map((title) => (
                  <button
                    key={title.id}
                    type="button"
                    onClick={() => {
                      systemAudio.click();
                      quest.setActiveTitle(title.id);
                    }}
                    className={cn(
                      "flex items-center justify-between rounded-md border px-3 py-2 text-left font-mono text-xs transition-colors",
                      quest.activeTitleId === title.id ? "border-signal/50 bg-signal/10 text-signal" : "border-border text-muted-foreground hover:text-foreground",
                    )}
                  >
                    <span>[ {title.title} ]</span>
                    <span>+{title.expBonusPct}% EXP</span>
                  </button>
                ))}
              </div>
            )}
          </section>
        </div>
      </SheetContent>

      <RankCalculator open={rankOpen} onOpenChange={setRankOpen} level={quest.level} />
      <FriendsPanel open={friendsOpen} onOpenChange={setFriendsOpen} />
    </Sheet>
  );
}
