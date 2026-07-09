"use client";

import { useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import type { MovementParams } from "@/lib/adaptive/engine";

interface LogSetSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  movementName: string | null;
  params: MovementParams | null;
  onSave: (completedReps: number, completedSets: number, rpe: number) => void;
}

/**
 * The parent should render this with `key={exerciseId}` so switching to a
 * different movement remounts the sheet with fresh initial values, instead
 * of syncing local state to the `params` prop via an effect.
 */
export function LogSetSheet({ open, onOpenChange, movementName, params, onSave }: LogSetSheetProps) {
  const [completedReps, setCompletedReps] = useState(params?.reps ?? 0);
  const [completedSets, setCompletedSets] = useState(params?.sets ?? 0);
  const [rpe, setRpe] = useState(6);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="mx-auto max-w-xl rounded-t-2xl border-t border-border bg-surface-2 px-5 pt-2 pb-8">
        <SheetHeader className="px-0">
          <SheetTitle className="font-display text-lg">Log: {movementName}</SheetTitle>
        </SheetHeader>

        <div className="flex flex-col gap-4 px-0">
          <div>
            <Label className="mb-2 block text-xs uppercase tracking-wide text-muted-foreground">
              Completed sets
            </Label>
            <Input
              type="number"
              min={0}
              value={completedSets}
              onChange={(e) => setCompletedSets(Number(e.target.value))}
              className="font-mono"
            />
          </div>

          <div>
            <Label className="mb-2 block text-xs uppercase tracking-wide text-muted-foreground">
              Completed reps per set
            </Label>
            <Input
              type="number"
              min={0}
              value={completedReps}
              onChange={(e) => setCompletedReps(Number(e.target.value))}
              className="font-mono"
            />
          </div>

          <div>
            <Label className="mb-2 block text-xs uppercase tracking-wide text-muted-foreground">
              RPE — how hard did it feel (1 easy – 10 max effort)
            </Label>
            <Slider
              min={1}
              max={10}
              step={0.5}
              value={[rpe]}
              onValueChange={(value) => setRpe(Array.isArray(value) ? value[0] : value)}
            />
            <div className="mt-1.5 text-center font-mono text-xl">{rpe}</div>
          </div>
        </div>

        <SheetFooter className="flex-row gap-2.5 px-0">
          <Button variant="secondary" className="flex-1" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            className="flex-1"
            onClick={() => {
              onSave(completedReps, completedSets, rpe);
              onOpenChange(false);
            }}
          >
            Save &amp; adapt
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
