import "server-only";
import { createClient } from "@/lib/supabase/server";
import type { Database } from "@/lib/types/database.types";
import type { Story } from "@/lib/types/domain";

type StoryRow = Database["public"]["Tables"]["stories"]["Row"];
type ProfileRow = Database["public"]["Tables"]["profiles"]["Row"];

/** Active (non-expired) stories, most recent per user. */
export async function getStories(): Promise<Story[]> {
  const supabase = await createClient();

  const { data: storiesData, error } = await supabase
    .from("stories")
    .select("id, user_id, media_url, media_type, created_at, expires_at")
    .gt("expires_at", new Date().toISOString())
    .order("created_at", { ascending: false });

  if (error || !storiesData || storiesData.length === 0) return [];

  const stories = storiesData as Pick<
    StoryRow,
    "id" | "user_id" | "media_url" | "media_type" | "created_at" | "expires_at"
  >[];

  const userIds = [...new Set(stories.map((s) => s.user_id))];
  const { data: profilesData } = await supabase
    .from("profiles")
    .select("id, username, display_name, avatar_url")
    .in("id", userIds);

  const profiles = (profilesData ?? []) as Pick<
    ProfileRow,
    "id" | "username" | "display_name" | "avatar_url"
  >[];
  const profileById = new Map(profiles.map((p) => [p.id, p]));

  const latestPerUser = new Map<string, (typeof stories)[number]>();
  for (const story of stories) {
    if (!latestPerUser.has(story.user_id)) {
      latestPerUser.set(story.user_id, story);
    }
  }

  return [...latestPerUser.values()].map((s) => {
    const profile = profileById.get(s.user_id);
    return {
      id: s.id,
      author: {
        id: s.user_id,
        username: profile?.username ?? null,
        displayName: profile?.display_name ?? null,
        avatarUrl: profile?.avatar_url ?? null,
      },
      mediaUrl: s.media_url,
      mediaType: s.media_type,
      createdAt: s.created_at,
      expiresAt: s.expires_at,
    };
  });
}
