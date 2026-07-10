import { Swords } from "lucide-react";

interface LevelBadgeProps {
  level: number;
  rankTitle: string;
  className?: string;
}

/** Compact "Lv. N - Rank" pill, shown wherever the streak/user info already lives. */
export function LevelBadge({ level, rankTitle, className }: LevelBadgeProps) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full bg-signal/10 px-2.5 py-1 font-mono text-[11px] font-semibold text-signal ring-1 ring-signal/20 ${className ?? ""}`}
    >
      <Swords size={12} strokeWidth={2.5} />
      Lv. {level} · {rankTitle}
    </span>
  );
}
