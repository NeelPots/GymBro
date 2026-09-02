"use client";

import { useEffect, useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { NumberStepper } from "@/components/shared/NumberStepper";
import { CATEGORY_STAT, QUEST_CATEGORY_LABELS, type QuestCategory } from "@/lib/gamification/quests";
import { STAT_LABELS, type Stats } from "@/lib/gamification/stats";
import type { RoutineStep } from "@/lib/gamification/routines";
import type { ScheduleKind, Schedule } from "@/lib/gamification/routines";
import { cn } from "@/lib/utils";
import { systemAudio } from "@/lib/gamification/audio";

interface StepEditorDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Present when editing an existing step; absent when creating a new one. */
  step?: RoutineStep | null;
  onSave: (name: string, exp: number, category: QuestCategory, statReward: keyof Stats, schedule: Schedule) => void;
}

const WEEKDAYS: { value: number; label: string }[] = [
  { value: 0, label: "Sun" },
  { value: 1, label: "Mon" },
  { value: 2, label: "Tue" },
  { value: 3, label: "Wed" },
  { value: 4, label: "Thu" },
  { value: 5, label: "Fri" },
  { value: 6, label: "Sat" },
];

const SCHEDULE_KINDS: { value: ScheduleKind; label: string }[] = [
  { value: "daily", label: "Daily" },
  { value: "weekdays", label: "Specific days" },
  { value: "interval", label: "Every N days" },
];

/** Add/edit a routine step: name, category, EXP, and a schedule (daily / specific weekdays / every N days). */
export function StepEditorDialog({ open, onOpenChange, step, onSave }: StepEditorDialogProps) {
  const isEditing = step != null;
  const [name, setName] = useState("");
  const [exp, setExp] = useState(50);
  const [category, setCategory] = useState<QuestCategory>("fitness");
  const [scheduleKind, setScheduleKind] = useState<ScheduleKind>("daily");
  const [weekdays, setWeekdays] = useState<number[]>([1, 3, 5]);
  const [intervalDays, setIntervalDays] = useState(3);

  useEffect(() => {
    if (!open) return;
    /* eslint-disable react-hooks/set-state-in-effect -- resetting the whole form to the step being edited (or blank) on open */
    if (step) {
      setName(step.name);
      setExp(step.exp);
      setCategory(step.category);
      setScheduleKind(step.schedule.kind);
      setWeekdays(step.schedule.weekdays ?? [1, 3, 5]);
      setIntervalDays(step.schedule.intervalDays ?? 3);
    } else {
      setName("");
      setExp(50);
      setCategory("fitness");
      setScheduleKind("daily");
      setWeekdays([1, 3, 5]);
      setIntervalDays(3);
    }
    /* eslint-enable react-hooks/set-state-in-effect */
  }, [open, step]);

  function toggleWeekday(day: number) {
    setWeekdays((prev) => (prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day].sort((a, b) => a - b)));
  }

  function buildSchedule(): Schedule {
    if (scheduleKind === "weekdays") return { kind: "weekdays", weekdays };
    if (scheduleKind === "interval") return { kind: "interval", intervalDays: Math.max(2, Math.min(14, intervalDays)) };
    return { kind: "daily" };
  }

  const canSave = name.trim().length > 0 && (scheduleKind !== "weekdays" || weekdays.length > 0);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="mx-auto max-h-[88vh] max-w-xl overflow-y-auto rounded-t-2xl border-t border-signal/25 bg-surface-2 px-5 pt-2 pb-8 hud-panel">
        <SheetHeader className="px-0">
          <SheetTitle className="font-display text-lg">{isEditing ? "Edit Quest" : "New Quest"}</SheetTitle>
        </SheetHeader>

        <div className="flex flex-col gap-4 px-0">
          <div>
            <Label htmlFor="step-name" className="mb-2 block text-xs uppercase tracking-wide text-muted-foreground">
              Objective
            </Label>
            <Input
              id="step-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Shampoo hair"
              maxLength={60}
            />
          </div>

          <div>
            <Label className="mb-2 block text-xs uppercase tracking-wide text-muted-foreground">Category</Label>
            <div className="grid grid-cols-2 gap-2">
              {(Object.keys(QUEST_CATEGORY_LABELS) as QuestCategory[]).map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setCategory(c)}
                  className={cn(
                    "rounded-md border px-3 py-2 text-left font-mono text-xs transition-colors",
                    category === c ? "border-signal/50 bg-signal/10 text-signal" : "border-border text-muted-foreground hover:text-foreground",
                  )}
                >
                  {QUEST_CATEGORY_LABELS[c]}
                  <span className="ml-1 text-[10px] text-muted-foreground">+{STAT_LABELS[CATEGORY_STAT[c]]}</span>
                </button>
              ))}
            </div>
          </div>

          <div>
            <Label htmlFor="step-exp" className="mb-2 block text-xs uppercase tracking-wide text-muted-foreground">
              EXP value
            </Label>
            <div className="flex items-center gap-3">
              <Input
                id="step-exp"
                type="number"
                min={5}
                max={500}
                step={5}
                value={exp}
                onChange={(e) => setExp(Math.max(5, Math.min(500, Number(e.target.value) || 0)))}
                className="w-28"
              />
              <span className="font-mono text-xs text-muted-foreground">EXP</span>
            </div>
          </div>

          <div>
            <Label className="mb-2 block text-xs uppercase tracking-wide text-muted-foreground">Schedule</Label>
            <div className="grid grid-cols-3 gap-2">
              {SCHEDULE_KINDS.map((s) => (
                <button
                  key={s.value}
                  type="button"
                  onClick={() => setScheduleKind(s.value)}
                  className={cn(
                    "rounded-md border px-2 py-2 text-center font-mono text-[11px] transition-colors",
                    scheduleKind === s.value ? "border-signal/50 bg-signal/10 text-signal" : "border-border text-muted-foreground hover:text-foreground",
                  )}
                >
                  {s.label}
                </button>
              ))}
            </div>

            {scheduleKind === "weekdays" && (
              <div className="mt-2.5 flex flex-wrap gap-1.5">
                {WEEKDAYS.map((d) => (
                  <button
                    key={d.value}
                    type="button"
                    onClick={() => toggleWeekday(d.value)}
                    className={cn(
                      "flex-1 rounded-md border px-2 py-1.5 text-center font-mono text-[11px] transition-colors",
                      weekdays.includes(d.value) ? "border-signal/50 bg-signal/10 text-signal" : "border-border text-muted-foreground hover:text-foreground",
                    )}
                  >
                    {d.label}
                  </button>
                ))}
              </div>
            )}

            {scheduleKind === "interval" && (
              <div className="mt-2.5 flex items-center gap-3">
                <span className="font-mono text-xs text-muted-foreground">Every</span>
                <div className="w-32">
                  <NumberStepper value={intervalDays} onChange={(v) => setIntervalDays(Math.max(2, Math.min(14, v)))} min={2} />
                </div>
                <span className="font-mono text-xs text-muted-foreground">days</span>
              </div>
            )}
          </div>
        </div>

        <SheetFooter className="flex-row gap-2.5 px-0">
          <Button variant="secondary" className="flex-1" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            className="flex-1"
            disabled={!canSave}
            onClick={() => {
              systemAudio.click();
              onSave(name.trim(), exp, category, CATEGORY_STAT[category], buildSchedule());
              onOpenChange(false);
            }}
          >
            {isEditing ? "Save changes" : "Add quest"}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
