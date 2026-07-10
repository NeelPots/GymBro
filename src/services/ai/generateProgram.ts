import "server-only";
import { getExercises } from "@/services/movements/getExercises";
import { getAIProvider, isAIConfigured } from "./provider";
import { validateProgramExercises } from "./validateProgramExercises";
import type { ExperienceLevel, GenerateProgramOutput, GoalType } from "./types";

export interface GenerateProgramRequest {
  goalType: GoalType;
  customPrompt?: string;
  experienceLevel?: ExperienceLevel;
  sessionsPerWeek?: number;
}

export class AINotConfiguredError extends Error {}
export class NoValidExercisesError extends Error {}

export async function generateProgram(request: GenerateProgramRequest): Promise<GenerateProgramOutput> {
  if (!isAIConfigured()) {
    throw new AINotConfiguredError(
      "The AI provider isn't configured yet - add ANTHROPIC_API_KEY to .env.local to enable this.",
    );
  }

  const candidates = await getExercises();
  const candidateIds = new Set(candidates.map((c) => c.id));

  const provider = getAIProvider();
  const output = await provider.generateProgram({
    ...request,
    candidateExercises: candidates.map((c) => ({
      id: c.id,
      name: c.name,
      category: c.category,
      description: c.description,
    })),
  });

  const exercises = validateProgramExercises(output.exercises, candidateIds);
  if (exercises.length === 0) {
    throw new NoValidExercisesError("The AI didn't return any exercises that match the library - try again.");
  }

  return { ...output, exercises };
}
