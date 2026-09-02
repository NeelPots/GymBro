"use client";

import { useState } from "react";
import { CheckCircle2, Circle, Plus, Trash2 } from "lucide-react";
import { QUEST_CATEGORY_LABELS, type QuestCategory } from "@/lib/gamification/quests";
import { QuestCreatorDialog } from "@/components/gamification/QuestCreatorDialog";
import { EmergencyTrigger } from "@/components/gamification/EmergencyTrigger";
import { Countdown, nextMidnightIso } from "@/components/gamification/Countdown";
import { systemAudio } from "@/lib/gamification/audio";
import { cn } from "@/lib/utils";
import { useQuest } from "@/components/gamification/QuestProvider";

interface QuestRowProps {
  id: string;
  name: string;
  description?: string;
  exp: number;
  category: QuestCategory;
  completed: boolean;
  onComplete: (id: string) => void;
  onDelete?: (id: string) => void;
}

function QuestRow({ id, name, description, exp, category, completed, onComplete, onDelete }: QuestRowProps) {
  return (
    <div
      className={cn(
        "flex items-center gap-3 rounded-md border px-3 py-2.5 transition-colors",
        completed ? "border-progress/40 bg-progress/10" : "border-border bg-background/30",
      )}
    >
      <button
        type="button"
        disabled={completed}
        onClick={() => {
          if (completed) return;
          systemAudio.questComplete();
          onComplete(id);
        }}
        aria-label={completed ? `${name} completed` : `Complete ${name}`}
        className={cn(
          "shrink-0 transition-colors",
          completed ? "text-progress" : "text-subtle hover:text-signal",
        )}
      >
        {completed ? <CheckCircle2 size={20} /> : <Circle size={20} />}
      </button>
      <div className="min-w-0 flex-1">
        <div className={cn("truncate text-sm font-medium", completed && "text-muted-foreground line-through")}>{name}</div>
        {description && <div className="truncate text-[11px] text-muted-foreground">{description}</div>}
      </div>
      <div className="flex shrink-0 items-center gap-2">
        <span className="rounded-full bg-surface-2 px-2 py-0.5 font-mono text-[10px] text-muted-foreground">
          {QUEST_CATEGORY_LABELS[category]}
        </span>
        <span className="font-mono text-xs font-semibold text-signal">+{exp}</span>
        {onDelete && (
          <button
            type="button"
            onClick={() => onDelete(id)}
            aria-label={`Delete ${name}`}
            className="text-muted-foreground transition-colors hover:text-destructive"
          >
            <Trash2 size={14} />
          </button>
        )}
      </div>
    </div>
  );
}

/** Daily quest tracker: the five pre-loaded mandatory quests plus any custom ones. */
export function QuestPanel() {
  const quest = useQuest();
  const [creatorOpen, setCreatorOpen] = useState(false);

  return (
    <div className="hud-panel rounded-[var(--radius)] p-5">
      <div className="mb-3 flex items-center justify-between gap-3">
        <h2 className="font-display text-[17px] font-semibold hud-glow-text">Daily Quests</h2>
        <span className="font-mono text-[11px] text-muted-foreground">
          Reset in <Countdown targetIso={nextMidnightIso()} className="text-signal" />
        </span>
      </div>

      <div className="flex flex-col gap-2">
        {quest.defaultQuests.map((q) => (
          <QuestRow
            key={q.id}
            id={q.id}
            name={q.name}
            description={q.description}
            exp={q.exp}
            category={q.category}
            completed={q.completed}
            onComplete={quest.completeQuest}
          />
        ))}
        {quest.customQuests.map((q) => (
          <QuestRow
            key={q.id}
            id={q.id}
            name={q.name}
            exp={q.exp}
            category={q.category}
            completed={q.completed}
            onComplete={quest.completeQuest}
            onDelete={quest.deleteCustomQuest}
          />
        ))}
      </div>

      <div className="mt-3 flex items-center justify-between gap-3">
        <button
          type="button"
          onClick={() => {
            systemAudio.click();
            setCreatorOpen(true);
          }}
          className="flex items-center gap-1.5 rounded-md border border-dashed border-border px-3 py-1.5 font-mono text-xs text-muted-foreground transition-colors hover:border-signal/40 hover:text-signal"
        >
          <Plus size={13} />
          New quest
        </button>
        <EmergencyTrigger disabled={quest.emergencyPenalty !== null} onTrigger={quest.triggerEmergencyPenalty} />
      </div>

      <QuestCreatorDialog
        open={creatorOpen}
        onOpenChange={setCreatorOpen}
        onCreate={quest.createCustomQuest}
      />
    </div>
  );
}
