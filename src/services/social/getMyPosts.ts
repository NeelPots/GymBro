import "server-only";
import { createClient } from "@/lib/supabase/server";
import type { Database } from "@/lib/types/database.types";
import type { Post } from "@/lib/types/domain";

type PostRow = Database["public"]["Tables"]["posts"]["Row"];
type ProfileRow = Database["public"]["Tables"]["profiles"]["Row"];

/** A lean version of getFeed.ts scoped to one author, for the profile page's post grid. */
export async function getMyPosts(userId: string): Promise<Post[]> {
  const supabase = await createClient();

  const { data: postsData, error } = await supabase
    .from("posts")
    .select("id, user_id, caption, media_url, media_type, created_at")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(30);

  if (error || !postsData || postsData.length === 0) return [];

  const posts = postsData as Pick<
    PostRow,
    "id" | "user_id" | "caption" | "media_url" | "media_type" | "created_at"
  >[];

  const { data: profileData } = await supabase
    .from("profiles")
    .select("id, username, display_name, avatar_url")
    .eq("id", userId)
    .single();
  const profile = profileData as Pick<ProfileRow, "id" | "username" | "display_name" | "avatar_url"> | null;

  return posts.map((p) => ({
    id: p.id,
    author: {
      id: p.user_id,
      username: profile?.username ?? null,
      displayName: profile?.display_name ?? null,
      avatarUrl: profile?.avatar_url ?? null,
    },
    caption: p.caption,
    mediaUrl: p.media_url,
    mediaType: p.media_type,
    createdAt: p.created_at,
    likeCount: 0,
    commentCount: 0,
    likedByMe: false,
  }));
}
