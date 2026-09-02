"use client";

import { useEffect, useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { systemAudio } from "@/lib/gamification/audio";

interface RoutineNameDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Present when renaming an existing routine; absent when creating a new one. */
  initialName?: string;
  onSave: (name: string) => void;
}

/** Name-only dialog shared by "new routine" and "rename routine". */
export function RoutineNameDialog({ open, onOpenChange, initialName, onSave }: RoutineNameDialogProps) {
  const isEditing = initialName !== undefined;
  const [name, setName] = useState(initialName ?? "");

  useEffect(() => {
    if (!open) return;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setName(initialName ?? "");
  }, [open, initialName]);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="mx-auto max-w-xl rounded-t-2xl border-t border-signal/25 bg-surface-2 px-5 pt-2 pb-8 hud-panel">
        <SheetHeader className="px-0">
          <SheetTitle className="font-display text-lg">{isEditing ? "Rename Routine" : "New Routine"}</SheetTitle>
        </SheetHeader>

        <div className="px-0">
          <Label htmlFor="routine-name" className="mb-2 block text-xs uppercase tracking-wide text-muted-foreground">
            Name
          </Label>
          <Input
            id="routine-name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Face Routine"
            maxLength={40}
            autoFocus
          />
        </div>

        <SheetFooter className="flex-row gap-2.5 px-0">
          <Button variant="secondary" className="flex-1" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            className="flex-1"
            disabled={name.trim().length === 0}
            onClick={() => {
              systemAudio.click();
              onSave(name.trim());
              onOpenChange(false);
            }}
          >
            {isEditing ? "Save" : "Create routine"}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
