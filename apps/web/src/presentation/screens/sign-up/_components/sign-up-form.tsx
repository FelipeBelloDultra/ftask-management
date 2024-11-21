import { Loader2Icon } from "@/presentation/components/icons";
import { PasswordInput } from "@/presentation/components/input-password";
import { Button } from "@/presentation/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/presentation/components/ui/form";
import { Input } from "@/presentation/components/ui/input";
import { useDependencies } from "@/presentation/hooks/use-dependencies";

import { useSignUp } from "../_hooks/use-sign-up";

export function SignUpForm() {
  const { authAdapter } = useDependencies();
  const { form, submitForm } = useSignUp({ authAdapter });

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
                <PasswordInput placeholder="my-password" {...field} />
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
