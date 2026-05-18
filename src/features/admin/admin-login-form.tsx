"use client";

import { useRouter } from "next/navigation";
import * as React from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function AdminLoginForm({ notice }: { notice?: string | null }) {
  const router = useRouter();
  const [token, setToken] = React.useState("");
  const [busy, setBusy] = React.useState(false);
  const [banner, setBanner] = React.useState<{ tone: "ok" | "err"; text: string } | null>(null);

  async function authenticate(event: React.FormEvent) {
    event.preventDefault();
    setBusy(true);
    setBanner(null);

    try {
      const res = await fetch("/api/admin/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token }),
      });
      const body = await res.json().catch(() => ({}));
      if (!res.ok) {
        setBanner({ tone: "err", text: typeof body?.error === "string" ? body.error : "Login failed" });
        return;
      }
      setBanner({ tone: "ok", text: body?.note ?? "Session established" });
      router.replace("/admin");
      router.refresh();
    } finally {
      setBusy(false);
    }
  }

  return (
    <form className="mx-auto w-full max-w-md space-y-5 rounded-2xl border border-zinc-800 bg-zinc-950/80 p-8" onSubmit={authenticate}>
      <div className="space-y-1">
        <p className="text-zinc-500 text-[0.65rem] uppercase">Operator access</p>
        <h1 className="text-white text-xl font-semibold tracking-tight">Sign Fashion CMS</h1>
        <p className="text-muted-foreground text-sm">
          Enter the shared ADMIN_SESSION_TOKEN from your secrets manager. SSO extensions land later.
        </p>
      </div>
      {notice === "config" && (
        <p className="text-destructive text-sm">
          Admin gate is mandatory in production. Set ADMIN_SESSION_TOKEN in the deployment environment before continuing.
        </p>
      )}
      <label className="block space-y-2 text-[0.7rem] text-zinc-300 uppercase tracking-wide">
        Session token
        <Input autoComplete="off" value={token} onChange={(e) => setToken(e.target.value)} type="password" />
      </label>
      <Button disabled={busy} type="submit" className="w-full">
        {busy ? "Authorizing..." : "Enter console"}
      </Button>
      {banner && (
        <p className={banner.tone === "err" ? "text-destructive text-sm" : "text-emerald-400 text-sm"}>{banner.text}</p>
      )}
    </form>
  );
}
