import Link from "next/link";
import { categoryIcon, DEFAULT_CATEGORY_ICON } from "@/lib/categoryIcon";
import type { Exercise } from "@/lib/types/domain";

export function ExerciseCard({ exercise }: { exercise: Exercise }) {
  const Icon = categoryIcon[exercise.category] ?? DEFAULT_CATEGORY_ICON;

  return (
    <Link
      href={`/exercises/${exercise.id}`}
      className="flex flex-col items-center gap-2.5 rounded-xl border border-border bg-surface-2/40 p-4 text-center transition-colors hover:border-signal/30"
    >
      <div className="flex size-12 items-center justify-center rounded-2xl bg-signal/10 text-signal">
        <Icon size={20} strokeWidth={2} />
      </div>
      <div>
        <div className="text-sm font-medium text-foreground">{exercise.name}</div>
        <div className="mt-0.5 font-mono text-[11px] uppercase tracking-wide text-muted-foreground">
          {exercise.category}
        </div>
      </div>
    </Link>
  );
}
