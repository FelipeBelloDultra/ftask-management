import { Metadata } from "next";
import Link from "next/link";

import { SignInForm } from "@/components/sign-in-form";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Sign In - FTask Management",
  description: "Do your login and make all projects easy.",
};

export default function SignInPage() {
  return (
    <section className="max-w-md w-full mx-auto">
      <h2 className="mb-2 text-2xl font-semibold">Continue with your account</h2>
      <p className="mb-6 text-sm text-muted-foreground">Enter your email and password combination to proceed</p>

      <SignInForm />

      <Button asChild variant="link">
        <Link href="/sign-up">Don't have an account? Create now!</Link>
      </Button>
    </section>
  );
}
