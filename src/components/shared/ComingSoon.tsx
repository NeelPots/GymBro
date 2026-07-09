import type { LucideIcon } from "lucide-react";

interface ComingSoonProps {
  icon: LucideIcon;
  title: string;
  description: string;
  phase: string;
}

export function ComingSoon({ icon: Icon, title, description, phase }: ComingSoonProps) {
  return (
    <div className="flex flex-col items-center gap-3 rounded-[var(--radius)] border border-border bg-surface px-6 py-16 text-center">
      <Icon size={28} className="text-signal" strokeWidth={1.75} />
      <h2 className="font-display text-lg font-semibold">{title}</h2>
      <p className="max-w-xs text-sm text-muted-foreground">{description}</p>
      <span className="mt-1 rounded-md bg-surface-2 px-2 py-1 font-mono text-[11px] text-muted-foreground">
        {phase}
      </span>
    </div>
  );
}
