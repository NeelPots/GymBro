"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { RoutineCard } from "@/components/gamification/RoutineCard";
import { StepEditorDialog } from "@/components/gamification/StepEditorDialog";
import { RoutineNameDialog } from "@/components/gamification/RoutineNameDialog";
import { EmergencyTrigger } from "@/components/gamification/EmergencyTrigger";
import { Countdown, nextMidnightIso } from "@/components/gamification/Countdown";
import { systemAudio } from "@/lib/gamification/audio";
import { useQuest } from "@/components/gamification/QuestProvider";
import type { StepWithState } from "@/hooks/useLocalQuest";

/** Routines of scheduled quests - each routine is its own card, steps due today are actionable. */
export function QuestPanel() {
  const quest = useQuest();
  const [routineDialogOpen, setRoutineDialogOpen] = useState(false);
  const [stepEditor, setStepEditor] = useState<{ routineId: string; step: StepWithState | null } | null>(null);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between gap-3">
        <h2 className="font-display text-[17px] font-semibold hud-glow-text">Routines</h2>
        <span className="font-mono text-[11px] text-muted-foreground">
          Reset in <Countdown targetIso={nextMidnightIso()} className="text-signal" />
        </span>
      </div>

      {quest.routines.map((routine) => (
        <RoutineCard
          key={routine.id}
          routine={routine}
          onComplete={quest.completeStep}
          onUncomplete={quest.uncompleteStep}
          onEditStep={(step) => setStepEditor({ routineId: routine.id, step })}
          onDeleteStep={quest.deleteStep}
          onAddStep={() => setStepEditor({ routineId: routine.id, step: null })}
          onRename={(name) => quest.renameRoutine(routine.id, name)}
          onDelete={() => quest.deleteRoutine(routine.id)}
          onToggleCollapsed={() => quest.toggleRoutineCollapsed(routine.id)}
        />
      ))}

      <div className="flex items-center justify-between gap-3">
        <button
          type="button"
          onClick={() => {
            systemAudio.click();
            setRoutineDialogOpen(true);
          }}
          className="flex items-center gap-1.5 rounded-md border border-dashed border-border px-3 py-1.5 font-mono text-xs text-muted-foreground transition-colors hover:border-signal/40 hover:text-signal"
        >
          <Plus size={13} />
          New routine
        </button>
        <EmergencyTrigger disabled={quest.emergencyPenalty !== null} onTrigger={quest.triggerEmergencyPenalty} />
      </div>

      <RoutineNameDialog
        open={routineDialogOpen}
        onOpenChange={setRoutineDialogOpen}
        onSave={(name) => quest.createRoutine(name)}
      />

      <StepEditorDialog
        open={stepEditor !== null}
        onOpenChange={(open) => !open && setStepEditor(null)}
        step={stepEditor?.step ?? null}
        onSave={(name, exp, category, statReward, schedule) => {
          if (!stepEditor) return;
          if (stepEditor.step) {
            quest.updateStep(stepEditor.step.id, { name, exp, category, statReward, schedule });
          } else {
            quest.createStep(stepEditor.routineId, name, exp, category, statReward, schedule);
          }
        }}
      />
    </div>
  );
}
