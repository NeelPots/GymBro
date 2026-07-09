"use server";

import { redirect } from "next/navigation";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { createClient } from "@/lib/supabase/server";

export interface AuthFormState {
  error?: string;
}

export async function signIn(_prevState: AuthFormState, formData: FormData): Promise<AuthFormState> {
  if (!isSupabaseConfigured) {
    return { error: "Supabase isn't connected yet - see .env.local.example." };
  }

  const email = String(formData.get("email") ?? "");
  const password = String(formData.get("password") ?? "");

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) return { error: error.message };

  redirect("/home");
}

export async function signUp(_prevState: AuthFormState, formData: FormData): Promise<AuthFormState> {
  if (!isSupabaseConfigured) {
    return { error: "Supabase isn't connected yet - see .env.local.example." };
  }

  const email = String(formData.get("email") ?? "");
  const password = String(formData.get("password") ?? "");

  const supabase = await createClient();
  const { error } = await supabase.auth.signUp({ email, password });
  if (error) return { error: error.message };

  redirect("/home");
}

export async function signOut() {
  if (!isSupabaseConfigured) {
    redirect("/home");
  }
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/login");
}
