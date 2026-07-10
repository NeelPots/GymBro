"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { StoriesBar } from "./StoriesBar";
import { StoryViewer } from "./StoryViewer";
import { PostCard } from "./PostCard";
import { ComposerSheet } from "./ComposerSheet";
import type { Post, Story } from "@/lib/types/domain";

interface SocialFeedViewProps {
  initialPosts: Post[];
  initialStories: Story[];
  currentUserId: string;
  initialShareCaption?: string;
}

export function SocialFeedView({
  initialPosts,
  initialStories,
  currentUserId,
  initialShareCaption,
}: SocialFeedViewProps) {
  const router = useRouter();
  const [posts, setPosts] = useState(initialPosts);
  const [stories, setStories] = useState(initialStories);
  const [composerOpen, setComposerOpen] = useState(Boolean(initialShareCaption));
  const [composerType, setComposerType] = useState<"post" | "story">("post");
  const [viewingStory, setViewingStory] = useState<Story | null>(null);

  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => setPosts(initialPosts), [initialPosts]);
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => setStories(initialStories), [initialStories]);

  useEffect(() => {
    if (initialShareCaption) router.replace("/social");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function openComposer(type: "post" | "story") {
    setComposerType(type);
    setComposerOpen(true);
  }

  return (
    <div className="flex flex-col gap-4 pt-2">
      <StoriesBar
        stories={stories}
        onAddStory={() => openComposer("story")}
        onViewStory={(story) => setViewingStory(story)}
      />

      <div className="flex items-center justify-between">
        <h2 className="font-display text-[17px] font-semibold">Feed</h2>
        <Button size="sm" onClick={() => openComposer("post")} className="gap-1.5">
          <Plus size={15} />
          New post
        </Button>
      </div>

      {posts.length === 0 ? (
        <div className="rounded-[var(--radius)] border border-border bg-surface p-8 text-center text-sm text-muted-foreground">
          No posts yet - be the first to share something.
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {posts.map((post) => (
            <PostCard
              key={post.id}
              post={post}
              currentUserId={currentUserId}
              onDeleted={(id) => setPosts((prev) => prev.filter((p) => p.id !== id))}
            />
          ))}
        </div>
      )}

      <ComposerSheet
        open={composerOpen}
        onOpenChange={setComposerOpen}
        defaultType={composerType}
        initialCaption={initialShareCaption}
        onShared={() => router.refresh()}
      />

      {viewingStory && <StoryViewer story={viewingStory} onClose={() => setViewingStory(null)} />}
    </div>
  );
}
