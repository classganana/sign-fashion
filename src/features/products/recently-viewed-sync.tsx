"use client";

import { useEffect } from "react";

import { useRecentlyViewedStore } from "@/store/recently-viewed-store";

export function RecentlyViewedSync({ slug }: { slug: string }) {
  const recordSlug = useRecentlyViewedStore((s) => s.recordSlug);

  useEffect(() => {
    recordSlug(slug);
  }, [slug, recordSlug]);

  return null;
}
