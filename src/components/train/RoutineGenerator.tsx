"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { CATEGORY_STAT, type QuestCategory } from "@/lib/gamification/quests";
import { useQuest } from "@/components/gamification/QuestProvider";
import type { GeneratedRoutineStep } from "@/services/ai/types";

/**
 * AI-generated routines - the general "leveling up" counterpart to the AI
 * workout program builder above. A user names a routine (Face Routine, Skin
 * Routine, whatever) and describes it in a sentence or two; the AI breaks it
 * into scheduled steps, then this hands them straight to the same routines
 * system the Home quest panel manages manually.
 */
export function RoutineGenerator() {
  const quest = useQuest();
  const [name, setName] = useState("");
  const [prompt, setPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  async function handleGenerate() {
    if (name.trim().length === 0) {
      toast.error("Give the routine a name.");
      return;
    }
    if (prompt.trim().length === 0) {
      toast.error("Describe what this routine should cover.");
      return;
    }

    setIsGenerating(true);
    try {
      const res = await fetch("/api/ai/generate-routine", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim(), prompt: prompt.trim() }),
      });

      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error ?? "Failed to generate a routine.");
        return;
      }

      const steps = (data.steps as GeneratedRoutineStep[]).map((s) => {
        const category = s.category as QuestCategory;
        return {
          name: s.name,
          exp: s.exp,
          category,
          statReward: CATEGORY_STAT[category],
          schedule: s.schedule,
        };
      });

      quest.createRoutineFromAI(name.trim(), steps);
      toast.success(`"${name.trim()}" created`, { description: `${steps.length} steps added - check Home to start them.` });
      setName("");
      setPrompt("");
    } catch {
      toast.error("Couldn't reach the AI service. Check your connection and try again.");
    } finally {
      setIsGenerating(false);
    }
  }

  return (
    <div className="flex flex-col gap-5 rounded-[var(--radius)] border border-border bg-surface p-5">
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Sparkles size={16} className="text-signal" />
        Describe a routine and the System will break it into scheduled steps.
      </div>

      <div>
        <Label htmlFor="routine-gen-name" className="mb-2 block text-xs uppercase tracking-wide text-muted-foreground">
          Routine name
        </Label>
        <Input
          id="routine-gen-name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. Face Routine"
          maxLength={40}
        />
      </div>

      <div>
        <Label htmlFor="routine-gen-prompt" className="mb-2 block text-xs uppercase tracking-wide text-muted-foreground">
          What does it cover?
        </Label>
        <Textarea
          id="routine-gen-prompt"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="e.g. Morning and night skincare, shampoo every 3 days, sunscreen daily"
          rows={3}
        />
      </div>

      <Button onClick={handleGenerate} disabled={isGenerating}>
        {isGenerating ? "Generating…" : "Generate routine"}
      </Button>
    </div>
  );
}
