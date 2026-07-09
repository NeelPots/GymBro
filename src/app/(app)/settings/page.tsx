import Link from "next/link";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { SettingsActions } from "@/components/settings/SettingsActions";

export default function SettingsPage() {
  return (
    <div className="flex flex-col gap-4 pt-2">
      <div className="rounded-[var(--radius)] border border-border bg-surface p-5">
        <h2 className="font-display text-[17px] font-semibold">Account</h2>
        {isSupabaseConfigured ? (
          <p className="mt-2 text-sm text-muted-foreground">
            Connected to Supabase.{" "}
            <Link href="/login" className="text-signal underline-offset-4 hover:underline">
              Sign in
            </Link>{" "}
            to sync your data across devices.
          </p>
        ) : (
          <p className="mt-2 text-sm text-muted-foreground">
            Running in local mode - your data stays on this device only. Connect a Supabase
            project (see <code className="font-mono text-xs">.env.local.example</code>) to enable
            accounts, sync, and the features planned for later phases.
          </p>
        )}
      </div>

      <div className="rounded-[var(--radius)] border border-border bg-surface p-5">
        <h2 className="font-display text-[17px] font-semibold">Local data</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Your movements, logs, and streaks are stored in this browser&apos;s local storage.
        </p>
        <SettingsActions />
      </div>
    </div>
  );
}
