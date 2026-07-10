"use client";

import { useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { SignalPanel } from "@/components/signal/SignalPanel";
import { MovementTile } from "@/components/movement/MovementTile";
import { LogSetSheet } from "@/components/movement/LogSetSheet";
import { CircularProgress } from "@/components/shared/CircularProgress";
import { ProfileCard } from "@/components/home/ProfileCard";
import { useLocalAdaptiveState } from "@/hooks/useLocalAdaptiveState";
import type { Exercise } from "@/lib/types/domain";

export function HomeView({ exercises }: { exercises: Exercise[] }) {
  const { state, isLoading, logSession, streak, weekCompletion } = useLocalAdaptiveState(exercises);
  const [activeExerciseId, setActiveExerciseId] = useState<string | null>(null);

  if (isLoading || !state) {
    return (
      <div className="flex flex-col gap-4 pt-2">
        <Skeleton className="h-40 w-full rounded-[var(--radius)]" />
        <Skeleton className="h-24 w-full rounded-[var(--radius)]" />
        <Skeleton className="h-56 w-full rounded-[var(--radius)]" />
      </div>
    );
  }

  const activeExercise = exercises.find((e) => e.id === activeExerciseId) ?? null;
  const rpeValues = state.sessionLog.map((s) => s.avgRpe);

  return (
    <div className="pt-2 lg:grid lg:grid-cols-[1fr_280px] lg:items-start lg:gap-6">
      <div className="flex flex-col gap-4">
        <div className="flex items-baseline justify-between lg:hidden">
          <span className="font-mono text-[13px] text-signal">{streak} day streak</span>
        </div>

        <SignalPanel signals={state.lastSignal} rpeValues={rpeValues} />

        <div className="grid grid-cols-3 gap-3">
          <div className="flex items-center justify-center rounded-[var(--radius)] border border-border bg-surface p-3">
            <CircularProgress value={weekCompletion} label="This week" size={60} strokeWidth={5} />
          </div>
          <StatCard value={String(state.sessionLog.length)} label="Total logs" />
          <StatCard value={String(exercises.length)} label="Movements" />
        </div>

        <div className="rounded-[var(--radius)] border border-border bg-surface p-5">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-display text-[17px] font-semibold">Today&apos;s targets</h2>
            <span className="rounded-md bg-surface-2 px-2 py-0.75 font-mono text-[11px] text-muted-foreground">
              auto-adjusted
            </span>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {exercises.map((exercise) => (
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
      </div>

      <div className="mt-4 hidden lg:mt-0 lg:block">
        <ProfileCard
          streak={streak}
          totalLogs={state.sessionLog.length}
          movementCount={exercises.length}
        />
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

function StatCard({ value, label }: { value: string; label: string }) {
  return (
    <div className="rounded-[var(--radius)] border border-border bg-surface p-4">
      <div className="font-mono text-2xl font-semibold">{value}</div>
      <div className="mt-1 text-[11px] uppercase tracking-wide text-muted-foreground">{label}</div>
    </div>
  );
}
