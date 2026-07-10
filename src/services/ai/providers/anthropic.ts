import "server-only";
import Anthropic from "@anthropic-ai/sdk";
import type { AIProvider, GenerateProgramInput, GenerateProgramOutput, GoalType } from "../types";

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
}
