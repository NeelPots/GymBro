"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { navItems } from "./navItems";

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 flex justify-center gap-8 border-t border-border bg-surface/90 py-3 backdrop-blur-md sm:gap-12 lg:hidden">
      {navItems.map(({ href, label, icon: Icon }) => {
        const active = pathname === href || pathname?.startsWith(href + "/");
        return (
          <Link
            key={href}
            href={href}
            className={cn(
              "flex flex-col items-center gap-1 font-mono text-[11px] transition-colors",
              active ? "text-signal" : "text-subtle",
            )}
          >
            <span
              className={cn(
                "flex size-8 items-center justify-center rounded-full transition-colors",
                active && "bg-signal/12",
              )}
            >
              <Icon size={19} strokeWidth={active ? 2.25 : 1.75} />
            </span>
            {label}
          </Link>
        );
      })}
    </nav>
  );
}
