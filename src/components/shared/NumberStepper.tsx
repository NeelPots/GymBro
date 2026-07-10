"use client";

import { Minus, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

interface NumberStepperProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  step?: number;
}

/**
 * Tactile +/- entry for reps/sets - the pattern lifting-log apps (Strong,
 * Hevy) use instead of a raw number input, since typing on a numeric
 * keyboard mid-set is friction a stepper avoids entirely.
 */
export function NumberStepper({ value, onChange, min = 0, step = 1 }: NumberStepperProps) {
  return (
    <div className="flex items-center justify-between rounded-[10px] border border-border bg-surface px-2 py-1.5">
      <Button
        type="button"
        variant="ghost"
        size="icon-sm"
        onClick={() => onChange(Math.max(min, value - step))}
        aria-label="Decrease"
      >
        <Minus size={16} />
      </Button>
      <span className="font-mono text-xl font-semibold tabular-nums">{value}</span>
      <Button
        type="button"
        variant="ghost"
        size="icon-sm"
        onClick={() => onChange(value + step)}
        aria-label="Increase"
      >
        <Plus size={16} />
      </Button>
    </div>
  );
}
