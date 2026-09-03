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

export interface GenerateRoutineInput {
  name: string;
  prompt: string;
}

export type GeneratedScheduleKind = "daily" | "weekdays" | "interval" | "cycle";

export interface GeneratedSchedule {
  kind: GeneratedScheduleKind;
  /** 0 = Sunday .. 6 = Saturday. Only meaningful when kind === "weekdays". */
  weekdays?: number[];
  /** Days since last completion before it's due again. Only meaningful when kind === "interval". */
  intervalDays?: number;
  /** Consecutive "on" days per rotation. Only meaningful when kind === "cycle". */
  onDays?: number;
  /** Consecutive "off"/rest days per rotation. Only meaningful when kind === "cycle". */
  offDays?: number;
}

export type GeneratedStepCategory = "fitness" | "care" | "nutrition" | "work";

export interface GeneratedRoutineStep {
  name: string;
  category: GeneratedStepCategory;
  exp: number;
  schedule: GeneratedSchedule;
}

export interface GenerateRoutineOutput {
  steps: GeneratedRoutineStep[];
}

export interface AIProvider {
  generateProgram(input: GenerateProgramInput): Promise<GenerateProgramOutput>;
  generateRoutine(input: GenerateRoutineInput): Promise<GenerateRoutineOutput>;
}
