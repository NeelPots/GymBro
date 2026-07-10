"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";
import { SignalPanel } from "@/components/signal/SignalPanel";
import { MovementTile } from "@/components/movement/MovementTile";
import { LogSetSheet } from "@/components/movement/LogSetSheet";
import { CircularProgress } from "@/components/shared/CircularProgress";
import { ProfileCard } from "@/components/home/ProfileCard";
import { useLocalAdaptiveState } from "@/hooks/useLocalAdaptiveState";
import { useLocalProgram } from "@/hooks/useLocalProgram";
import { useLocalSplit } from "@/hooks/useLocalSplit";
import { useActivePlanSource } from "@/hooks/useActivePlanSource";
import { useLocalQuest } from "@/hooks/useLocalQuest";
import { resolveActivePlan } from "@/lib/adaptive/activePlan";
import { evaluateMovement, type SessionEntry } from "@/lib/adaptive/engine";
import { LevelCard } from "@/components/gamification/LevelCard";
import { PenaltyGate } from "@/components/gamification/PenaltyGate";
import { MotivationalBanner } from "@/components/gamification/MotivationalBanner";
import type { Exercise } from "@/lib/types/domain";

export function HomeView({ exercises }: { exercises: Exercise[] }) {
  const router = useRouter();
  const { program, isLoading: isProgramLoading } = useLocalProgram();
  const { days: splitDays, activeDayId, isLoading: isSplitLoading } = useLocalSplit();
  const { source, isLoading: isSourceLoading } = useActivePlanSource();
  const activeDay = splitDays.find((d) => d.id === activeDayId) ?? null;
  const planExercises = resolveActivePlan({ source, program, activeDay, library: exercises });
  const { state, isLoading, logSession, streak, weekCompletion } = useLocalAdaptiveState(planExercises);
  const quest = useLocalQuest(streak, state !== null && state.sessionLog.length > 0);
  const [activeExerciseId, setActiveExerciseId] = useState<string | null>(null);

  if (isLoading || isProgramLoading || isSplitLoading || isSourceLoading || quest.isLoading || !state) {
    return (
      <div className="flex flex-col gap-4 pt-2">
        <Skeleton className="h-40 w-full rounded-[var(--radius)]" />
        <Skeleton className="h-24 w-full rounded-[var(--radius)]" />
        <Skeleton className="h-56 w-full rounded-[var(--radius)]" />
      </div>
    );
  }

  const activeExercise = planExercises.find((e) => e.id === activeExerciseId) ?? null;
  const rpeValues = state.sessionLog.map((s) => s.avgRpe);
  const planTitle =
    source === "ai" && program ? program.title : source === "split" && activeDay ? activeDay.name : "Today's targets";
  const planBadgeLabel = source === "default" ? "auto-adjusted" : "manage";

  function announceLevelUp(result: { leveledUp: boolean; level: number; rankTitle: string }) {
    if (!result.leveledUp) return;
    toast.success(`Level Up! You're now Lv. ${result.level}`, {
      description: result.rankTitle,
    });
  }

  return (
    <div className="pt-2 lg:grid lg:grid-cols-[1fr_280px] lg:items-start lg:gap-6">
      <div className="flex flex-col gap-4">
        <div className="flex items-baseline justify-between lg:hidden">
          <span className="font-mono text-[13px] text-signal">{streak} day streak</span>
        </div>

        <MotivationalBanner offset={0} tone="signal" />

        {quest.pendingPenalty && (
          <PenaltyGate
            pendingPenalty={quest.pendingPenalty}
            onComplete={() => {
              const result = quest.completePenalty();
              toast.success("Gate cleared. +50 XP", { description: "Redemption logged." });
              announceLevelUp(result);
            }}
            onSkip={(note) => {
              quest.skipPenalty(note);
              toast("The gate closes.", { description: "No judgment - it's logged, not held against you." });
            }}
          />
        )}

        <LevelCard
          level={quest.level}
          rankTitle={quest.rankTitle}
          xpIntoLevel={quest.xpIntoLevel}
          xpForNext={quest.xpForNext}
        />

        <SignalPanel signals={state.lastSignal} rpeValues={rpeValues} />

        <div className="grid grid-cols-3 gap-3">
          <div className="flex items-center justify-center rounded-[var(--radius)] border border-border bg-surface p-3">
            <CircularProgress value={weekCompletion} label="This week" size={60} strokeWidth={5} />
          </div>
          <StatCard value={String(state.sessionLog.length)} label="Total logs" />
          <StatCard value={String(planExercises.length)} label="Movements" />
        </div>

        <MotivationalBanner offset={4} tone="progress" />

        <div className="rounded-[var(--radius)] border border-border bg-surface p-5">
          <div className="mb-4 flex items-center justify-between gap-3">
            <h2 className="font-display text-[17px] font-semibold">{planTitle}</h2>
            <Link
              href="/train"
              className="shrink-0 rounded-md bg-surface-2 px-2 py-0.75 font-mono text-[11px] text-muted-foreground transition-colors hover:text-foreground"
            >
              {planBadgeLabel}
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {planExercises.map((exercise) => (
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
          movementCount={planExercises.length}
        />
      </div>

      <LogSetSheet
        key={activeExerciseId ?? "none"}
        open={activeExerciseId !== null}
        onOpenChange={(open) => !open && setActiveExerciseId(null)}
        movementName={activeExercise?.name ?? null}
        params={activeExerciseId ? state.movements[activeExerciseId] : null}
        onSave={(reps, sets, rpe) => {
          if (!activeExerciseId) return;

          const params = state.movements[activeExerciseId];
          const entry: SessionEntry = {
            date: new Date().toISOString().slice(0, 10),
            targetReps: params.reps,
            targetSets: params.sets,
            completedReps: reps,
            completedSets: sets,
            rpe,
          };
          const projectedHistory = [...(state.history[activeExerciseId] ?? []), entry];
          const { action } = evaluateMovement(projectedHistory, params);

          logSession(activeExerciseId, reps, sets, rpe);
          announceLevelUp(quest.awardSessionXp(action === "progress"));

          if (action === "progress") {
            const name = activeExercise?.name ?? "that exercise";
            const caption = `Just hit a new ${name} PR: ${sets}x${reps} \u{1F4AA}`;
            toast.success("New PR!", {
              description: `${name}: ${sets}x${reps}`,
              action: {
                label: "Share \u{1F389}",
                onClick: () => router.push(`/social?share=${encodeURIComponent(caption)}`),
              },
            });
          }
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
