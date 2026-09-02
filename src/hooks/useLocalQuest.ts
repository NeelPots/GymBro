"use client";

import { useCallback, useEffect, useState } from "react";
import {
  levelFromXp,
  rankTitle,
  streakBonusXp,
  XP_PER_SESSION,
  XP_PROGRESS_BONUS,
  XP_REDEMPTION,
} from "@/lib/gamification/rank";
import { allocateStat, DEFAULT_STATS, pointsAwardedForLevels, type Stats } from "@/lib/gamification/stats";
import { DEFAULT_QUESTS, QUEST_BUFFS, type CustomQuest, type QuestCategory } from "@/lib/gamification/quests";
import {
  DAILY_SCHEDULE,
  isStepDueToday,
  type Routine,
  type RoutineStep,
  type Schedule,
} from "@/lib/gamification/routines";
import { activeBonusPct, milestonesReached, type UnlockedTitle } from "@/lib/gamification/titles";
import { effectiveStats as computeEffectiveStats, pruneExpired, totalXpMultiplierPct, type StatusEffect } from "@/lib/gamification/effects";
import {
  clampResource,
  HP_COST_PER_PENALTY,
  maxHp,
  maxStamina,
  RESOURCE_REGEN_PER_TICK,
  STAMINA_COST_PER_FITNESS_QUEST,
} from "@/lib/gamification/resources";
import { appendLog, type TerminalLogEntry } from "@/lib/gamification/log";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { getCurrentUserId, pullQuestState, pushQuestState } from "@/services/gamification/questSync";

const STORAGE_KEY = "adaptive-coach-quest-v2";
const LEGACY_STORAGE_KEY = "adaptive-coach-quest-v1";
const DAILY_ESSENTIALS_ROUTINE_ID = "daily-essentials";
const MIGRATED_CUSTOM_ROUTINE_ID = "custom";

const EMERGENCY_WINDOW_MS = 3 * 60 * 60 * 1000;
const DEBUFF_DURATION_MS = 24 * 60 * 60 * 1000;
const CLOUD_PUSH_DEBOUNCE_MS = 1_500;
const COINS_PER_QUEST = 10;
const GEMS_PER_LEVEL_UP = 1;
const GEMS_PER_TITLE_UNLOCK = 3;

/** Weighted toward running - it's the default Penalty Zone consequence, with a few non-running fallbacks for variety. */
const EMERGENCY_OBJECTIVES = [
  "Run 5km outside - no treadmill, no shortcuts.",
  "Run 3 miles at a steady pace.",
  "Run 30 minutes continuous, any pace, keep moving.",
  "Sprint 400m x 8, walk 1 minute to recover between each.",
  "Run 2km, then drop for 50 burpees.",
  "Run/walk 8000 steps outside within the window.",
  "200 Burpees, any pace, no time limit but no stopping long.",
  "100 Push-ups + 100 Squats, split however you need.",
];

export interface PenaltyRecord {
  id: string;
  missedDate: string;
  outcome: "completed" | "skipped";
  note?: string;
  resolvedAt: string;
}

export interface PendingPenalty {
  missedDate: string;
  createdAt: string;
}

export interface EmergencyPenalty {
  id: string;
  assignedAt: string;
  deadline: string;
  objective: string;
  manual: boolean;
}

export interface LevelUpEvent {
  id: string;
  level: number;
  rankTitle: string;
}

export interface StepWithState extends RoutineStep {
  completed: boolean;
  dueToday: boolean;
}

export interface RoutineWithSteps extends Routine {
  steps: StepWithState[];
}

export interface GeneratedStepInput {
  name: string;
  exp: number;
  category: QuestCategory;
  statReward: keyof Stats;
  schedule: Schedule;
}

