import Link from "next/link";
import { Users } from "lucide-react";
import { ComingSoon } from "@/components/shared/ComingSoon";
import { SocialFeedView } from "@/components/social/SocialFeedView";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { createClient } from "@/lib/supabase/server";
import { getFeed } from "@/services/social/getFeed";
import { getStories } from "@/services/social/getStories";

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

  if (!user) {
    return (
      <div className="pt-2">
        <div className="relative flex flex-col items-center gap-4 overflow-hidden rounded-[var(--radius)] border border-border bg-surface px-6 py-20 text-center">
          <div
            className="pointer-events-none absolute inset-x-0 top-0 h-48"
            style={{
              background: "radial-gradient(ellipse 60% 100% at 50% 0%, rgba(255,77,46,0.14), transparent 70%)",
            }}
          />
          <div className="relative flex size-14 items-center justify-center rounded-2xl bg-signal/10 text-signal ring-1 ring-signal/25">
            <Users size={26} strokeWidth={1.9} />
          </div>
          <h2 className="relative font-display text-xl font-bold tracking-tight">Join the community</h2>
          <p className="relative max-w-xs text-sm leading-relaxed text-muted-foreground">
            Sign in to see posts and stories from other members, and to share your own.
          </p>
          <div className="relative flex gap-3">
            <Link
              href="/login"
              className="rounded-lg bg-signal px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-signal/90"
            >
              Log in
            </Link>
            <Link
              href="/signup"
              className="rounded-lg border border-border px-4 py-2 text-sm font-semibold text-foreground transition-colors hover:bg-surface-2"
            >
              Sign up
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const [posts, stories] = await Promise.all([getFeed(), getStories()]);

  return (
    <SocialFeedView
      initialPosts={posts}
      initialStories={stories}
      currentUserId={user.id}
      initialShareCaption={share}
    />
  );
}
