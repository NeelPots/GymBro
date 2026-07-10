import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { createClient } from "@/lib/supabase/server";
import { signOut } from "@/lib/actions/auth";
import { SettingsActions } from "@/components/settings/SettingsActions";
import { SettingsRow, SettingsSection } from "@/components/settings/SettingsRow";

async function getSignedInUser() {
  if (!isSupabaseConfigured) return null;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: profile } = await supabase
    .from("profiles")
    .select("display_name, avatar_url")
    .eq("id", user.id)
    .single();

  return {
    email: user.email ?? null,
    displayName: profile?.display_name ?? null,
    avatarUrl: profile?.avatar_url ?? null,
  };
}

export default async function SettingsPage() {
  const user = await getSignedInUser();

  return (
    <div className="flex flex-col gap-5 pt-2">
      <div>
        <div className="font-mono text-[11px] font-semibold uppercase tracking-wider text-signal">
          Settings
        </div>
        <h1 className="mt-1 font-display text-2xl font-bold tracking-tight">Preferences</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Manage your account, appearance, and local data.
        </p>
      </div>

      <SettingsSection label="Account">
        {!isSupabaseConfigured ? (
          <SettingsRow
            label="Local mode"
            description="Connect a Supabase project (.env.local.example) to enable accounts and sync."
            control={<Badge variant="outline">Not connected</Badge>}
          />
        ) : user ? (
          <>
            <SettingsRow
              label={user.displayName ?? "Signed in"}
              description={user.email ?? "Connected to Supabase"}
              control={
                <Avatar size="sm">
                  {user.avatarUrl && <AvatarImage src={user.avatarUrl} alt="" />}
                  <AvatarFallback>
                    {(user.displayName ?? user.email ?? "?").charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              }
            />
            <SettingsRow
              label="Profile"
              description="Your training stats and social activity, in one place."
              control={
                <Link href="/profile" className="text-sm font-medium text-signal underline-offset-4 hover:underline">
                  View profile
                </Link>
              }
            />
            <SettingsRow
              label="Session"
              description="Sign out of this account on this device."
              control={
                <form action={signOut}>
                  <Button type="submit" variant="outline" size="sm">
                    Sign out
                  </Button>
                </form>
              }
            />
          </>
        ) : (
          <SettingsRow
            label="Connected to Supabase"
            description="Sign in to sync your data across devices."
            control={
              <Link href="/login" className="text-sm font-medium text-signal underline-offset-4 hover:underline">
                Sign in
              </Link>
            }
          />
        )}
      </SettingsSection>

      <SettingsSection label="Appearance">
        <SettingsRow
          label="Theme"
          description="GymBro is dark-first by design - no light theme yet."
          control={<Badge variant="secondary">Dark</Badge>}
        />
      </SettingsSection>

      <SettingsSection label="Local data">
        <SettingsRow
          label="Stored on this device"
          description="Movements, logs, and streaks live in this browser's local storage."
          control={<SettingsActions />}
        />
      </SettingsSection>
    </div>
  );
}
