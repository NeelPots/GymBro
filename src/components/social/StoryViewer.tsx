"use client";

import { X } from "lucide-react";
import { AuthorAvatar, authorLabel } from "./AuthorAvatar";
import { formatRelativeTime } from "@/lib/formatRelativeTime";
import type { Story } from "@/lib/types/domain";

export function StoryViewer({ story, onClose }: { story: Story; onClose: () => void }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4"
      onClick={onClose}
    >
      <div className="relative flex max-h-full w-full max-w-sm flex-col" onClick={(e) => e.stopPropagation()}>
        <div className="mb-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AuthorAvatar author={story.author} size="sm" />
            <div>
              <div className="text-sm font-medium text-white">{authorLabel(story.author)}</div>
              <div className="font-mono text-[11px] text-white/60">{formatRelativeTime(story.createdAt)}</div>
            </div>
          </div>
          <button type="button" onClick={onClose} className="text-white/80 hover:text-white">
            <X size={22} />
          </button>
        </div>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={story.mediaUrl}
          alt={`${authorLabel(story.author)}'s story`}
          className="max-h-[75vh] w-full rounded-lg object-contain"
        />
      </div>
    </div>
  );
}
