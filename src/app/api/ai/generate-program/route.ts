import { NextResponse } from "next/server";
import {
  AINotConfiguredError,
  NoValidExercisesError,
  generateProgram,
  type GenerateProgramRequest,
} from "@/services/ai/generateProgram";

// A full structured program from Claude Opus can take longer than Vercel's
// default serverless timeout (10s on Hobby) - without this, a slow/complex
// request gets killed mid-call and surfaces as a generic 500 with no useful
// message. 60s is the practical ceiling on Hobby; raise it if upgraded.
export const maxDuration = 60;

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
    const detail = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ error: `Failed to generate a program: ${detail}` }, { status: 500 });
  }
}
