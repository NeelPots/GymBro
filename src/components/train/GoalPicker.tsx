"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { NumberStepper } from "@/components/shared/NumberStepper";
import { cn } from "@/lib/utils";
import type { LocalProgram } from "@/hooks/useLocalProgram";
import type { ExperienceLevel, GoalType } from "@/services/ai/types";

const GOALS: { value: GoalType; label: string }[] = [
  { value: "build_strength", label: "Build strength" },
  { value: "lose_fat", label: "Lose fat" },
  { value: "gain_muscle", label: "Gain muscle" },
  { value: "stay_lean", label: "Stay lean" },
  { value: "custom", label: "Custom" },
];

const EXPERIENCE_LEVELS: { value: ExperienceLevel; label: string }[] = [
  { value: "beginner", label: "Beginner" },
  { value: "intermediate", label: "Intermediate" },
  { value: "advanced", label: "Advanced" },
];

interface GoalPickerProps {
  onGenerated: (program: LocalProgram) => void;
}

export function GoalPicker({ onGenerated }: GoalPickerProps) {
  const [goalType, setGoalType] = useState<GoalType>("build_strength");
  const [customPrompt, setCustomPrompt] = useState("");
  const [experienceLevel, setExperienceLevel] = useState<ExperienceLevel>("intermediate");
  const [sessionsPerWeek, setSessionsPerWeek] = useState(4);
  const [isGenerating, setIsGenerating] = useState(false);

  async function handleGenerate() {
    if (goalType === "custom" && customPrompt.trim().length === 0) {
      toast.error("Describe what you want your program to focus on.");
      return;
    }

    const trimmedPrompt = customPrompt.trim();
    setIsGenerating(true);
    try {
      const res = await fetch("/api/ai/generate-program", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          goalType,
          customPrompt: trimmedPrompt.length > 0 ? trimmedPrompt : undefined,
          experienceLevel,
          sessionsPerWeek,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error ?? "Failed to generate a program.");
        return;
      }

      onGenerated({
        title: data.title,
        rationale: data.rationale,
        exercises: data.exercises,
        goalType,
        customPrompt: trimmedPrompt.length > 0 ? trimmedPrompt : undefined,
        experienceLevel,
        sessionsPerWeek,
        createdAt: new Date().toISOString(),
      });
    } catch {
      toast.error("Couldn't reach the AI service. Check your connection and try again.");
    } finally {
      setIsGenerating(false);
    }
  }

  return (
    <div className="flex flex-col gap-5 rounded-[var(--radius)] border border-border bg-surface p-5">
      <div>
        <Label className="mb-2.5 block text-xs uppercase tracking-wide text-muted-foreground">Goal</Label>
        <div className="flex flex-wrap gap-2">
          {GOALS.map((goal) => (
            <button
              key={goal.value}
              type="button"
              onClick={() => setGoalType(goal.value)}
              className={cn(
                "rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors",
                goalType === goal.value
                  ? "border-signal bg-signal/10 text-signal"
                  : "border-border text-muted-foreground hover:text-foreground",
              )}
            >
              {goal.label}
            </button>
          ))}
        </div>
      </div>

      <div>
        <Label className="mb-2 block text-xs uppercase tracking-wide text-muted-foreground">
          {goalType === "custom" ? "Describe what you want" : "Anything specific to add? (optional)"}
        </Label>
        <Textarea
          value={customPrompt}
          onChange={(e) => setCustomPrompt(e.target.value)}
          placeholder="e.g. focus on pulling strength, I have a pull-up bar and rings, 3 sessions a week"
          rows={3}
        />
      </div>

      <div>
        <Label className="mb-2.5 block text-xs uppercase tracking-wide text-muted-foreground">
          Experience level
        </Label>
        <div className="flex gap-2">
          {EXPERIENCE_LEVELS.map((level) => (
            <button
              key={level.value}
              type="button"
              onClick={() => setExperienceLevel(level.value)}
              className={cn(
                "flex-1 rounded-lg border px-3 py-1.5 text-sm font-medium transition-colors",
                experienceLevel === level.value
                  ? "border-signal bg-signal/10 text-signal"
                  : "border-border text-muted-foreground hover:text-foreground",
              )}
            >
              {level.label}
            </button>
          ))}
        </div>
      </div>

      <div>
        <Label className="mb-2 block text-xs uppercase tracking-wide text-muted-foreground">
          Sessions per week
        </Label>
        <NumberStepper value={sessionsPerWeek} onChange={setSessionsPerWeek} min={1} />
      </div>

      <Button onClick={handleGenerate} disabled={isGenerating}>
        {isGenerating ? "Generating…" : "Generate program"}
      </Button>
    </div>
  );
}
