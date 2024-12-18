import { AnimatedPage } from "@/presentation/components/animated-page";

import { SignUpForm } from "./_components/sign-up-form";

export default function SignUpScreen() {
  return (
    <AnimatedPage>
      <section className="max-w-md w-full mx-auto">
        <h2 className="mb-2 text-2xl font-semibold text-foreground">Create account</h2>
        <p className="mb-6 text-sm text-muted-foreground">Don't you have an account yet? Create now</p>

        <SignUpForm />
      </section>
    </AnimatedPage>
  );
}
