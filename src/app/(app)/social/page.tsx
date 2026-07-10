import { Users } from "lucide-react";
import { ComingSoon } from "@/components/shared/ComingSoon";
import { SocialFeedView } from "@/components/social/SocialFeedView";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { createClient } from "@/lib/supabase/server";
import { getFeed } from "@/services/social/getFeed";
import { getStories } from "@/services/social/getStories";
import { MOCK_POSTS, MOCK_STORIES } from "@/lib/social/mockSocialData";
import type { Post, Story } from "@/lib/types/domain";

function byNewest<T extends { createdAt: string }>(a: T, b: T): number {
  return b.createdAt.localeCompare(a.createdAt);
}

export default async function SocialPage({
  searchParams,
}: {
  searchParams: Promise<{ share?: string }>;
}) {
  const { share } = await searchParams;

  if (!isSupabaseConfigured) {
    return (
      <div className="pt-2">
        <ComingSoon
          icon={Users}
          title="Gym community feed"
          description="Posts, 24-hour stories, and progress updates from the community. Connect a Supabase project (see .env.local.example) to enable this."
          phase="Phase 3"
        />
      </div>
    );
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let posts: Post[];
  let stories: Story[];

  if (user) {
    const [realPosts, realStories] = await Promise.all([getFeed(), getStories()]);
    posts = [...realPosts, ...MOCK_POSTS].sort(byNewest);
    stories = [...realStories, ...MOCK_STORIES].sort(byNewest);
  } else {
    // Not signed in: browsing is open (demo content fills the feed so it's
    // never empty) - posting/liking/commenting still needs a real sign-in,
    // enforced by SocialFeedView/ComposerSheet/PostCard when currentUserId
    // is null.
    posts = [...MOCK_POSTS].sort(byNewest);
    stories = [...MOCK_STORIES].sort(byNewest);
  }

  return (
    <SocialFeedView
      initialPosts={posts}
      initialStories={stories}
      currentUserId={user?.id ?? null}
      initialShareCaption={share}
    />
  );
}
