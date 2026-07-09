import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";

/**
 * Refreshes the Supabase auth cookie on every request. Called from
 * src/proxy.ts (Next.js 16 renamed "middleware" to "proxy" - see
 * node_modules/next/dist/docs/01-app/02-guides/upgrading/version-16.md).
 * A no-op until NEXT_PUBLIC_SUPABASE_URL/ANON_KEY are set, so the app
 * still runs before a Supabase project exists.
 */
export async function updateSession(request: NextRequest) {
  const response = NextResponse.next({ request });

  if (!isSupabaseConfigured) {
    return response;
  }

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  // Required so the session cookie gets refreshed - do not remove.
  await supabase.auth.getUser();

  return response;
}
