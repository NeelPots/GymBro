import Link from "next/link";
import { Users } from "lucide-react";
import { AuthorAvatar, authorLabel } from "@/components/social/AuthorAvatar";
import type { Post } from "@/lib/types/domain";
import type { SupabaseProfileInfo } from "./ProfileView";

interface SocialProfileTabProps {
  user: SupabaseProfileInfo | null;
  posts: Post[];
}

export function SocialProfileTab({ user, posts }: SocialProfileTabProps) {
  if (!user) {
    return (
      <div className="relative flex flex-col items-center gap-4 overflow-hidden rounded-[var(--radius)] border border-border bg-surface px-6 py-16 text-center">
        <div className="flex size-14 items-center justify-center rounded-2xl bg-signal/10 text-signal ring-1 ring-signal/25">
          <Users size={26} strokeWidth={1.9} />
        </div>
        <h2 className="font-display text-xl font-bold tracking-tight">Sign in to see your social profile</h2>
        <p className="max-w-xs text-sm leading-relaxed text-muted-foreground">
          Your posts, stories, and community activity live here once you&apos;re signed in.
        </p>
        <div className="flex gap-3">
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
    );
  }

  const author = {
    id: "me",
    username: user.username,
    displayName: user.displayName,
    avatarUrl: user.avatarUrl,
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-3 rounded-[var(--radius)] border border-border bg-surface p-5">
        <AuthorAvatar author={author} size="lg" />
        <div className="min-w-0">
          <div className="truncate font-display text-base font-bold">{authorLabel(author)}</div>
          {user.email && <div className="truncate text-xs text-muted-foreground">{user.email}</div>}
          {user.memberSince && (
            <div className="mt-0.5 font-mono text-[11px] text-muted-foreground">
              Member since{" "}
              {new Date(user.memberSince).toLocaleDateString(undefined, { year: "numeric", month: "short" })}
            </div>
          )}
        </div>
      </div>

      <div className="rounded-[var(--radius)] border border-border bg-surface p-5">
        <div className="mb-3 flex items-center justify-between">
          <h3 className="font-display text-[15px] font-semibold">Your posts</h3>
          <span className="font-mono text-[11px] text-muted-foreground">{posts.length}</span>
        </div>
        {posts.length === 0 ? (
          <p className="text-sm text-muted-foreground">No posts yet - share something on the Social tab.</p>
        ) : (
          <div className="grid grid-cols-3 gap-1.5">
            {posts.map((post) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                key={post.id}
                src={post.mediaUrl}
                alt={post.caption ?? "Post"}
                className="aspect-square w-full rounded-md object-cover"
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
