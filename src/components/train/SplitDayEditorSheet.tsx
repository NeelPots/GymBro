"use client";

import { useMemo, useState } from "react";
import { Minus, Plus, Search, X } from "lucide-react";
import { toast } from "sonner";
import { Sheet, SheetContent, SheetFooter, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { SplitDay, SplitExercise } from "@/hooks/useLocalSplit";
import type { Exercise } from "@/lib/types/domain";

interface SplitDayEditorSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  day: SplitDay | null;
  exercises: Exercise[];
  onSave: (name: string, exercises: SplitExercise[]) => void;
}

interface DraftExercise {
  exerciseId: string;
  name: string;
  targetReps: number;
  targetSets: number;
}

function seedDraft(day: SplitDay | null, exercises: Exercise[]): DraftExercise[] {
  if (!day) return [];
  return [...day.exercises]
    .sort((a, b) => a.orderIndex - b.orderIndex)
    .flatMap((se) => {
      const base = exercises.find((e) => e.id === se.exerciseId);
      if (!base) return [];
      return [{ exerciseId: se.exerciseId, name: base.name, targetReps: se.targetReps, targetSets: se.targetSets }];
    });
}

/**
 * Parent should render this with a `key` that changes between "new" and each
 * day's id (see SplitsView) so opening a different day remounts with fresh
 * initial values, same pattern as LogSetSheet.
 */
export function SplitDayEditorSheet({ open, onOpenChange, day, exercises, onSave }: SplitDayEditorSheetProps) {
  const [name, setName] = useState(day?.name ?? "");
  const [draft, setDraft] = useState<DraftExercise[]>(() => seedDraft(day, exercises));
  const [query, setQuery] = useState("");

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (q.length === 0) return [];
    const selectedIds = new Set(draft.map((d) => d.exerciseId));
    return exercises.filter((e) => !selectedIds.has(e.id) && e.name.toLowerCase().includes(q)).slice(0, 8);
  }, [exercises, query, draft]);

  function addExercise(exercise: Exercise) {
    setDraft((prev) => [
      ...prev,
      {
        exerciseId: exercise.id,
        name: exercise.name,
        targetReps: exercise.defaultReps,
        targetSets: exercise.defaultSets,
      },
    ]);
    setQuery("");
  }

  function removeExercise(exerciseId: string) {
    setDraft((prev) => prev.filter((d) => d.exerciseId !== exerciseId));
  }

  function updateExercise(exerciseId: string, patch: Partial<Pick<DraftExercise, "targetReps" | "targetSets">>) {
    setDraft((prev) => prev.map((d) => (d.exerciseId === exerciseId ? { ...d, ...patch } : d)));
  }

  function handleSave() {
    const trimmed = name.trim();
    if (trimmed.length === 0) {
      toast.error("Give this day a name, like \"Push Day\".");
      return;
    }
    if (draft.length === 0) {
      toast.error("Add at least one exercise.");
      return;
    }
    onSave(
      trimmed,
      draft.map((d, i) => ({
        exerciseId: d.exerciseId,
        orderIndex: i,
        targetReps: d.targetReps,
        targetSets: d.targetSets,
      })),
    );
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="bottom"
        className="mx-auto flex max-h-[85vh] max-w-xl flex-col rounded-t-2xl border-t border-border bg-surface-2 px-5 pt-2 pb-8"
      >
        <SheetHeader className="px-0">
          <SheetTitle className="font-display text-lg">{day ? "Edit day" : "New split day"}</SheetTitle>
        </SheetHeader>

        <div className="flex flex-col gap-4 overflow-y-auto px-0">
          <div>
            <Label className="mb-2 block text-xs uppercase tracking-wide text-muted-foreground">Day name</Label>
            <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Push Day" />
          </div>

          <div>
            <Label className="mb-2 block text-xs uppercase tracking-wide text-muted-foreground">
              Add exercises
            </Label>
            <div className="relative">
              <Search
                size={16}
                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
              />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search the library…"
                className="h-10 w-full rounded-lg border border-border bg-surface pl-9 pr-3 text-sm text-foreground placeholder:text-muted-foreground focus-visible:border-ring focus-visible:outline-none"
              />
            </div>
            {results.length > 0 && (
              <div className="mt-2 flex flex-col gap-1 rounded-lg border border-border bg-surface p-1">
                {results.map((e) => (
                  <button
                    key={e.id}
                    type="button"
                    onClick={() => addExercise(e)}
                    className="flex items-center justify-between rounded-md px-2.5 py-2 text-left text-sm transition-colors hover:bg-surface-2"
                  >
                    <span>{e.name}</span>
                    <span className="text-xs text-muted-foreground">{e.category}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          <div>
            <Label className="mb-2 block text-xs uppercase tracking-wide text-muted-foreground">
              Exercises in this day
            </Label>
            {draft.length === 0 ? (
              <p className="rounded-lg border border-dashed border-border bg-surface p-4 text-center text-sm text-muted-foreground">
                Search above to add exercises.
              </p>
            ) : (
              <div className="flex flex-col gap-2">
                {draft.map((d) => (
                  <div
                    key={d.exerciseId}
                    className="flex items-center gap-2 rounded-[10px] border border-border bg-surface px-3 py-2.5"
                  >
                    <span className="flex-1 truncate text-sm font-medium">{d.name}</span>

                    <StepperField
                      label="sets"
                      value={d.targetSets}
                      onChange={(v) => updateExercise(d.exerciseId, { targetSets: v })}
                    />
                    <StepperField
                      label="reps"
                      value={d.targetReps}
                      onChange={(v) => updateExercise(d.exerciseId, { targetReps: v })}
                    />

                    <button
                      type="button"
                      onClick={() => removeExercise(d.exerciseId)}
                      aria-label={`Remove ${d.name}`}
                      className="shrink-0 text-subtle transition-colors hover:text-deload"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <SheetFooter className="flex-row gap-2.5 px-0">
          <Button variant="secondary" className="flex-1" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button className="flex-1" onClick={handleSave}>
            Save day
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}

function StepperField({ label, value, onChange }: { label: string; value: number; onChange: (v: number) => void }) {
  return (
    <div className="flex shrink-0 items-center gap-1 rounded-md bg-surface-2 px-1 py-1">
      <Button
        type="button"
        variant="ghost"
        size="icon-xs"
        onClick={() => onChange(Math.max(1, value - 1))}
        aria-label={`Decrease ${label}`}
      >
        <Minus size={12} />
      </Button>
      <span className="w-9 text-center font-mono text-xs tabular-nums">
        {value} {label}
      </span>
      <Button type="button" variant="ghost" size="icon-xs" onClick={() => onChange(value + 1)} aria-label={`Increase ${label}`}>
        <Plus size={12} />
      </Button>
    </div>
  );
}
