import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { useSearchParams } from "react-router-dom";
import { z } from "zod";

import { AuthAdapter } from "@/adapters/auth-adapter";
import { env } from "@/config/env";
import { useToast } from "@/presentation/components/ui/use-toast";
import { useSignedInStore } from "@/presentation/store/user";

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

interface UseSignInProps {
  authAdapter: AuthAdapter;
}

function validateExternalEmail(email: string | null): string {
  if (!email) return "";

  const { success, data } = z.string().email().safeParse(email);

  return !success ? "" : data;
}

export function useSignIn({ authAdapter }: UseSignInProps) {
  const { toast } = useToast();
  const { actions } = useSignedInStore();
  const [searchParams] = useSearchParams();
  const email = validateExternalEmail(searchParams.get("email"));
  const mustFocusEmail = Boolean(!email);
  const { mutateAsync } = useMutation({
    mutationFn: (data: SignInFormSchema) => authAdapter.signIn(data),
    onSuccess: ({ token }) => {
      localStorage.setItem(env.jwtPrefix, token);
      actions.setSignedIn();

      toast({
        title: "Login successfully",
        description: "You have successfully logged in.",
        variant: "default",
        duration: 3000,
      });
    },
    onError: () => {
      toast({
        title: "Failed to login",
        description: "Please, confirm your email and password combination",
        variant: "destructive",
        duration: 3000,
      });
    },
  });
  const form = useForm<SignInFormSchema>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email,
      password: "",
    },
  });

  async function submitForm(data: SignInFormSchema) {
    await mutateAsync(data);
  }

  return {
    submitForm,
    form,
    mustFocusEmail,
  };
}
