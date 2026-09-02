"use client";

import { useState } from "react";
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
import { QUEST_CATEGORY_LABELS, type QuestCategory } from "@/lib/gamification/quests";
import { STAT_LABELS, type Stats } from "@/lib/gamification/stats";
import { cn } from "@/lib/utils";
import { systemAudio } from "@/lib/gamification/audio";

interface QuestCreatorDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreate: (name: string, exp: number, category: QuestCategory, statReward: keyof Stats) => void;
}

const CATEGORY_STAT: Record<QuestCategory, keyof Stats> = {
  fitness: "str",
  care: "vit",
  nutrition: "vit",
  work: "int",
};

/** "Custom Quest Architect" - add a self-defined daily quest with an EXP value and category tag. */
export function QuestCreatorDialog({ open, onOpenChange, onCreate }: QuestCreatorDialogProps) {
  const [name, setName] = useState("");
  const [exp, setExp] = useState(50);
  const [category, setCategory] = useState<QuestCategory>("fitness");

  function reset() {
    setName("");
    setExp(50);
    setCategory("fitness");
  }

  return (
    <Sheet
      open={open}
      onOpenChange={(next) => {
        if (!next) reset();
        onOpenChange(next);
      }}
    >
      <SheetContent side="bottom" className="mx-auto max-w-xl rounded-t-2xl border-t border-signal/25 bg-surface-2 px-5 pt-2 pb-8 hud-panel">
        <SheetHeader className="px-0">
          <SheetTitle className="font-display text-lg">New Quest</SheetTitle>
        </SheetHeader>

        <div className="flex flex-col gap-4 px-0">
          <div>
            <Label htmlFor="quest-name" className="mb-2 block text-xs uppercase tracking-wide text-muted-foreground">
              Objective
            </Label>
            <Input
              id="quest-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Read for 20 minutes"
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
            <Label htmlFor="quest-exp" className="mb-2 block text-xs uppercase tracking-wide text-muted-foreground">
              EXP value
            </Label>
            <div className="flex items-center gap-3">
              <Input
                id="quest-exp"
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
        </div>

        <SheetFooter className="flex-row gap-2.5 px-0">
          <Button variant="secondary" className="flex-1" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            className="flex-1"
            disabled={name.trim().length === 0}
            onClick={() => {
              systemAudio.click();
              onCreate(name.trim(), exp, category, CATEGORY_STAT[category]);
              reset();
              onOpenChange(false);
            }}
          >
            Add quest
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
