"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";

const links = [
  { href: "/admin", label: "Overview" },
  { href: "/admin/products", label: "Catalogue" },
  { href: "/admin/collections", label: "Capsules" },
  { href: "/admin/homepage", label: "Homepage" },
  { href: "/admin/merchandising", label: "Spotlight" },
  { href: "/admin/media", label: "Imagery" },
];

export function AdminSidebar() {
  const path = usePathname() ?? "";

  return (
    <aside className="border-zinc-800 bg-zinc-950/70 flex w-full flex-col gap-6 border-e px-4 py-6 lg:h-full lg:w-56">
      <div>
        <p className="text-zinc-500 text-[0.65rem] uppercase tracking-wide">Sign Fashion</p>
        <p className="text-zinc-100 text-lg font-medium tracking-tight">Studio</p>
      </div>
      <nav className="flex flex-col gap-0.5 text-sm">
        {links.map(({ href, label }) => {
          const active = href === "/admin" ? path === "/admin" : path.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                active ? "border-zinc-100 bg-white/10 text-white" :
                  "text-zinc-400 hover:border-white/40 hover:bg-white/5 hover:text-white",
                "rounded-md border border-transparent px-3 py-2 transition-colors",
              )}
            >
              {label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
