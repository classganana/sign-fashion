import type { ReactNode } from "react";

import { AdminLogoutButton } from "@/features/admin/admin-logout-button";
import { AdminSidebar } from "@/features/admin/admin-sidebar";

export const dynamic = "force-dynamic";

export default function AdminConsoleLayout({ children }: { children: ReactNode }) {
  return (
    <div className="bg-background text-foreground flex min-h-screen flex-col lg:flex-row">
      <AdminSidebar />
      <div className="border-border bg-zinc-950 text-zinc-50 flex flex-1 flex-col">
        <header className="border-b border-white/10 flex items-center justify-between gap-4 px-5 py-4">
          <p className="text-[0.7rem] text-zinc-500 uppercase tracking-wide">Sign Fashion studio</p>
          <AdminLogoutButton />
        </header>
        <div className="flex-1 overflow-y-auto px-5 py-8 lg:px-10">{children}</div>
      </div>
    </div>
  );
}
