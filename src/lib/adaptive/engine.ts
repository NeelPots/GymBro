/**
 * Adaptive Training Engine
 * ------------------------
 * Rule-based v1. This is deliberately NOT a black box: every adjustment
 * it makes is explainable in one sentence, because the user needs to
 * trust and understand why their plan changed, not just accept it.
 *
 * How it thinks about each movement (e.g. "pull-ups", "pistol squats"):
 *   1. Look at the last N sessions for that movement.
 *   2. Compute completion rate (did they hit the prescribed reps/sets?)
 *      and average RPE (how hard it felt, 1-10).
 *   3. Compare against target zones to decide: progress, hold, or deload.
 *
 * This module has zero DOM/network dependencies - it's pure logic so it
 * can be unit-tested and later swapped for a trained model without
 * touching the UI or the data-fetching layer.
 */

export interface SessionEntry {
  date: string;
  targetReps: number;
  targetSets: number;
  completedReps: number;
  completedSets: number;
  rpe: number;
}

export interface MovementParams {
  reps: number;
  sets: number;
  difficultyTier: number;
}

export type AdaptiveAction = "progress" | "hold" | "deload";

export interface EvaluationResult {
  action: AdaptiveAction;
  reason: string;
  newParams: MovementParams;
}

// Tunable thresholds - the "coaching philosophy" lives here
export const CONFIG = {
  lookbackSessions: 3, // how many recent sessions inform a decision
  completionThresholdHigh: 0.9, // >=90% completion + low RPE = ready to progress
  completionThresholdLow: 0.6, // <60% completion = plan is too hard right now
  rpeCeiling: 8.5, // consistently above this = overreaching
  rpeFloor: 5, // consistently below this = plan is too easy
  minSessionsBeforeAdjust: 2, // don't overreact to a single session
} as const;

const REP_CAP = 15;
const SET_CAP = 5;

function average(arr: number[]): number {
  if (arr.length === 0) return 0;
  return arr.reduce((a, b) => a + b, 0) / arr.length;
}

function progressParams(params: MovementParams): MovementParams {
  // Simple linear progression: add reps first, then a set once reps cap out,
  // then bump difficulty tier once both are maxed (e.g. knee push-up -> push-up)
  if (params.reps < REP_CAP) {
    return { ...params, reps: params.reps + 1 };
  }
  if (params.sets < SET_CAP) {
    return { ...params, sets: params.sets + 1, reps: Math.max(6, params.reps - 4) };
  }
  return {
    ...params,
    difficultyTier: params.difficultyTier + 1,
    reps: 6,
    sets: 3,
  };
}

function deloadParams(params: MovementParams): MovementParams {
  // Pull back reps by ~20%, floor at a sane minimum. Don't drop difficulty
  // tier automatically - that's a bigger call the user should confirm.
  const reducedReps = Math.max(4, Math.round(params.reps * 0.8));
  return { ...params, reps: reducedReps };
}

/**
 * Given the history of logged sessions for one movement, decide what
 * should happen to it next session.
 */
export function evaluateMovement(
  history: SessionEntry[],
  currentParams: MovementParams,
): EvaluationResult {
  const recent = history.slice(-CONFIG.lookbackSessions);

  if (recent.length < CONFIG.minSessionsBeforeAdjust) {
    return {
      action: "hold",
      reason: "Not enough recent sessions yet to adjust confidently.",
      newParams: { ...currentParams },
    };
  }

  const completionRates = recent.map(
    (s) => (s.completedReps * s.completedSets) / (s.targetReps * s.targetSets),
  );
  const avgCompletion = average(completionRates);
  const avgRpe = average(recent.map((s) => s.rpe));

  // Overreaching: high completion but also consistently very hard -> hold, don't push further yet
  if (avgCompletion >= CONFIG.completionThresholdHigh && avgRpe > CONFIG.rpeCeiling) {
    return {
      action: "hold",
      reason: `You're completing sessions but RPE has averaged ${avgRpe.toFixed(1)}/10 — that's near your limit. Holding steady so this doesn't turn into burnout.`,
      newParams: { ...currentParams },
    };
  }

  // Clear progression signal: high completion, comfortable effort
  if (avgCompletion >= CONFIG.completionThresholdHigh && avgRpe <= CONFIG.rpeCeiling) {
    return {
      action: "progress",
      reason: `${Math.round(avgCompletion * 100)}% completion at RPE ${avgRpe.toFixed(1)}/10 over your last ${recent.length} sessions — you're ahead of the plan. Increasing difficulty.`,
      newParams: progressParams(currentParams),
    };
  }

  // Struggling: low completion or effort consistently maxed out
  if (avgCompletion < CONFIG.completionThresholdLow || avgRpe > CONFIG.rpeCeiling) {
    return {
      action: "deload",
      reason: `Completion has averaged ${Math.round(avgCompletion * 100)}% over your last ${recent.length} sessions — the plan's outpacing where you're at. Scaling back so you can rebuild consistency.`,
      newParams: deloadParams(currentParams),
    };
  }

  // Middle ground: consistent but not clearly ready either way
  return {
    action: "hold",
    reason: `Solid, steady sessions (${Math.round(avgCompletion * 100)}% completion, RPE ${avgRpe.toFixed(1)}/10). Staying at this level a bit longer to build a base before progressing.`,
    newParams: { ...currentParams },
  };
}

/**
 * Weekly summary across all tracked movements - powers the dashboard's
 * "signal" view.
 */
export function summarizeWeek(
  allMovementHistories: Record<string, SessionEntry[]>,
  allCurrentParams: Record<string, MovementParams>,
): Record<string, EvaluationResult> {
  const results: Record<string, EvaluationResult> = {};
  for (const movement in allMovementHistories) {
    results[movement] = evaluateMovement(
      allMovementHistories[movement],
      allCurrentParams[movement],
    );
  }
  return results;
}
