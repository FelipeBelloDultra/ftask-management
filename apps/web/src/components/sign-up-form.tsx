"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";

const signUpSchema = z.object({
  name: z.string().min(6).max(255),
  email: z.string().email().min(6).max(255),
  password: z.string().min(6).max(255),
});

type SignUpFormSchema = z.infer<typeof signUpSchema>;

export function SignUpForm() {
  const {
    formState: { errors },
    register,
    handleSubmit,
  } = useForm<SignUpFormSchema>({
    resolver: zodResolver(signUpSchema),
  });

  function submitForm(data: SignUpFormSchema) {
    console.log(data);
  }

  return (
    <form onSubmit={handleSubmit(submitForm)} className="flex flex-col gap-4">
      <div>
        <Label>
          <span className="block mb-2 text-base">Name</span>
          <Input type="name" placeholder="John Doe" className="w-full" {...register("name")} />
        </Label>
        {errors.name?.message ? <span className="">{errors.name.message}</span> : null}
      </div>

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
        {errors.password?.message ? <span className="">{errors.password.message}</span> : null}
      </div>

      <Button type="submit" className="w-full">
        Create account
      </Button>
    </form>
  );
}
