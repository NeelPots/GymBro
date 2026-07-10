"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { TrainingProfileTab } from "./TrainingProfileTab";
import { SocialProfileTab } from "./SocialProfileTab";
import type { Exercise, Post } from "@/lib/types/domain";

export interface SupabaseProfileInfo {
  email: string | null;
  displayName: string | null;
  username: string | null;
  avatarUrl: string | null;
  memberSince: string | null;
}

interface ProfileViewProps {
  exercises: Exercise[];
  supabaseUser: SupabaseProfileInfo | null;
  myPosts: Post[];
}

const TABS = [
  { value: "training", label: "Training" },
  { value: "social", label: "Social" },
] as const;

type Tab = (typeof TABS)[number]["value"];

export function ProfileView({ exercises, supabaseUser, myPosts }: ProfileViewProps) {
  const [tab, setTab] = useState<Tab>("training");

  return (
    <div className="flex flex-col gap-4 pt-2">
      <div>
        <div className="font-mono text-[11px] font-semibold uppercase tracking-wider text-signal">Profile</div>
        <h1 className="mt-1 font-display text-2xl font-bold tracking-tight">Your progress</h1>
      </div>

      <div className="flex gap-1 rounded-lg border border-border bg-surface p-1">
        {TABS.map((t) => (
          <button
            key={t.value}
            type="button"
            onClick={() => setTab(t.value)}
            className={cn(
              "flex-1 rounded-md py-2 text-sm font-medium transition-colors",
              tab === t.value ? "bg-signal/10 text-signal" : "text-muted-foreground hover:text-foreground",
            )}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === "training" ? (
        <TrainingProfileTab exercises={exercises} />
      ) : (
        <SocialProfileTab user={supabaseUser} posts={myPosts} />
      )}
    </div>
  );
}
