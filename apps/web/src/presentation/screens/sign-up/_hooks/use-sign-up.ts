import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { z } from "zod";

import { AuthAdapter } from "@/adapters/auth-adapter";
import { useToast } from "@/presentation/components/ui/use-toast";

const signUpSchema = z.object({
  name: z.string().min(6).max(255),
  email: z.string().email().min(6).max(255),
  password: z.string().min(6).max(255),
});

type SignUpFormSchema = z.infer<typeof signUpSchema>;

interface UseSignUpProps {
  authAdapter: AuthAdapter;
}

export function useSignUp({ authAdapter }: UseSignUpProps) {
  const { toast } = useToast();
  const navigate = useNavigate();
  const form = useForm<SignUpFormSchema>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      email: "",
      name: "",
      password: "",
    },
  });

  async function submitForm(data: SignUpFormSchema) {
    try {
      await authAdapter.signUp(data);

      toast({
        title: "Sign up successfully",
        description: "You have successfully signed up. You can now log in",
        variant: "default",
        duration: 3000,
      });
      navigate(`/sign-in?email=${encodeURI(data.email)}`);
    } catch (error) {
      if (error instanceof Response && error.status === 409) {
        toast({
          title: "Email already in use",
          description: "Please, choose a different email address",
          variant: "destructive",
          duration: 3000,
        });
        form.setError("email", {
          message: "Email already in use",
        });
        return;
      }

      toast({
        title: "Failed to sign up",
        description: "Please, check the form for errors and try again",
        variant: "destructive",
        duration: 3000,
      });
    }
  }

  return {
    submitForm,
    form,
  };
}
