import { NextResponse } from "next/server";
import {
  AINotConfiguredError,
  NoValidExercisesError,
  generateProgram,
  type GenerateProgramRequest,
} from "@/services/ai/generateProgram";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  if (!body || typeof body.goalType !== "string") {
    return NextResponse.json({ error: "Missing goalType" }, { status: 400 });
  }

  const payload: GenerateProgramRequest = {
    goalType: body.goalType,
    customPrompt: typeof body.customPrompt === "string" ? body.customPrompt : undefined,
    experienceLevel: typeof body.experienceLevel === "string" ? body.experienceLevel : undefined,
    sessionsPerWeek: typeof body.sessionsPerWeek === "number" ? body.sessionsPerWeek : undefined,
  };

  try {
    const program = await generateProgram(payload);
    return NextResponse.json(program);
  } catch (error) {
    if (error instanceof AINotConfiguredError) {
      return NextResponse.json({ error: error.message }, { status: 503 });
    }
    if (error instanceof NoValidExercisesError) {
      return NextResponse.json({ error: error.message }, { status: 502 });
    }
    console.error("generate-program failed:", error);
    return NextResponse.json({ error: "Failed to generate a program. Please try again." }, { status: 500 });
  }
}
