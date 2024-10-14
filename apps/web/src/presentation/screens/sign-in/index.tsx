import { Link } from "react-router-dom";

import { AnimatedPage } from "@/presentation/components/animated-page";
import { Button } from "@/presentation/components/ui/button";

import { SignInForm } from "./_components/sign-in-form";

export default function SignInScreen() {
  return (
    <AnimatedPage>
      <section className="max-w-md w-full mx-auto">
        <h2 className="mb-2 text-2xl font-semibold text-foreground">Continue with your account</h2>
        <p className="mb-6 text-sm text-muted-foreground">Enter your email and password combination to proceed</p>

        <SignInForm />

        <Button asChild variant="link">
          <Link to="/sign-up">Don't have an account? Create now!</Link>
        </Button>
      </section>
    </AnimatedPage>
  );
}
