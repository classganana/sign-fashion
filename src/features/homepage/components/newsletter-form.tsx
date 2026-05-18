"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const schema = z.object({
  email: z.string().email({ message: "Enter a valid email" }),
});

type FormValues = z.infer<typeof schema>;

export function NewsletterForm() {
  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { email: "" },
  });

  const onSubmit = form.handleSubmit(() => {
    form.reset({ email: "" });
  });

  return (
    <>
      <form
        className="flex w-full flex-col gap-4 sm:flex-row sm:justify-center"
        onSubmit={onSubmit}
      >
        <Input
          type="email"
          autoComplete="email"
          aria-label="Email address"
          placeholder="you@email.com"
          className="h-11 sm:max-w-xs"
          {...form.register("email")}
        />
        <Button type="submit" disabled={form.formState.isSubmitting} className="h-11 sm:w-auto">
          Join the list
        </Button>
      </form>
      {form.formState.errors.email ?
        <p className="-mt-4 text-center text-xs text-destructive sm:w-full">
          {form.formState.errors.email.message}
        </p>
      : null}
    </>
  );
}