interface QuestState {
  xp: number;
  lastStreakSeen: number;
  pendingPenalty: PendingPenalty | null;
  penaltyLog: PenaltyRecord[];
  stats: Stats;
  unallocatedPoints: number;
  routines: Routine[];
  steps: RoutineStep[];
  completedToday: string[];
  lastCompletedAt: Record<string, string>;
  lastQuestDate: string;
  titles: UnlockedTitle[];
  activeTitleId: string | null;
  effects: StatusEffect[];
  emergencyPenalty: EmergencyPenalty | null;
  log: TerminalLogEntry[];
  lastLevelUp: LevelUpEvent | null;
  hp: number;
  stamina: number;
  coins: number;
  gems: number;
  updatedAt: string;
}

function todayDateString(): string {
  return new Date().toISOString().slice(0, 10);
}

function yesterdayDateString(): string {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return d.toISOString().slice(0, 10);
}

function seedRoutinesAndSteps(): { routines: Routine[]; steps: RoutineStep[] } {
  const now = new Date().toISOString();
  return {
    routines: [{ id: DAILY_ESSENTIALS_ROUTINE_ID, name: "Daily Essentials", createdAt: now }],
    steps: DEFAULT_QUESTS.map((q) => ({
      id: q.id,
      routineId: DAILY_ESSENTIALS_ROUTINE_ID,
      name: q.name,
      description: q.description,
      exp: q.exp,
      category: q.category,
      statReward: q.statReward,
      schedule: DAILY_SCHEDULE,
      createdAt: now,
    })),
  };
}

function defaultState(): QuestState {
  const { routines, steps } = seedRoutinesAndSteps();
  return {
    xp: 0,
    lastStreakSeen: 0,
    pendingPenalty: null,
    penaltyLog: [],
    stats: DEFAULT_STATS,
    unallocatedPoints: 0,
    routines,
    steps,
    completedToday: [],
    lastCompletedAt: {},
    lastQuestDate: todayDateString(),
    titles: [],
    activeTitleId: null,
    effects: [],
    emergencyPenalty: null,
    log: [],
    lastLevelUp: null,
    hp: maxHp(1, DEFAULT_STATS),
    stamina: maxStamina(1, DEFAULT_STATS),
    coins: 0,
    gems: 0,
    updatedAt: new Date(0).toISOString(),
  };
}

/**
 * Pre-routines saves (v2, before this feature) had a flat `customQuests`
 * array and relied on the static `DEFAULT_QUESTS` for everything else. This
 * folds both into routines/steps once, keeping the original ids so
 * completedToday/streak/buff history carries over untouched.
 */
function migrateLegacyQuestsToRoutines(parsed: Record<string, unknown>): { routines: Routine[]; steps: RoutineStep[] } {
  const { routines, steps } = seedRoutinesAndSteps();
  const legacyCustom = (parsed.customQuests as CustomQuest[] | undefined) ?? [];

  if (legacyCustom.length > 0) {
    routines.push({ id: MIGRATED_CUSTOM_ROUTINE_ID, name: "Custom Quests", createdAt: new Date().toISOString() });
    for (const q of legacyCustom) {
      steps.push({
        id: q.id,
        routineId: MIGRATED_CUSTOM_ROUTINE_ID,
        name: q.name,
        exp: q.exp,
        category: q.category,
        statReward: q.statReward,
        schedule: DAILY_SCHEDULE,
        createdAt: q.createdAt,
      });
    }
  }

  return { routines, steps };
}

function loadQuest(): QuestState {
  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (raw) {
    try {
      const parsed = JSON.parse(raw) as Record<string, unknown>;
      if (!parsed.routines) {
        const { routines, steps } = migrateLegacyQuestsToRoutines(parsed);
        return { ...defaultState(), ...parsed, routines, steps, lastCompletedAt: {} } as QuestState;
      }
      return { ...defaultState(), ...(parsed as unknown as QuestState) };
    } catch {
      return defaultState();
    }
  }

  // Migrate v1 (xp/streak/penalty only, predates quests entirely) forward.
  const legacy = window.localStorage.getItem(LEGACY_STORAGE_KEY);
  if (legacy) {
    try {
      const parsed = JSON.parse(legacy) as Partial<QuestState>;
      return {
        ...defaultState(),
        xp: parsed.xp ?? 0,
        lastStreakSeen: parsed.lastStreakSeen ?? 0,
        pendingPenalty: parsed.pendingPenalty ?? null,
        penaltyLog: parsed.penaltyLog ?? [],
      };
    } catch {
      return defaultState();
    }
  }

  return defaultState();
}

