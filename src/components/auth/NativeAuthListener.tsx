"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Capacitor } from "@capacitor/core";
import { App } from "@capacitor/app";
import { Browser } from "@capacitor/browser";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase/client";

/**
 * Completes the native Google sign-in round trip: GoogleSignInButton opens
 * the OAuth URL in the system browser (Capacitor's Browser plugin) because
 * Google refuses to authenticate inside a plain WebView; once the user
 * approves, Google/Supabase redirect to the com.lockinn.app://auth/callback
 * deep link registered in AndroidManifest.xml, which Capacitor's App plugin
 * surfaces here as an `appUrlOpen` event carrying that same URL. No-ops
 * entirely on the web (only relevant inside the native shell).
 */
export function NativeAuthListener() {
  const router = useRouter();

  useEffect(() => {
    if (!Capacitor.isNativePlatform()) return;

    const sub = App.addListener("appUrlOpen", async ({ url }) => {
      if (!url.startsWith("com.lockinn.app://auth/callback")) return;

      const code = new URL(url).searchParams.get("code");
      await Browser.close().catch(() => {});
      if (!code) return;

      const supabase = createClient();
      const { error } = await supabase.auth.exchangeCodeForSession(code);
      if (error) {
        toast.error(error.message);
        return;
      }
      router.replace("/home");
    });

    return () => {
      void sub.then((s) => s.remove());
    };
  }, [router]);

  return null;
}
