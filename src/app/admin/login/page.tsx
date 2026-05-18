import type { Metadata } from "next";

import { AdminLoginForm } from "@/features/admin/admin-login-form";

export const metadata: Metadata = {
  title: "Admin · Login",
};

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams?: Promise<{ notice?: string }>;
}) {
  const query = await searchParams;
  return (
    <div className="bg-background flex min-h-screen items-center px-6 py-12">
      <AdminLoginForm notice={query?.notice} />
    </div>
  );
}
