"use client";

import { useState } from "react";
import { ImagePlus } from "lucide-react";
import { toast } from "sonner";
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { createPost, createStory } from "@/services/social/socialClient";

interface ComposerSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  defaultType?: "post" | "story";
  onShared: () => void;
}

export function ComposerSheet({ open, onOpenChange, defaultType = "post", onShared }: ComposerSheetProps) {
  const [type, setType] = useState<"post" | "story">(defaultType);
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [caption, setCaption] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const selected = e.target.files?.[0] ?? null;
    setFile(selected);
    setPreviewUrl(selected ? URL.createObjectURL(selected) : null);
  }

  function reset() {
    setFile(null);
    setPreviewUrl(null);
    setCaption("");
  }

  async function handleShare() {
    if (!file) {
      toast.error("Pick an image first.");
      return;
    }
    setIsSubmitting(true);
    try {
      if (type === "post") {
        await createPost(caption, file);
      } else {
        await createStory(file);
      }
      toast.success(type === "post" ? "Posted!" : "Story shared!");
      reset();
      onOpenChange(false);
      onShared();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Couldn't share that.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Sheet
      open={open}
      onOpenChange={(next) => {
        if (!next) reset();
        onOpenChange(next);
      }}
    >
      <SheetContent side="bottom" className="mx-auto max-w-xl rounded-t-2xl border-t border-border bg-surface-2 px-5 pt-2 pb-8">
        <SheetHeader className="px-0">
          <SheetTitle className="font-display text-lg">New</SheetTitle>
        </SheetHeader>

        <div className="flex flex-col gap-4 px-0">
          <div className="flex gap-2">
            {(["post", "story"] as const).map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setType(t)}
                className={cn(
                  "flex-1 rounded-lg border px-3 py-1.5 text-sm font-medium capitalize transition-colors",
                  type === t
                    ? "border-signal bg-signal/10 text-signal"
                    : "border-border text-muted-foreground hover:text-foreground",
                )}
              >
                {t}
              </button>
            ))}
          </div>

          <label className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-border p-6 text-muted-foreground hover:border-signal/40">
            {previewUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={previewUrl} alt="Selected preview" className="max-h-48 rounded-lg object-contain" />
            ) : (
              <>
                <ImagePlus size={22} />
                <span className="text-sm">Choose a photo</span>
              </>
            )}
            <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
          </label>

          {type === "post" && (
            <Textarea
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              placeholder="Write a caption…"
              rows={3}
            />
          )}
        </div>

        <SheetFooter className="flex-row gap-2.5 px-0">
          <Button variant="secondary" className="flex-1" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button className="flex-1" onClick={handleShare} disabled={isSubmitting}>
            {isSubmitting ? "Sharing…" : "Share"}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
