import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useSearchParams } from "react-router-dom";
import { z } from "zod";

import { useToast } from "@/presentation/components/ui/use-toast";
import { useAuth } from "@/presentation/hooks/use-auth";

const signInSchema = z.object({
  email: z
    .string({
      message: "The field email is required",
    })
    .email({
      message: "The field email must be a valid email address",
    })
    .min(6)
    .max(255),
  password: z
    .string({
      message: "The field password is required",
    })
    .min(6)
    .max(255),
});

type SignInFormSchema = z.infer<typeof signInSchema>;

function validateExternalEmail(email: string | null): string {
  if (!email) return "";

  const { success, data } = z.string().email().safeParse(email);

  return !success ? "" : data;
}

export function useSignIn() {
  const [searchParams] = useSearchParams();
  const email = validateExternalEmail(searchParams.get("email"));
  const mustFocusEmail = Boolean(!email);
  const { signIn } = useAuth();
  const { toast } = useToast();
  const form = useForm<SignInFormSchema>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email,
      password: "",
    },
  });

  async function submitForm(data: SignInFormSchema) {
    try {
      await signIn(data);

      toast({
        title: "Login successfully",
        description: "You have successfully logged in.",
        variant: "default",
        duration: 3000,
      });
    } catch (error) {
      toast({
        title: "Failed to login",
        description: "Please, confirm your email and password combination",
        variant: "destructive",
        duration: 3000,
      });
    }
  }

  return {
    submitForm,
    form,
    mustFocusEmail,
  };
}
