"use client";

import { useState } from "react";
import { CheckCircle2, Circle, Pencil, Plus, Trash2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { QUEST_CATEGORY_LABELS } from "@/lib/gamification/quests";
import { describeSchedule } from "@/lib/gamification/routines";
import type { RoutineWithSteps, StepWithState } from "@/hooks/useLocalQuest";
import { systemAudio } from "@/lib/gamification/audio";
import { cn } from "@/lib/utils";
import { RoutineNameDialog } from "./RoutineNameDialog";

interface RoutineCardProps {
  routine: RoutineWithSteps;
  onComplete: (stepId: string) => void;
  onEditStep: (step: StepWithState) => void;
  onDeleteStep: (stepId: string) => void;
  onAddStep: () => void;
  onRename: (name: string) => void;
  onDelete: () => void;
}

function StepRow({ step, onComplete, onEdit, onDelete }: { step: StepWithState; onComplete: () => void; onEdit: () => void; onDelete: () => void }) {
  const active = step.dueToday && !step.completed;
  return (
    <div
      className={cn(
        "flex items-center gap-3 rounded-md border px-3 py-2.5 transition-colors",
        step.completed ? "border-progress/40 bg-progress/10" : !step.dueToday ? "border-border/60 bg-background/15" : "border-border bg-background/30",
      )}
    >
      <button
        type="button"
        disabled={!active}
        onClick={() => {
          if (!active) return;
          systemAudio.questComplete();
          onComplete();
        }}
        aria-label={step.completed ? `${step.name} completed` : `Complete ${step.name}`}
        className={cn(
          "shrink-0 transition-colors",
          step.completed ? "text-progress" : active ? "text-subtle hover:text-signal" : "text-subtle/40",
        )}
      >
        {step.completed ? <CheckCircle2 size={20} /> : <Circle size={20} />}
      </button>
      <div className="min-w-0 flex-1">
        <div className={cn("truncate text-sm font-medium", step.completed && "text-muted-foreground line-through", !step.dueToday && "text-muted-foreground")}>
          {step.name}
        </div>
        <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
          <span>{describeSchedule(step.schedule)}</span>
          {!step.dueToday && !step.completed && (
            <>
              <span>·</span>
              <span>Not due today</span>
            </>
          )}
        </div>
      </div>
      <div className="flex shrink-0 items-center gap-2">
        <span className="rounded-full bg-surface-2 px-2 py-0.5 font-mono text-[10px] text-muted-foreground">
          {QUEST_CATEGORY_LABELS[step.category]}
        </span>
        <span className="font-mono text-xs font-semibold text-signal">+{step.exp}</span>
        <button
          type="button"
          onClick={onEdit}
          aria-label={`Edit ${step.name}`}
          className="text-muted-foreground transition-colors hover:text-signal"
        >
          <Pencil size={13} />
        </button>
        <button
          type="button"
          onClick={onDelete}
          aria-label={`Delete ${step.name}`}
          className="text-muted-foreground transition-colors hover:text-destructive"
        >
          <Trash2 size={14} />
        </button>
      </div>
    </div>
  );
}

/** One routine's card: header (rename/delete) plus its steps, due-today ones actionable. */
export function RoutineCard({ routine, onComplete, onEditStep, onDeleteStep, onAddStep, onRename, onDelete }: RoutineCardProps) {
  const [renameOpen, setRenameOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const dueCount = routine.steps.filter((s) => s.dueToday).length;
  const doneCount = routine.steps.filter((s) => s.dueToday && s.completed).length;

  return (
    <div className="hud-panel rounded-[var(--radius)] p-5">
      <div className="mb-3 flex items-center justify-between gap-3">
        <button
          type="button"
          onClick={() => {
            systemAudio.click();
            setRenameOpen(true);
          }}
          className="flex items-center gap-1.5 font-display text-[17px] font-semibold hud-glow-text transition-opacity hover:opacity-80"
        >
          {routine.name}
          <Pencil size={12} className="text-muted-foreground" />
        </button>
        <div className="flex items-center gap-3">
          {dueCount > 0 && (
            <span className="font-mono text-[11px] text-muted-foreground">
              {doneCount}/{dueCount} today
            </span>
          )}
          <button
            type="button"
            onClick={() => setDeleteOpen(true)}
            aria-label={`Delete ${routine.name} routine`}
            className="text-muted-foreground transition-colors hover:text-destructive"
          >
            <Trash2 size={14} />
          </button>
          <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete &quot;{routine.name}&quot;?</AlertDialogTitle>
                <AlertDialogDescription>
                  This removes the routine and all {routine.steps.length} of its steps. This can&apos;t be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction variant="destructive" onClick={onDelete}>
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>

      {routine.steps.length === 0 ? (
        <p className="mb-3 text-xs text-muted-foreground">No steps yet.</p>
      ) : (
        <div className="flex flex-col gap-2">
          {routine.steps.map((step) => (
            <StepRow
              key={step.id}
              step={step}
              onComplete={() => onComplete(step.id)}
              onEdit={() => onEditStep(step)}
              onDelete={() => onDeleteStep(step.id)}
            />
          ))}
        </div>
      )}

      <button
        type="button"
        onClick={() => {
          systemAudio.click();
          onAddStep();
        }}
        className="mt-3 flex items-center gap-1.5 rounded-md border border-dashed border-border px-3 py-1.5 font-mono text-xs text-muted-foreground transition-colors hover:border-signal/40 hover:text-signal"
      >
        <Plus size={13} />
        New step
      </button>

      <RoutineNameDialog open={renameOpen} onOpenChange={setRenameOpen} initialName={routine.name} onSave={onRename} />
    </div>
  );
}
