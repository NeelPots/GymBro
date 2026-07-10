import "server-only";
import { createClient } from "@/lib/supabase/server";
import type { Database } from "@/lib/types/database.types";
import type { Post } from "@/lib/types/domain";

type PostRow = Database["public"]["Tables"]["posts"]["Row"];
type ProfileRow = Database["public"]["Tables"]["profiles"]["Row"];
type LikeRow = Database["public"]["Tables"]["post_likes"]["Row"];
type CommentRow = Database["public"]["Tables"]["post_comments"]["Row"];

export async function getFeed(): Promise<Post[]> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: postsData, error } = await supabase
    .from("posts")
    .select("id, user_id, caption, media_url, media_type, created_at")
    .order("created_at", { ascending: false })
    .limit(50);

  if (error || !postsData || postsData.length === 0) return [];

  const posts = postsData as Pick<
    PostRow,
    "id" | "user_id" | "caption" | "media_url" | "media_type" | "created_at"
  >[];

  const postIds = posts.map((p) => p.id);
  const userIds = [...new Set(posts.map((p) => p.user_id))];

  const [{ data: profilesData }, { data: likesData }, { data: commentsData }] = await Promise.all([
    supabase.from("profiles").select("id, username, display_name, avatar_url").in("id", userIds),
    supabase.from("post_likes").select("post_id, user_id").in("post_id", postIds),
    supabase.from("post_comments").select("post_id").in("post_id", postIds),
  ]);

  const profiles = (profilesData ?? []) as Pick<
    ProfileRow,
    "id" | "username" | "display_name" | "avatar_url"
  >[];
  const likes = (likesData ?? []) as Pick<LikeRow, "post_id" | "user_id">[];
  const comments = (commentsData ?? []) as Pick<CommentRow, "post_id">[];

  const profileById = new Map(profiles.map((p) => [p.id, p]));

  const likeCounts = new Map<string, number>();
  const likedByMeSet = new Set<string>();
  for (const like of likes) {
    likeCounts.set(like.post_id, (likeCounts.get(like.post_id) ?? 0) + 1);
    if (user && like.user_id === user.id) likedByMeSet.add(like.post_id);
  }

  const commentCounts = new Map<string, number>();
  for (const c of comments) {
    commentCounts.set(c.post_id, (commentCounts.get(c.post_id) ?? 0) + 1);
  }

  return posts.map((p) => {
    const profile = profileById.get(p.user_id);
    return {
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
      likeCount: likeCounts.get(p.id) ?? 0,
      commentCount: commentCounts.get(p.id) ?? 0,
      likedByMe: likedByMeSet.has(p.id),
    };
  });
}
