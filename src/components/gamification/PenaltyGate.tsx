"use client";

import { useState } from "react";
import Link from "next/link";
import { DoorOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PenaltySkipDialog } from "./PenaltySkipDialog";
import type { PendingPenalty } from "@/hooks/useLocalQuest";

interface PenaltyGateProps {
  pendingPenalty: PendingPenalty;
  onComplete: () => void;
  onSkip: (note?: string) => void;
}

/**
 * Shown on Home when a training streak just broke. Encourages, never
 * blocks: the redemption step is a single honor-system button, and skipping
 * is always one click away behind a confirm dialog (see PenaltySkipDialog).
 */
export function PenaltyGate({ pendingPenalty, onComplete, onSkip }: PenaltyGateProps) {
  const [expanded, setExpanded] = useState(false);
  const [skipOpen, setSkipOpen] = useState(false);

  return (
    <div className="relative overflow-hidden rounded-[var(--radius)] border border-deload/30 bg-gradient-to-br from-deload/10 via-surface to-surface p-5">
      <div className="flex items-start gap-3">
        <div className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-deload/15 text-deload ring-1 ring-deload/30">
          <DoorOpen size={20} strokeWidth={2} />
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="font-display text-base font-bold tracking-tight">A Gate Has Opened</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Your streak closed on {pendingPenalty.missedDate}. Clear this trial to reclaim it.
          </p>
        </div>
      </div>

      {expanded ? (
        <div className="mt-4 flex flex-col gap-3 border-t border-border/60 pt-4">
          <p className="text-sm text-foreground">
            Complete <strong>30 minutes of cardio</strong> to close this gate.
          </p>
          <Link
            href="/exercises?category=cardio"
            className="text-sm font-medium text-signal underline-offset-4 hover:underline"
          >
            Browse cardio exercises &rarr;
          </Link>
          <Button onClick={onComplete}>Mark my 30 minutes complete</Button>
        </div>
      ) : (
        <div className="mt-4">
          <Button onClick={() => setExpanded(true)}>Enter the Gate</Button>
        </div>
      )}

      <button
        type="button"
        onClick={() => setSkipOpen(true)}
        className="mt-3 text-xs text-muted-foreground underline-offset-4 hover:underline"
      >
        I don&apos;t want to repent for my sins
      </button>

      <PenaltySkipDialog
        open={skipOpen}
        onOpenChange={setSkipOpen}
        onConfirmSkip={(note) => {
          setSkipOpen(false);
          onSkip(note);
        }}
      />
    </div>
  );
}