/** Persists to localStorage with a fresh timestamp and returns the stamped state. */
function saveQuest(state: QuestState): QuestState {
  const stamped: QuestState = { ...state, updatedAt: new Date().toISOString() };
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(stamped));
  return stamped;
}

interface LevelUpResult {
  leveledUp: boolean;
  level: number;
  rankTitle: string;
  levelsGained: number;
}

function withLevelUp(beforeXp: number, afterXp: number): LevelUpResult {
  const before = levelFromXp(beforeXp).level;
  const after = levelFromXp(afterXp).level;
  return { leveledUp: after > before, level: after, rankTitle: rankTitle(after), levelsGained: after - before };
}

function xpMultiplierPct(state: QuestState, now: number): number {
  return activeBonusPct(state.titles, state.activeTitleId) + totalXpMultiplierPct(state.effects, now);
}

function applyXpGain(state: QuestState, baseAmount: number, now: number): { next: QuestState; gained: number; result: LevelUpResult } {
  const gained = Math.max(0, Math.round(baseAmount * (1 + xpMultiplierPct(state, now) / 100)));
  const nextXp = state.xp + gained;
  const result = withLevelUp(state.xp, nextXp);
  const gainedPoints = pointsAwardedForLevels(result.levelsGained);

  let log = state.log;
  let lastLevelUp = state.lastLevelUp;
  let gems = state.gems;
  if (result.leveledUp) {
    log = appendLog(log, `LEVEL UP! You are now Level ${result.level} - ${result.rankTitle}.`, "success");
    lastLevelUp = { id: crypto.randomUUID(), level: result.level, rankTitle: result.rankTitle };
    gems = state.gems + GEMS_PER_LEVEL_UP * result.levelsGained;
  }

  return {
    next: { ...state, xp: nextXp, unallocatedPoints: state.unallocatedPoints + gainedPoints, log, lastLevelUp, gems },
    gained,
    result,
  };
}

/** Restores HP/Stamina to (roughly) full and ticks them toward the current max each cycle. */
function regenResources(state: QuestState, now: number): QuestState {
  const level = levelFromXp(state.xp).level;
  const stats = computeEffectiveStats(state.stats, state.effects, now);
  return {
    ...state,
    hp: clampResource(state.hp + RESOURCE_REGEN_PER_TICK, maxHp(level, stats)),
    stamina: clampResource(state.stamina + RESOURCE_REGEN_PER_TICK, maxStamina(level, stats)),
  };
}

