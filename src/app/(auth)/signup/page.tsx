import { AuthForm } from "@/components/auth/AuthForm";
import { signUp } from "@/lib/actions/auth";

export default function SignupPage() {
  return (
    <AuthForm
      title="Sign up"
      action={signUp}
      submitLabel="Sign up"
      altHref="/login"
      altLabel="Already have an account? Log in"
    />
  );
}
