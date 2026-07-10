import Link from "next/link";
import { Settings } from "lucide-react";

export function AppHeader() {
  return (
    <header className="flex items-center justify-between px-5 pt-6 pb-2 sm:px-0 sm:pt-8 lg:hidden">
      <h1 className="font-display text-[22px] font-bold tracking-tight">GymBro</h1>
      <Link
        href="/settings"
        className="rounded-full p-1.5 text-muted-foreground transition-colors hover:text-foreground"
        aria-label="Settings"
      >
        <Settings size={20} />
      </Link>
    </header>
  );
}
