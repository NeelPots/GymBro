"use client";

import { Trash2 } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { VolumeChart } from "@/components/charts/VolumeChart";
import { CircularProgress } from "@/components/shared/CircularProgress";
import { useLocalAdaptiveState } from "@/hooks/useLocalAdaptiveState";
import type { Exercise } from "@/lib/types/domain";

export function HistoryView({ exercises }: { exercises: Exercise[] }) {
  const { state, isLoading, streak, weekCompletion, deleteSession } = useLocalAdaptiveState(exercises);

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
        <div className="flex items-center justify-center rounded-[var(--radius)] border border-border bg-surface p-3">
          <CircularProgress value={weekCompletion} label="This week" size={60} strokeWidth={5} />
        </div>
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
                key={log.id}
                className={`flex items-center justify-between gap-2 py-2.5 text-sm ${i === 0 ? "" : "border-t border-border"}`}
              >
                <span className="text-foreground">{names[log.exerciseId] ?? log.exerciseId}</span>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs text-muted-foreground">
                    {log.date} · RPE {log.avgRpe}
                  </span>
                  <Button
                    variant="ghost"
                    size="icon-xs"
                    aria-label="Delete this session"
                    onClick={() => deleteSession(log.exerciseId, log.id)}
                    className="text-subtle hover:text-deload"
                  >
                    <Trash2 size={14} />
                  </Button>
                </div>
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
