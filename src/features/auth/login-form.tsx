"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

const schema = z.object({
  email: z.string().email({ message: "Enter a valid email" }),
  password: z.string().min(8, "At least 8 characters"),
});

type Values = z.infer<typeof schema>;

export function LoginForm() {
  const form = useForm<Values>({
    resolver: zodResolver(schema),
    mode: "onBlur",
    defaultValues: { email: "", password: "" },
  });

  const submit = form.handleSubmit(() => {
    // Pending auth backend (OTP / OAuth / Credentials)
  });

  return (
    <Card className="shadow-none lg:sticky lg:top-28 mx-auto mt-14 w-full max-w-md lg:mr-12">
      <CardHeader className="space-y-2">
        <p className="text-muted-foreground text-xs uppercase">Account</p>
        <p className="font-medium text-xl tracking-tight">Sign in</p>
      </CardHeader>
      <CardContent>
        <form className="flex flex-col gap-4" onSubmit={submit} noValidate>
          <div className="space-y-2">
            <label className="text-muted-foreground text-xs uppercase" htmlFor="email">
              Email
            </label>
            <Input id="email" type="email" autoComplete="email" {...form.register("email")} />
            <FieldError>{form.formState.errors.email?.message}</FieldError>
          </div>
          <div className="space-y-2">
            <label className="text-muted-foreground text-xs uppercase" htmlFor="pwd">
              Password
            </label>
            <Input id="pwd" type="password" autoComplete="current-password" {...form.register("password")} />
            <FieldError>{form.formState.errors.password?.message}</FieldError>
          </div>
          <Button type="submit" disabled={form.formState.isSubmitting} className="mt-4 w-full">
            Continue
          </Button>
        </form>
      </CardContent>
      <CardFooter className="text-muted-foreground text-[0.8rem] leading-relaxed">
        <p>
          Sign-in will connect to your commerce profile when authentication ships. Password recovery and SSO will
          appear in the same release — this form is layout-only for now.
        </p>
      </CardFooter>
    </Card>
  );
}

function FieldError({ children }: { children?: string }) {
  if (!children) return null;
  return <p className="text-xs text-destructive">{children}</p>;
}
