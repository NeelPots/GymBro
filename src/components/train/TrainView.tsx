"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { GoalPicker } from "./GoalPicker";
import { ActiveProgramView } from "./ActiveProgramView";
import { useLocalProgram } from "@/hooks/useLocalProgram";
import type { Exercise } from "@/lib/types/domain";

export function TrainView({ exercises }: { exercises: Exercise[] }) {
  const { program, isLoading, saveProgram, clearProgram } = useLocalProgram();

  if (isLoading) {
    return <Skeleton className="h-72 w-full rounded-[var(--radius)]" />;
  }

  if (!program) {
    return <GoalPicker onGenerated={saveProgram} />;
  }

  return <ActiveProgramView program={program} exercises={exercises} onGenerateNew={clearProgram} />;
}
