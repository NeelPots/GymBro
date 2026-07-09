"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { VolumeChart } from "@/components/charts/VolumeChart";
import { useLocalAdaptiveState } from "@/hooks/useLocalAdaptiveState";
import type { Exercise } from "@/lib/types/domain";

export function HistoryView({ exercises }: { exercises: Exercise[] }) {
  const { state, isLoading, streak, weekCompletion } = useLocalAdaptiveState(exercises);

  if (isLoading || !state) {
    return (
      <div className="flex flex-col gap-4 pt-2">
        <Skeleton className="h-24 w-full rounded-[var(--radius)]" />
        <Skeleton className="h-56 w-full rounded-[var(--radius)]" />
      </div>
    );
  }

  const names = Object.fromEntries(exercises.map((e) => [e.id, e.name]));
  const recentLogs = [...state.sessionLog].reverse().slice(0, 10);

  return (
    <div className="flex flex-col gap-4 pt-2">
      <div className="grid grid-cols-3 gap-3">
        <StatCard value={`${streak}`} label="Day streak" />
        <StatCard value={`${weekCompletion}%`} label="This week" />
        <StatCard value={String(state.sessionLog.length)} label="Total logs" />
      </div>

      <div className="rounded-[var(--radius)] border border-border bg-surface p-5">
        <h3 className="mb-3 font-display text-[15px]">Volume over time</h3>
        <VolumeChart history={state.history} names={names} />
      </div>

      <div className="rounded-[var(--radius)] border border-border bg-surface p-5">
        <h3 className="mb-3 font-display text-[15px]">Recent sessions</h3>
        {recentLogs.length === 0 ? (
          <p className="font-mono text-xs text-muted-foreground">No sessions logged yet.</p>
        ) : (
          <div className="flex flex-col">
            {recentLogs.map((log, i) => (
              <div
                key={`${log.date}-${log.exerciseId}-${i}`}
                className={`flex items-center justify-between py-2.5 text-sm ${i === 0 ? "" : "border-t border-border"}`}
              >
                <span className="text-foreground">{names[log.exerciseId] ?? log.exerciseId}</span>
                <span className="font-mono text-xs text-muted-foreground">
                  {log.date} · RPE {log.avgRpe}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
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
