"use client";

import { useEffect, useRef, useState } from "react";
import { Skull } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Countdown } from "@/components/gamification/Countdown";
import { systemAudio } from "@/lib/gamification/audio";
import { useQuest } from "@/components/gamification/QuestProvider";

/**
 * The Penalty Zone: a full-screen, un-dismissable lock shown whenever an
 * emergency penalty is active (manual "Fail Daily Routine" or an automatic
 * midnight trigger for an incomplete day). No skip/close button - the only
 * way out is honor-system self-certification via "Enforce Completion",
 * matching the honor-system philosophy the rest of the app already uses
 * for PenaltyGate/PenaltySkipDialog.
 */
export function PenaltyOverlay() {
  const quest = useQuest();
  const [verifying, setVerifying] = useState(false);
  const lastPenaltyId = useRef<string | null>(null);

  const penalty = quest.emergencyPenalty;

  useEffect(() => {
    if (penalty && penalty.id !== lastPenaltyId.current) {
      lastPenaltyId.current = penalty.id;
      systemAudio.penaltyAlarm();
    }
    if (!penalty) lastPenaltyId.current = null;
  }, [penalty]);

  if (!penalty) return null;

  return (
    <div
      role="alertdialog"
      aria-modal="true"
      aria-labelledby="penalty-zone-title"
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center overflow-y-auto bg-background/95 px-6 py-10 backdrop-blur-sm animate-hud-screen-shake"
    >
      <div
        className="pointer-events-none absolute inset-0 animate-hud-vignette-pulse"
        style={{ background: "radial-gradient(ellipse at 50% 50%, transparent 35%, rgba(255,0,85,0.35) 100%)" }}
        aria-hidden="true"
      />

      <div className="relative z-10 flex w-full max-w-md flex-col items-center gap-6 rounded-[var(--radius)] border border-destructive/50 bg-surface/90 p-6 text-center hud-alarm-panel">
        <Skull size={40} className="text-destructive animate-hud-pulse-glow" />

        <div>
          <h2 id="penalty-zone-title" className="font-display text-xl font-bold tracking-wide text-destructive">
            [ WARNING: PENALTY QUEST ASSIGNED ]
          </h2>
          <p className="mt-2 font-mono text-xs text-muted-foreground">Survival in the Penalty Zone.</p>
        </div>

        <p className="text-base font-semibold text-foreground">{penalty.objective}</p>

        <div className="flex flex-col items-center gap-1">
          <span className="font-mono text-[11px] uppercase tracking-widest text-muted-foreground">Time remaining</span>
          <Countdown targetIso={penalty.deadline} className="font-mono text-3xl font-bold tabular-nums text-destructive" />
        </div>

        <p className="text-xs text-muted-foreground">
          Failing to clear this before the timer expires drains your Ability Points, or applies a temporary
          [Debuff: Weakened -5 all attributes] if none remain.
        </p>

        <Button
          variant="destructive"
          className="w-full"
          disabled={verifying}
          onClick={() => {
            setVerifying(true);
            systemAudio.questComplete();
            quest.enforcePenaltyCompletion();
          }}
        >
          Enforce Penalty Completion
        </Button>
      </div>
    </div>
  );
}
