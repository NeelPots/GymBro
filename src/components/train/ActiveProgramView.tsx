"use client";

import { useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { MovementTile } from "@/components/movement/MovementTile";
import { LogSetSheet } from "@/components/movement/LogSetSheet";
import { useLocalAdaptiveState } from "@/hooks/useLocalAdaptiveState";
import type { LocalProgram } from "@/hooks/useLocalProgram";
import { resolvePlanExercises } from "@/lib/adaptive/planExercises";
import type { Exercise } from "@/lib/types/domain";

interface ActiveProgramViewProps {
  program: LocalProgram;
  exercises: Exercise[];
  onGenerateNew: () => void;
  isActive: boolean;
  onActivate: () => void;
}

export function ActiveProgramView({
  program,
  exercises,
  onGenerateNew,
  isActive,
  onActivate,
}: ActiveProgramViewProps) {
  const programExercises = resolvePlanExercises(program, exercises);

  const { state, isLoading, logSession } = useLocalAdaptiveState(programExercises);
  const [activeExerciseId, setActiveExerciseId] = useState<string | null>(null);

  if (isLoading || !state) {
    return <Skeleton className="h-72 w-full rounded-[var(--radius)]" />;
  }

  const activeExercise = programExercises.find((e) => e.id === activeExerciseId) ?? null;

  return (
    <div className="flex flex-col gap-4">
      <div className="rounded-[var(--radius)] border border-border bg-surface p-5">
        <h2 className="font-display text-lg font-bold">{program.title}</h2>
        <p className="mt-1.5 text-sm text-muted-foreground">{program.rationale}</p>
        <Button variant="outline" size="sm" className="mt-4" onClick={onGenerateNew}>
          Generate a new program
        </Button>
      </div>

      <div className="rounded-[var(--radius)] border border-border bg-surface p-5">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="font-display text-[15px] font-semibold">Your program</h3>
          {isActive ? (
            <span className="rounded-md bg-surface-2 px-2 py-0.75 font-mono text-[11px] text-muted-foreground">
              now on Home
            </span>
          ) : (
            <button
              type="button"
              onClick={onActivate}
              className="rounded-md bg-signal/10 px-2 py-0.75 font-mono text-[11px] text-signal transition-colors hover:bg-signal/20"
            >
              use on Home
            </button>
          )}
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {programExercises.map((exercise) => (
            <MovementTile
              key={exercise.id}
              name={exercise.name}
              category={exercise.category}
              params={state.movements[exercise.id]}
              onLog={() => setActiveExerciseId(exercise.id)}
            />
          ))}
        </div>
      </div>

      <LogSetSheet
        key={activeExerciseId ?? "none"}
        open={activeExerciseId !== null}
        onOpenChange={(open) => !open && setActiveExerciseId(null)}
        movementName={activeExercise?.name ?? null}
        params={activeExerciseId ? state.movements[activeExerciseId] : null}
        onSave={(reps, sets, rpe) => {
          if (activeExerciseId) logSession(activeExerciseId, reps, sets, rpe);
        }}
      />
    </div>
  );
}
