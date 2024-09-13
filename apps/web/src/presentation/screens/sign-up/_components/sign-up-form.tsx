import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { z } from "zod";

import { Loader2Icon } from "@/presentation/components/icons";
import { Button } from "@/presentation/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/presentation/components/ui/form";
import { Input } from "@/presentation/components/ui/input";
import { useToast } from "@/presentation/components/ui/use-toast";
import { createUserService } from "@/services/create-user-service";

const signUpSchema = z.object({
  name: z.string().min(6).max(255),
  email: z.string().email().min(6).max(255),
  password: z.string().min(6).max(255),
});

type SignUpFormSchema = z.infer<typeof signUpSchema>;

export function SignUpForm() {
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
      await createUserService(data);

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

  return (
    <Form {...form}>
      <form className="flex flex-col gap-4" onSubmit={form.handleSubmit(submitForm)}>
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input autoFocus type="text" placeholder="John Doe" className="w-full" {...field} />
              </FormControl>
              <FormMessage className="font-semibold" />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input type="email" placeholder="name@example.com" className="w-full" {...field} />
              </FormControl>
              <FormMessage className="font-semibold" />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input type="password" placeholder="my-password" className="w-full pr-11" {...field} />
              </FormControl>
              <FormMessage className="font-semibold" />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
          {form.formState.isSubmitting ? <Loader2Icon className="mr-2 h-4 w-4 animate-spin" /> : <>Create account</>}
        </Button>
      </form>
    </Form>
  );
}
