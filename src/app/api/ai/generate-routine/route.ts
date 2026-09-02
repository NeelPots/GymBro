import { NextResponse } from "next/server";
import {
  AINotConfiguredError,
  NoValidStepsError,
  generateRoutine,
  type GenerateRoutineRequest,
} from "@/services/ai/generateRoutine";

// See generate-program/route.ts - a full structured response from Claude can
// take longer than Vercel's default serverless timeout (10s on Hobby).
export const maxDuration = 60;

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  if (!body || typeof body.name !== "string" || typeof body.prompt !== "string") {
    return NextResponse.json({ error: "Missing name or prompt" }, { status: 400 });
  }
  if (body.name.trim().length === 0 || body.prompt.trim().length === 0) {
    return NextResponse.json({ error: "Name and prompt can't be empty" }, { status: 400 });
  }

  const payload: GenerateRoutineRequest = { name: body.name, prompt: body.prompt };

  try {
    const routine = await generateRoutine(payload);
    return NextResponse.json(routine);
  } catch (error) {
    if (error instanceof AINotConfiguredError) {
      return NextResponse.json({ error: error.message }, { status: 503 });
    }
    if (error instanceof NoValidStepsError) {
      return NextResponse.json({ error: error.message }, { status: 502 });
    }
    console.error("generate-routine failed:", error);
    const detail = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ error: `Failed to generate a routine: ${detail}` }, { status: 500 });
  }
}
