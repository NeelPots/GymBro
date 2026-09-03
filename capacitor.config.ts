import type { CapacitorConfig } from "@capacitor/cli";

/**
 * This app ships as a thin native wrapper, not a bundled static build - the
 * server routes (AI generation, Supabase auth callback, middleware-based
 * session refresh) can't be `next export`ed, so the WebView loads the real
 * deployed site directly rather than a local copy. `androidScheme: "https"`
 * (not Capacitor's default "http") matters here since Supabase's session
 * cookies and the app's own fetch calls all assume a secure origin.
 *
 * appId is permanent once this is published to the Play Store - pick it
 * deliberately before then, it can't be changed for an existing listing
 * afterward (only by publishing as a brand new app).
 */
const config: CapacitorConfig = {
  appId: "com.lockinn.app",
  appName: "Lock Inn",
  webDir: "www",
  server: {
    url: "https://gym-bro-sand-five.vercel.app",
    androidScheme: "https",
  },
  android: {
    backgroundColor: "#050b22",
  },
};

export default config;
