"use client";

import { useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { systemAudio } from "@/lib/gamification/audio";

interface EmergencyTriggerProps {
  disabled: boolean;
  onTrigger: () => void;
}

/** Manual "Fail Daily Routine" self-report - the Emergency Overdrive trigger, honor-system like the rest of the app. */
export function EmergencyTrigger({ disabled, onTrigger }: EmergencyTriggerProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        disabled={disabled}
        onClick={() => setOpen(true)}
        className="font-mono text-[11px] text-muted-foreground underline-offset-4 transition-colors hover:text-destructive hover:underline disabled:pointer-events-none disabled:opacity-40"
      >
        Fail daily routine
      </button>

      <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogContent className="border-destructive/30">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-destructive">Assign yourself a Penalty Quest?</AlertDialogTitle>
            <AlertDialogDescription>
              This locks the interface behind an emergency objective. Failing to clear it drains stat points or
              applies a temporary attribute debuff.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction
              variant="destructive"
              onClick={() => {
                systemAudio.penaltyAlarm();
                onTrigger();
              }}
            >
              Assign the penalty
            </AlertDialogAction>
            <AlertDialogCancel>Never mind</AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
