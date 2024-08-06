"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";

const signInSchema = z.object({
  email: z.string().email().min(6).max(255),
  password: z.string().min(6).max(255),
});

type SignInFormSchema = z.infer<typeof signInSchema>;

export function SignInForm() {
  const {
    formState: { errors },
    register,
    handleSubmit,
  } = useForm<SignInFormSchema>({
    resolver: zodResolver(signInSchema),
  });

  const router = useRouter();

  async function submitForm(data: SignInFormSchema) {
    await signIn("credentials", {
      redirect: false,
      email: data.email,
      password: data.password,
    });

    router.replace("/dash");
  }

  return (
    <form onSubmit={handleSubmit(submitForm)} className="flex flex-col gap-4">
      <div>
        <Label>
          <span className="block mb-2 text-base">Email</span>
          <Input type="email" placeholder="name@example.com" className="w-full" {...register("email")} />
        </Label>
        {errors.email?.message ? <span className="">{errors.email.message}</span> : null}
      </div>

      <div>
        <Label>
          <span className="block mb-2 text-base">Password</span>
          <Input type="password" placeholder="my-password" className="w-full" {...register("password")} />
        </Label>
      </div>

      <Button type="submit" className="w-full">
        Join
      </Button>
    </form>
  );
}