/** Applies the daily rollover (quest reset + missed-day emergency trigger) and expires stale effects/emergencies. */
function tick(state: QuestState, now: number = Date.now()): QuestState {
  let next = regenResources({ ...state, effects: pruneExpired(state.effects, now) }, now);

  if (next.emergencyPenalty && new Date(next.emergencyPenalty.deadline).getTime() <= now) {
    next = applyPenaltyDrain(next, now);
  }

  const today = todayDateString();
  if (next.lastQuestDate !== today) {
    // Only daily-schedule steps are "mandatory" for the Penalty Zone - a
    // step that's every-3-days or weekday-only is never due every single
    // day, so it can never fairly cause a penalty just because today wasn't
    // its day. (isStepDueToday still governs what shows as actionable in
    // the checklist; this is specifically about what's penalty-eligible.)
    const mandatorySteps = next.steps.filter((s) => s.schedule.kind === "daily");
    const allDone = mandatorySteps.length === 0 || mandatorySteps.every((s) => next.completedToday.includes(s.id));
    let log = appendLog(next.log, "SYSTEM: Daily reset. New quests assigned.", "info");
    let emergencyPenalty = next.emergencyPenalty;

    if (!allDone && !next.pendingPenalty && !emergencyPenalty) {
      emergencyPenalty = {
        id: crypto.randomUUID(),
        assignedAt: new Date(now).toISOString(),
        deadline: new Date(now + EMERGENCY_WINDOW_MS).toISOString(),
        objective: EMERGENCY_OBJECTIVES[Math.floor(Math.random() * EMERGENCY_OBJECTIVES.length)],
        manual: false,
      };
      log = appendLog(log, "WARNING: Daily quests incomplete. Penalty Quest assigned.", "danger");
    }

    const level = levelFromXp(next.xp).level;
    const stats = computeEffectiveStats(next.stats, next.effects, now);
    next = {
      ...next,
      completedToday: [],
      lastQuestDate: today,
      emergencyPenalty,
      log,
      hp: maxHp(level, stats),
      stamina: maxStamina(level, stats),
    };
  }

  return next;
}

function applyPenaltyDrain(state: QuestState, now: number): QuestState {
  let log = appendLog(state.log, "PENALTY ENFORCEMENT: Quest failed. Consequence applied.", "danger");

  const level = levelFromXp(state.xp).level;
  const hpMax = maxHp(level, computeEffectiveStats(state.stats, state.effects, now));
  const hp = clampResource(state.hp - HP_COST_PER_PENALTY, hpMax);
  log = appendLog(log, `HP drained: -${HP_COST_PER_PENALTY}.`, "danger");

  if (state.unallocatedPoints > 0) {
    const drained = Math.min(2, state.unallocatedPoints);
    log = appendLog(log, `Stat drain: -${drained} unallocated Ability Point(s).`, "danger");
    return { ...state, hp, unallocatedPoints: state.unallocatedPoints - drained, emergencyPenalty: null, log };
  }

  const debuff: StatusEffect = {
    id: crypto.randomUUID(),
    label: "Weakened",
    kind: "debuff",
    expiresAt: new Date(now + DEBUFF_DURATION_MS).toISOString(),
    statDelta: { str: -5, int: -5, vit: -5, dex: -5 },
  };
  log = appendLog(log, "Stat drain: [Debuff: Weakened -5 all attributes].", "danger");
  return { ...state, hp, effects: [...state.effects, debuff], emergencyPenalty: null, log };
}

function withoutKey(record: Record<string, string>, key: string): Record<string, string> {
  const next = { ...record };
  delete next[key];
  return next;
}

/**
 * The System HUD gamification layer: XP, levels, stats, resources, currency,
 * routines of scheduled steps, titles, status effects and the Penalty Zone.
 * Local-first like useLocalProgram - localStorage always works offline -
 * and, when the user is signed in and Supabase is configured, mirrors
 * state to the `hunter_state` table so it follows them across devices
 * (last-write-wins by `updatedAt`, no separate passcode). Meant to be
 * mounted once via QuestProvider and shared through context; call
 * `syncStreak` from wherever the real streak is known (see
 * useLocalAdaptiveState) instead of passing it in here.
 */
