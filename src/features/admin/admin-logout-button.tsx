"use client";

import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";

export function AdminLogoutButton() {
  const router = useRouter();

  async function logout() {
    await fetch("/api/admin/auth/logout", { method: "POST" });
    router.replace("/admin/login");
    router.refresh();
  }

  return (
    <Button type="button" variant="outline" size="xs" className="text-zinc-200" onClick={logout}>
      Log out
    </Button>
  );
}
