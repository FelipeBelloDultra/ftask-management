import { Loader2Icon } from "@/presentation/components/icons";
import { PasswordInput } from "@/presentation/components/input-password";
import { Button } from "@/presentation/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/presentation/components/ui/form";
import { Input } from "@/presentation/components/ui/input";

import { useSignIn } from "../_hooks/use-sign-in";

export function SignInForm() {
  const { form, submitForm, mustFocusEmail } = useSignIn();

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
                <Input
                  autoFocus={mustFocusEmail}
                  type="email"
                  placeholder="name@example.com"
                  className="w-full"
                  {...field}
                />
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
                <PasswordInput autoFocus={!mustFocusEmail} placeholder="my-password" {...field} />
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