export function useLocalQuest() {
  const [quest, setQuest] = useState<QuestState | undefined>(undefined);

  useEffect(() => {
    let cancelled = false;

    void (async () => {
      const local = tick(loadQuest());
      if (cancelled) return;
      setQuest(local);

      if (!isSupabaseConfigured) return;
      const userId = await getCurrentUserId();
      if (!userId || cancelled) return;

      const cloud = await pullQuestState(userId);
      if (!cloud || cancelled) return;
      if (new Date(cloud.updatedAt).getTime() <= new Date(local.updatedAt).getTime()) return;

      const cloudState = cloud.state as Record<string, unknown>;
      const merged = tick(
        cloudState.routines
          ? ({ ...defaultState(), ...(cloudState as Partial<QuestState>) } as QuestState)
          : ({ ...defaultState(), ...cloudState, ...migrateLegacyQuestsToRoutines(cloudState), lastCompletedAt: {} } as QuestState),
      );
      const saved = saveQuest(merged);
      if (!cancelled) setQuest(saved);
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  // Periodic tick: daily rollover, resource regen, and emergency-penalty deadline enforcement.
  useEffect(() => {
    const id = setInterval(() => {
      setQuest((prev) => {
        if (!prev) return prev;
        return saveQuest(tick(prev));
      });
    }, 30_000);
    return () => clearInterval(id);
  }, []);

  // Debounced cloud push - mirrors every local save to `hunter_state` when signed in.
  useEffect(() => {
    if (quest === undefined || !isSupabaseConfigured) return;
    const id = setTimeout(() => {
      void (async () => {
        const userId = await getCurrentUserId();
        if (!userId) return;
        await pushQuestState(userId, quest, quest.updatedAt);
      })();
    }, CLOUD_PUSH_DEBOUNCE_MS);
    return () => clearTimeout(id);
  }, [quest]);

  /**
   * Called from wherever the real streak is known (HomeView, via
   * useLocalAdaptiveState) rather than taken as a hook argument - this hook
   * is shared app-wide through QuestProvider, and the streak depends on the
   * exercise library, which isn't loaded at that shell level.
   */
  const syncStreak = useCallback((currentStreak: number, hasLoggedBefore: boolean) => {
    if (!hasLoggedBefore) return;
    setQuest((prev) => {
      if (!prev) return prev;

      if (currentStreak > prev.lastStreakSeen) {
        const { next: withXp } = applyXpGain(prev, streakBonusXp(currentStreak), Date.now());
        let next = { ...withXp, lastStreakSeen: currentStreak };

        for (const milestone of milestonesReached(currentStreak, next.titles)) {
          const unlocked: UnlockedTitle = {
            id: crypto.randomUUID(),
            title: milestone.title,
            expBonusPct: milestone.expBonusPct,
            unlockedAt: new Date().toISOString(),
          };
          next = {
            ...next,
            titles: [...next.titles, unlocked],
            gems: next.gems + GEMS_PER_TITLE_UNLOCK,
            log: appendLog(next.log, `TITLE UNLOCKED: "${milestone.title}" (+${milestone.expBonusPct}% EXP, +${GEMS_PER_TITLE_UNLOCK} Gems).`, "success"),
          };
        }

        return saveQuest(next);
      }

      if (currentStreak === 0 && prev.lastStreakSeen > 0 && !prev.pendingPenalty) {
        return saveQuest({
          ...prev,
          lastStreakSeen: 0,
          pendingPenalty: { missedDate: yesterdayDateString(), createdAt: new Date().toISOString() },
          log: appendLog(prev.log, "SYSTEM: Streak broken. A Gate has opened.", "warning"),
        });
      }

      return prev;
    });
  }, []);

  const awardSessionXp = useCallback((isProgress: boolean): LevelUpResult => {
    let result: LevelUpResult = { leveledUp: false, level: 1, rankTitle: rankTitle(1), levelsGained: 0 };
    setQuest((prev) => {
      if (!prev) return prev;
      const base = XP_PER_SESSION + (isProgress ? XP_PROGRESS_BONUS : 0);
      const { next, result: r } = applyXpGain(prev, base, Date.now());
      result = r;
      return saveQuest(next);
    });
    return result;
  }, []);

  const completeStep = useCallback((stepId: string): LevelUpResult | null => {
    let result: LevelUpResult | null = null;
    setQuest((prev) => {
      if (!prev || prev.completedToday.includes(stepId)) return prev;
      const step = prev.steps.find((s) => s.id === stepId);
      if (!step) return prev;

      const now = Date.now();
      const { next: withXp, gained, result: r } = applyXpGain(prev, step.exp, now);
      result = r;

      const buff = QUEST_BUFFS[stepId];
      const effects = buff
        ? [...withXp.effects, { id: crypto.randomUUID(), label: buff.label, kind: "buff" as const, expiresAt: new Date(now + buff.hours * 3_600_000).toISOString() }]
        : withXp.effects;

      const level = levelFromXp(withXp.xp).level;
      const staminaMax = maxStamina(level, computeEffectiveStats(withXp.stats, effects, now));
      const stamina = step.category === "fitness" ? clampResource(withXp.stamina - STAMINA_COST_PER_FITNESS_QUEST, staminaMax) : withXp.stamina;

      const next: QuestState = {
        ...withXp,
        completedToday: [...withXp.completedToday, stepId],
        lastCompletedAt: { ...withXp.lastCompletedAt, [stepId]: new Date(now).toISOString() },
        effects,
        stamina,
        coins: withXp.coins + COINS_PER_QUEST,
        log: appendLog(withXp.log, `Quest "${step.name}" completed. +${gained} EXP, +${COINS_PER_QUEST} Coins gained.`, "success"),
      };
      return saveQuest(next);
    });
    return result;
  }, []);

  const createRoutine = useCallback((name: string): string => {
    const id = crypto.randomUUID();
    setQuest((prev) => {
      if (!prev) return prev;
      const routine: Routine = { id, name, createdAt: new Date().toISOString() };
      return saveQuest({
        ...prev,
        routines: [...prev.routines, routine],
        log: appendLog(prev.log, `New routine created: "${name}".`, "info"),
      });
    });
    return id;
  }, []);

  const renameRoutine = useCallback((routineId: string, name: string) => {
    setQuest((prev) => {
      if (!prev) return prev;
      return saveQuest({ ...prev, routines: prev.routines.map((r) => (r.id === routineId ? { ...r, name } : r)) });
    });
  }, []);

  const toggleRoutineCollapsed = useCallback((routineId: string) => {
    setQuest((prev) => {
      if (!prev) return prev;
      return saveQuest({
        ...prev,
        routines: prev.routines.map((r) => (r.id === routineId ? { ...r, collapsed: !r.collapsed } : r)),
      });
    });
  }, []);

  const deleteRoutine = useCallback((routineId: string) => {
    setQuest((prev) => {
      if (!prev) return prev;
      const removedIds = new Set(prev.steps.filter((s) => s.routineId === routineId).map((s) => s.id));
      let lastCompletedAt = prev.lastCompletedAt;
      for (const id of removedIds) lastCompletedAt = withoutKey(lastCompletedAt, id);
      const routine = prev.routines.find((r) => r.id === routineId);
      return saveQuest({
        ...prev,
        routines: prev.routines.filter((r) => r.id !== routineId),
        steps: prev.steps.filter((s) => s.routineId !== routineId),
        completedToday: prev.completedToday.filter((id) => !removedIds.has(id)),
        lastCompletedAt,
        log: routine ? appendLog(prev.log, `Routine deleted: "${routine.name}".`, "warning") : prev.log,
      });
    });
  }, []);

  const createStep = useCallback((routineId: string, name: string, exp: number, category: QuestCategory, statReward: keyof Stats, schedule: Schedule) => {
    setQuest((prev) => {
      if (!prev) return prev;
      const step: RoutineStep = { id: crypto.randomUUID(), routineId, name, exp, category, statReward, schedule, createdAt: new Date().toISOString() };
      return saveQuest({
        ...prev,
        steps: [...prev.steps, step],
        log: appendLog(prev.log, `New quest architected: "${name}" (+${exp} EXP).`, "info"),
      });
    });
  }, []);

  const updateStep = useCallback((stepId: string, updates: Partial<Omit<RoutineStep, "id" | "createdAt">>) => {
    setQuest((prev) => {
      if (!prev) return prev;
      return saveQuest({
        ...prev,
        steps: prev.steps.map((s) => (s.id === stepId ? { ...s, ...updates } : s)),
      });
    });
  }, []);

  const deleteStep = useCallback((stepId: string) => {
    setQuest((prev) => {
      if (!prev) return prev;
      return saveQuest({
        ...prev,
        steps: prev.steps.filter((s) => s.id !== stepId),
        completedToday: prev.completedToday.filter((id) => id !== stepId),
        lastCompletedAt: withoutKey(prev.lastCompletedAt, stepId),
      });
    });
  }, []);

  const createRoutineFromAI = useCallback((name: string, generatedSteps: GeneratedStepInput[]) => {
    setQuest((prev) => {
      if (!prev) return prev;
      const routineId = crypto.randomUUID();
      const now = new Date().toISOString();
      const routine: Routine = { id: routineId, name, createdAt: now };
      const steps: RoutineStep[] = generatedSteps.map((s) => ({ id: crypto.randomUUID(), routineId, ...s, createdAt: now }));
      return saveQuest({
        ...prev,
        routines: [...prev.routines, routine],
        steps: [...prev.steps, ...steps],
        log: appendLog(prev.log, `SYSTEM: AI-generated routine "${name}" added (${steps.length} steps).`, "success"),
      });
    });
  }, []);

  const allocateStatPoint = useCallback((stat: keyof Stats) => {
    setQuest((prev) => {
      if (!prev || prev.unallocatedPoints <= 0) return prev;
      return saveQuest({
        ...prev,
        stats: allocateStat(prev.stats, stat),
        unallocatedPoints: prev.unallocatedPoints - 1,
        log: appendLog(prev.log, `Ability Point allocated to ${stat.toUpperCase()}.`, "info"),
      });
    });
  }, []);

  const setActiveTitle = useCallback((id: string | null) => {
    setQuest((prev) => {
      if (!prev) return prev;
      return saveQuest({ ...prev, activeTitleId: id });
    });
  }, []);

  const triggerEmergencyPenalty = useCallback(() => {
    setQuest((prev) => {
      if (!prev || prev.emergencyPenalty) return prev;
      const now = Date.now();
      const emergencyPenalty: EmergencyPenalty = {
        id: crypto.randomUUID(),
        assignedAt: new Date(now).toISOString(),
        deadline: new Date(now + EMERGENCY_WINDOW_MS).toISOString(),
        objective: EMERGENCY_OBJECTIVES[Math.floor(Math.random() * EMERGENCY_OBJECTIVES.length)],
        manual: true,
      };
      return saveQuest({
        ...prev,
        emergencyPenalty,
        log: appendLog(prev.log, "WARNING: PENALTY QUEST ASSIGNED. Survival in the Penalty Zone.", "danger"),
      });
    });
  }, []);

  const enforcePenaltyCompletion = useCallback((): LevelUpResult | null => {
    let result: LevelUpResult | null = null;
    setQuest((prev) => {
      if (!prev || !prev.emergencyPenalty) return prev;
      const { next: withXp, result: r } = applyXpGain(prev, XP_REDEMPTION, Date.now());
      result = r;
      return saveQuest({
        ...withXp,
        emergencyPenalty: null,
        log: appendLog(withXp.log, "Penalty Quest cleared. Interface unlocked.", "success"),
      });
    });
    return result;
  }, []);

  const completePenalty = useCallback((note?: string): LevelUpResult => {
    let result: LevelUpResult = { leveledUp: false, level: 1, rankTitle: rankTitle(1), levelsGained: 0 };
    setQuest((prev) => {
      if (!prev || !prev.pendingPenalty) return prev;
      const { next: withXp, result: r } = applyXpGain(prev, XP_REDEMPTION, Date.now());
      result = r;
      const record: PenaltyRecord = {
        id: crypto.randomUUID(),
        missedDate: prev.pendingPenalty.missedDate,
        outcome: "completed",
        note,
        resolvedAt: new Date().toISOString(),
      };
      return saveQuest({
        ...withXp,
        pendingPenalty: null,
        penaltyLog: [...withXp.penaltyLog, record],
        log: appendLog(withXp.log, "Gate cleared. Redemption logged.", "success"),
      });
    });
    return result;
  }, []);

  const skipPenalty = useCallback((note?: string) => {
    setQuest((prev) => {
      if (!prev || !prev.pendingPenalty) return prev;
      const record: PenaltyRecord = {
        id: crypto.randomUUID(),
        missedDate: prev.pendingPenalty.missedDate,
        outcome: "skipped",
        note,
        resolvedAt: new Date().toISOString(),
      };
      const hangover: StatusEffect = {
        id: crypto.randomUUID(),
        label: "Penalty Hangover",
        kind: "debuff",
        expiresAt: new Date(Date.now() + DEBUFF_DURATION_MS).toISOString(),
        xpMultiplierPct: -10,
      };
      return saveQuest({
        ...prev,
        pendingPenalty: null,
        penaltyLog: [...prev.penaltyLog, record],
        effects: [...prev.effects, hangover],
        log: appendLog(prev.log, "The gate closes. [Debuff: Penalty Hangover -10% EXP].", "warning"),
      });
    });
  }, []);

  const dismissLevelUp = useCallback(() => {
    setQuest((prev) => {
      if (!prev || !prev.lastLevelUp) return prev;
      return saveQuest({ ...prev, lastLevelUp: null });
    });
  }, []);

  const { level, xpIntoLevel, xpForNext } = levelFromXp(quest?.xp ?? 0);
  const activeEffects = pruneExpired(quest?.effects ?? []);
  const baseStats = quest?.stats ?? DEFAULT_STATS;
  const effectiveStatValues = computeEffectiveStats(baseStats, activeEffects);

  const today = new Date();
  const routines: RoutineWithSteps[] = (quest?.routines ?? []).map((r) => ({
    ...r,
    steps: (quest?.steps ?? [])
      .filter((s) => s.routineId === r.id)
      .map((s) => ({
        ...s,
        completed: quest?.completedToday.includes(s.id) ?? false,
        dueToday: isStepDueToday(s, today, quest?.lastCompletedAt[s.id]),
      })),
  }));

  return {
    isLoading: quest === undefined,
    level,
    rankTitle: rankTitle(level),
    xpIntoLevel,
    xpForNext,
    totalXp: quest?.xp ?? 0,
    pendingPenalty: quest?.pendingPenalty ?? null,
    emergencyPenalty: quest?.emergencyPenalty ?? null,
    baseStats,
    stats: effectiveStatValues,
    unallocatedPoints: quest?.unallocatedPoints ?? 0,
    routines,
    titles: quest?.titles ?? [],
    activeTitleId: quest?.activeTitleId ?? null,
    effects: activeEffects,
    log: quest?.log ?? [],
    lastLevelUp: quest?.lastLevelUp ?? null,
    hp: quest?.hp ?? maxHp(level, effectiveStatValues),
    hpMax: maxHp(level, effectiveStatValues),
    stamina: quest?.stamina ?? maxStamina(level, effectiveStatValues),
    staminaMax: maxStamina(level, effectiveStatValues),
    coins: quest?.coins ?? 0,
    gems: quest?.gems ?? 0,
    dismissLevelUp,
    syncStreak,
    awardSessionXp,
    completeStep,
    createRoutine,
    renameRoutine,
    deleteRoutine,
    toggleRoutineCollapsed,
    createStep,
    updateStep,
    deleteStep,
    createRoutineFromAI,
    allocateStatPoint,
    setActiveTitle,
    triggerEmergencyPenalty,
    enforcePenaltyCompletion,
    completePenalty,
    skipPenalty,
  };
}
