"use client";

import { useEffect } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { SignalPanel } from "@/components/signal/SignalPanel";
import { CircularProgress } from "@/components/shared/CircularProgress";
import { LevelCard } from "@/components/gamification/LevelCard";
import { useQuest } from "@/components/gamification/QuestProvider";
import { useLocalAdaptiveState } from "@/hooks/useLocalAdaptiveState";
import type { Exercise } from "@/lib/types/domain";

export function TrainingProfileTab({ exercises }: { exercises: Exercise[] }) {
  const { state, isLoading, streak, weekCompletion } = useLocalAdaptiveState(exercises);
  const quest = useQuest();
  const hasLoggedBefore = state !== null && state.sessionLog.length > 0;

  useEffect(() => {
    quest.syncStreak(streak, hasLoggedBefore);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [streak, hasLoggedBefore]);

  if (isLoading || quest.isLoading || !state) {
    return (
      <div className="flex flex-col gap-4">
        <Skeleton className="h-40 w-full rounded-[var(--radius)]" />
        <Skeleton className="h-24 w-full rounded-[var(--radius)]" />
        <Skeleton className="h-56 w-full rounded-[var(--radius)]" />
      </div>
    );
  }

  const rpeValues = state.sessionLog.map((s) => s.avgRpe);

  return (
    <div className="flex flex-col gap-4">
      <LevelCard
        level={quest.level}
        rankTitle={quest.rankTitle}
        xpIntoLevel={quest.xpIntoLevel}
        xpForNext={quest.xpForNext}
        totalSessionsLogged={state.sessionLog.length}
      />

      <div className="grid grid-cols-3 gap-3">
        <StatCard value={String(streak)} label="Day streak" />
        <div className="flex items-center justify-center rounded-[var(--radius)] border border-border bg-surface p-3">
          <CircularProgress value={weekCompletion} label="This week" size={60} strokeWidth={5} />
        </div>
        <StatCard value={String(state.sessionLog.length)} label="Total logs" />
      </div>

      <SignalPanel signals={state.lastSignal} rpeValues={rpeValues} />
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
