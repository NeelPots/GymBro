"use client";

import Link from "next/link";
import { Settings } from "lucide-react";
import { LevelBadge } from "@/components/gamification/LevelBadge";
import { FullscreenToggle } from "@/components/gamification/FullscreenToggle";
import { useQuest } from "@/components/gamification/QuestProvider";

export function AppHeader() {
  const { level, rankTitle, isLoading } = useQuest();

  return (
    <header className="relative z-10 flex items-center justify-between gap-2 bg-background px-5 pt-6 pb-2 sm:px-0 sm:pt-8 lg:hidden">
      <div className="flex min-w-0 items-center gap-2.5">
        <h1 className="shrink-0 font-display text-[22px] font-bold tracking-tight">Lock Inn</h1>
        {!isLoading && <LevelBadge level={level} rankTitle={rankTitle} compact />}
      </div>
      <div className="flex shrink-0 items-center gap-2">
        <FullscreenToggle />
        <Link
          href="/settings"
          className="shrink-0 rounded-full p-1.5 text-muted-foreground transition-colors hover:text-foreground"
          aria-label="Settings"
        >
          <Settings size={20} />
        </Link>
      </div>
    </header>
  );
}
