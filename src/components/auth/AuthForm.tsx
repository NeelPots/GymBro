"use client";

import { useActionState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { GoogleSignInButton } from "@/components/auth/GoogleSignInButton";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import type { AuthFormState } from "@/lib/actions/auth";

interface AuthFormProps {
  title: string;
  action: (state: AuthFormState, formData: FormData) => Promise<AuthFormState>;
  submitLabel: string;
  altHref: string;
  altLabel: string;
}

export function AuthForm({ title, action, submitLabel, altHref, altLabel }: AuthFormProps) {
  const [state, formAction, pending] = useActionState(action, {});

  return (
    <div className="flex flex-col gap-6">
      <h1 className="font-display text-xl font-bold">{title}</h1>

      {isSupabaseConfigured && (
        <div className="flex flex-col gap-4">
          <GoogleSignInButton />
          <div className="flex items-center gap-3">
            <div className="h-px flex-1 bg-border" />
            <span className="font-mono text-[11px] uppercase tracking-wide text-muted-foreground">or</span>
            <div className="h-px flex-1 bg-border" />
          </div>
        </div>
      )}

      <form action={formAction} className="flex flex-col gap-4">
        <div>
          <Label htmlFor="email" className="mb-2 block text-xs uppercase tracking-wide text-muted-foreground">
            Email
          </Label>
          <Input id="email" name="email" type="email" required autoComplete="email" />
        </div>
        <div>
          <Label htmlFor="password" className="mb-2 block text-xs uppercase tracking-wide text-muted-foreground">
            Password
          </Label>
          <Input id="password" name="password" type="password" required autoComplete="current-password" minLength={6} />
        </div>

        {state?.error && <p className="text-sm text-destructive">{state.error}</p>}

        <Button type="submit" disabled={pending} className="mt-1">
          {pending ? "Please wait…" : submitLabel}
        </Button>
      </form>

      <p className="text-center text-sm text-muted-foreground">
        <Link href={altHref} className="text-signal underline-offset-4 hover:underline">
          {altLabel}
        </Link>
      </p>
    </div>
  );
}
