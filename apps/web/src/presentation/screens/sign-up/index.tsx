import { AnimatedPage } from "@/presentation/components/animated-page";

import { SignUpForm } from "./_components/sign-up-form";

// export const metadata: Metadata = {
//   title: "Sign Up - FTask Management",
//   description: "Finish your account registration",
// };

export default function SignUpScreen() {
  return (
    <AnimatedPage>
      <section className="max-w-md w-full mx-auto">
        <h2 className="mb-2 text-2xl font-semibold">Create account</h2>
        <p className="mb-6 text-sm text-muted-foreground">Don't you have an account yet? Create now</p>

        <SignUpForm />
      </section>
    </AnimatedPage>
  );
}
