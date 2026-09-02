import "server-only";
import { getAIProvider, isAIConfigured } from "./provider";
import type { GeneratedRoutineStep, GeneratedStepCategory, GenerateRoutineOutput } from "./types";

export interface GenerateRoutineRequest {
  name: string;
  prompt: string;
}

export class AINotConfiguredError extends Error {}
export class NoValidStepsError extends Error {}

const VALID_CATEGORIES: GeneratedStepCategory[] = ["fitness", "care", "nutrition", "work"];

/** Clamps/sanitizes one AI-returned step - defensive even though the tool schema already constrains shape, since values (ranges, dedup) aren't schema-enforceable. */
function sanitizeStep(step: GeneratedRoutineStep): GeneratedRoutineStep | null {
  if (typeof step.name !== "string" || step.name.trim().length === 0) return null;
  if (!VALID_CATEGORIES.includes(step.category)) return null;

  const exp = Math.max(10, Math.min(200, Math.round(step.exp)));

  if (step.schedule.kind === "weekdays") {
    const weekdays = [...new Set((step.schedule.weekdays ?? []).filter((d) => d >= 0 && d <= 6))].sort((a, b) => a - b);
    if (weekdays.length === 0) return { ...step, name: step.name.trim(), exp, schedule: { kind: "daily" } };
    return { ...step, name: step.name.trim(), exp, schedule: { kind: "weekdays", weekdays } };
  }

  if (step.schedule.kind === "interval") {
    const intervalDays = Math.max(2, Math.min(14, Math.round(step.schedule.intervalDays ?? 3)));
    return { ...step, name: step.name.trim(), exp, schedule: { kind: "interval", intervalDays } };
  }

  return { ...step, name: step.name.trim(), exp, schedule: { kind: "daily" } };
}

export async function generateRoutine(request: GenerateRoutineRequest): Promise<GenerateRoutineOutput> {
  if (!isAIConfigured()) {
    throw new AINotConfiguredError(
      "The AI provider isn't configured yet - add ANTHROPIC_API_KEY to .env.local to enable this.",
    );
  }

  const provider = getAIProvider();
  const output = await provider.generateRoutine(request);

  const steps = output.steps.map(sanitizeStep).filter((s): s is GeneratedRoutineStep => s !== null);
  if (steps.length === 0) {
    throw new NoValidStepsError("The AI didn't return any usable steps - try describing the routine differently.");
  }

  return { steps };
}
