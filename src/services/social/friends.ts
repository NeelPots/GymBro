"use client";

import { createClient } from "@/lib/supabase/client";
import type { Database } from "@/lib/types/database.types";

type FriendshipInsert = Database["public"]["Tables"]["friendships"]["Insert"];
type ProfileRow = Database["public"]["Tables"]["profiles"]["Row"];

export interface FriendProfile {
  id: string;
  username: string | null;
  displayName: string | null;
  avatarUrl: string | null;
  level: number;
  rankTitle: string;
}

export interface PendingRequest {
  friendshipId: string;
  from: FriendProfile;
}

async function requireUserId(): Promise<string> {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("You need to be signed in to do that.");
  return user.id;
}

function toFriendProfile(profile: Pick<ProfileRow, "id" | "username" | "display_name" | "avatar_url">, state: { state: unknown } | null): FriendProfile {
  const questState = (state?.state ?? {}) as { xp?: number };
  const xp = typeof questState.xp === "number" ? questState.xp : 0;
  // Mirrors levelFromXp's curve without importing it here to keep this a thin data layer.
  let level = 1;
  let remaining = xp;
  while (remaining >= 100 + (level - 1) * 25) {
    remaining -= 100 + (level - 1) * 25;
    level += 1;
  }
  return {
    id: profile.id,
    username: profile.username,
    displayName: profile.display_name,
    avatarUrl: profile.avatar_url,
    level,
    rankTitle: level >= 30 ? "S-Rank Hunter" : level >= 20 ? "A-Rank Hunter" : level >= 15 ? "B-Rank Hunter" : level >= 10 ? "C-Rank Hunter" : level >= 5 ? "D-Rank Hunter" : "E-Rank Trainee",
  };
}

export async function searchProfiles(query: string): Promise<FriendProfile[]> {
  if (query.trim().length === 0) return [];
  const supabase = createClient();
  const userId = await requireUserId();
  const { data, error } = await supabase
    .from("profiles")
    .select("id, username, display_name, avatar_url")
    .neq("id", userId)
    .ilike("username", `%${query.trim()}%`)
    .limit(10);
  if (error || !data) return [];
  return data.map((p) => toFriendProfile(p, null));
}

export async function sendFriendRequest(targetUserId: string): Promise<void> {
  const userId = await requireUserId();
  const supabase = createClient();
  const payload: FriendshipInsert = { requester_id: userId, addressee_id: targetUserId, status: "pending" };
  const { error } = await supabase.from("friendships").insert(payload);
  if (error) throw error;
}

export async function respondToRequest(friendshipId: string, accept: boolean): Promise<void> {
  const supabase = createClient();
  if (accept) {
    const { error } = await supabase.from("friendships").update({ status: "accepted" }).eq("id", friendshipId);
    if (error) throw error;
  } else {
    const { error } = await supabase.from("friendships").delete().eq("id", friendshipId);
    if (error) throw error;
  }
}

export async function getFriends(): Promise<FriendProfile[]> {
  const userId = await requireUserId();
  const supabase = createClient();
  const { data, error } = await supabase
    .from("friendships")
    .select("id, requester_id, addressee_id")
    .eq("status", "accepted")
    .or(`requester_id.eq.${userId},addressee_id.eq.${userId}`);
  if (error || !data || data.length === 0) return [];

  const friendIds = data.map((f) => (f.requester_id === userId ? f.addressee_id : f.requester_id));
  const { data: profiles } = await supabase
    .from("profiles")
    .select("id, username, display_name, avatar_url")
    .in("id", friendIds);
  const { data: states } = await supabase.from("hunter_state").select("user_id, state").in("user_id", friendIds);
  const stateById = new Map((states ?? []).map((s) => [s.user_id, { state: s.state }]));

  return (profiles ?? []).map((p) => toFriendProfile(p, stateById.get(p.id) ?? null));
}

export async function getPendingRequests(): Promise<PendingRequest[]> {
  const userId = await requireUserId();
  const supabase = createClient();
  const { data, error } = await supabase
    .from("friendships")
    .select("id, requester_id")
    .eq("status", "pending")
    .eq("addressee_id", userId);
  if (error || !data || data.length === 0) return [];

  const requesterIds = data.map((f) => f.requester_id);
  const { data: profiles } = await supabase
    .from("profiles")
    .select("id, username, display_name, avatar_url")
    .in("id", requesterIds);
  const profileById = new Map((profiles ?? []).map((p) => [p.id, p]));

  return data
    .map((f) => {
      const profile = profileById.get(f.requester_id);
      if (!profile) return null;
      return { friendshipId: f.id, from: toFriendProfile(profile, null) };
    })
    .filter((r): r is PendingRequest => r !== null);
}
