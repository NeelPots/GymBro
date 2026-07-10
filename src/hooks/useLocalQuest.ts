"use client";

import { useCallback, useEffect, useState } from "react";
import {
  levelFromXp,
  rankTitle,
  XP_PER_SESSION,
  XP_PROGRESS_BONUS,
  XP_REDEMPTION,
  XP_STREAK_BONUS,
} from "@/lib/gamification/rank";

const STORAGE_KEY = "adaptive-coach-quest-v1";

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

interface QuestState {
  xp: number;
  lastStreakSeen: number;
  pendingPenalty: PendingPenalty | null;
  penaltyLog: PenaltyRecord[];
}

const DEFAULT_STATE: QuestState = { xp: 0, lastStreakSeen: 0, pendingPenalty: null, penaltyLog: [] };

function loadQuest(): QuestState {
  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (!raw) return DEFAULT_STATE;
  try {
    return { ...DEFAULT_STATE, ...(JSON.parse(raw) as QuestState) };
  } catch {
    return DEFAULT_STATE;
  }
}

function saveQuest(state: QuestState) {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function yesterdayDateString(): string {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return d.toISOString().slice(0, 10);
}

interface LevelUpResult {
  leveledUp: boolean;
  level: number;
  rankTitle: string;
}

function withLevelUp(beforeXp: number, afterXp: number): LevelUpResult {
  const before = levelFromXp(beforeXp).level;
  const after = levelFromXp(afterXp).level;
  return { leveledUp: after > before, level: after, rankTitle: rankTitle(after) };
}

/**
 * The gamification layer: XP, levels, and "penalty gates" opened when a
 * training streak breaks. Local-first like useLocalProgram/useLocalSplit -
 * no accounts required. `currentStreak` and `hasLoggedBefore` come from
 * useLocalAdaptiveState, which already computes the streak; this hook just
 * reacts to it rather than recomputing it.
 *
 * Streak reconciliation only fires once per change: a streak increase
 * awards a bonus and records the new high-water mark, and a streak
 * dropping to zero (after having been positive) opens exactly one pending
 * penalty - it won't reopen while one is already pending.
 */
export function useLocalQuest(currentStreak: number = 0, hasLoggedBefore: boolean = false) {
  const [quest, setQuest] = useState<QuestState | undefined>(undefined);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setQuest(loadQuest());
  }, []);

  useEffect(() => {
    if (!hasLoggedBefore) return;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setQuest((prev) => {
      if (!prev) return prev;

      if (currentStreak > prev.lastStreakSeen) {
        const next = { ...prev, xp: prev.xp + XP_STREAK_BONUS, lastStreakSeen: currentStreak };
        saveQuest(next);
        return next;
      }

      if (currentStreak === 0 && prev.lastStreakSeen > 0 && !prev.pendingPenalty) {
        const next: QuestState = {
          ...prev,
          lastStreakSeen: 0,
          pendingPenalty: { missedDate: yesterdayDateString(), createdAt: new Date().toISOString() },
        };
        saveQuest(next);
        return next;
      }

      return prev;
    });
  }, [currentStreak, hasLoggedBefore]);

  const awardSessionXp = useCallback((isProgress: boolean): LevelUpResult => {
    let result: LevelUpResult = { leveledUp: false, level: 1, rankTitle: rankTitle(1) };
    setQuest((prev) => {
      if (!prev) return prev;
      const gained = XP_PER_SESSION + (isProgress ? XP_PROGRESS_BONUS : 0);
      const nextXp = prev.xp + gained;
      result = withLevelUp(prev.xp, nextXp);
      const next = { ...prev, xp: nextXp };
      saveQuest(next);
      return next;
    });
    return result;
  }, []);

  const completePenalty = useCallback((note?: string): LevelUpResult => {
    let result: LevelUpResult = { leveledUp: false, level: 1, rankTitle: rankTitle(1) };
    setQuest((prev) => {
      if (!prev || !prev.pendingPenalty) return prev;
      const nextXp = prev.xp + XP_REDEMPTION;
      result = withLevelUp(prev.xp, nextXp);
      const record: PenaltyRecord = {
        id: crypto.randomUUID(),
        missedDate: prev.pendingPenalty.missedDate,
        outcome: "completed",
        note,
        resolvedAt: new Date().toISOString(),
      };
      const next: QuestState = {
        ...prev,
        xp: nextXp,
        pendingPenalty: null,
        penaltyLog: [...prev.penaltyLog, record],
      };
      saveQuest(next);
      return next;
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
      const next: QuestState = {
        ...prev,
        pendingPenalty: null,
        penaltyLog: [...prev.penaltyLog, record],
      };
      saveQuest(next);
      return next;
    });
  }, []);

  const { level, xpIntoLevel, xpForNext } = levelFromXp(quest?.xp ?? 0);

  return {
    isLoading: quest === undefined,
    level,
    rankTitle: rankTitle(level),
    xpIntoLevel,
    xpForNext,
    totalXp: quest?.xp ?? 0,
    pendingPenalty: quest?.pendingPenalty ?? null,
    awardSessionXp,
    completePenalty,
    skipPenalty,
  };
}
