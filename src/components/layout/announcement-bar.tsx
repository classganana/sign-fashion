"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { X } from "lucide-react";

import { Container } from "@/components/ui/container";
import { announcement } from "@/config/site";
import { cn } from "@/lib/utils";

const STORAGE_KEY = "sf-announce-dismissed-at";

/**
 * Lightweight strip above the Navbar.
 * Server render always matches “open”; client hides if dismissed in the last ~24 hours.
 */
export function AnnouncementBar() {
  const [closed, setClosed] = useState(false);

  useEffect(() => {
    if (!announcement.enabled) return;
    const ts = sessionStorage.getItem(STORAGE_KEY);
    if (!ts) return;
    const stored = Number.parseInt(ts, 10);
    if (!Number.isNaN(stored) && Date.now() - stored <= 1000 * 60 * 60 * 24) {
      setClosed(true);
    }
  }, []);

  if (!announcement.enabled || closed) return null;

  function dismiss() {
    sessionStorage.setItem(STORAGE_KEY, `${Date.now()}`);
    setClosed(true);
  }

  return (
    <div className="border-border relative border-b bg-primary text-primary-foreground">
      <Container className="relative py-2.5 pr-12">
        <div className="flex justify-center">
          <Link
            href={announcement.href}
            className={cn(
              "transition-luxury text-center text-[0.6875rem] font-medium uppercase tracking-[var(--text-eyebrow--letter-spacing)]",
              "underline-offset-[5px] decoration-transparent hover:underline hover:decoration-primary-foreground/50",
              "leading-relaxed lg:leading-none",
            )}
          >
            {announcement.message}
          </Link>
        </div>
        <button
          type="button"
          onClick={dismiss}
          className="-translate-y-1/2 absolute top-1/2 right-[length:var(--spacing-gutter)] inline-flex rounded-sm p-1 text-primary-foreground/90 opacity-85 transition-opacity hover:opacity-100"
          aria-label="Dismiss announcement"
        >
          <X className="size-4" aria-hidden />
        </button>
      </Container>
    </div>
  );
}
