"use client";

import { useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { GoalPicker } from "./GoalPicker";
import { ActiveProgramView } from "./ActiveProgramView";
import { SplitsView } from "./SplitsView";
import { useLocalProgram } from "@/hooks/useLocalProgram";
import { useLocalSplit } from "@/hooks/useLocalSplit";
import { useActivePlanSource } from "@/hooks/useActivePlanSource";
import type { Exercise } from "@/lib/types/domain";

const TABS = [
  { value: "ai", label: "AI Coach" },
  { value: "splits", label: "My Splits" },
] as const;

type Tab = (typeof TABS)[number]["value"];

export function TrainView({ exercises }: { exercises: Exercise[] }) {
  const { program, isLoading: isProgramLoading, saveProgram, clearProgram } = useLocalProgram();
  const { days, activeDayId, isLoading: isSplitLoading, createDay, updateDay, deleteDay, activateDay } =
    useLocalSplit();
  const { source, isLoading: isSourceLoading, setSource } = useActivePlanSource();
  const [tab, setTab] = useState<Tab>("ai");

  if (isProgramLoading || isSplitLoading || isSourceLoading) {
    return <Skeleton className="h-72 w-full rounded-[var(--radius)]" />;
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex gap-1 rounded-lg border border-border bg-surface p-1">
        {TABS.map((t) => (
          <button
            key={t.value}
            type="button"
            onClick={() => setTab(t.value)}
            className={cn(
              "flex-1 rounded-md py-2 text-sm font-medium transition-colors",
              tab === t.value ? "bg-signal/10 text-signal" : "text-muted-foreground hover:text-foreground",
            )}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === "ai" ? (
        program ? (
          <ActiveProgramView
            program={program}
            exercises={exercises}
            onGenerateNew={clearProgram}
            isActive={source === "ai"}
            onActivate={() => setSource("ai")}
          />
        ) : (
          <GoalPicker
            onGenerated={(next) => {
              saveProgram(next);
              setSource("ai");
            }}
          />
        )
      ) : (
        <SplitsView
          exercises={exercises}
          days={days}
          activeDayId={activeDayId}
          isActiveSource={source === "split"}
          onCreateDay={createDay}
          onUpdateDay={updateDay}
          onDeleteDay={deleteDay}
          onActivateDay={(dayId) => {
            activateDay(dayId);
            setSource("split");
          }}
        />
      )}
    </div>
  );
}
