import type { Metadata } from "next";
import Image from "next/image";
import { LoginForm } from "@/features/auth/login-form";

export const metadata: Metadata = {
  title: "Sign in",
};

export default function AuthLoginRoute() {
  return (
    <div className="mx-auto flex min-h-[65vh] w-full max-w-7xl flex-1 flex-col gap-14 px-5 py-14 lg:flex-row lg:items-start lg:px-10">
      <div className="relative hidden lg:flex lg:flex-1 lg:justify-end">
        <div className="relative aspect-[4/5] overflow-hidden rounded-3xl border">
          <Image
            src="https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=1600&q=80"
            alt="Editorial frame for authentication"
            fill
            sizes="48vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-transparent to-transparent" />
        </div>
      </div>
      <div className="flex flex-1 flex-col lg:justify-center">
        <LoginForm />
      </div>
    </div>
  );
}
