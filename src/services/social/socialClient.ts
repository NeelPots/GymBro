"use client";

import { createClient } from "@/lib/supabase/client";
import type { Database } from "@/lib/types/database.types";
import type { Comment } from "@/lib/types/domain";

type PostInsert = Database["public"]["Tables"]["posts"]["Insert"];
type StoryInsert = Database["public"]["Tables"]["stories"]["Insert"];
type LikeInsert = Database["public"]["Tables"]["post_likes"]["Insert"];
type CommentInsert = Database["public"]["Tables"]["post_comments"]["Insert"];
type CommentRow = Database["public"]["Tables"]["post_comments"]["Row"];
type ProfileRow = Database["public"]["Tables"]["profiles"]["Row"];

async function requireUserId(): Promise<string> {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("You need to be signed in to do that.");
  return user.id;
}

async function uploadMedia(userId: string, file: File): Promise<string> {
  const supabase = createClient();
  const path = `${userId}/${crypto.randomUUID()}-${file.name}`;
  const { error } = await supabase.storage.from("social-media").upload(path, file);
  if (error) throw error;
  const { data } = supabase.storage.from("social-media").getPublicUrl(path);
  return data.publicUrl;
}

export async function createPost(caption: string, file: File): Promise<void> {
  const userId = await requireUserId();
  const mediaUrl = await uploadMedia(userId, file);
  const supabase = createClient();
  const payload: PostInsert = {
    user_id: userId,
    caption: caption.trim().length > 0 ? caption.trim() : null,
    media_url: mediaUrl,
    media_type: file.type.startsWith("video") ? "video" : "image",
  };
  const { error } = await supabase.from("posts").insert(payload);
  if (error) throw error;
}

export async function createStory(file: File): Promise<void> {
  const userId = await requireUserId();
  const mediaUrl = await uploadMedia(userId, file);
  const supabase = createClient();
  const payload: StoryInsert = {
    user_id: userId,
    media_url: mediaUrl,
    media_type: file.type.startsWith("video") ? "video" : "image",
  };
  const { error } = await supabase.from("stories").insert(payload);
  if (error) throw error;
}

export async function toggleLike(postId: string, currentlyLiked: boolean): Promise<void> {
  const userId = await requireUserId();
  const supabase = createClient();
  if (currentlyLiked) {
    const { error } = await supabase.from("post_likes").delete().eq("post_id", postId).eq("user_id", userId);
    if (error) throw error;
  } else {
    const payload: LikeInsert = { post_id: postId, user_id: userId };
    const { error } = await supabase.from("post_likes").insert(payload);
    if (error) throw error;
  }
}

export async function addComment(postId: string, body: string): Promise<void> {
  const userId = await requireUserId();
  const supabase = createClient();
  const payload: CommentInsert = { post_id: postId, user_id: userId, body: body.trim() };
  const { error } = await supabase.from("post_comments").insert(payload);
  if (error) throw error;
}

export async function getComments(postId: string): Promise<Comment[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("post_comments")
    .select("id, post_id, user_id, body, created_at")
    .eq("post_id", postId)
    .order("created_at", { ascending: true });

  if (error || !data) return [];

  const comments = data as Pick<CommentRow, "id" | "post_id" | "user_id" | "body" | "created_at">[];
  const userIds = [...new Set(comments.map((c) => c.user_id))];
  const { data: profilesData } = await supabase
    .from("profiles")
    .select("id, username, display_name, avatar_url")
    .in("id", userIds);
  const profiles = (profilesData ?? []) as Pick<
    ProfileRow,
    "id" | "username" | "display_name" | "avatar_url"
  >[];
  const profileById = new Map(profiles.map((p) => [p.id, p]));

  return comments.map((c) => {
    const profile = profileById.get(c.user_id);
    return {
      id: c.id,
      postId: c.post_id,
      body: c.body,
      createdAt: c.created_at,
      author: {
        id: c.user_id,
        username: profile?.username ?? null,
        displayName: profile?.display_name ?? null,
        avatarUrl: profile?.avatar_url ?? null,
      },
    };
  });
}

export async function deletePost(postId: string): Promise<void> {
  const supabase = createClient();
  const { error } = await supabase.from("posts").delete().eq("id", postId);
  if (error) throw error;
}
