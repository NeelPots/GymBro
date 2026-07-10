"use client";

import { Plus } from "lucide-react";
import { AuthorAvatar, authorLabel } from "./AuthorAvatar";
import type { Story } from "@/lib/types/domain";

interface StoriesBarProps {
  stories: Story[];
  onAddStory: () => void;
  onViewStory: (story: Story) => void;
}

export function StoriesBar({ stories, onAddStory, onViewStory }: StoriesBarProps) {
  return (
    <div className="flex gap-4 overflow-x-auto pb-1">
      <button type="button" onClick={onAddStory} className="flex shrink-0 flex-col items-center gap-1.5">
        <div className="flex size-14 items-center justify-center rounded-full border-2 border-dashed border-border text-muted-foreground">
          <Plus size={20} />
        </div>
        <span className="text-[11px] text-muted-foreground">Your story</span>
      </button>

      {stories.map((story) => (
        <button
          key={story.id}
          type="button"
          onClick={() => onViewStory(story)}
          className="flex shrink-0 flex-col items-center gap-1.5"
        >
          <div className="rounded-full p-0.5 ring-2 ring-signal">
            <AuthorAvatar author={story.author} size="lg" />
          </div>
          <span className="max-w-14 truncate text-[11px] text-muted-foreground">
            {authorLabel(story.author)}
          </span>
        </button>
      ))}
    </div>
  );
}
