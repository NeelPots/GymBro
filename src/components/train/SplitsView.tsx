"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SplitDayCard } from "./SplitDayCard";
import { SplitDayEditorSheet } from "./SplitDayEditorSheet";
import type { SplitDay, SplitExercise } from "@/hooks/useLocalSplit";
import type { Exercise } from "@/lib/types/domain";

interface SplitsViewProps {
  exercises: Exercise[];
  days: SplitDay[];
  activeDayId: string | null;
  isActiveSource: boolean;
  onCreateDay: (name: string, exercises: SplitExercise[]) => void;
  onUpdateDay: (dayId: string, name: string, exercises: SplitExercise[]) => void;
  onDeleteDay: (dayId: string) => void;
  onActivateDay: (dayId: string) => void;
}

export function SplitsView({
  exercises,
  days,
  activeDayId,
  isActiveSource,
  onCreateDay,
  onUpdateDay,
  onDeleteDay,
  onActivateDay,
}: SplitsViewProps) {
  const [editingDay, setEditingDay] = useState<SplitDay | "new" | null>(null);

  return (
    <div className="flex flex-col gap-3">
      {days.length === 0 ? (
        <div className="rounded-[var(--radius)] border border-dashed border-border bg-surface p-8 text-center text-sm text-muted-foreground">
          No split days yet. Create one like &quot;Push Day&quot; with its own exercises, sets, and reps.
        </div>
      ) : (
        days.map((day) => (
          <SplitDayCard
            key={day.id}
            day={day}
            exercises={exercises}
            isActive={isActiveSource && day.id === activeDayId}
            onActivate={() => onActivateDay(day.id)}
            onEdit={() => setEditingDay(day)}
            onDelete={() => onDeleteDay(day.id)}
          />
        ))
      )}

      <Button variant="outline" onClick={() => setEditingDay("new")} className="gap-1.5">
        <Plus size={16} />
        New day
      </Button>

      <SplitDayEditorSheet
        key={editingDay === null ? "closed" : editingDay === "new" ? "new" : editingDay.id}
        open={editingDay !== null}
        onOpenChange={(open) => !open && setEditingDay(null)}
        day={editingDay === "new" ? null : editingDay}
        exercises={exercises}
        onSave={(name, dayExercises) => {
          if (editingDay === "new") {
            onCreateDay(name, dayExercises);
          } else if (editingDay) {
            onUpdateDay(editingDay.id, name, dayExercises);
          }
          setEditingDay(null);
        }}
      />
    </div>
  );
}
