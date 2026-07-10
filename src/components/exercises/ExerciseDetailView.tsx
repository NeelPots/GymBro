import { ArrowDown, ArrowUp } from "lucide-react";
import { categoryIcon, DEFAULT_CATEGORY_ICON } from "@/lib/categoryIcon";
import { Badge } from "@/components/ui/badge";
import { CategoryAnimation } from "./CategoryAnimation";
import type { Exercise } from "@/lib/types/domain";

function VideoEmbed({ videoUrl }: { videoUrl: string }) {
  return (
    <div className="aspect-video w-full overflow-hidden rounded-lg border border-border">
      <iframe
        src={videoUrl}
        title="Exercise demonstration"
        className="h-full w-full"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
    </div>
  );
}

export function ExerciseDetailView({ exercise }: { exercise: Exercise }) {
  const Icon = categoryIcon[exercise.category] ?? DEFAULT_CATEGORY_ICON;
  const steps = exercise.instructions?.split("\n").filter(Boolean) ?? [];

  return (
    <div className="flex flex-col gap-4 pt-2">
      <div className="rounded-[var(--radius)] border border-border bg-surface p-5">
        <div className="flex items-start gap-4">
          <div className="flex size-14 shrink-0 items-center justify-center rounded-2xl bg-signal/10 text-signal">
            <Icon size={26} strokeWidth={2} />
          </div>
          <div>
            <h1 className="font-display text-xl font-bold">{exercise.name}</h1>
            <Badge variant="outline" className="mt-1.5">
              {exercise.category}
            </Badge>
            {exercise.description && (
              <p className="mt-2 text-sm text-muted-foreground">{exercise.description}</p>
            )}
          </div>
        </div>
      </div>

      <div className="rounded-[var(--radius)] border border-border bg-surface p-5">
        <h2 className="mb-3 font-display text-[15px] font-semibold">Demo</h2>
        {exercise.videoUrl ? (
          <VideoEmbed videoUrl={exercise.videoUrl} />
        ) : (
          <CategoryAnimation category={exercise.category} />
        )}
      </div>

      {steps.length > 0 && (
        <div className="rounded-[var(--radius)] border border-border bg-surface p-5">
          <h2 className="mb-3 font-display text-[15px] font-semibold">How to do it</h2>
          <ol className="flex flex-col gap-2.5">
            {steps.map((step, i) => {
              const text = step.replace(/^\d+\.\s*/, "");
              return (
                <li key={i} className="flex gap-3 text-sm text-foreground">
                  <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-surface-2 font-mono text-[11px] text-muted-foreground">
                    {i + 1}
                  </span>
                  <span className="leading-relaxed">{text}</span>
                </li>
              );
            })}
          </ol>
        </div>
      )}

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {exercise.easierVariation && (
          <div className="rounded-[var(--radius)] border border-border bg-surface p-5">
            <div className="mb-2 flex items-center gap-2 text-progress">
              <ArrowDown size={16} />
              <h3 className="font-display text-sm font-semibold">Make it easier</h3>
            </div>
            <p className="text-sm text-muted-foreground">{exercise.easierVariation}</p>
          </div>
        )}
        {exercise.harderVariation && (
          <div className="rounded-[var(--radius)] border border-border bg-surface p-5">
            <div className="mb-2 flex items-center gap-2 text-deload">
              <ArrowUp size={16} />
              <h3 className="font-display text-sm font-semibold">Make it harder</h3>
            </div>
            <p className="text-sm text-muted-foreground">{exercise.harderVariation}</p>
          </div>
        )}
      </div>
    </div>
  );
}
