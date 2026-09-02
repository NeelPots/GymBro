"use client";

import Link from "next/link";
import { Settings } from "lucide-react";
import { LevelBadge } from "@/components/gamification/LevelBadge";
import { FullscreenToggle } from "@/components/gamification/FullscreenToggle";
import { useQuest } from "@/components/gamification/QuestProvider";

export function AppHeader() {
  const { level, rankTitle, isLoading } = useQuest();

  return (
    <header className="relative z-10 flex items-center justify-between bg-background px-5 pt-6 pb-2 sm:px-0 sm:pt-8 lg:hidden">
      <div className="flex items-center gap-2.5">
        <h1 className="font-display text-[22px] font-bold tracking-tight">GymBro</h1>
        {!isLoading && <LevelBadge level={level} rankTitle={rankTitle} />}
      </div>
      <div className="flex items-center gap-2">
        <FullscreenToggle />
        <Link
          href="/settings"
          className="rounded-full p-1.5 text-muted-foreground transition-colors hover:text-foreground"
          aria-label="Settings"
        >
          <Settings size={20} />
        </Link>
      </div>
    </header>
  );
}
