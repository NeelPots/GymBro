import { ProfileView } from "@/components/profile/ProfileView";
import { getExercises } from "@/services/movements/getExercises";
import { getMyPosts } from "@/services/social/getMyPosts";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { createClient } from "@/lib/supabase/server";
import type { SupabaseProfileInfo } from "@/components/profile/ProfileView";
import type { Post } from "@/lib/types/domain";

export default async function ProfilePage() {
  const exercises = await getExercises();

  let supabaseUser: SupabaseProfileInfo | null = null;
  let myPosts: Post[] = [];

  if (isSupabaseConfigured) {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (user) {
      const { data: profile } = await supabase
        .from("profiles")
        .select("username, display_name, avatar_url")
        .eq("id", user.id)
        .single();

      supabaseUser = {
        email: user.email ?? null,
        displayName: profile?.display_name ?? null,
        username: profile?.username ?? null,
        avatarUrl: profile?.avatar_url ?? null,
        memberSince: user.created_at ?? null,
      };
      myPosts = await getMyPosts(user.id);
    }
  }

  return <ProfileView exercises={exercises} supabaseUser={supabaseUser} myPosts={myPosts} />;
}
