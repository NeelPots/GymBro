export type GoalType = "build_strength" | "lose_fat" | "gain_muscle" | "stay_lean" | "custom";
export type ExperienceLevel = "beginner" | "intermediate" | "advanced";

export interface CandidateExercise {
  id: string;
  name: string;
  category: string;
  description: string | null;
}

export interface GenerateProgramInput {
  goalType: GoalType;
  customPrompt?: string;
  experienceLevel?: ExperienceLevel;
  sessionsPerWeek?: number;
  candidateExercises: CandidateExercise[];
}

export interface GeneratedProgramExercise {
  exerciseId: string;
  orderIndex: number;
  targetReps: number;
  targetSets: number;
  note?: string;
}

export interface GenerateProgramOutput {
  title: string;
  rationale: string;
  exercises: GeneratedProgramExercise[];
}

export interface AIProvider {
  generateProgram(input: GenerateProgramInput): Promise<GenerateProgramOutput>;
}
