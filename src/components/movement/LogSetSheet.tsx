"use client";

import { useRef, useState } from "react";
import { CheckCircle2, Circle, Minus, Plus } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { cn } from "@/lib/utils";
import type { MovementParams } from "@/lib/adaptive/engine";
import { RestTimerOverlay } from "@/components/train/RestTimerOverlay";
import { getRestSeconds } from "@/lib/workout/restDuration";

interface SetRow {
  reps: number;
  done: boolean;
}

interface LogSetSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  movementName: string | null;
  category?: string;
  params: MovementParams | null;
  onSave: (completedReps: number, completedSets: number, rpe: number) => void;
}

function seedRows(params: MovementParams | null): SetRow[] {
  if (!params) return [];
  return Array.from({ length: params.sets }, () => ({ reps: params.reps, done: false }));
}

/**
 * The parent should render this with `key={exerciseId}` so switching to a
 * different movement remounts the sheet with fresh initial values, instead
 * of syncing local state to the `params` prop via an effect.
 *
 * Logs set-by-set (a row per prescribed set, tap to check off, adjustable
 * reps per row) rather than one aggregate reps/sets pair - it's the
 * lifting-log convention (Strong/Hevy/Lyfta) and reads far less abstract
 * than "how many sets did you do" after the fact. Still collapses to the
 * same aggregate (completedReps, completedSets, rpe) the adaptive engine
 * expects, so no data-model change was needed to support it.
 */
export function LogSetSheet({ open, onOpenChange, movementName, category, params, onSave }: LogSetSheetProps) {
  const [rows, setRows] = useState<SetRow[]>(() => seedRows(params));
  const [rpe, setRpe] = useState(6);
  const [restTimer, setRestTimer] = useState<{ key: number; seconds: number } | null>(null);
  const restKeyRef = useRef(0);

  const doneRows = rows.filter((r) => r.done);
  const completedSets = doneRows.length;
  const completedReps =
    doneRows.length === 0 ? 0 : Math.round(doneRows.reduce((sum, r) => sum + r.reps, 0) / doneRows.length);

  function updateRow(index: number, patch: Partial<SetRow>) {
    setRows((prev) => prev.map((r, i) => (i === index ? { ...r, ...patch } : r)));
  }

  function toggleDone(index: number) {
    const wasDone = rows[index].done;
    updateRow(index, { done: !wasDone });
    if (!wasDone && params) {
      restKeyRef.current += 1;
      setRestTimer({ key: restKeyRef.current, seconds: getRestSeconds(category ?? "", params.difficultyTier) });
    }
  }

  return (
    <>
      <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="mx-auto max-w-xl rounded-t-2xl border-t border-border bg-surface-2 px-5 pt-2 pb-8">
        <SheetHeader className="px-0">
          <SheetTitle className="font-display text-lg">Log: {movementName}</SheetTitle>
        </SheetHeader>

        <div className="flex flex-col gap-4 px-0">
          <div>
            <Label className="mb-2 block text-xs uppercase tracking-wide text-muted-foreground">
              Sets
            </Label>
            <div className="flex flex-col gap-2">
              {rows.map((row, i) => (
                <div
                  key={i}
                  className={cn(
                    "flex items-center gap-3 rounded-[10px] border px-3 py-2 transition-colors",
                    row.done ? "border-progress/40 bg-progress/10" : "border-border bg-surface",
                  )}
                >
                  <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-surface-2 font-mono text-[11px] text-muted-foreground">
                    {i + 1}
                  </span>
                  <div className="flex flex-1 items-center justify-between">
                    <span className="font-mono text-xs text-muted-foreground">reps</span>
                    <div className="flex items-center gap-2">
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon-xs"
                        onClick={() => updateRow(i, { reps: Math.max(0, row.reps - 1) })}
                        aria-label="Decrease reps"
                      >
                        <Minus size={13} />
                      </Button>
                      <span className="w-6 text-center font-mono text-sm font-semibold tabular-nums">
                        {row.reps}
                      </span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon-xs"
                        onClick={() => updateRow(i, { reps: row.reps + 1 })}
                        aria-label="Increase reps"
                      >
                        <Plus size={13} />
                      </Button>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => toggleDone(i)}
                    aria-label={row.done ? "Mark set as not done" : "Mark set as done"}
                    className={cn(
                      "shrink-0 transition-colors",
                      row.done ? "text-progress" : "text-subtle hover:text-muted-foreground",
                    )}
                  >
                    {row.done ? <CheckCircle2 size={22} /> : <Circle size={22} />}
                  </button>
                </div>
              ))}
            </div>
            <button
              type="button"
              onClick={() => setRows((prev) => [...prev, { reps: params?.reps ?? 0, done: false }])}
              className="mt-2 w-full rounded-[10px] border border-dashed border-border py-2 font-mono text-xs text-muted-foreground transition-colors hover:border-signal/40 hover:text-signal"
            >
              + Add set
            </button>
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
      {restTimer && (
        <RestTimerOverlay
          key={restTimer.key}
          seconds={restTimer.seconds}
          exerciseName={movementName ?? "next set"}
          onDone={() => setRestTimer(null)}
        />
      )}
    </>
  );
}
