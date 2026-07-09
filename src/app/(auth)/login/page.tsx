import { AuthForm } from "@/components/auth/AuthForm";
import { signIn } from "@/lib/actions/auth";

export default function LoginPage() {
  return (
    <AuthForm
      title="Log in"
      action={signIn}
      submitLabel="Log in"
      altHref="/signup"
      altLabel="Don't have an account? Sign up"
    />
  );
}
