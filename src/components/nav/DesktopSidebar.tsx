"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Activity, Settings, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { navItems } from "./navItems";

export function DesktopSidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed inset-y-0 left-0 hidden w-64 flex-col border-r border-border bg-surface px-4 py-6 lg:flex">
      <Link href="/home" className="mb-8 flex items-center gap-2.5 px-2">
        <div className="flex size-8 items-center justify-center rounded-lg bg-signal/10 text-signal ring-1 ring-signal/30">
          <Activity size={16} strokeWidth={2.25} />
        </div>
        <span className="font-display text-[15px] font-bold tracking-tight">Adaptive Coach</span>
      </Link>

      <nav className="flex flex-1 flex-col gap-1">
        {navItems.map(({ href, label, icon: Icon }) => {
          const active = pathname === href || pathname?.startsWith(href + "/");
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                active
                  ? "bg-signal/10 text-signal"
                  : "text-muted-foreground hover:bg-surface-2 hover:text-foreground",
              )}
            >
              <Icon size={18} strokeWidth={active ? 2.25 : 1.75} />
              {label}
            </Link>
          );
        })}
      </nav>

      <div className="flex flex-col gap-1 border-t border-border pt-3">
        <Link
          href="/settings"
          className={cn(
            "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
            pathname === "/settings"
              ? "bg-signal/10 text-signal"
              : "text-muted-foreground hover:bg-surface-2 hover:text-foreground",
          )}
        >
          <Settings size={18} strokeWidth={1.75} />
          Settings
        </Link>
        <div className="mt-2 flex items-center gap-2.5 rounded-lg px-3 py-2">
          <div className="flex size-8 items-center justify-center rounded-full bg-surface-2 text-muted-foreground">
            <User size={15} />
          </div>
          <span className="text-xs text-muted-foreground">
            {isSupabaseConfigured ? "Connected" : "Local mode"}
          </span>
        </div>
      </div>
    </aside>
  );
}
