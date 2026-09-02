"use client";

import { useState } from "react";
import { Moon } from "lucide-react";
import { Sheet, SheetContent, SheetFooter, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { computeSleepHours, isSleepInsufficient, SLEEP_PENALTY_THRESHOLD_HOURS } from "@/lib/gamification/sleep";
import { systemAudio } from "@/lib/gamification/audio";

interface SleepPromptDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onLog: (bedTime: string, wakeTime: string) => void;
}

/**
 * Daily bedtime/wake-time check-in. Dismissable (it's a prompt, not a
 * lockout) but re-appears every time Home loads until logged for the day -
 * the actual enforcement is the consequence in useLocalQuest.logSleep, not
 * this dialog being unclosable.
 */
export function SleepPromptDialog({ open, onOpenChange, onLog }: SleepPromptDialogProps) {
  const [bedTime, setBedTime] = useState("23:00");
  const [wakeTime, setWakeTime] = useState("07:00");

  const previewHours = computeSleepHours(bedTime, wakeTime);
  const willPenalize = isSleepInsufficient(previewHours);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="mx-auto max-w-xl rounded-t-2xl border-t border-signal/25 bg-surface-2 px-5 pt-2 pb-8 hud-panel">
        <SheetHeader className="px-0">
          <SheetTitle className="flex items-center gap-2 font-display text-lg">
            <Moon size={18} className="text-signal" />
            Sleep Check-In
          </SheetTitle>
        </SheetHeader>

        <div className="flex flex-col gap-4 px-0">
          <p className="text-xs text-muted-foreground">
            Under {SLEEP_PENALTY_THRESHOLD_HOURS} hours triggers a Penalty Quest and a stat debuff - the System doesn&apos;t
            negotiate on recovery.
          </p>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label htmlFor="bed-time" className="mb-2 block text-xs uppercase tracking-wide text-muted-foreground">
                Bed time
              </Label>
              <input
                id="bed-time"
                type="time"
                value={bedTime}
                onChange={(e) => setBedTime(e.target.value)}
                className="h-10 w-full rounded-lg border border-border bg-surface px-3 text-sm text-foreground focus-visible:border-ring focus-visible:outline-none"
              />
            </div>
            <div>
              <Label htmlFor="wake-time" className="mb-2 block text-xs uppercase tracking-wide text-muted-foreground">
                Wake time
              </Label>
              <input
                id="wake-time"
                type="time"
                value={wakeTime}
                onChange={(e) => setWakeTime(e.target.value)}
                className="h-10 w-full rounded-lg border border-border bg-surface px-3 text-sm text-foreground focus-visible:border-ring focus-visible:outline-none"
              />
            </div>
          </div>

          <div
            className={
              "rounded-md border px-3 py-2.5 text-center font-mono text-sm " +
              (willPenalize ? "border-destructive/40 bg-destructive/10 text-destructive" : "border-progress/40 bg-progress/10 text-progress")
            }
          >
            {previewHours}h {willPenalize ? "- Penalty Quest will be assigned" : "- Well Rested buff will be granted"}
          </div>
        </div>

        <SheetFooter className="flex-row gap-2.5 px-0">
          <Button variant="secondary" className="flex-1" onClick={() => onOpenChange(false)}>
            Later
          </Button>
          <Button
            className="flex-1"
            onClick={() => {
              systemAudio.click();
              onLog(bedTime, wakeTime);
              onOpenChange(false);
            }}
          >
            Log sleep
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
