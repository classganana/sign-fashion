"use client";

import type { ReactNode } from "react";

import { usePathname } from "next/navigation";

import { SiteChrome } from "@/components/layout/site-chrome";

export function ConditionalSiteChrome({ children }: { children: ReactNode }) {
  const path = usePathname() ?? "";
  if (path.startsWith("/admin")) return children;
  return <SiteChrome>{children}</SiteChrome>;
}
