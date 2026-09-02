import "server-only";
import Anthropic from "@anthropic-ai/sdk";
import type {
  AIProvider,
  GenerateProgramInput,
  GenerateProgramOutput,
  GenerateRoutineInput,
  GenerateRoutineOutput,
  GoalType,
} from "../types";

const MODEL = "claude-opus-4-8";

const GOAL_LABEL: Record<GoalType, string> = {
  build_strength: "Build strength",
  lose_fat: "Lose fat",
  gain_muscle: "Gain muscle",
  stay_lean: "Stay lean",
  custom: "Custom",
};

/**
 * Claude implementation of AIProvider. Forces the response through a
 * strict-schema tool call (tool_choice pinned to generate_program) rather
 * than parsing free text, so the shape is always valid - the candidate-ID
 * check that follows in generateProgram.ts is the only thing standing
 * between this and a hallucinated exercise.
 */
export class AnthropicProvider implements AIProvider {
  private client: Anthropic;

  constructor() {
    this.client = new Anthropic();
  }

  async generateProgram(input: GenerateProgramInput): Promise<GenerateProgramOutput> {
    const candidateList = input.candidateExercises
      .map((e) => `- id: ${e.id} | ${e.name} (${e.category})${e.description ? ` — ${e.description}` : ""}`)
      .join("\n");

    const userPrompt = `Goal: ${GOAL_LABEL[input.goalType]}
${input.customPrompt ? `Custom request: ${input.customPrompt}\n` : ""}Experience level: ${input.experienceLevel ?? "intermediate"}
Sessions per week: ${input.sessionsPerWeek ?? 4}

Candidate exercises (choose only from this list, referencing them by their exact id - never invent an id):
${candidateList}

Build a training program from these exercises.`;

    const response = await this.client.messages.create({
      model: MODEL,
      max_tokens: 4096,
      system:
        "You are the training-program-building component of a calisthenics coaching app. You MUST select exercises only from the candidate list provided in the user message, referencing them by their exact id - never invent an exercise or id that is not in the list. Tailor target reps/sets to the stated goal, experience level, and sessions per week. Write the rationale in the same plain-English, one-to-two-sentence explainable style the app's adaptive engine already uses for its own progress/hold/deload decisions.",
      tools: [
        {
          name: "generate_program",
          description:
            "Return a structured calisthenics training program composed only from the supplied candidate exercises.",
          strict: true,
          input_schema: {
            type: "object",
            properties: {
              title: { type: "string", description: "Short, motivating program title." },
              rationale: {
                type: "string",
                description: "1-2 plain-English sentences on why this program fits the stated goal.",
              },
              exercises: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    exerciseId: { type: "string", description: "Must exactly match a candidate exercise id." },
                    orderIndex: { type: "integer" },
                    targetReps: { type: "integer" },
                    targetSets: { type: "integer" },
                    note: { type: "string", description: "Optional short coaching note for this exercise." },
                  },
                  required: ["exerciseId", "orderIndex", "targetReps", "targetSets"],
                  additionalProperties: false,
                },
              },
            },
            required: ["title", "rationale", "exercises"],
            additionalProperties: false,
          },
        },
      ],
      tool_choice: { type: "tool", name: "generate_program" },
      messages: [{ role: "user", content: userPrompt }],
    });

    const toolUse = response.content.find(
      (block): block is Anthropic.ToolUseBlock => block.type === "tool_use",
    );
    if (!toolUse) {
      throw new Error("AI provider did not return a tool_use block");
    }

    return toolUse.input as GenerateProgramOutput;
  }

  async generateRoutine(input: GenerateRoutineInput): Promise<GenerateRoutineOutput> {
    const userPrompt = `Routine name: ${input.name}
User's description of what this routine should cover: ${input.prompt}

Break this down into individual scheduled steps.`;

    const response = await this.client.messages.create({
      model: MODEL,
      max_tokens: 2048,
      system:
        "You are the routine-building component of a general self-improvement/leveling-up app - it covers fitness, skin/grooming, nutrition, and focused work, not just workouts. Given a routine name and a free-text description, break it into a short list of concrete, individually-completable steps (typically 3-8). Each step needs: a short imperative name (e.g. \"Apply moisturizer\", \"Shampoo hair\", \"30 min deep work\"), a category (fitness/care/nutrition/work - pick whichever fits best, care covers skin/grooming/hygiene), an EXP value between 20 and 150 scaled to effort/time required, and a schedule. Use schedule kind \"daily\" for things that should happen every day, \"weekdays\" with specific weekday numbers (0=Sunday..6=Saturday) for things tied to certain days, or \"interval\" with intervalDays for things that recur every N days regardless of which weekday (e.g. \"wash hair every 3 days\"). Infer a sensible schedule from the description; default to daily if nothing suggests otherwise.",
      tools: [
        {
          name: "generate_routine",
          description: "Return a structured list of scheduled steps for a self-improvement routine.",
          strict: true,
          input_schema: {
            type: "object",
            properties: {
              steps: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    name: { type: "string", description: "Short imperative step name." },
                    category: { type: "string", enum: ["fitness", "care", "nutrition", "work"] },
                    exp: { type: "integer", description: "EXP value, 20-150." },
                    schedule: {
                      type: "object",
                      properties: {
                        kind: { type: "string", enum: ["daily", "weekdays", "interval"] },
                        weekdays: {
                          type: "array",
                          items: { type: "integer", description: "0=Sunday..6=Saturday." },
                          description: "Only when kind is weekdays - each entry 0=Sunday..6=Saturday.",
                        },
                        intervalDays: { type: "integer", description: "Only when kind is interval - days between occurrences." },
                      },
                      required: ["kind"],
                      additionalProperties: false,
                    },
                  },
                  required: ["name", "category", "exp", "schedule"],
                  additionalProperties: false,
                },
              },
            },
            required: ["steps"],
            additionalProperties: false,
          },
        },
      ],
      tool_choice: { type: "tool", name: "generate_routine" },
      messages: [{ role: "user", content: userPrompt }],
    });

    const toolUse = response.content.find(
      (block): block is Anthropic.ToolUseBlock => block.type === "tool_use",
    );
    if (!toolUse) {
      throw new Error("AI provider did not return a tool_use block");
    }

    return toolUse.input as GenerateRoutineOutput;
  }
}
