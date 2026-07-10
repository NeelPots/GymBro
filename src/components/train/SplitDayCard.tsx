"use client";

import { Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { SplitDay } from "@/hooks/useLocalSplit";
import type { Exercise } from "@/lib/types/domain";

interface SplitDayCardProps {
  day: SplitDay;
  exercises: Exercise[];
  isActive: boolean;
  onActivate: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

export function SplitDayCard({ day, exercises, isActive, onActivate, onEdit, onDelete }: SplitDayCardProps) {
  const names = day.exercises
    .map((se) => exercises.find((e) => e.id === se.exerciseId)?.name)
    .filter((name): name is string => Boolean(name))
    .join(", ");

  return (
    <div className="rounded-[var(--radius)] border border-border bg-surface p-4">
      <div className="flex items-start justify-between gap-2">
        <div>
          <h3 className="font-display text-[15px] font-semibold">{day.name}</h3>
          <p className="mt-1 text-xs text-muted-foreground">
            {day.exercises.length} exercise{day.exercises.length === 1 ? "" : "s"}
            {names ? ` - ${names}` : ""}
          </p>
        </div>
        {isActive && (
          <span className="shrink-0 rounded-md bg-signal/10 px-2 py-0.75 font-mono text-[11px] text-signal">
            active
          </span>
        )}
      </div>
      <div className="mt-3 flex gap-2">
        {!isActive && (
          <Button size="sm" onClick={onActivate}>
            Activate
          </Button>
        )}
        <Button size="sm" variant="outline" onClick={onEdit} className="gap-1.5">
          <Pencil size={14} />
          Edit
        </Button>
        <Button size="sm" variant="destructive" onClick={onDelete} className="gap-1.5">
          <Trash2 size={14} />
          Delete
        </Button>
      </div>
    </div>
  );
}
