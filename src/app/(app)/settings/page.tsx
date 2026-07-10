import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { SettingsActions } from "@/components/settings/SettingsActions";
import { SettingsRow, SettingsSection } from "@/components/settings/SettingsRow";

export default function SettingsPage() {
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
        {isSupabaseConfigured ? (
          <SettingsRow
            label="Connected to Supabase"
            description="Sign in to sync your data across devices."
            control={
              <Link href="/login" className="text-sm font-medium text-signal underline-offset-4 hover:underline">
                Sign in
              </Link>
            }
          />
        ) : (
          <SettingsRow
            label="Local mode"
            description="Connect a Supabase project (.env.local.example) to enable accounts and sync."
            control={<Badge variant="outline">Not connected</Badge>}
          />
        )}
      </SettingsSection>

      <SettingsSection label="Appearance">
        <SettingsRow
          label="Theme"
          description="Adaptive Coach is dark-first by design - no light theme yet."
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
