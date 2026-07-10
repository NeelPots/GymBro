"use client";

import { useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface PenaltySkipDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirmSkip: (note?: string) => void;
}

export function PenaltySkipDialog({ open, onOpenChange, onConfirmSkip }: PenaltySkipDialogProps) {
  const [note, setNote] = useState("");

  return (
    <AlertDialog
      open={open}
      onOpenChange={(next) => {
        if (!next) setNote("");
        onOpenChange(next);
      }}
    >
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Aww&hellip; that&apos;s really disappointing.</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to be ignorant of your training regime?
          </AlertDialogDescription>
        </AlertDialogHeader>

        <div>
          <Label className="mb-2 block text-xs uppercase tracking-wide text-muted-foreground">
            Want to leave a note? (optional)
          </Label>
          <Textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Sick, travel, rest day - all fine, just for your own record."
            rows={2}
          />
        </div>

        <AlertDialogFooter>
          <AlertDialogAction
            variant="destructive"
            onClick={() => onConfirmSkip(note.trim().length > 0 ? note.trim() : undefined)}
          >
            Yes, I&apos;ll skip it
          </AlertDialogAction>
          <AlertDialogCancel>No, I want to repent for my sins</AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
