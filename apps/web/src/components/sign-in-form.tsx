import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 as Loader2Icon } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { authenticateUserService } from "@/services/authenticate-user-service";

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

export function SignInForm() {
  const form = useForm<SignInFormSchema>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const { toast } = useToast();
  // const router = useRouter();

  async function submitForm(data: SignInFormSchema) {
    try {
      const { token } = await authenticateUserService({
        email: data.email,
        password: data.password,
      });
      console.log(token);

      toast({
        title: "Login successfully",
        description: "You have successfully logged in.",
        variant: "default",
        duration: 3000,
      });
    } catch (error) {
      console.log({ error });

      toast({
        title: "Failed to login",
        description: "Please, confirm your email and password combination",
        variant: "destructive",
        duration: 3000,
      });
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(submitForm)} className="flex flex-col gap-4">
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
                <Input type="password" placeholder="my-password" className="w-full" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
          {form.formState.isSubmitting ? <Loader2Icon className="mr-2 h-4 w-4 animate-spin" /> : <>Join</>}
        </Button>
      </form>
    </Form>
  );
}
